/**
 * Builds one die-collage image from individual chips embedded in the original
 * timeline figure.
 *
 * Two layouts are supported:
 *   --layout=figure (default)  keeps the figure's own arrangement: placements
 *                              come from the transform matrices in the SVG, so
 *                              relative sizes, overlaps and stacking order match
 *                              the source figure.
 *   --layout=side-by-side      puts the requested chips in a row at a common
 *                              height (no upscaling), in the order given.
 *
 * Source bitmaps are the ones extracted from the same SVG into
 * public/images/gds/raw (see scripts/extract-svg-bitmaps.mjs).
 *
 * Usage:
 *   node scripts/build-chip-collage.mjs <output.png> <bitmap-index> [...] [--layout=figure|side-by-side]
 *   node scripts/build-chip-collage.mjs public/images/gds/cryogenic-open-silicon.png 3 5 6 7 10
 *   node scripts/build-chip-collage.mjs public/images/gds/openfasoc-generators.png 8 9 --layout=side-by-side
 */
import fs from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"

// Sampled from the cream band the chips sit on in the original figure.
const BACKGROUND = { r: 244, g: 220, b: 192 }
// Figure layout: output width in pixels, padding and shadow in figure units.
const TARGET_WIDTH = 1200
const FIGURE_PADDING = 7
const FIGURE_SHADOW = { offset: 0.6, sigma: 0.55 }
// Side-by-side layout: gap and padding as fractions of the common die height.
const SIDE_GAP = 0.1
const SIDE_PADDING = 0.06
const SIDE_SHADOW = { offset: 0.008, sigma: 0.007 }
const SHADOW_OPACITY = 0.22

const args = process.argv.slice(2)
const [output, ...rest] = args
const layout = rest.find((arg) => arg.startsWith("--layout="))?.split("=")[1] ?? "figure"
const indices = rest.filter((arg) => !arg.startsWith("--")).map(Number).filter(Number.isFinite)
if (!output || indices.length === 0) {
  console.error("Usage: node scripts/build-chip-collage.mjs <output.png> <bitmap-index> [...] [--layout=figure|side-by-side]")
  process.exit(1)
}

const svg = await fs.readFile("content/figures/tapeouts-source.svg", "utf8")
const manifest = JSON.parse(await fs.readFile("public/images/gds/raw/manifest.json", "utf8"))
const fileFor = (index) => {
  const record = manifest.records.find((entry) => entry.index === index)
  if (!record?.file) throw new Error(`No extracted bitmap for index ${index}`)
  return path.join("public/images/gds/raw", record.file)
}

let canvasWidth
let canvasHeight
let placements
let shadow

if (layout === "figure") {
  const tags = [...svg.matchAll(/<image\b[^>]*?\/?>/gs)]
  placements = indices.map((index) => {
    const tag = tags[index - 1]
    if (!tag) throw new Error(`Bitmap ${index} is not in the figure`)
    const matrices = [...svg.slice(0, tag.index).matchAll(/<g\b[^>]*transform="matrix\(([^)]+)\)"[^>]*>/g)]
    const matrix = matrices[matrices.length - 1]?.[1]?.trim().split(/[\s,]+/).map(Number)
    if (!matrix || matrix.length !== 6) throw new Error(`No transform matrix for bitmap ${index}`)
    const [a, b, c, d, e, f] = matrix
    if (b !== 0 || c !== 0) throw new Error(`Rotated placement for bitmap ${index} is not supported`)
    const width = Number(tag[0].match(/\bwidth="([\d.]+)"/)?.[1])
    const height = Number(tag[0].match(/\bheight="([\d.]+)"/)?.[1])
    // Figure coordinates, in the SVG's 960 x 540 user space.
    return { index, file: fileFor(index), x: e, y: f, width: a * width, height: d * height }
  })
  placements.sort((left, right) => left.index - right.index)

  const pad = FIGURE_PADDING
  const minX = Math.min(...placements.map((p) => p.x)) - pad
  const minY = Math.min(...placements.map((p) => p.y)) - pad
  const maxX = Math.max(...placements.map((p) => p.x + p.width)) + pad
  const maxY = Math.max(...placements.map((p) => p.y + p.height)) + pad
  const scale = TARGET_WIDTH / (maxX - minX)
  canvasWidth = Math.round((maxX - minX) * scale)
  canvasHeight = Math.round((maxY - minY) * scale)
  placements = placements.map((p) => ({
    file: p.file,
    left: Math.round((p.x - minX) * scale),
    top: Math.round((p.y - minY) * scale),
    width: Math.round(p.width * scale),
    height: Math.round(p.height * scale),
  }))
  shadow = { offset: Math.round(FIGURE_SHADOW.offset * scale), sigma: FIGURE_SHADOW.sigma * scale }
} else if (layout === "side-by-side") {
  const sources = []
  for (const index of indices) {
    const file = fileFor(index)
    const meta = await sharp(file).metadata()
    sources.push({ index, file, width: meta.width, height: meta.height })
  }
  // Common height, capped at the smallest source so nothing is upscaled.
  const height = Math.min(...sources.map((source) => source.height))
  const gap = Math.round(height * SIDE_GAP)
  const pad = Math.round(height * SIDE_PADDING)
  let left = pad
  placements = sources.map((source) => {
    const width = Math.round((height * source.width) / source.height)
    const placement = { file: source.file, left, top: pad, width, height }
    left += width + gap
    return placement
  })
  canvasWidth = left - gap + pad
  canvasHeight = height + pad * 2
  shadow = { offset: Math.round(height * SIDE_SHADOW.offset), sigma: height * SIDE_SHADOW.sigma }
} else {
  throw new Error(`Unknown layout: ${layout}`)
}

const composites = []
for (const placement of placements) {
  // Soft drop shadow, as in the original figure. Built as a translucent black
  // rectangle so it also reads correctly against the cream band.
  const shadowWidth = Math.min(placement.width, canvasWidth - placement.left)
  const shadowHeight = Math.min(placement.height, canvasHeight - placement.top)
  const shadowImage = await sharp({
    create: {
      width: shadowWidth,
      height: shadowHeight,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: SHADOW_OPACITY },
    },
  })
    .blur(Math.max(0.3, shadow.sigma))
    .png()
    .toBuffer()
  composites.push({
    input: shadowImage,
    left: Math.min(canvasWidth - 1, placement.left + shadow.offset),
    top: Math.min(canvasHeight - 1, placement.top + shadow.offset),
  })

  const chip = await sharp(placement.file)
    .resize({ width: placement.width, height: placement.height, fit: "fill" })
    .png()
    .toBuffer()
  composites.push({ input: chip, left: placement.left, top: placement.top })
}

await sharp({
  create: { width: canvasWidth, height: canvasHeight, channels: 3, background: BACKGROUND },
})
  .composite(composites)
  .png()
  .toFile(output)

const meta = await sharp(output).metadata()
console.log(
  `Wrote ${output} (${meta.width}x${meta.height}) from bitmaps ${indices.join(", ")} using the ${layout} layout.`,
)
