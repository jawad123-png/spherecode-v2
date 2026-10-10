/* Generates one real HTML entry per division, plus the sitemap.
 *
 * The site is a client-rendered SPA, so without this every division shares
 * a single URL and a single <title> — and one page cannot rank for three
 * different service categories at once. Each generated file carries its own
 * title, description, canonical, Open Graph and FAQPage data, which is what
 * a crawler reads before it runs any JavaScript.
 *
 * index.html is the template and the home page; subpages are derived from it
 * so they can never drift. Output dirs are generated, not committed.
 * Runs automatically before `vite build` (see package.json).
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { SITE, BRAND, HOME, PAGES } from '../src/seo.js'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const tpl = readFileSync(resolve(root, 'index.html'), 'utf8')
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function swap(html, { title, desc, url }) {
  let out = html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(desc)}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(title)}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(desc)}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${esc(title)}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${esc(desc)}$2`)
  return out
}

function faqLd(page, url) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': url + '#faq',
    mainEntity: page.faq.map(([q, a]) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }, null, 2)
}

function breadcrumbLd(page, url) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: BRAND, item: SITE + '/' },
      { '@type': 'ListItem', position: 2, name: page.title.split('|')[0].trim(), item: url },
    ],
  }, null, 2)
}

const written = []
for (const page of PAGES) {
  const url = `${SITE}/${page.slug}`
  let html = swap(tpl, { title: page.title, desc: page.desc, url })
  html = html.replace('</head>', `  <script type="application/ld+json">\n${faqLd(page, url)}\n  </script>\n  <script type="application/ld+json">\n${breadcrumbLd(page, url)}\n  </script>\n</head>`)
  const dir = resolve(root, page.slug)
  mkdirSync(dir, { recursive: true })
  writeFileSync(resolve(dir, 'index.html'), html)
  written.push(`${page.slug}/index.html`)
}

const today = new Date().toISOString().slice(0, 10)
const urls = [{ loc: `${SITE}/`, pri: '1.0' }, ...PAGES.map((p) => ({ loc: `${SITE}/${p.slug}`, pri: '0.9' }))]
writeFileSync(resolve(root, 'public/sitemap.xml'),
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${u.pri}</priority>
  </url>`).join('\n')}
</urlset>
`)

console.log('gen-pages:', written.join(', '), '+ sitemap.xml (' + urls.length + ' urls)')
