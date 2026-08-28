import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { PublicationsContent, SectionContent } from "@/lib/content"

type FeaturedWorkSectionProps = {
  content: SectionContent<PublicationsContent>
}

export function FeaturedWorkSection({ content }: FeaturedWorkSectionProps) {
  const selected = [...content.data.items]
    .sort((a, b) => Number(b.year) - Number(a.year))
    .slice(0, 3)

  return (
    <section className="section-shell bg-foreground text-background">
      <div className="site-container">
        <div className="grid gap-8 lg:grid-cols-[0.34fr_0.66fr] lg:gap-16">
          <div>
            <p className="section-eyebrow">Selected work</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-background sm:text-4xl lg:text-5xl">
              Recent publications
            </h2>
            <Link
              href="/publications"
              className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-background transition-colors hover:text-primary"
            >
              View all publications
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <ol className="border-t border-background/20">
            {selected.map((publication) => {
              const href = publication.links?.find((link) => link.href && link.href !== "#")?.href
                ?? publication.url
                ?? "/publications"
              const isExternal = href.startsWith("http")

              return (
                <li key={`${publication.title}-${publication.venue}`} className="border-b border-background/20">
                  <Link
                    href={href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noreferrer" : undefined}
                    className="group grid gap-4 py-6 sm:grid-cols-[7rem_1fr_auto] sm:items-start sm:gap-6"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-primary">{publication.year}</span>
                      <Badge variant="outline" className="border-background/25 text-[10px] text-background/75">
                        {publication.type}
                      </Badge>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold leading-snug text-background transition-colors group-hover:text-primary sm:text-xl">
                        {publication.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-background/60">{publication.venue}</p>
                    </div>
                    <ArrowUpRight className="hidden h-5 w-5 text-background/50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary sm:block" />
                  </Link>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
