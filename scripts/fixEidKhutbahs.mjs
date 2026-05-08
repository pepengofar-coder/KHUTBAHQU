import fs from 'fs';
import path from 'path';

const partsDir = path.join(process.cwd(), 'src/data/parts');
const files = ['k5k6.js', 'k9k10.js']; // known files with TAKBIR and similar

for (const file of files) {
  const filePath = path.join(partsDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  if (!content.includes('khutbahOpeningTemplates')) {
    content = content.replace(
      /import\s+\{([^}]+)\}\s+from\s+['"]\.\/header\.js['"];/, 
      (match, imports) => {
        return `import { khutbahOpeningTemplates, ${imports.trim()} } from './header.js';`;
      }
    );
  }

  // Find { type: 'opening', text: TAKBIR } and add the khutbahOpeningTemplate after it
  // Wait, in k9k10.js it has:
  // { type: 'opening', text: MUK_LENGKAP } on line 9 (which was updated to khutbahOpeningTemplates[0])
  // { type: 'opening', text: 'اَللهُ أَكْبَرُ...' } on line 37.
  
  // So k9k10.js already has the khutbahOpeningTemplates for the first one?
  // Let's just fix it manually.
}
