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
    .slice(0, 10)

  return (
    <section id="in-the-news" className="section-shell border-b border-border/60 bg-card/45">
      <div className="site-container grid gap-10 lg:grid-cols-[0.34fr_0.66fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="section-eyebrow">Latest</p>
          <h2 className="section-title">In the News</h2>
          <Link
            href="/news"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-primary"
          >
            See all news
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <ul className="surface-card divide-y divide-border/70 overflow-hidden">
          {recentItems.map((item) => (
            <li
              key={`${item.title}-${item.date}`}
              className="group grid gap-2 px-5 py-4 transition-colors hover:bg-secondary/70 sm:grid-cols-[7rem_1fr_auto] sm:items-center sm:gap-4 sm:px-6"
            >
              <time className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {item.date}
              </time>
              <Link
                href={`/news/${slugify(item.title)}`}
                className="text-sm font-medium leading-6 text-foreground transition-colors group-hover:text-primary sm:text-base"
              >
                {item.title}
              </Link>
              <ArrowRight className="hidden h-4 w-4 -translate-x-1 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0 group-hover:text-primary group-hover:opacity-100 sm:block" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
