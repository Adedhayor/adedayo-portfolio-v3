// Generates public/sitemap.xml from the routes in src/data.ts,
// excluding case studies held back from production (release.ts).
// Runs as part of `npm run build`, so the sitemap can never drift
// from the content. Zero dependencies: it slices the source text
// (data.ts imports Vite-only assets, so it can't be imported here).
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const ORIGIN = 'https://adedayobabalola.com'

const slugsIn = (text) => [...text.matchAll(/slug: '([^']+)'/g)].map((m) => m[1])
const slice = (text, from, to) => {
  const a = text.indexOf(from)
  const b = text.indexOf(to, a)
  if (a === -1 || b === -1) throw new Error(`sitemap: could not find block ${from} … ${to} — update generate-sitemap.mjs`)
  return text.slice(a, b)
}

const data = readFileSync(join(root, 'src/data.ts'), 'utf8')
const release = readFileSync(join(root, 'src/lib/release.ts'), 'utf8')

const staged = new Set(slugsIn(slice(release, 'STAGED_CASE_STUDIES', ')')) )
const stagedList = [...slice(release, 'STAGED_CASE_STUDIES', ')').matchAll(/'([^']+)'/g)].map((m) => m[1])
stagedList.forEach((s) => staged.add(s))

const caseSlugs = slugsIn(slice(data, 'const allCaseStudies', 'export const caseStudies')).filter((s) => !staged.has(s))
const noteSlugs = slugsIn(slice(data, 'export const writing', 'export function getNote'))

const staticPaths = ['/', '/work', '/about', '/notes']
const paths = [
  ...staticPaths,
  ...caseSlugs.map((s) => `/case-study/${s}`),
  ...noteSlugs.map((s) => `/notes/${s}`),
]

const today = new Date().toISOString().slice(0, 10)
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url><loc>${ORIGIN}${p === '/' ? '/' : p}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`
writeFileSync(join(root, 'public/sitemap.xml'), xml)
console.log(`sitemap: ${paths.length} urls (${caseSlugs.length} case studies, ${noteSlugs.length} notes; staged excluded: ${[...staged].join(', ') || 'none'})`)
