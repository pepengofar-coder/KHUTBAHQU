import { khutbahList, CATEGORIES } from './src/data/khutbahData.js';
import { countWords, estimateReadingDuration, scanKhutbahForAbbreviations, detectPlaceholders, validateKhutbah } from './src/data/khutbahValidator.js';

console.log('=== KhutbahQu Content Verification ===');
console.log('Total khutbah:', khutbahList.length);
console.log('Total categories:', CATEGORIES.length);
console.log('');

let issues = 0;
for (const k of khutbahList) {
  const words = countWords(k);
  const duration = estimateReadingDuration(k);
  const abbrevs = scanKhutbahForAbbreviations(k);
  const validation = validateKhutbah(k);
  
  const status = validation.valid ? '✅' : '❌';
  console.log(`${status} #${k.id} [${k.category}] ${k.title}`);
  console.log(`   Words: ${words} | Duration: ~${duration} min | Blocks: ${k.firstKhutbah.length + k.secondKhutbah.length}`);
  
  if (abbrevs.length > 0) {
    console.log(`   ⚠️ Abbreviations found: ${abbrevs.map(a => a.abbreviation).join(', ')}`);
    issues++;
  }
  if (!validation.valid) {
    validation.issues.filter(i => i.severity === 'error').forEach(i => {
      console.log(`   ❌ ${i.message}`);
    });
    issues++;
  }
  if (words < 600) {
    console.log(`   ⚠️ Too short: ${words} words (min 600)`);
    issues++;
  }
}

console.log('');
console.log(`=== Summary ===`);
console.log(`Total khutbah: ${khutbahList.length}`);
console.log(`Issues found: ${issues}`);

// Category coverage
const usedCategories = new Set(khutbahList.map(k => k.category));
console.log(`Categories used: ${usedCategories.size} / ${CATEGORIES.length}`);
const unusedCats = CATEGORIES.filter(c => !usedCategories.has(c.id));
if (unusedCats.length > 0) {
  console.log(`Unused categories: ${unusedCats.map(c => c.label).join(', ')}`);
}
