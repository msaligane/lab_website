import fs from "node:fs/promises"
import path from "node:path"
import assert from "node:assert/strict"

async function walk(dir) {
  const result = []
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name)
    if (entry.isDirectory()) result.push(...await walk(file))
    else if (entry.name.endsWith(".html") && !entry.name.startsWith("_")) result.push(file)
  }
  return result
}
let pages = 0
for (const file of await walk(".next/server/app")) {
  const html = await fs.readFile(file, "utf8")
  assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1, `${file}: one page heading`)
  assert.equal((html.match(/<main[\s>]/g) ?? []).length, 1, `${file}: one main landmark`)
  assert(html.includes('id="main-content" tabindex="-1"'), `${file}: focusable skip target`)
  assert(html.includes('href="#main-content"'), `${file}: skip link`)
  assert(html.indexOf("</header>") < html.indexOf("<main"), `${file}: header outside main`)
  assert(html.indexOf("</main>") < html.indexOf("<footer"), `${file}: footer outside main`)
  // Research article figures are rendered by Markdown; overview tapeout images are separate.
  const articleImages = file.includes(`${path.sep}research${path.sep}`)
    ? html.matchAll(/<img[^>]*data-original-src="(\/images\/research\/[^" ]+)"/g) : []
  for (const match of articleImages) {
    assert(html.includes(`href="${match[1]}"`), `${file}: original figure link`)
  }
  pages++
}
assert(pages > 0)
console.log(`Verified headings, landmarks, skip links, and original figure links on ${pages} generated pages. Browser keyboard/mobile checks are separate.`)
