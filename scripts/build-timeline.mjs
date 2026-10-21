/**
 * Builds the timeline figure's layout from the JSON entries in content/tapeouts.
 *
 * Placement rules:
 *   - vertical track (lane) comes from the chip's technology node;
 *   - horizontal position comes from the chip's date;
 *   - chips inside one entry stay together as a cluster, and clusters are packed
 *     into two rows per lane so a busy decade does not pile chips on one spot.
 *
 * Also records each image's content box (alpha or background trimmed) so the
 * figure, its hover hotspots and the glow only cover the die itself.
 *
 * Usage: npm run timeline:build
 */
import fs from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"

const DIRECTORY = "content/tapeouts"
const LAYOUT = "content/figures/timeline-layout.json"
const MANIFEST = "lib/image-manifest.json"

const VIEW = { width: 960, height: 540 }
const LANE_TOP = 36
const LANE_HEIGHT = 100
const LANE_GAP = 8
const CHIP_HEIGHT = 42
const ROW_INSET = 8
const AXIS_Y = 505
const X_START = 70
const X_END = 930
const START = Date.UTC(2021, 0, 1)
const END = Date.UTC(2026, 11, 31)
const CLUSTER_GAP = 0
const CLUSTER_SPACING = 8

const LANES = [
  { id: "180-130", labels: ["180 nm", "130 nm"], color: "#f8e3c8", nodes: ["180/130nm", "130nm", "180nm"] },
  { id: "65", labels: ["65 nm"], color: "#ece6f5", nodes: ["65nm", "65nmgp", "65nmlp"] },
  { id: "22", labels: ["22 nm", "FDSOI"], color: "#e4f0e6", nodes: ["22nmfdsoi"] },
  { id: "12-16", labels: ["12 nm", "16 nm"], color: "#f2f5e4", nodes: ["12/16nm", "12nmfinfet", "16nm", "16nmfinfet"] },
]

const imageManifest = JSON.parse(await fs.readFile(MANIFEST, "utf8"))

// Original placement of every chip in the source figure, in figure units.
const sourceSvg = await fs.readFile("content/figures/tapeouts-source.svg", "utf8")
const figurePlacements = new Map()
const sourceTags = [...sourceSvg.matchAll(/<image\b[^>]*?\/?>/gs)]
sourceTags.forEach((tag, index) => {
  const matrices = [...sourceSvg.slice(0, tag.index).matchAll(/<g\b[^>]*transform="matrix\(([^)]+)\)"[^>]*>/g)]
  const matrix = matrices[matrices.length - 1]?.[1]?.trim().split(/[\s,]+/).map(Number)
  if (!matrix || matrix.length !== 6) return
  const width = Number(tag[0].match(/\bwidth="([\d.]+)"/)?.[1])
  const height = Number(tag[0].match(/\bheight="([\d.]+)"/)?.[1])
  figurePlacements.set(index + 1, {
    cx: matrix[4] + (matrix[0] * width) / 2,
    cy: matrix[5] + (matrix[3] * height) / 2,
    width: matrix[0] * width,
    height: matrix[3] * height,
  })
})

// Saturated version of a stripe colour, used for the chip glow.
function vivid(hex, saturation = 0.9, lightness = 0.55) {
  const [r, g, b] = [1, 3, 5].map((index) => parseInt(hex.slice(index, index + 2), 16) / 255)
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  if (max !== min) {
    const delta = max - min
    if (max === r) h = ((g - b) / delta + (g < b ? 6 : 0)) / 6
    else if (max === g) h = ((b - r) / delta + 2) / 6
    else h = ((r - g) / delta + 4) / 6
  }
  const hueToRgb = (p, q, t) => {
    let value = t
    if (value < 0) value += 1
    if (value > 1) value -= 1
    if (value < 1 / 6) return p + (q - p) * 6 * value
    if (value < 1 / 2) return q
    if (value < 2 / 3) return p + (q - p) * (2 / 3 - value) * 6
    return p
  }
  const q = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation
  const p = 2 * lightness - q
  const rgb = [h + 1 / 3, h, h - 1 / 3].map((t) => Math.round(hueToRgb(p, q, t) * 255))
  return "#" + rgb.map((value) => Math.max(0, Math.min(255, value)).toString(16).padStart(2, "0")).join("")
}

