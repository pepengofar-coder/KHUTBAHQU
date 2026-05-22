export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

  if (!YOUTUBE_API_KEY) {
    return res.status(200).json({
      error: 'YOUTUBE_API_KEY is not configured',
      items: []
    });
  }

  // Target Channel IDs:
  const UPLOADS_PLAYLISTS = {
    'al-irsyad': { id: 'UUVJ6N-aKKLf7cCageY5WZIA', name: 'Masjid Al-Irsyad TV' },
    'syafiq-riza': { id: 'UU3_QdDQnRVRDJzq56JTO_Zw', name: 'Syafiq Riza Basalamah Official' },
    'khalid-basalamah': { id: 'UUpBUN-oH2QeMh-hNux7Tzcw', name: 'Khalid Basalamah Official' },
    'gazwah-tv': { id: 'UUiTK5pzTj6BMIO14YYLA_jA', name: 'Gazwah TV' }
  };

  const { channel } = req.query;
  const targetPlaylists = channel && UPLOADS_PLAYLISTS[channel] 
    ? [UPLOADS_PLAYLISTS[channel]]
    : [UPLOADS_PLAYLISTS['al-irsyad']]; // Prefer Al-Irsyad if not specified, per requirement

  // Helper to parse ISO 8601 duration (PT1M30S)
  const parseDuration = (duration) => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return 0;
    const hours = (parseInt(match[1]) || 0);
    const minutes = (parseInt(match[2]) || 0);
    const seconds = (parseInt(match[3]) || 0);
    return hours * 3600 + minutes * 60 + seconds;
  };

  // Helper to determine theme
  const getTheme = (title, desc) => {
    const text = (title + ' ' + desc).toLowerCase();
    if (text.includes('akhlak') || text.includes('adab') || text.includes('lisan')) return 'Akhlak';
    if (text.includes('sholat') || text.includes('shalat') || text.includes('sujud')) return 'Sholat';
    if (text.includes('keluarga') || text.includes('suami') || text.includes('istri') || text.includes('anak')) return 'Keluarga';
    if (text.includes('sedekah') || text.includes('infak') || text.includes('zakat')) return 'Sedekah';
    if (text.includes('iman') || text.includes('hati') || text.includes('taubat')) return 'Motivasi Iman';
    if (text.includes('quran') || text.includes('al-qur\'an') || text.includes('surah')) return 'Qur\'an';
    if (text.includes('aqidah') || text.includes('tauhid') || text.includes('syirik')) return 'Aqidah';
    if (text.includes('fiqih') || text.includes('hukum') || text.includes('puasa')) return 'Fiqih';
    if (text.includes('remaja') || text.includes('pemuda')) return 'Remaja';
    return 'Umum';
  };

  try {
    const fetchPromises = targetPlaylists.map(async (playlist) => {
      // Fetch 25 items to have a good pool for recommendations
      const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=25&playlistId=${playlist.id}&key=${YOUTUBE_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (!data.items || data.items.length === 0) return [];

      const videoIds = data.items.map(i => i.snippet.resourceId.videoId).join(',');
      
      // Secondary fetch for duration
      const durationUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${YOUTUBE_API_KEY}`;
      const durationRes = await fetch(durationUrl);
      const durationData = await durationRes.json();
      
      const durationMap = {};
      if (durationData.items) {
        durationData.items.forEach(v => {
          durationMap[v.id] = parseDuration(v.contentDetails.duration);
        });
      }

      return data.items
        .filter(item => item.snippet.title && !item.snippet.title.toLowerCase().includes('private'))
        .map(item => {
          const videoId = item.snippet.resourceId.videoId;
          const durationSeconds = durationMap[videoId] || 0;
          const title = item.snippet.title;
          const description = item.snippet.description;
          let theme = getTheme(title, description);
          const isShort = durationSeconds > 0 && durationSeconds <= 60;
          const isShortKajian = durationSeconds > 0 && durationSeconds <= 600;
          
          if (isShort) theme = 'Kajian Singkat';

          return {
            id: `youtube-${videoId}`,
            videoId: videoId,
            title: title,
            description: description,
            thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
            channelTitle: item.snippet.channelTitle || playlist.name,
            sourceName: playlist.name,
            publishedAt: item.snippet.publishedAt,
            durationSeconds: durationSeconds,
            isShort: isShort,
            isShortKajian: isShortKajian,
            theme: theme,
            watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
            embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`,
            attribution: `Sumber: ${playlist.name} / YouTube`,
            isVerified: true,
            type: 'kajian_youtube',
            isExternalPlayable: true,
            isPlayable: true
          };
        });
    });

    const results = await Promise.all(fetchPromises);
    // Sort by short status first (prefer shorts), then published date
    const allItems = results.flat().sort((a, b) => {
      if (a.isShort !== b.isShort) return a.isShort ? -1 : 1;
      if (a.isShortKajian !== b.isShortKajian) return a.isShortKajian ? -1 : 1;
      return new Date(b.publishedAt) - new Date(a.publishedAt);
    });

    // Cache on Vercel Edge for 1 hour to prevent quota exhaustion
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=7200');
    
    return res.status(200).json({
      success: true,
      items: allItems
    });
  } catch (error) {
    console.error('YouTube API Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch YouTube data',
      items: []
    });
  }
}
