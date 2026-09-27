import assert from "node:assert/strict"
import fs from "node:fs/promises"
import path from "node:path"
import YAML from "yaml"
import { marked } from "marked"

// Run after a production build: verify what visitors receive, not just filenames.
const root = process.cwd()
const { items } = YAML.parse(await fs.readFile(path.join(root, "content/news.yaml"), "utf8"))
const output = path.join(root, ".next/server/app")
const listing = await fs.readFile(path.join(output, "news.html"), "utf8")
const home = await fs.readFile(path.join(output, "index.html"), "utf8")
const sitemap = await fs.readFile(path.join(output, "sitemap.xml.body"), "utf8")
const mappedBodies = new Set()
const slugs = new Set()
const escapeHtml = (value) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("'", "&#x27;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")

for (const item of items) {
  assert.match(item.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  assert(!slugs.has(item.slug), `Duplicate news slug: ${item.slug}`)
  slugs.add(item.slug)
  assert(item.summary.trim(), `Missing summary: ${item.slug}`)
  if (item.body) {
    assert.match(item.body, /^[a-z0-9]+(?:-[a-z0-9]+)*\.md$/)
    mappedBodies.add(item.body)
  }
  const raw = item.body
    ? await fs.readFile(path.join(root, "content/news", item.body), "utf8")
    : item.summary
  assert(raw.trim(), `Empty article: ${item.slug}`)
  const html = await fs.readFile(path.join(output, "news", `${item.slug}.html`), "utf8")
  assert(html.includes((await marked.parse(raw)).trim()), `Body not rendered: ${item.slug}`)
  assert(!html.includes("Detailed content will be added here soon."), `Placeholder: ${item.slug}`)
  assert(html.includes(`>${escapeHtml(item.title)}</h1>`), `Wrong heading: ${item.slug}`)
  assert(html.includes('href="/news"'), `Missing return link: ${item.slug}`)
  assert(listing.includes(`href="/news/${item.slug}"`), `Not linked from news: ${item.slug}`)
  assert(sitemap.includes(`/news/${item.slug}</loc>`), `Missing sitemap route: ${item.slug}`)
  if (item.link) {
    assert(html.includes(`href="${escapeHtml(item.link.href)}"`), `Missing source link: ${item.slug}`)
  }
  if (item.imagesDir) {
    const images = await fs.readdir(path.join(root, "public/images/news", item.imagesDir))
    for (const image of images.filter((name) => /\.(png|jpe?g|webp|gif)$/i.test(name))) {
      assert(html.includes(escapeHtml(`/images/news/${item.imagesDir}/${image}`)), `Missing gallery image: ${item.slug}/${image}`)
    }
  }
}

const markdownFiles = (await fs.readdir(path.join(root, "content/news"))).filter((name) => name.endsWith(".md"))
for (const file of markdownFiles) {
  assert(mappedBodies.has(file), `Unmapped news article: ${file}`)
}
for (const item of [...items].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10)) {
  assert(home.includes(`href="/news/${item.slug}"`), `Missing homepage link: ${item.slug}`)
}
console.log(`Verified ${items.length} news pages: ${mappedBodies.size} articles, ${items.filter((item) => !item.body).length} short announcements; bodies, links, galleries, homepage, sitemap, and no orphan articles.`)
