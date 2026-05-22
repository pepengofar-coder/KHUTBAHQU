import { TRAVEL_AUDIO_ITEMS } from '../data/travelAudioContent';

export function getFullValidRecommendations() {
  return TRAVEL_AUDIO_ITEMS.filter(item => item.enabled && item.audioUrl);
}

export function getHourlyRecommendations() {
  // Filter only items that have an audioUrl and are enabled
  const validItems = TRAVEL_AUDIO_ITEMS.filter(item => item.enabled && item.audioUrl);
  
  if (validItems.length === 0) return [];

  // Deterministic seed based on current hour
  const hourSlot = Math.floor(Date.now() / (60 * 60 * 1000));
  
  const recommendations = [];
  const count = Math.min(5, validItems.length);
  
  // Use hourSlot as a starting index
  let startIndex = hourSlot % validItems.length;

  for (let i = 0; i < count; i++) {
    const index = (startIndex + i) % validItems.length;
    recommendations.push(validItems[index]);
  }

  return recommendations;
}
