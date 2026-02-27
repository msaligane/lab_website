"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCallback } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Markdown } from "@/components/markdown"
import type { ResearchContent, SectionContent } from "@/lib/content"
import { slugify } from "@/lib/utils"
import { Activity, BrainCircuit, CircuitBoard, Cpu, Database, Dna, Shield, Sparkles } from "lucide-react"

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
    <section id="research" className="py-24">
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

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
          {areas.map((area) => {
            const Icon = iconMap[area.icon as keyof typeof iconMap] ?? Cpu

            return (
              <Link
                key={area.title}
                href={`/research/${area.slug}`}
                className="group h-full"
                onClick={handleNavigate(`/research/${area.slug}`)}
              >
                <Card className="h-full transition-all hover:-translate-y-1 hover:border-primary/50 bg-card">
                  <CardHeader className="flex h-full flex-col">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      {area.catchPhrase ? (
                        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary bg-primary/10 px-3 py-1 rounded-full">
                          {area.catchPhrase}
                        </span>
                      ) : null}
                    </div>
                    <CardTitle className="text-foreground">{area.title}</CardTitle>
                    <CardDescription className="text-muted-foreground leading-relaxed">
                      {area.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto">
                    <div className="flex flex-wrap gap-2">
                      {area.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
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
