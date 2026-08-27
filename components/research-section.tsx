"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCallback } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Markdown } from "@/components/markdown"
import type { ResearchContent, SectionContent } from "@/lib/content"
import { slugify } from "@/lib/utils"
import { Activity, ArrowUpRight, BrainCircuit, CircuitBoard, Cpu, Database, Dna, Shield, Sparkles } from "lucide-react"

const iconMap = { Activity, BrainCircuit, CircuitBoard, Cpu, Database, Dna, Shield, Sparkles }

type ResearchSectionProps = {
  content: SectionContent<ResearchContent>
}

export function ResearchSection({ content }: ResearchSectionProps) {
  const { data, html } = content
  const router = useRouter()
  const areas = data.areas.map((area) => ({
    ...area,
    slug: slugify(area.title),
  }))

  const handleNavigate = useCallback(
    (href: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.altKey ||
        event.ctrlKey ||
        event.shiftKey
      ) {
        return
      }

      event.preventDefault()
      const doc = document as Document & {
        startViewTransition?: (callback: () => void) => void
      }

      if (doc.startViewTransition) {
        doc.startViewTransition(() => router.push(href))
      } else {
        router.push(href)
      }
    },
    [router],
  )

  return (
    <section id="research" className="section-shell relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="site-container">
        <div className="grid items-end gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
          <h2 className="section-eyebrow">
            {data.eyebrow}
          </h2>
          <p className="section-title text-balance">
            {data.title}
          </p>
          </div>
          <Markdown
            html={html}
            className="section-copy mt-0 max-w-2xl text-pretty lg:justify-self-end"
          />
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
          {areas.map((area, index) => {
            const Icon = iconMap[area.icon as keyof typeof iconMap] ?? Cpu

            return (
              <Link
                key={area.title}
                href={`/research/${area.slug}`}
                className="group h-full focus-visible:outline-none"
                onClick={handleNavigate(`/research/${area.slug}`)}
              >
                <Card className="surface-card relative h-full overflow-hidden border-border/70 py-0 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary/45 group-hover:shadow-[0_24px_70px_-36px_rgba(24,20,14,0.55)] group-focus-visible:ring-2 group-focus-visible:ring-ring">
                  <div className="h-1 w-full bg-gradient-to-r from-primary via-primary/55 to-transparent" />
                  <CardHeader className="flex h-full flex-col px-6 pt-6">
                    <div className="mb-6 flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 transition-colors group-hover:bg-primary/20">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <span className="text-xs font-semibold tracking-[0.16em] text-muted-foreground/70">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="mb-3">
                      {area.catchPhrase ? (
                        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                          {area.catchPhrase}
                        </span>
                      ) : null}
                    </div>
                    <CardTitle className="text-xl leading-tight text-foreground">{area.title}</CardTitle>
                    <CardDescription className="mt-1 text-sm leading-6 text-muted-foreground">
                      {area.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto px-6 pb-6">
                    <div className="flex flex-wrap gap-2">
                      {area.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-6 flex items-center justify-between border-t border-border/70 pt-4 text-sm font-semibold text-foreground">
                      Explore area
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
