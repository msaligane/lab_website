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
    <section id="publications" className="py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-primary">
            {data.eyebrow}
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            {data.title}
          </p>
          <Markdown
            html={html}
            className="mt-4 text-lg text-muted-foreground text-pretty"
          />
        </div>

        <div className="mt-16 space-y-10">
          {years.map((year) => (
            <div key={year} className="space-y-6">
              <div className="flex items-center gap-4">
                <h3 className="text-2xl font-semibold text-foreground">{year}</h3>
                <div className="h-px flex-1 bg-border" />
              </div>
              <ul className="space-y-6">
                {grouped[year].map((pub) => (
                  <li key={`${pub.title}-${pub.venue}`} className="space-y-2">
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
                    <p className="text-lg font-semibold text-foreground">{pub.title}</p>
                    <p className="text-sm text-muted-foreground">{pub.authors}</p>
                    {pub.links && pub.links.length > 0 && (
                      <div className="flex flex-wrap gap-3 text-sm">
                        {pub.links.map((link) => (
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
