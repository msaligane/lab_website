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
}

export type SectionContent<T> = {
  data: T
  html: string
}

const contentDir = path.join(process.cwd(), "content")

async function readYaml<T extends { description?: string }>(
  slug: string,
): Promise<SectionContent<T>> {
  const filePath = path.join(contentDir, `${slug}.yaml`)
  const raw = await fs.readFile(filePath, "utf8")
  const data = YAML.parse(raw) as T
  const description = data.description?.trim() ?? ""
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
    readYaml<NewsContent>("news"),
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

export async function getNewsSlugs() {
  const news = await readYaml<NewsContent>("news")
  return news.data.items.map((item) => slugify(item.title))
}

export async function getNewsDetail(slug: string): Promise<NewsDetail | null> {
  const news = await readYaml<NewsContent>("news")
  const item = news.data.items.find((entry) => slugify(entry.title) === slug)

  if (!item) {
    return null
  }

  const filePath = path.join(contentDir, "news", `${slug}.md`)
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
