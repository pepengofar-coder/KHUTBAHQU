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
  // Syafiq Riza Basalamah: UC3_QdDQnRVRDJzq56JTO_Zw
  // Khalid Basalamah: UC2aGjX8QjXgO52u3L8u1cQQ (Example known ID, but we will search if needed. Gazwah is UCiTK5pzTj6BMIO14YYLA_jA)
  // Gazwah TV: UCiTK5pzTj6BMIO14YYLA_jA
  // Masjid Al-Irsyad TV: UCVJ6N-aKKLf7cCageY5WZIA
  // 
  // To save quota, we use the Uploads Playlist ID (replace UC with UU)
  const UPLOADS_PLAYLISTS = {
    'syafiq-riza': { id: 'UU3_QdDQnRVRDJzq56JTO_Zw', name: 'Syafiq Riza Basalamah Official' },
    'khalid-basalamah': { id: 'UUpBUN-oH2QeMh-hNux7Tzcw', name: 'Khalid Basalamah Official' }, // using a fallback ID or Gazwah
    'gazwah-tv': { id: 'UUiTK5pzTj6BMIO14YYLA_jA', name: 'Gazwah TV' },
    'al-irsyad': { id: 'UUVJ6N-aKKLf7cCageY5WZIA', name: 'Masjid Al-Irsyad TV' }
  };

  const { channel } = req.query;
  const targetPlaylists = channel && UPLOADS_PLAYLISTS[channel] 
    ? [UPLOADS_PLAYLISTS[channel]]
    : Object.values(UPLOADS_PLAYLISTS);

  try {
    const fetchPromises = targetPlaylists.map(async (playlist) => {
      // Use playlistItems endpoint (1 quota unit) instead of search (100 units)
      const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=5&playlistId=${playlist.id}&key=${YOUTUBE_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (!data.items) return [];

      return data.items
        .filter(item => item.snippet.title && !item.snippet.title.toLowerCase().includes('private'))
        .map(item => {
          const videoId = item.snippet.resourceId.videoId;
          return {
            id: `youtube-${videoId}`,
            videoId: videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
            channelTitle: item.snippet.channelTitle || playlist.name,
            sourceName: playlist.name,
            publishedAt: item.snippet.publishedAt,
            watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
            embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`,
            attribution: `Sumber video: ${playlist.name}`,
            isVerified: true,
            type: 'kajian_youtube',
            isExternalPlayable: true
          };
        });
    });

    const results = await Promise.all(fetchPromises);
    const allItems = results.flat().sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

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
