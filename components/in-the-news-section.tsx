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
    <section id="in-the-news" className="pt-4 pb-12">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl text-balance">
            In the News
          </h2>
        </div>

        <ul className="mt-8 mx-auto max-w-3xl space-y-3">
          {recentItems.map((item) => (
            <li
              key={`${item.title}-${item.date}`}
              className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4"
            >
              <time className="shrink-0 text-sm font-semibold text-muted-foreground sm:w-32">
                {item.date}
              </time>
              <Link
                href={`/news/${slugify(item.title)}`}
                className="text-base font-medium text-foreground transition-colors hover:text-primary sm:text-lg"
              >
                {item.title}
              </Link>
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
