import assert from "node:assert/strict"
import fs from "node:fs/promises"
import path from "node:path"
import ts from "typescript"

// Transpile the data-only module so this check also runs on Node versions that
// do not yet support loading TypeScript directly. No extra test dependency.
const source = await fs.readFile("content/tapeouts.ts", "utf8")
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
}).outputText
const { tapeouts, publishedTapeouts, featuredTapeoutIds, tapeoutPresentation } = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`
)
assert.equal(new Set(tapeouts.map((project) => project.id)).size, tapeouts.length, "Unique project slugs")
assert.equal(featuredTapeoutIds.length, 3, "Homepage retains three featured chips")
assert.equal(new Set(featuredTapeoutIds).size, featuredTapeoutIds.length)
const root = ".next/server/app"
const home = await fs.readFile(path.join(root, "index.html"), "utf8")
const research = await fs.readFile(path.join(root, "research.html"), "utf8")
const sitemap = await fs.readFile(path.join(root, "sitemap.xml.body"), "utf8")
const projectLinks = (html) => [...html.matchAll(/href="\/tapeouts\/([^"#]+)"/g)].map((match) => match[1])
assert.deepEqual(projectLinks(home), featuredTapeoutIds, "Homepage card order")
assert.deepEqual(projectLinks(research), publishedTapeouts.map((project) => project.id), "Complete documented gallery")
assert(home.includes('href="/research#tapeouts"'), "Homepage links to full collection")
assert(home.includes("Featured Tapeouts"), "Homepage identifies a curated selection")
assert(home.includes("Explore all tapeouts"), "Clear link to the full collection")
assert(research.includes("View the original tapeout timeline"))
assert(research.includes('href="/images/research/tapeouts.png"'))
for (const project of publishedTapeouts) {
  assert(tapeoutPresentation[project.id]?.purpose, `Missing card purpose: ${project.id}`)
  const html = await fs.readFile(path.join(root, "tapeouts", `${project.id}.html`), "utf8")
  assert(html.includes('href="/research#tapeouts"'), `Return link: ${project.id}`)
  assert(html.includes(`href="https://www.saliganelab.com/tapeouts/${project.id}"`), "Canonical project URL")
  assert(sitemap.includes(`/tapeouts/${project.id}</loc>`), "Sitemap contains project")
  for (const paper of project.publications) {
    assert(html.includes(`href="${paper.href}"`), `Publication link: ${project.id}`)
    assert(html.includes(String(paper.year)), `Publication year: ${project.id}`)
    assert(html.includes(paper.credit), `Explicit credit label: ${project.id}`)
    for (const name of paper.authors.split(" & ")) assert(html.includes(name), `Author missing: ${name}`)
    if (paper.related) assert(html.includes("Related publication"), "Preserve related-publication qualifier")
  }
  for (const link of [...project.publications, ...project.links]) {
    assert(html.includes(`href="${link.href}"`), `Resource link: ${link.href}`)
    if (link.href.startsWith("/images/")) await fs.access(path.join("public", link.href))
    else if (link.href.startsWith("/research/")) await fs.access(path.join("content", `${link.href}.md`))
    else assert.equal(new URL(link.href).protocol, "https:")
  }
  const image = tapeoutPresentation[project.id].image
  if (image) await fs.access(path.join("public", image))
  const region = project.region
  assert(region.x >= 0 && region.y >= 0 && region.width > 0 && region.height > 0)
  assert(region.x + region.width <= 1373 && region.y + region.height <= 686)
}
for (const project of tapeouts.filter((entry) => !entry.publications.length)) {
  assert(!projectLinks(research).includes(project.id), "No undocumented placeholder card")
  assert(!sitemap.includes(`/tapeouts/${project.id}</loc>`), "No undocumented project in sitemap")
}
console.log(`Verified ${featuredTapeoutIds.length} featured chips, ${publishedTapeouts.length} project pages, publication credits/resources, original timeline, and sitemap coverage.`)
