import { Badge } from "@/components/ui/badge"
import { Markdown } from "@/components/markdown"
import type { PublicationsContent, SectionContent } from "@/lib/content"
import Link from "next/link"
import { ExternalLink } from "lucide-react"

type PublicationsSectionProps = {
  content: SectionContent<PublicationsContent>
}

export function PublicationsSection({ content }: PublicationsSectionProps) {
  const { data, html } = content
  const grouped = data.items.reduce<Record<string, PublicationsContent["items"]>>(
    (acc, item) => {
      acc[item.year] = acc[item.year] ? [...acc[item.year], item] : [item]
      return acc
    },
    {},
  )
  const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a))

  return (
    <section id="publications" className="section-shell">
      <div className="site-container">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="section-eyebrow">
            {data.eyebrow}
          </h2>
          <p className="section-title text-balance">
            {data.title}
          </p>
          <Markdown
            html={html}
            className="section-copy text-pretty"
          />
        </div>

        <div className="mx-auto mt-14 max-w-5xl space-y-12">
          {years.map((year) => (
            <div key={year} className="space-y-6">
              <div className="flex items-center gap-4">
                <h3 className="text-3xl font-semibold tracking-tight text-foreground">{year}</h3>
                <div className="h-px flex-1 bg-border" />
              </div>
              <ul className="space-y-4">
                {grouped[year].map((pub) => (
                  <li key={`${pub.title}-${pub.venue}`} className="surface-card space-y-3 px-5 py-5 transition-colors hover:border-primary/35 sm:px-7 sm:py-6">
                    <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                      <Badge
                        variant={pub.type === "Journal" ? "default" : "secondary"}
                        className={`text-xs ${
                          pub.type === "Conference"
                            ? "bg-[oklch(0.55_0.14_35)] text-white"
                            : ""
                        }`}
                      >
                        {pub.type}
                      </Badge>
                      <span className="text-muted-foreground">{pub.venue}</span>
                    </div>
                    <p className="text-lg font-semibold leading-snug text-foreground sm:text-xl">{pub.title}</p>
                    <p className="text-sm leading-6 text-muted-foreground">{pub.authors}</p>
                    {pub.links?.some((link) => link.href && link.href !== "#") && (
                      <div className="flex flex-wrap gap-3 text-sm">
                        {pub.links.filter((link) => link.href && link.href !== "#").map((link) => (
                          <Link
                            key={link.label}
                            href={link.href}
                            className="inline-flex items-center gap-1 text-primary hover:text-primary/80"
                          >
                            {link.label}
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
