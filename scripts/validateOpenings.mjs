import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const partsDir = path.join(__dirname, '../src/data/parts');

const mandatoryPhrases = [
  'الحمد لله',
  'أشهد أن لا إله إلا الله',
  'محمد',
  'اللهم صل',
  'آله',
  'أصحابه'
];

function stripArabicDiacritics(text) {
  // Removes harakat (tashkeel) including shadda, superscript alifs, etc.
  return text.replace(/[\u064B-\u065F\u0670]/g, '');
}

async function runValidation() {
  const files = fs.readdirSync(partsDir).filter(f => f.endsWith('.js') && f !== 'header.js');
  let hasErrors = false;
  let totalChecked = 0;

  for (const file of files) {
    const filePath = path.join(partsDir, file);
    const module = await import('file://' + filePath);
    
    for (const key of Object.keys(module)) {
      const khutbah = module[key];
      if (khutbah && khutbah.firstKhutbah) {
        totalChecked++;
        
        // Find WASIAT_TAQWA
        // The wasiat takwa is usually an arabic quote starting with "يَا أَيُّهَا الَّذِينَ آمَنُوا"
        const wasiatIndex = khutbah.firstKhutbah.findIndex(part => 
          part.arabic && stripArabicDiacritics(part.arabic).includes(stripArabicDiacritics('يا أيها الذين آمنوا اتقوا الله'))
        );

        if (wasiatIndex === -1) {
          // Not an error, some might not have explicit wasiat takwa, but usually they do
        }

        // We assume all openings before wasiat takwa combined make up the full opening.
        const openings = khutbah.firstKhutbah.filter((part, index) => part.type === 'opening' && (wasiatIndex === -1 || index < wasiatIndex));
        
        if (openings.length === 0) {
          console.error(`[ERROR] ${file}: ${key} is missing an opening before wasiat takwa.`);
          hasErrors = true;
          continue;
        }

        const text = openings.map(o => o.text).join(' ') || '';
        
        // Check length
        if (text.length < 50) {
          console.error(`[ERROR] ${file}: ${key} opening is too short (${text.length} chars).`);
          hasErrors = true;
        }

        // Check mandatory phrases
        const cleanText = stripArabicDiacritics(text);
        for (const phrase of mandatoryPhrases) {
          const cleanPhrase = stripArabicDiacritics(phrase);
          if (!cleanText.includes(cleanPhrase)) {
            console.error(`[ERROR] ${file}: ${key} opening is missing required phrase: "${phrase}"`);
            hasErrors = true;
          }
        }
      }
    }
  }

  if (hasErrors) {
    console.error(`\nValidation FAILED. Please fix the errors above.`);
    process.exit(1);
  } else {
    console.log(`\nValidation PASSED for ${totalChecked} khutbahs. All openings are valid and contain the mandatory phrases.`);
  }
}

runValidation().catch(err => {
  console.error(err);
  process.exit(1);
});
