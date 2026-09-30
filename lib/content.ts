import fs from "node:fs/promises"
import path from "node:path"
import { marked } from "marked"
import YAML from "yaml"
import { slugify } from "@/lib/utils"

export type HeroContent = {
  titleHighlight: string
  titleLineOne: string
  titleLineTwo: string
  primaryButton: string
  secondaryButton: string
  description: string
}

export type AboutContent = {
  eyebrow: string
  title: string
  description: string
  features: { icon: string; title: string; description: string }[]
}

export type ResearchContent = {
  eyebrow: string
  title: string
  description: string
  areas: {
    icon: string
    title: string
    catchPhrase?: string
    description: string
    tags: string[]
  }[]
}

export type ResearchDetail = {
  slug: string
  area: ResearchContent["areas"][number]
  html: string
  raw: string
}

export type TeamContent = {
  groupPhoto?: { image: string; alt: string }
  gallery?: { title: string; photos: { image: string; alt: string }[] }
  eyebrow: string
  title: string
  description: string
  pi: {
    name: string
    role: string
    specialty: string
    image?: string
    initials: string
    email?: string
    linkedin?: string
    moreInfoUrl?: string
  }
  groups: {
    title: string
    members: {
      name: string
      role: string
      started?: string
      specialty?: string
      introduction?: string
      image?: string
      initials: string
      email?: string
      linkedin?: string
    }[]
  }[]
}

export type PublicationsContent = {
  eyebrow: string
  title: string
  description: string
  buttonLabel: string
  items: {
    title: string
    authors: string
    venue: string
    year: string
    type: string
    url?: string
    summary?: string
    thumbnail?: string
    links?: { label: string; href: string }[]
  }[]
}

export type NewsContent = {
  eyebrow: string
  title: string
  description: string
  items: {
    slug: string
    body?: string
    title: string
    date: string
    category: string
    summary: string
    location?: string
    speaker?: string
    link?: { label: string; href: string }
    imagesDir?: string
  }[]
}

export type NewsDetail = {
  slug: string
  item: NewsContent["items"][number]
  html: string
  raw: string
  images: string[]
}

export type ContactContent = {
  eyebrow: string
  title: string
  description: string
  recipientEmail: string
  formTitle: string
  formDescription: string
  labels: {
    firstName: string
    lastName: string
    email: string
    subject: string
    message: string
    submit: string
  }
  info: { icon: string; title: string; details: string[] }[]
}

export type HeaderContent = {
  brand: string
  brandAccent: string
  cta: string
  links: { name: string; href: string; children?: { name: string; href: string }[] }[]
}

export type FooterContent = {
  brand: string
  brandAccent: string
  logoPath?: string
  social: { name: string; href: string; icon: string }[]
  fundingTitle?: string
  fundingNote?: string
  fundingImage?: string
  fundingLogos?: { name: string; image: string; viewBox?: string; href?: string; caption?: string }[]
}

export type SectionContent<T> = {
  data: T
  html: string
}

const contentDir = path.join(process.cwd(), "content")

async function readYaml<T extends object>(
  slug: string,
): Promise<SectionContent<T>> {
  const filePath = path.join(contentDir, `${slug}.yaml`)
  const raw = await fs.readFile(filePath, "utf8")
  const data = YAML.parse(raw) as T
  const descriptionValue = (data as { description?: unknown }).description
  const description =
    typeof descriptionValue === "string" ? descriptionValue.trim() : ""
  const html = description ? await marked.parse(description) : ""
  return { data, html }
}

export async function getPageContent() {
  const [
    header,
    hero,
    about,
    research,
    team,
    publications,
    news,
    contact,
    footer,
  ] = await Promise.all([
    readYaml<HeaderContent>("header"),
    readYaml<HeroContent>("hero"),
    readYaml<AboutContent>("about"),
    readYaml<ResearchContent>("research"),
    readYaml<TeamContent>("team"),
    readYaml<PublicationsContent>("publications"),
    getNewsContent(),
    readYaml<ContactContent>("contact"),
    readYaml<FooterContent>("footer"),
  ])

  return {
    header,
    hero,
    about,
    research,
    team,
    publications,
    news,
    contact,
    footer,
  }
}

export async function getResearchSlugs() {
  const research = await readYaml<ResearchContent>("research")
  return research.data.areas.map((area) => slugify(area.title))
}

export async function getResearchDetail(slug: string): Promise<ResearchDetail | null> {
  const research = await readYaml<ResearchContent>("research")
  const area = research.data.areas.find((item) => slugify(item.title) === slug)

  if (!area) {
    return null
  }

  const filePath = path.join(contentDir, "research", `${slug}.md`)
  let raw = ""

  try {
    raw = await fs.readFile(filePath, "utf8")
  } catch (error) {
    const err = error as NodeJS.ErrnoException
    if (err.code !== "ENOENT") {
      throw error
    }
  }

  const html = raw.trim() ? await marked.parse(raw) : ""

  return {
    slug,
    area,
    html,
    raw,
  }
}

async function getNewsContent(): Promise<SectionContent<NewsContent>> {
  const news = await readYaml<NewsContent>("news")
  const seen = new Set<string>()

  for (const item of news.data.items) {
    if (typeof item.slug !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug)) {
      throw new Error(`News entry "${item.title}" needs a valid, stable slug.`)
    }
    if (seen.has(item.slug)) {
      throw new Error(`Duplicate news slug: ${item.slug}`)
    }
    seen.add(item.slug)
    if (typeof item.summary !== "string" || !item.summary.trim()) {
      throw new Error(`News entry "${item.slug}" needs a nonempty summary.`)
    }
    if (item.body !== undefined &&
        (typeof item.body !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*\.md$/.test(item.body))) {
      throw new Error(`News entry "${item.slug}" has an invalid markdown filename.`)
    }
  }

  return news
}

export async function getNewsSlugs() {
  const news = await getNewsContent()
  return news.data.items.map((item) => item.slug)
}

export async function getNewsDetail(slug: string): Promise<NewsDetail | null> {
  const news = await getNewsContent()
  const item = news.data.items.find((entry) => entry.slug === slug)

  if (!item) {
    return null
  }

  // Short announcements use their existing summary. An explicitly mapped
  // article must exist and contain text; never silently replace a lost story.
  const raw = item.body
    ? await fs.readFile(path.join(contentDir, "news", item.body), "utf8")
    : item.summary
  if (!raw.trim()) {
    throw new Error(`News article "${slug}" is empty (${item.body}).`)
  }

  const html = await marked.parse(raw)
  const images = await getNewsImages(item.imagesDir)

  return {
    slug,
    item,
    html,
    raw,
    images,
  }
}

async function getNewsImages(imagesDir?: string) {
  if (!imagesDir) return []
  const dirPath = path.join(process.cwd(), "public", "images", "news", imagesDir)

  try {
    const entries = await fs.readdir(dirPath)
    return entries
      .filter((file) => /\.(png|jpe?g|webp|gif)$/i.test(file))
      .sort()
      .map((file) => `/images/news/${imagesDir}/${file}`)
  } catch (error) {
    const err = error as NodeJS.ErrnoException
    if (err.code !== "ENOENT") {
      throw error
    }
    return []
  }
}
