import assert from "node:assert/strict"
import fs from "node:fs/promises"
import path from "node:path"

// The research gallery and timeline are generated from one JSON file per entry
// in content/tapeouts. Entries marked "page": false are figure-only chips: they
// are drawn on the timeline but must not get a project page or sitemap entry.

const directory = "content/tapeouts"
const files = (await fs.readdir(directory)).filter((file) => file.endsWith(".json")).sort()
const entries = await Promise.all(
  files.map(async (file) => ({
    slug: file.replace(/\.json$/, ""),
    data: JSON.parse(await fs.readFile(path.join(directory, file), "utf8")),
  })),
)

const escapeHtml = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#x27;")
const isPublished = (entry) => entry.data.page !== false
const latestYear = (entry) => Math.max(...entry.data.publications.map((publication) => publication.year))

const published = entries.filter(isPublished).sort((left, right) => {
  const byYear = latestYear(right) - latestYear(left)
  if (byYear !== 0) return byYear
  return left.data.title < right.data.title ? -1 : left.data.title > right.data.title ? 1 : 0
})
const unlabeled = entries.filter((entry) => !isPublished(entry))
const featured = published.filter((entry) => entry.data.featured === true)

assert.equal(new Set(entries.map((entry) => entry.slug)).size, entries.length, "Unique entry slugs")
assert.equal(featured.length, 3, "Homepage retains three featured chips")
assert(published.length > 0, "There are published entries")
assert(unlabeled.length > 0, "Figure-only chips exist")
for (const entry of published) assert(entry.data.publications.length > 0, `${entry.slug}: documented entry needs a publication`)
for (const entry of unlabeled) assert.equal(entry.data.publications.length, 0, `${entry.slug}: figure-only entry must not publish`)

const root = ".next/server/app"
const home = await fs.readFile(path.join(root, "index.html"), "utf8")
const research = await fs.readFile(path.join(root, "research.html"), "utf8")
const sitemap = await fs.readFile(path.join(root, "sitemap.xml.body"), "utf8")
const projectLinks = (html) => [...html.matchAll(/href="\/tapeouts\/([^"#]+)"/g)].map((match) => match[1])
assert.deepEqual(projectLinks(home), featured.map((entry) => entry.slug), "Homepage card order")
assert.deepEqual([...new Set(projectLinks(research))], published.map((entry) => entry.slug), "Complete documented gallery")
assert(home.includes('href="/research#tapeouts"'), "Homepage links to full collection")
assert(home.includes("Featured Tapeouts"), "Homepage identifies a curated selection")
assert(home.includes("Explore all tapeouts"), "Clear link to the full collection")

for (const entry of unlabeled) {
  assert(!projectLinks(research).includes(entry.slug), `${entry.slug}: figure-only chip must not link to a page`)
  assert(!sitemap.includes(`/tapeouts/${entry.slug}</loc>`), `${entry.slug}: figure-only chip must stay out of the sitemap`)
  await assert.rejects(
    fs.access(path.join(root, "tapeouts", `${entry.slug}.html`)),
    `${entry.slug}: figure-only chip must not be prerendered`,
  )
}

const layout = JSON.parse(await fs.readFile("content/figures/timeline-layout.json", "utf8"))
assert.equal(layout.lanes.length, 4, "Timeline has four technology lanes")
assert.equal(layout.years.length, 6, "Timeline spans six years")
assert.equal(
  layout.chips.length,
  entries.reduce((total, entry) => total + entry.data.chips.length, 0),
  "Every chip is placed on the timeline",
)
for (const chip of layout.chips) {
  assert(chip.lane, "Timeline chip has a lane")
  assert(chip.x >= 0 && chip.x + chip.width <= layout.viewBox.width, `${chip.slug}: chip stays inside the figure`)
  assert(chip.y >= 0 && chip.y + chip.height <= layout.viewBox.height, `${chip.slug}: chip stays inside the figure`)
  assert(typeof chip.page === "boolean", `${chip.slug}: timeline chip carries its page flag`)
  assert(/^\/(images|optimized)\//.test(chip.image), `${chip.slug}: timeline chip image`)
}
assert(research.includes("timeline-glow"), "Research renders the interactive timeline")
assert(research.includes("180 nm") && research.includes("FDSOI"), "Timeline renders its technology lanes")

for (const { slug, data } of published) {
  for (const field of ["category", "title", "tagline", "description"]) {
    assert(typeof data[field] === "string" && data[field].trim(), `${slug}: ${field} is required`)
  }
  assert(Array.isArray(data.authors) && data.authors.length > 0, `${slug}: authors are required`)
  for (const author of data.authors) assert(author.name && author.credit, `${slug}: author needs a name and a credit`)
  assert(Array.isArray(data.chips) && data.chips.length > 0, `${slug}: chips are required`)

  const html = await fs.readFile(path.join(root, "tapeouts", `${slug}.html`), "utf8")
  assert(html.includes('href="/research#tapeouts"'), `Return link: ${slug}`)
  assert(html.includes(`href="https://www.saliganelab.com/tapeouts/${slug}"`), `Canonical project URL: ${slug}`)
  assert(sitemap.includes(`/tapeouts/${slug}</loc>`), `Sitemap contains ${slug}`)
  assert(html.includes(escapeHtml(data.category)), `Category on page: ${slug}`)
  assert(html.includes(escapeHtml(data.description)), `Description on page: ${slug}`)
  for (const author of data.authors) assert(html.includes(escapeHtml(author.name)), `Author on page: ${slug} ${author.name}`)

  for (const paper of data.publications) {
    assert(html.includes(`href="${paper.href}"`), `Publication link: ${slug}`)
    assert(html.includes(String(paper.year)), `Publication year: ${slug}`)
    assert(html.includes(paper.credit), `Explicit credit label: ${slug}`)
    for (const name of paper.authors.split(" & ")) assert(html.includes(name), `Author missing: ${name}`)
    if (paper.related) assert(html.includes("Related publication"), "Preserve related-publication qualifier")
  }
  for (const resource of [...data.publications, ...(data.resources ?? [])]) {
    assert(html.includes(`href="${resource.href}"`), `Resource link: ${resource.href}`)
    if (resource.href.startsWith("/images/")) await fs.access(path.join("public", resource.href))
    else if (resource.href.startsWith("/research/")) await fs.access(path.join("content", `${resource.href}.md`))
    else assert.equal(new URL(resource.href).protocol, "https:")
  }

  for (const chip of data.chips) {
    assert(html.includes(chip.image), `Chip image on project page: ${slug} ${chip.node}`)
  }
  const firstChipLabel = data.chips[0].date ? `${data.chips[0].node} · ${data.chips[0].date}` : data.chips[0].node
  assert(html.includes(escapeHtml(firstChipLabel)), `Chip node/date caption: ${slug}`)
  if (data.chips.length > 1) assert(html.includes('aria-roledescription="carousel"'), `Cover-flow gallery: ${slug}`)
}

for (const { slug, data } of entries) {
  for (const chip of data.chips) {
    assert(chip.image?.startsWith("/images/"), `${slug}: chip image path`)
    assert(chip.node?.trim(), `${slug}: chip technology node`)
    assert(typeof chip.date === "string", `${slug}: chip date must be a string`)
    await fs.access(path.join("public", chip.image))
  }
  if (data.cover) await fs.access(path.join("public", data.cover))
}

console.log(
  `Verified ${featured.length} featured chips, ${published.length} project pages, ${unlabeled.length} figure-only chips, ` +
  `${layout.chips.length} timeline placements, publication credits/resources, and sitemap coverage.`,
)
