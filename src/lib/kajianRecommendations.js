// 10-minute deterministic rotation logic for Kajian Pendek

/**
 * Returns a consistent list of 5 recommendations from the provided items,
 * rotating exactly every 10 minutes.
 * 
 * @param {Array} allItems - Normalized YouTube Kajian items
 * @param {string} theme - Selected theme filter
 * @returns {Array} Array of up to 5 recommended items
 */
export function getKajianRecommendations(allItems, theme = 'Semua') {
  if (!allItems || allItems.length === 0) return [];

  // Filter by theme
  let filtered = allItems;
  if (theme !== 'Semua') {
    filtered = allItems.filter(item => item.theme === theme);
  }

  // If no items match theme, fallback to all (or return empty if strictly requested)
  // The requirements say "no broken state if theme has no videos", but typically returning empty is fine if we show empty message
  if (filtered.length === 0) return [];

  // If we have 5 or less, just return them
  if (filtered.length <= 5) return filtered;

  // 10-minute slot
  // 10 minutes = 10 * 60 * 1000 = 600,000 ms
  const slot = Math.floor(Date.now() / 600000);
  
  // Deterministic starting index based on slot
  const startIndex = slot % filtered.length;

  const recommendations = [];
  for (let i = 0; i < 5; i++) {
    // Wrap around safely
    const idx = (startIndex + i) % filtered.length;
    recommendations.push(filtered[idx]);
  }

  return recommendations;
}
