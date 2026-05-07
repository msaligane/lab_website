import Link from "next/link"
import type { NewsContent, SectionContent } from "@/lib/content"
import { slugify } from "@/lib/utils"
import { ArrowRight } from "lucide-react"

type InTheNewsSectionProps = {
  content: SectionContent<NewsContent>
}

export function InTheNewsSection({ content }: InTheNewsSectionProps) {
  const { data } = content
  const recentItems = [...data.items]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)

  return (
    <section id="in-the-news" className="py-24 bg-secondary/20">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            In the News
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Latest Updates
          </h2>
        </div>

        <ul className="mt-12 divide-y divide-border rounded-2xl border border-border bg-card/60">
          {recentItems.map((item) => (
            <li key={`${item.title}-${item.date}`} className="px-6 py-6 sm:px-8">
              <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-wide text-muted-foreground">
                <time className="font-semibold text-foreground/80">{item.date}</time>
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-[11px] font-semibold text-primary">
                  {item.category}
                </span>
              </div>
              <h3 className="mt-3 text-lg font-semibold text-foreground sm:text-xl">
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
            </li>
          ))}
        </ul>

        <div className="mt-8 flex justify-center">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80"
          >
            See all news
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