const median = (values) => {
  const sorted = [...values].sort((left, right) => left - right)
  return sorted[Math.floor(sorted.length / 2)]
}
const files = (await fs.readdir(DIRECTORY)).filter((file) => file.endsWith(".json")).sort()
const entries = await Promise.all(
  files.map(async (file) => ({
    slug: file.replace(/\.json$/, ""),
    ...JSON.parse(await fs.readFile(path.join(DIRECTORY, file), "utf8")),
  })),
)

const normalized = (node) => node.toLowerCase().replaceAll(" ", "")
const laneFor = (node) => LANES.findIndex((lane) => lane.nodes.includes(normalized(node)))

const timeOf = (date) => {
  const [year, month = "01"] = date.split("-")
  return Date.UTC(Number(year), Number(month) - 1, 1)
}
const xOf = (time) => X_START + ((time - START) / (END - START)) * (X_END - X_START)

const crops = new Map()
async function contentBox(file) {
  if (crops.has(file)) return crops.get(file)
  const meta = await sharp(file).metadata()
  let box = { x: 0, y: 0, width: meta.width, height: meta.height }
  try {
    const { data, info } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true })
    const { width, height, channels } = info
    const pixel = (x, y) => {
      const i = (y * width + x) * channels
      return [data[i], data[i + 1], data[i + 2]]
    }
    const background = pixel(0, 0)
    const tolerance = 18
    const isBackground = (p) =>
      Math.abs(p[0] - background[0]) <= tolerance &&
      Math.abs(p[1] - background[1]) <= tolerance &&
      Math.abs(p[2] - background[2]) <= tolerance
    let minX = width
    let minY = height
    let maxX = -1
    let maxY = -1
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (isBackground(pixel(x, y))) continue
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
    if (maxX > minX && (maxX - minX + 1) * (maxY - minY + 1) > width * height * 0.15) {
      box = { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 }
    }
  } catch {
    // Keep the full image when it cannot be analysed.
  }
  const result = {
    imageWidth: meta.width,
    imageHeight: meta.height,
    crop: box,
    aspect: box.width / box.height,
    url: variantFor("/" + file.replace(/^public\//, "")),
  }
  crops.set(file, result)
  return result
}

function variantFor(publicPath) {
  const entry = imageManifest[publicPath]
  if (!entry) return publicPath
  const preferred = entry.variants.find((variant) => variant.width >= 384) ?? entry.variants[entry.variants.length - 1]
  return preferred.src
}

const lanes = LANES.map((lane, index) => ({
  id: lane.id,
  labels: lane.labels,
  color: lane.color,
  glow: vivid(lane.color),
  y: LANE_TOP + index * (LANE_HEIGHT + LANE_GAP),
  height: LANE_HEIGHT,
}))

const rows = lanes.map(() => [X_START - 8, X_START - 8])
const chips = []
let contentRight = X_START

// Place entries cluster by cluster so a record's chips stay together.
const sortedEntries = [...entries].sort((left, right) => {
  const first = (entry) => Math.min(...entry.chips.map((chip) => timeOf(chip.date)))
  return first(left) - first(right)
})

for (const entry of sortedEntries) {
  const groups = new Map()
  for (const chip of entry.chips) {
    const laneIndex = laneFor(chip.node)
    if (laneIndex < 0) throw new Error(`${entry.slug}: no lane for node "${chip.node}"`)
    if (!groups.has(laneIndex)) groups.set(laneIndex, [])
    groups.get(laneIndex).push(chip)
  }

  for (const [laneIndex, laneChips] of groups) {
    const row = rows[laneIndex][0] <= rows[laneIndex][1] ? 0 : 1
    const lane = lanes[laneIndex]
    const ordered = [...laneChips].sort((left, right) => timeOf(left.date) - timeOf(right.date))
    const sizes = []
    for (const chip of ordered) {
      const info = await contentBox(path.join("public", chip.image))
      const height = CHIP_HEIGHT
      const width = Math.min(150, Math.max(22, height * info.aspect))
      sizes.push({ info, width, height })
    }
    const placed = ordered.map((chip, index) => ({
      chip,
      size: sizes[index],
      figure: chip.figure ? figurePlacements.get(chip.figure) : undefined,
    }))
    const withFigure = placed.filter((item) => item.figure)
    const rowTop = lane.y + (row === 0 ? ROW_INSET : LANE_HEIGHT - CHIP_HEIGHT - ROW_INSET)
    const laneCenter = rowTop + CHIP_HEIGHT / 2

    // Groups drawn in the source figure keep their relative stagger and overlap;
    // the group as a whole is still placed by its earliest date.
    const stagger = withFigure.length > 1
      ? {
          minX: Math.min(...withFigure.map((item) => item.figure.cx)),
          maxX: Math.max(...withFigure.map((item) => item.figure.cx)),
          centerY: (Math.min(...withFigure.map((item) => item.figure.cy)) + Math.max(...withFigure.map((item) => item.figure.cy))) / 2,
          scale: CHIP_HEIGHT / median(withFigure.map((item) => item.figure.height)),
        }
      : null

    const clusterWidth = stagger
      ? (stagger.maxX - stagger.minX) * stagger.scale + placed[0].size.width
      : sizes.reduce((total, size) => total + size.width, 0) + CLUSTER_GAP * (sizes.length - 1)
    const earliest = xOf(timeOf(ordered[0].date)) - sizes[0].width / 2
    let cursor = Math.max(rows[laneIndex][row] + CLUSTER_SPACING, earliest)
    cursor = Math.min(cursor, X_END - clusterWidth)
    cursor = Math.max(cursor, X_START)

    const y = rowTop
    const groupLeft = cursor
    let groupRight = cursor
    ordered.forEach((chip, index) => {
      const size = sizes[index]
      const figure = placed[index].figure
      let x = cursor
      let chipY = y
      if (stagger && figure) {
        // Horizontal offsets keep the source overlaps; vertical offsets are
        // amplified a little so the stagger reads at the smaller chip size.
        x = groupLeft + (figure.cx - stagger.minX) * stagger.scale - size.width / 2
        chipY = Math.min(
          lane.y + LANE_HEIGHT - CHIP_HEIGHT - 4,
          Math.max(lane.y + 4, laneCenter - CHIP_HEIGHT / 2 + (figure.cy - stagger.centerY) * stagger.scale * 1.4),
        )
      }
      chips.push({
        slug: entry.slug,
        page: entry.page !== false,
        title: entry.title,
        category: entry.category,
        tagline: entry.tagline,
        entryChips: entry.chips.map(({ node, date }) => ({ node, date })),
        image: size.info.url,
        imageWidth: size.info.imageWidth,
        imageHeight: size.info.imageHeight,
        crop: size.info.crop,
        x: round(x),
        y: round(chipY),
        width: round(size.width),
        height: round(size.height),
        lane: lane.id,
      })
      if (stagger && figure) {
        groupRight = Math.max(groupRight, x + size.width)
        cursor = groupRight + CLUSTER_GAP
      } else {
        cursor = x + size.width + CLUSTER_GAP
        groupRight = Math.max(groupRight, cursor - CLUSTER_GAP)
      }
      contentRight = Math.max(contentRight, x + size.width)
    })
    rows[laneIndex][row] = groupRight + CLUSTER_GAP
  }
}

const years = []
for (let year = 2021; year <= 2026; year++) {
  years.push({ year, x: round(xOf(Date.UTC(year, 0, 1))) })
}

// Trim the canvas to the last content, so the figure has no empty right side.
const canvasWidth = Math.max(760, Math.min(VIEW.width, Math.ceil(contentRight + 46)))

await fs.writeFile(
  LAYOUT,
  JSON.stringify(
    {
      viewBox: { width: canvasWidth, height: VIEW.height },
      axis: { y: AXIS_Y },
      lanes,
      years,
      chips: chips.sort((left, right) => left.y - right.y || left.x - right.x),
    },
    null,
    2,
  ) + "\n",
)

console.log(`Wrote ${LAYOUT}: ${chips.length} chips across ${lanes.length} lanes, ${years.length} years.`)

function round(value) {
  return Math.round(value * 10) / 10
}
