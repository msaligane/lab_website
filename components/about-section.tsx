import { Markdown } from "@/components/markdown"
import type { AboutContent, SectionContent } from "@/lib/content"
import { Target, Lightbulb, Award } from "lucide-react"

const iconMap = { Target, Lightbulb, Award }

type AboutSectionProps = {
  content: SectionContent<AboutContent>
}

export function AboutSection({ content }: AboutSectionProps) {
  const { data, html } = content

  return (
    <section id="about" className="py-24 bg-secondary/30">
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

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {data.features.map((feature) => {
            const Icon = iconMap[feature.icon as keyof typeof iconMap] ?? Target

            return (
            <div
              key={feature.title}
              className="relative rounded-lg border border-border bg-card p-8 transition-all hover:border-primary/50"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-6">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
