import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const version = {
  version: Date.now().toString(36),
  buildTime: new Date().toISOString(),
};

const outPath = resolve(__dirname, '..', 'public', 'version.json');
writeFileSync(outPath, JSON.stringify(version, null, 2));
console.log(`✅ version.json generated: v${version.version} (${version.buildTime})`);
