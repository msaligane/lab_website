import assert from "node:assert/strict"
import fs from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"

const root = process.cwd()
const manifest = JSON.parse(await fs.readFile("lib/image-manifest.json", "utf8"))
let count = 0
for (const [original, entry] of Object.entries(manifest)) {
  assert.equal((await fs.stat(path.join(root, "public", original))).size, entry.originalBytes, `Regenerate changed source: ${original}`)
  for (const variant of entry.variants) {
    const file = path.join(root, "public", variant.src)
    const actual = await sharp(file).metadata()
    assert.equal(actual.format, "webp")
    assert.equal(actual.width, variant.width)
    assert.equal((await fs.stat(file)).size, variant.bytes)
    assert(Math.abs(actual.height - actual.width * entry.height / entry.width) <= 1, `Aspect ratio changed: ${variant.src}`)
    count++
  }
}
async function walk(dir) {
  const files = []
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name)
    if (entry.isDirectory()) files.push(...await walk(file))
    else if (file.endsWith(".html")) files.push(file)
  }
  return files
}
let rendered = 0
for (const file of await walk(".next/server/app")) {
  const html = await fs.readFile(file, "utf8")
  for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
    const original = tag.match(/data-original-src="([^"]+)"/)?.[1]
    if (!original || !manifest[original]) continue
    assert(/srcSet=|srcset=/.test(tag), `Missing responsive sources: ${file}`)
    assert(/width="\d+"/.test(tag) && /height="\d+"/.test(tag), `Missing dimensions: ${file}`)
    assert(/src="\/optimized\//.test(tag), `Unoptimized source: ${file}`)
    rendered++
  }
}
assert(rendered > 0)
console.log(`Verified ${count} image variants and ${rendered} responsive image instances in generated pages.`)
