import fs from "node:fs/promises"
import path from "node:path"
import assert from "node:assert/strict"

async function walk(dir) {
  const files = []
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name)
    if (entry.isDirectory()) files.push(...await walk(file))
    else if (entry.name.endsWith(".html") && !entry.name.startsWith("_")) files.push(file)
  }
  return files
}

const root = ".next/server/app"
let count = 0
let articleImages = 0
for (const file of await walk(root)) {
  const html = await fs.readFile(file, "utf8")
  const metas = new Map([...html.matchAll(/<meta\s+(?:name|property)="([^"]+)"\s+content="([^"]*)"[^>]*>/g)].map(m => [m[1], m[2]]))
  const route = "/" + path.relative(root, file).replaceAll(path.sep, "/").replace(/\.html$/, "").replace(/^index$/, "")
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)[1]
  assert.equal(new URL(canonical).pathname, route, `${route}: canonical path`)
  assert.equal(metas.get("og:url"), canonical, `${route}: social URL`)
  for (const key of ["og:title", "og:description", "og:image", "twitter:title", "twitter:description", "twitter:image"]) {
    assert(metas.get(key), `${route}: missing ${key}`)
  }
  assert.equal(metas.get("twitter:title"), metas.get("og:title"), `${route}: social titles agree`)
  assert.equal(metas.get("twitter:description"), metas.get("description"), `${route}: page-specific description`)
  assert.equal(metas.get("og:description"), metas.get("description"))
  assert.equal(metas.get("twitter:image"), metas.get("og:image"))
  const title = html.match(/<title>(.*?)<\/title>/)[1]
  const suffix = " · ReaLLMASIC Lab — Prof. Mehdi Saligane"
  assert.equal(title, metas.get("og:title") + (route === "/" ? "" : suffix), `${route}: title suffix exactly once`)
  const image = new URL(metas.get("og:image"))
  assert.equal(image.origin, new URL(canonical).origin)
  await fs.access(path.join("public", decodeURIComponent(image.pathname)))
  if (image.pathname.startsWith("/images/")) articleImages++
  count++
}
assert(count > 0)
assert(articleImages > 0, "Article imagery must be used where available")
console.log(`Verified titles, descriptions, canonical URLs, and social images on ${count} pages; ${articleImages} use article photos/figures.`)
