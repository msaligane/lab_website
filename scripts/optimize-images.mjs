import fs from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"

const root = process.cwd()
const sourceDir = path.join(root, "public/images")
const targetDir = path.join(root, "public/optimized")
const manifest = {}
async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const name = path.join(dir, entry.name)
    if (entry.isDirectory()) files.push(...await walk(name))
    else if (/\.(png|jpe?g|webp)$/i.test(name)) files.push(name)
  }
  return files.sort()
}
for (const file of await walk(sourceDir)) {
  const relative = path.relative(sourceDir, file).replaceAll("\\", "/")
  const metadata = await sharp(file).metadata()
  const rotated = [5, 6, 7, 8].includes(metadata.orientation)
  const width = rotated ? metadata.height : metadata.width
  const height = rotated ? metadata.width : metadata.height
  // Preserve small labels and line art with lossless encoding at each size.
  const diagram = /^(research|publications|fundings)\//.test(relative) || relative === "lab_logo.png" || relative === "news/0925_webinar.png"
  const decorative = relative.startsWith("gds/")
  const maxWidth = diagram ? width : Math.min(width, decorative ? 768 : 1600)
  const steps = decorative ? [192, 384, 768] : [192, 480, 960]
  const sizes = [...new Set([...steps, maxWidth].filter(size => size <= maxWidth))].sort((a, b) => a - b)
  const variants = []
  for (const size of sizes) {
    const name = `${relative}-${size}.webp`
    const target = path.join(targetDir, name)
    await fs.mkdir(path.dirname(target), { recursive: true })
    const result = await sharp(file).rotate().resize({ width: size, withoutEnlargement: true })
      .webp(diagram ? { lossless: true, effort: 6 } : { quality: decorative ? 70 : 84, effort: 5 })
      .toFile(target)
    variants.push({ src: `/optimized/${name}`, width: result.width, bytes: result.size })
  }
  manifest[`/images/${relative}`] = { width, height, originalBytes: (await fs.stat(file)).size, variants }
}
await fs.writeFile(path.join(root, "lib/image-manifest.json"), JSON.stringify(manifest, null, 2) + "\n")
console.log(`Generated responsive WebP variants for ${Object.keys(manifest).length} images. Originals preserved.`)
