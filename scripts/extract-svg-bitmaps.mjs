/**
 * Extracts every bitmap embedded in the original timeline figure
 * (content/figures/tapeouts-source.svg) into public/images/gds/raw.
 *
 * The figure stores each chip as a base64 <image> element, so this is the
 * source inventory the gallery images are cut from. Output is deterministic:
 * bitmaps are numbered in document order, and manifest.json records each one's
 * pixel size, declared figure geometry and SHA-256.
 *
 * Usage: node scripts/extract-svg-bitmaps.mjs
 */
import fs from "node:fs/promises"
import path from "node:path"
import crypto from "node:crypto"
import sharp from "sharp"

const SVG_SOURCE = "content/figures/tapeouts-source.svg"
const OUTPUT_DIR = "public/images/gds/raw"

const svg = await fs.readFile(SVG_SOURCE, "utf8")
await fs.mkdir(OUTPUT_DIR, { recursive: true })

const attribute = (attrs, name) => attrs.match(new RegExp(`(?:^|\\s)${name}="([^"]*)"`))?.[1]

const records = []
for (const [index, [, attrs]] of [...svg.matchAll(/<image\b([^>]*?)\/?>/gs)].entries()) {
  const href = attrs.match(/(?:xlink:)?href="data:image\/([a-zA-Z+]+);base64,([^"]+)"/)
  if (!href) continue
  const [, subtype, base64] = href
  const bytes = Buffer.from(base64, "base64")
  const number = index + 1
  const file = `bitmap-${String(number).padStart(2, "0")}.${subtype === "jpeg" ? "jpg" : subtype}`
  await fs.writeFile(path.join(OUTPUT_DIR, file), bytes)

  const { width, height, format } = await sharp(bytes).metadata()
  records.push({
    index: number,
    file,
    declared: {
      x: attribute(attrs, "x"),
      y: attribute(attrs, "y"),
      width: attribute(attrs, "width"),
      height: attribute(attrs, "height"),
      preserveAspectRatio: attribute(attrs, "preserveAspectRatio"),
      clipPath: attribute(attrs, "clip-path"),
    },
    pixel: { width, height, format },
    bytes: bytes.length,
    sha256: crypto.createHash("sha256").update(bytes).digest("hex"),
  })
}

await fs.writeFile(
  path.join(OUTPUT_DIR, "manifest.json"),
  JSON.stringify({ source: SVG_SOURCE, extracted: records.length, records }, null, 2) + "\n",
)

console.log(`Extracted ${records.length} bitmaps from ${SVG_SOURCE} into ${OUTPUT_DIR}.`)
