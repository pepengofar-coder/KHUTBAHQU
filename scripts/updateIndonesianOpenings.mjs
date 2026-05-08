import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const partsDir = path.join(__dirname, '../src/data/parts');

async function updateFiles() {
  const files = fs.readdirSync(partsDir).filter(f => f.endsWith('.js') && f !== 'header.js');
  
  let templateIndex = 0;
  let updatedCount = 0;

  for (const file of files) {
    const filePath = path.join(partsDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Add khutbahIndonesianOpeningTemplates to the imports if it's not there
    if (!content.includes('khutbahIndonesianOpeningTemplates')) {
      content = content.replace(
        /import\s+\{([^}]+)\}\s+from\s+['"]\.\/header\.js['"];/, 
        (match, imports) => {
          return `import { khutbahIndonesianOpeningTemplates, ${imports.trim()} } from './header.js';`;
        }
      );
    }

    // Now we need to parse the content or use regex to insert.
    // The easiest way is to use regex to find the last opening in firstKhutbah.
    // Or we can just import the module, modify the object, and write it back? 
    // No, writing JS objects back to string loses formatting and comments. 
    // We should use regex or string manipulation.

    // Let's find occurrences of { type: 'opening', text: khutbahOpeningTemplates[X] }
    // or { type: 'opening', text: TAKBIR }
    
    // We can just find the first occurrence of:
    // { type: 'paragraph', text: "Ma'asyiral... }
    // or WASIAT_TAQWA
    // Actually, looking at the pattern, it's always:
    // { type: 'opening', text: khutbahOpeningTemplates[...] },
    // followed by other things.
    // It's safer to find `khutbahOpeningTemplates\\[\\d+\\] \\},`
    // Wait, what about `k5k6.js` and `k9k10.js` which have `{ type: 'opening', text: TAKBIR },` and then `khutbahOpeningTemplates[0]`?
    // We can just match `{ type: 'opening', text: khutbahOpeningTemplates[\d+] },`
    // and insert `{ type: 'paragraph', text: khutbahIndonesianOpeningTemplates[X] },` right after it!

    // But wait! There's also `secondKhutbah` which might have `MUK_KHUTBAH_2`. We ONLY want to modify `firstKhutbah`.
    // It's better to split by `firstKhutbah: [` and `secondKhutbah: [`

    let firstKhutbahStart = content.indexOf('firstKhutbah: [');
    let secondKhutbahStart = content.indexOf('secondKhutbah: [');
    
    // Some files might have different structures, let's just do it carefully per-export.
    let changed = false;

    // Use a regex to match the khutbahOpeningTemplates line inside firstKhutbah.
    // Since firstKhutbah is an array, we can look for `{ type: 'opening', text: khutbahOpeningTemplates[X] },`
    
    const openingRegex = /(\{\s*type:\s*'opening',\s*text:\s*khutbahOpeningTemplates\[\d+\]\s*\}(?:,)?)\n/g;
    
    content = content.replace(openingRegex, (match, p1) => {
      // Is this before secondKhutbah? (hacky check but works for these files since opening is near top)
      // Actually, khutbahOpeningTemplates is ONLY used in firstKhutbah.
      const replacement = `${p1}\n    { type: 'paragraph', text: khutbahIndonesianOpeningTemplates[${templateIndex}] },\n`;
      templateIndex = (templateIndex + 1) % 4; // 4 variations
      changed = true;
      return replacement;
    });

    if (changed) {
      fs.writeFileSync(filePath, content, 'utf-8');
      updatedCount++;
      console.log(`Updated ${file}`);
    } else {
      console.log(`Skipped ${file} (no khutbahOpeningTemplates found, maybe already updated?)`);
    }
  }
  
  console.log(`Updated total ${updatedCount} files.`);
}

updateFiles().catch(console.error);
