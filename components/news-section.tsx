import Link from "next/link"
import { Markdown } from "@/components/markdown"
import type { NewsContent, SectionContent } from "@/lib/content"
import { slugify } from "@/lib/utils"
import { ExternalLink, MapPin, Mic } from "lucide-react"

type NewsSectionProps = {
  content: SectionContent<NewsContent>
}

export function NewsSection({ content }: NewsSectionProps) {
  const { data, html } = content
  const sortedItems = [...data.items].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )

  return (
    <section id="news" className="py-24 bg-secondary/20">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            {data.eyebrow}
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            {data.title}
          </h2>
          <Markdown
            html={html}
            className="mt-4 text-lg text-muted-foreground text-pretty"
          />
        </div>

        <ul className="mt-12 divide-y divide-border rounded-2xl border border-border bg-card/60">
          {sortedItems.map((item) => (
            <li key={`${item.title}-${item.date}`} className="px-6 py-6 sm:px-8">
              <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-wide text-muted-foreground">
                <time className="font-semibold text-foreground/80">{item.date}</time>
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-[11px] font-semibold text-primary">
                  {item.category}
                </span>
              </div>
              <h3 className="mt-3 text-xl font-semibold text-foreground sm:text-2xl">
                <Link
                  href={`/news/${slugify(item.title)}`}
                  className="transition-colors hover:text-primary"
                >
                  {item.title}
                </Link>
              </h3>
              <p className="mt-3 text-base text-muted-foreground leading-relaxed">
                {item.summary}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {item.location && (
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {item.location}
                  </span>
                )}
                {item.speaker && (
                  <span className="inline-flex items-center gap-2">
                    <Mic className="h-4 w-4" />
                    {item.speaker}
                  </span>
                )}
                {item.link && (
                  <a
                    className="inline-flex items-center gap-2 font-semibold text-primary hover:text-primary/80"
                    href={item.link.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {item.link.label}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                <Link
                  href={`/news/${slugify(item.title)}`}
                  className="inline-flex items-center gap-2 font-semibold text-primary hover:text-primary/80"
                >
                  Read full story
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
