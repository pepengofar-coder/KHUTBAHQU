import fs from 'fs';
import path from 'path';

const partsDir = path.join(process.cwd(), 'src/data/parts');
const files = fs.readdirSync(partsDir).filter(f => f.endsWith('.js') && f !== 'header.js');

let globalIndex = 0;

for (const file of files) {
  const filePath = path.join(partsDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  if (!content.includes('khutbahOpeningTemplates')) {
    content = content.replace(
      /import\s+\{([^}]+)\}\s+from\s+['"]\.\/header\.js['"];/, 
      (match, imports) => {
        // remove MUK_LENGKAP if it's there
        const cleanImports = imports.split(',').map(i => i.trim()).filter(i => i !== 'MUK_LENGKAP' && i !== '');
        return `import { khutbahOpeningTemplates, ${cleanImports.join(', ')} } from './header.js';`;
      }
    );
  }

  let matchFound = false;
  content = content.replace(/\{\s*type:\s*'opening',\s*text:\s*MUK_LENGKAP\s*\}/g, () => {
    matchFound = true;
    const templateIndex = globalIndex % 3;
    globalIndex++;
    return `{ type: 'opening', text: khutbahOpeningTemplates[${templateIndex}] }`;
  });

  if (matchFound) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated ${file}`);
  }
}
console.log(`Updated total ${globalIndex} occurrences.`);
