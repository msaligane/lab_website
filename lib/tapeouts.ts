import fs from "node:fs/promises"
import path from "node:path"

export type TapeoutPublication = {
  title: string
  venue: string
  year: number
  authors: string
  credit: string
  href: string
  related?: boolean
}

export type TapeoutAuthor = { name: string; credit: string }
export type TapeoutResource = { label: string; href: string }
export type TapeoutChip = {
  image: string
  node: string
  date: string
  /** Index of the chip in the source timeline figure; keeps its group stagger. */
  figure?: number
}

export type Tapeout = {
  slug: string
  /** False for chips that are only drawn on the timeline (no project page). */
  page: boolean
  category: string
  title: string
  tagline: string
  description: string
  featured: boolean
  cover: string
  authors: TapeoutAuthor[]
  publications: TapeoutPublication[]
  resources: TapeoutResource[]
  chips: TapeoutChip[]
}

const directory = path.join(process.cwd(), "content", "tapeouts")

function text(value: unknown, where: string, { allowEmpty = false } = {}): string {
  if (typeof value !== "string") throw new Error(`${where} must be a string`)
  if (!allowEmpty && value.trim() === "") throw new Error(`${where} must not be empty`)
  return value
}

function list(value: unknown, where: string): unknown[] {
  if (!Array.isArray(value) || value.length === 0) throw new Error(`${where} must be a non-empty array`)
  return value
}

function parse(file: string, raw: string): Tapeout {
  const where = `content/tapeouts/${file}`
  const data = JSON.parse(raw) as Record<string, unknown>

  const page = data.page !== false
  const authors = (page ? list(data.authors, `${where}: authors`) : (Array.isArray(data.authors) ? data.authors : [])).map((author, index) => {
    const entry = author as Record<string, unknown>
    return { name: text(entry.name, `${where}: authors[${index}].name`), credit: text(entry.credit, `${where}: authors[${index}].credit`) }
  })

  const publications = (page ? list(data.publications, `${where}: publications`) : (Array.isArray(data.publications) ? data.publications : [])).map((publication, index) => {
    const entry = publication as Record<string, unknown>
    const at = `${where}: publications[${index}]`
    if (typeof entry.year !== "number" || !Number.isInteger(entry.year)) throw new Error(`${at}.year must be an integer`)
    return {
      title: text(entry.title, `${at}.title`),
      venue: text(entry.venue, `${at}.venue`),
      year: entry.year,
      authors: text(entry.authors, `${at}.authors`),
      credit: text(entry.credit, `${at}.credit`),
      href: text(entry.href, `${at}.href`),
      related: entry.related === true,
    }
  })

  const resources = (Array.isArray(data.resources) ? data.resources : []).map((resource, index) => {
    const entry = resource as Record<string, unknown>
    return { label: text(entry.label, `${where}: resources[${index}].label`), href: text(entry.href, `${where}: resources[${index}].href`) }
  })

  const chips = list(data.chips, `${where}: chips`).map((chip, index) => {
    const entry = chip as Record<string, unknown>
    const figure = entry.figure === undefined ? undefined : Number(entry.figure)
    if (figure !== undefined && (!Number.isInteger(figure) || figure < 1)) {
      throw new Error(`${where}: chips[${index}].figure must be a positive integer`)
    }
    return {
      image: text(entry.image, `${where}: chips[${index}].image`),
      node: text(entry.node, `${where}: chips[${index}].node`),
      date: text(entry.date ?? "", `${where}: chips[${index}].date`, { allowEmpty: true }),
      figure,
    }
  })

  return {
    slug: file.replace(/\.json$/, ""),
    page,
    category: text(data.category, `${where}: category`),
    title: text(data.title, `${where}: title`),
    tagline: text(data.tagline, `${where}: tagline`),
    description: text(data.description ?? "", `${where}: description`, { allowEmpty: !page }),
    featured: data.featured === true,
    cover: text(data.cover ?? chips[0].image, `${where}: cover`),
    authors,
    publications,
    resources,
    chips,
  }
}

const latestYear = (entry: Tapeout) => Math.max(...entry.publications.map((publication) => publication.year))

/** Newest publication first, then title, so the gallery order is stable. */
export function compareTapeouts(left: Tapeout, right: Tapeout) {
  const byYear = latestYear(right) - latestYear(left)
  if (byYear !== 0) return byYear
  return left.title < right.title ? -1 : left.title > right.title ? 1 : 0
}

/** One JSON file per entry; the file name is the project slug. */
export async function getTapeouts(): Promise<Tapeout[]> {
  const files = (await fs.readdir(directory)).filter((file) => file.endsWith(".json")).sort()
  const entries = await Promise.all(
    files.map(async (file) => parse(file, await fs.readFile(path.join(directory, file), "utf8"))),
  )
  return entries.sort(compareTapeouts)
}

export async function getTapeout(slug: string): Promise<Tapeout | undefined> {
  return (await getTapeouts()).find((entry) => entry.slug === slug && entry.page)
}

/** Entries that have a public project page. */
export async function getPublishedTapeouts(): Promise<Tapeout[]> {
  return (await getTapeouts()).filter((entry) => entry.page)
}

/** Chip caption: technology node, plus the date when it is known. */
export function chipLabel(chip: TapeoutChip): string {
  return chip.date ? `${chip.node} · ${chip.date}` : chip.node
}

export type TimelineChip = {
  slug: string
  page: boolean
  title: string
  category: string
  tagline: string
  entryChips: { node: string; date: string }[]
  image: string
  imageWidth: number
  imageHeight: number
  crop: { x: number; y: number; width: number; height: number }
  x: number
  y: number
  width: number
  height: number
  lane: string
}

export type TimelineLane = { id: string; labels: string[]; color: string; glow: string; y: number; height: number }

export type TimelineLayout = {
  viewBox: { width: number; height: number }
  axis: { y: number }
  lanes: TimelineLane[]
  years: { year: number; x: number }[]
  chips: TimelineChip[]
}

/** Positions of the chips inside the rebuilt timeline figure (viewBox units). */
export async function getTimelineLayout(): Promise<TimelineLayout> {
  const file = path.join(process.cwd(), "content", "figures", "timeline-layout.json")
  return JSON.parse(await fs.readFile(file, "utf8")) as TimelineLayout
}
