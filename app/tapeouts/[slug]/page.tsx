import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { TapeoutImage } from "@/components/tapeout-image"
import { publishedTapeouts, tapeoutPresentation } from "@/content/tapeouts"
import { getPageContent } from "@/lib/content"
import { pageMetadata } from "@/lib/metadata"

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return publishedTapeouts.map((project) => ({ slug: project.id }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = publishedTapeouts.find((entry) => entry.id === slug)
  if (!project) return {}
  return pageMetadata({
    title: project.name,
    description: tapeoutPresentation[project.id].purpose,
    path: `/tapeouts/${project.id}`,
    image: tapeoutPresentation[project.id].image,
    imageAlt: `${project.name} chip layout`,
    article: true,
  })
}

export default async function TapeoutPage({ params }: Props) {
  const { slug } = await params
  const project = publishedTapeouts.find((entry) => entry.id === slug)
  if (!project) notFound()
  const content = await getPageContent()
  const credits = [...new Map(project.publications.map((paper) => [
    `${paper.credit}:${paper.authors}`, { label: paper.credit, names: paper.authors },
  ])).values()]
  const originalImage = tapeoutPresentation[project.id].image ?? "/images/research/tapeouts.png"

  return (
    <div className="min-h-screen bg-background">
      <Header content={content.header.data} />
      <main id="main-content" tabIndex={-1}>
        <section className="pt-32 pb-20">
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <Link href="/research#tapeouts" className="mb-8 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary-text hover:underline"><ArrowLeft className="h-4 w-4" aria-hidden="true" />All chip projects</Link>
            <div className="grid items-center gap-8 md:grid-cols-[1fr_1.3fr] lg:gap-12">
              <figure className="min-w-0 rounded-xl bg-secondary/50 p-6 text-center sm:p-8">
                <div className="flex h-72 items-center justify-center"><TapeoutImage project={project} large /></div>
                <figcaption className="mt-5 text-sm text-muted-foreground">
                  {project.process}
                  <a href={originalImage} className="mt-3 block text-xs underline underline-offset-4">{tapeoutPresentation[project.id].image ? "View original chip image" : "View original timeline"}</a>
                </figcaption>
              </figure>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary-text">{project.area}</p>
                <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl text-balance">{project.name}</h1>
                <p className="mt-5 leading-relaxed text-muted-foreground">{project.summary}</p>
                <dl className="mt-6 space-y-4 border-t border-border pt-5 text-sm">
                  {credits.map((credit) => <div key={`${credit.label}:${credit.names}`}><dt className="text-xs text-muted-foreground">{credit.label}{credits.length > 1 ? " · see publications below" : ""}</dt><dd className="mt-1 font-medium">{credit.names}</dd></div>)}
                  {project.tapeoutYear && <div><dt className="text-xs text-muted-foreground">Tapeout year</dt><dd className="mt-1">{project.tapeoutYear}</dd></div>}
                  {project.projectLead && <div><dt className="text-xs text-muted-foreground">Project lead</dt><dd className="mt-1">{project.projectLead}</dd></div>}
                </dl>
              </div>
            </div>

            <section aria-labelledby="chip-publications" className="mt-12 border-t border-border pt-8">
              <h2 id="chip-publications" className="text-2xl font-semibold">Publications</h2>
              <div className="mt-6 space-y-8">
                {project.publications.map((publication) => <article key={publication.href}>
                  <p className="text-sm font-medium text-primary-text">{publication.venue} · {publication.year}</p>
                  {publication.related && <p className="mt-2 text-xs text-muted-foreground">Related publication</p>}
                  <h3 className="mt-3 max-w-4xl text-xl font-medium leading-relaxed">{publication.title}</h3>
                  <p className="mt-3 text-sm text-muted-foreground">{publication.credit}: {publication.authors}</p>
                  <a href={publication.href} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">Read paper{publication.href.endsWith(".pdf") ? " (PDF)" : ""}<ArrowUpRight className="h-4 w-4" aria-hidden="true" /></a>
                </article>)}
              </div>
            </section>

            {project.links.length > 0 && <section aria-labelledby="chip-resources" className="mt-10 border-t border-border pt-8">
              <h2 id="chip-resources" className="text-xl font-semibold">Explore further</h2>
              <ul className="mt-4 flex flex-wrap gap-3">
                {project.links.map((link) => <li key={link.href}><Link href={link.href} className="inline-flex min-h-11 items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-secondary">{link.label}<ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link></li>)}
              </ul>
            </section>}
          </div>
        </section>
      </main>
      <Footer content={content.footer.data} />
    </div>
  )
}
