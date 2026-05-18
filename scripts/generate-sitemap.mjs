/**
 * Sitemap Generator for Islamediaku
 * Run: node scripts/generate-sitemap.mjs
 * Outputs: public/sitemap.xml
 */
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const SITE_URL = 'https://khutbahqu.vercel.app';
const TODAY = new Date().toISOString().split('T')[0];

// Extract slugs from data files by parsing export objects
function extractSlugs() {
  const partsDir = resolve(ROOT, 'src/data/parts');
  const slugs = [];
  const files = readdirSync(partsDir).filter(f => f.endsWith('.js') && f !== 'header.js');

  for (const file of files) {
    const content = readFileSync(resolve(partsDir, file), 'utf-8');
    // Match slug: 'value' or slug: "value"
    const matches = content.matchAll(/slug:\s*['"]([^'"]+)['"]/g);
    for (const m of matches) {
      slugs.push(m[1]);
    }
  }

  return [...new Set(slugs)]; // deduplicate
}

function generateSitemap() {
  const slugs = extractSlugs();
  console.log(`Found ${slugs.length} khutbah slugs`);

  const staticPages = [
    { path: '/', priority: '1.0', changefreq: 'weekly' },
    { path: '/sholat', priority: '0.9', changefreq: 'daily' },
    { path: '/mushaf', priority: '0.9', changefreq: 'monthly' },
    { path: '/kiblat', priority: '0.8', changefreq: 'yearly' },
    { path: '/kalender-hijriah', priority: '0.8', changefreq: 'monthly' },
    { path: '/doa-dzikir', priority: '0.8', changefreq: 'monthly' },
    { path: '/khutbah', priority: '0.9', changefreq: 'weekly' },
    { path: '/tasbih', priority: '0.6', changefreq: 'yearly' },
    { path: '/tracker', priority: '0.6', changefreq: 'yearly' },
    { path: '/premium', priority: '0.5', changefreq: 'monthly' },
    { path: '/kontribusi', priority: '0.5', changefreq: 'monthly' },
    { path: '/tentang', priority: '0.4', changefreq: 'yearly' },
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Static pages
  for (const page of staticPages) {
    xml += `  <url>\n`;
    xml += `    <loc>${SITE_URL}${page.path}</loc>\n`;
    xml += `    <lastmod>${TODAY}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += `  </url>\n`;
  }

  // Detail pages
  for (const slug of slugs) {
    xml += `  <url>\n`;
    xml += `    <loc>${SITE_URL}/khutbah/${slug}</loc>\n`;
    xml += `    <lastmod>${TODAY}</lastmod>\n`;
    xml += `    <changefreq>monthly</changefreq>\n`;
    xml += `    <priority>0.7</priority>\n`;
    xml += `  </url>\n`;
  }

  xml += `</urlset>\n`;

  const outPath = resolve(ROOT, 'public/sitemap.xml');
  writeFileSync(outPath, xml, 'utf-8');
  console.log(`✅ Sitemap generated at public/sitemap.xml (${staticPages.length + slugs.length} URLs)`);
}

generateSitemap();
