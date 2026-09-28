import type { Metadata } from "next"
import fs from "node:fs/promises"
import path from "node:path"

export const defaultSocialImage = "/reallmasic_icon.png"

/** Use an existing local photo/figure; otherwise retain the shared logo fallback. */
export async function contentSocialImage(html: string, photos: string[] = []) {
  const inline = [...html.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["']/gi)].map(match => match[1])
  const publicRoot = path.resolve(process.cwd(), "public")
  for (const source of [...photos, ...inline]) {
    if (!source.startsWith("/images/") || !/\.(png|jpe?g|webp)$/i.test(source)) continue
    const file = path.resolve(publicRoot, `.${source}`)
    if (!file.startsWith(`${publicRoot}${path.sep}`)) continue
    try {
      const stat = await fs.stat(file)
      if (stat.isFile() && stat.size < 5_000_000) return source
    } catch {
      // Missing editorial images should not remove the default social image.
    }
  }
  return undefined
}

/** Supply complete social objects: Next.js replaces nested metadata rather than merging it. */
export function pageMetadata({ title, description, path, image, imageAlt, article = false }: {
  title: string
  description: string
  path: string
  image?: string
  imageAlt?: string
  article?: boolean
}): Metadata {
  const socialImage = {
    url: image || defaultSocialImage,
    alt: image ? (imageAlt || title) : "ReaLLMASIC Lab",
  }
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: article ? "article" : "website",
      siteName: "ReaLLMASIC Lab",
      title,
      description,
      url: path,
      images: [socialImage],
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: [socialImage],
    },
  }
}
