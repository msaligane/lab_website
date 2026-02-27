import Link from "next/link"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Markdown } from "@/components/markdown"
import { getPageContent, getResearchDetail, getResearchSlugs } from "@/lib/content"

export async function generateStaticParams() {
  const slugs = await getResearchSlugs()
  return slugs.map((slug) => ({ slug }))
}

type ResearchDetailPageProps = {
  params: Promise<{ slug: string }>
}

export default async function ResearchDetailPage({ params }: ResearchDetailPageProps) {
  const { slug } = await params
  const content = await getPageContent()
  const detail = await getResearchDetail(slug)

  if (!detail) {
    notFound()
  }

  const { area, html } = detail

  return (
    <main className="min-h-screen bg-background">
      <Header content={content.header.data} />
      <section className="pt-32 pb-20">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                {area.catchPhrase ?? "Research Focus"}
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl text-balance">
                {area.title}
              </h1>
            </div>
            <Button variant="outline" asChild>
              <Link href="/research">Return to research</Link>
            </Button>
          </div>

          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            {area.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {area.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

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
