import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Markdown } from "@/components/markdown"
import { NewsCarousel } from "@/components/news-carousel"
import { getNewsDetail, getNewsSlugs, getPageContent } from "@/lib/content"

export async function generateStaticParams() {
  const slugs = await getNewsSlugs()
  return slugs.map((slug) => ({ slug }))
}

type NewsDetailPageProps = {
  params: Promise<{ slug: string }>
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params
  const content = await getPageContent()
  const detail = await getNewsDetail(slug)

  if (!detail) {
    notFound()
  }

  const { item, html, images } = detail

  return (
    <main className="min-h-screen bg-background">
      <Header content={content.header.data} />
      <section className="pt-32 pb-20">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                {item.category}
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl text-balance">
                {item.title}
              </h1>
              <p className="mt-4 text-sm text-muted-foreground">
                {item.date}
                {item.location ? ` · ${item.location}` : ""}
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/news">Back to news</Link>
            </Button>
          </div>

          {images.length > 0 ? (
            <NewsCarousel images={images} altPrefix={item.title} />
          ) : null}

          <Markdown
            html={html}
            className="mt-10 text-base leading-relaxed text-foreground/90 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-semibold [&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:text-primary [&_a]:underline [&_img]:mt-6 [&_img]:rounded-xl [&_img]:border [&_img]:border-border"
          />

          {!html ? (
            <div className="mt-10 rounded-xl border border-dashed border-border bg-card p-6 text-sm text-muted-foreground">
              Detailed content will be added here soon.
            </div>
          ) : null}
        </div>
      </section>
      <Footer content={content.footer.data} />
    </main>
  )
}
