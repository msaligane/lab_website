import manifest from "./image-manifest.json"

type ImageEntry = { width: number; height: number; variants: { src: string; width: number }[] }
const images: Record<string, ImageEntry> = manifest

export function responsiveImage(src: string, sizes: string, fallbackWidth = 960) {
  const entry = images[src]
  if (!entry) return { src, loading: "lazy" as const, decoding: "async" as const }
  const fallback = entry.variants.find(image => image.width >= fallbackWidth) ?? entry.variants[entry.variants.length - 1]
  return {
    src: fallback.src,
    srcSet: entry.variants.map(image => `${image.src} ${image.width}w`).join(", "),
    sizes,
    width: entry.width,
    height: entry.height,
    loading: "lazy" as const,
    decoding: "async" as const,
    "data-original-src": src,
  }
}

// Only transform known, local images in our authored markdown. Keep alt text,
// inline styles, and existing dimensions; external images remain untouched.
export function responsiveMarkdown(html: string) {
  return html.replace(/<img\b[^>]*>/gi, tag => {
    const source = tag.match(/\bsrc=["']([^"']+)["']/)?.[1]
    if (!source || !images[source] || /\bsrcset=/i.test(tag)) return tag
    const percent = Number(tag.match(/\bwidth:\s*([\d.]+)%/)?.[1] ?? 100) / 100
    const max = Number(tag.match(/\bmax-width:\s*([\d.]+)px/)?.[1] ?? 960)
    const scientific = source.startsWith("/images/research/")
    const sizes = `${scientific ? "(max-width: 640px) calc(100vw - 48px), " : ""}(max-width: 1024px) ${Math.round(percent * 100)}vw, ${Math.min(max, Math.round(960 * percent))}px`
    const props = responsiveImage(source, sizes)
    let updated = tag.replace(/\bsrc=["'][^"']+["']/, `src="${props.src}"`)
    for (const [key, value] of Object.entries(props)) {
      if (key === "src" || value === undefined) continue
      const attribute = key === "srcSet" ? "srcset" : key
      if (!new RegExp(`\\b${attribute}=`).test(updated)) {
        updated = updated.replace(/\s*\/?>$/, ` ${attribute}="${String(value).replaceAll('"', "&quot;")}" />`)
      }
    }
    return scientific
      ? `${updated}<a class="figure-original-link" href="${source}" target="_blank" rel="noreferrer">Open full-resolution image <span class="sr-only">(new tab)</span></a>`
      : updated
  })
}
