import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { MANTRA_CATALOG, CATEGORY_OPTIONS } from '../src/data/mantraCatalog.js';
import { blogPosts } from '../src/components/blogs/Blogs.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const publicDir = path.join(projectRoot, 'public');

const SITE_URL = (process.env.SITE_URL || process.env.VITE_SITE_URL || 'https://mantraspirit.com').replace(/\/$/, '');
const NOW = new Date().toISOString();
const HREFLANG_MAP = {
  arabic: 'ar',
  bengali: 'bn',
  english: 'en',
  german: 'de',
  gujarati: 'gu',
  hindi: 'hi',
  kannada: 'kn',
  malayalam: 'ml',
  mandarin: 'zh',
  marathi: 'mr',
  punjabi: 'pa',
  russian: 'ru',
  sanskrit: 'sa',
  tamil: 'ta',
  telugu: 'te',
  urdu: 'ur'
};

const normalizeLanguage = (value = 'english') => {
  const normalized = String(value).trim().toLowerCase();
  const cleaned = normalized.replace(/^_+|_+$/g, '');

  if (cleaned === 'mandarine') return 'mandarin';
  if (cleaned === 'telegu') return 'telugu';
  if (cleaned === 'gujrati') return 'gujarati';
  if (cleaned === 'kannadaa') return 'kannada';

  return cleaned;
};

const toAbsolute = (pathname) => `${SITE_URL}${pathname}`;
const toHrefLang = (language) => HREFLANG_MAP[language] || language;
const escapeXml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const loadMantraLanguages = async () => {
  try {
    const jsonPath = path.join(publicDir, 'mantrasData.json');
    const jsonRaw = await fs.readFile(jsonPath, 'utf-8');
    const parsed = JSON.parse(jsonRaw);

    const map = new Map();
    for (const mantra of parsed.mantras || []) {
      const key = String(mantra.id || '').trim();
      if (!key) continue;
      map.set(
        key,
        [...new Set((mantra.languages || []).map((lang) => normalizeLanguage(lang)).filter(Boolean))]
      );
    }

    return map;
  } catch (error) {
    console.error('Unable to read public/mantrasData.json for multilingual sitemap:', error.message);
    return new Map();
  }
};

const buildUrlNode = ({ loc, lastmod = NOW, changefreq = 'weekly', priority = '0.7', alternates = [] }) => {
  const alternateXml = alternates
    .map((alternate) =>
      `    <xhtml:link rel="alternate" hreflang="${escapeXml(alternate.hreflang)}" href="${escapeXml(alternate.href)}" />`
    )
    .join('\n');

  return [
    '  <url>',
    `    <loc>${escapeXml(loc)}</loc>`,
    `    <lastmod>${escapeXml(lastmod)}</lastmod>`,
    `    <changefreq>${escapeXml(changefreq)}</changefreq>`,
    `    <priority>${escapeXml(priority)}</priority>`,
    alternateXml,
    '  </url>'
  ]
    .filter(Boolean)
    .join('\n');
};

const generateSitemap = async () => {
  const mantraLanguageMap = await loadMantraLanguages();
  const nodes = [];

  nodes.push(buildUrlNode({ loc: toAbsolute('/'), changefreq: 'daily', priority: '1.0' }));
  nodes.push(buildUrlNode({ loc: toAbsolute('/mantras'), changefreq: 'daily', priority: '0.95' }));
  nodes.push(buildUrlNode({ loc: toAbsolute('/blogs'), changefreq: 'daily', priority: '0.9' }));

  for (const category of CATEGORY_OPTIONS.filter((item) => item.value !== 'all')) {
    nodes.push(
      buildUrlNode({
        loc: toAbsolute(`/category/${category.value}`),
        changefreq: 'weekly',
        priority: '0.8'
      })
    );
  }

  for (const mantra of MANTRA_CATALOG) {
    const basePath = `/mantras/${mantra.slug}`;
    const languages = mantraLanguageMap.get(mantra.id) || ['english'];
    const uniqueLanguages = [...new Set(['english', ...languages])];

    const alternates = [
      { hreflang: 'x-default', href: toAbsolute(basePath) },
      ...uniqueLanguages.map((language) => ({
        hreflang: toHrefLang(language),
        href: toAbsolute(`${basePath}/${language}`)
      }))
    ];

    nodes.push(
      buildUrlNode({
        loc: toAbsolute(basePath),
        changefreq: 'weekly',
        priority: '0.85',
        alternates
      })
    );

    for (const language of uniqueLanguages) {
      nodes.push(
        buildUrlNode({
          loc: toAbsolute(`${basePath}/${language}`),
          changefreq: 'weekly',
          priority: language === 'english' ? '0.84' : '0.8'
        })
      );
    }
  }

  for (const blog of blogPosts) {
    if (!blog?.slug) continue;

    nodes.push(
      buildUrlNode({
        loc: toAbsolute(`/blogs/${blog.slug}`),
        changefreq: 'monthly',
        priority: '0.75'
      })
    );
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${nodes.join('\n')}\n</urlset>\n`;

  await fs.writeFile(path.join(publicDir, 'sitemap.xml'), xml, 'utf-8');
};

const generateRobots = async () => {
  const robots = [
    'User-agent: *',
    'Allow: /',
    '',
    'Disallow: /search?',
    '',
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    ''
  ].join('\n');

  await fs.writeFile(path.join(publicDir, 'robots.txt'), robots, 'utf-8');
};

const run = async () => {
  await generateSitemap();
  await generateRobots();
  console.log('SEO assets generated: public/sitemap.xml and public/robots.txt');
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
