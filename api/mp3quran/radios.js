// Vercel Serverless Proxy for MP3Quran Radios API
// Avoids CORS issues when fetching from browser

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=7200');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const response = await fetch('https://mp3quran.net/api/v3/radios?language=id');
    if (!response.ok) {
      throw new Error(`MP3Quran API responded with ${response.status}`);
    }
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('MP3Quran proxy error:', error);
    return res.status(502).json({ error: 'Failed to fetch radio stations', message: error.message });
  }
}
