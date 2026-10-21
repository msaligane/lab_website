import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ChipGallery } from "@/components/chip-gallery"
import { getPageContent } from "@/lib/content"
import { pageMetadata } from "@/lib/metadata"
import { responsiveImage } from "@/lib/responsive-images"
import { chipLabel, getPublishedTapeouts, getTapeout } from "@/lib/tapeouts"

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return (await getPublishedTapeouts()).map((project) => ({ slug: project.slug }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = await getTapeout(slug)
  if (!project) return {}
  return pageMetadata({
    title: project.title,
    description: project.tagline,
    path: `/tapeouts/${project.slug}`,
    image: project.cover,
    imageAlt: `${project.title} chip layout`,
    article: true,
  })
}

export default async function TapeoutPage({ params }: Props) {
  const { slug } = await params
  const project = await getTapeout(slug)
  if (!project) notFound()
  const content = await getPageContent()
  const slides = project.chips.map((chip) => ({
    src: chip.image,
    label: chipLabel(chip),
    alt: `${project.title} — ${chipLabel(chip)} chip layout`,
  }))

  return (
    <div className="min-h-screen bg-background">
      <Header content={content.header.data} />
      <main id="main-content" tabIndex={-1}>
        <section className="pt-32 pb-20">
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <Link href="/research#tapeouts" className="mb-8 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary-text hover:underline"><ArrowLeft className="h-4 w-4" aria-hidden="true" />All chip projects</Link>
            <div className="grid items-center gap-8 md:grid-cols-[1fr_1.3fr] lg:gap-12">
              <figure className="min-w-0 rounded-xl bg-secondary/50 p-6 text-center sm:p-8">
                {slides.length > 1 ? (
                  <ChipGallery slides={slides} />
                ) : (
                  <>
                    <div className="flex h-72 items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        {...responsiveImage(project.cover, "280px", 384)}
                        alt={`${project.title} chip layout`}
                        className="mx-auto h-full max-w-full object-contain"
                        style={{ maxHeight: 280 }}
                      />
                    </div>
                    <figcaption className="mt-5 text-sm text-muted-foreground">
                      {chipLabel(project.chips[0])}
                      <a href={project.chips[0].image} className="mt-3 block text-xs underline underline-offset-4">View original chip image</a>
                    </figcaption>
                  </>
                )}
              </figure>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary-text">{project.category}</p>
                <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl text-balance">{project.title}</h1>
                <p className="mt-5 leading-relaxed text-muted-foreground">{project.description}</p>
                <dl className="mt-6 space-y-4 border-t border-border pt-5 text-sm">
                  {project.authors.map((author) => <div key={`${author.credit}:${author.name}`}><dt className="text-xs text-muted-foreground">{author.credit}{project.authors.length > 1 ? " · see publications below" : ""}</dt><dd className="mt-1 font-medium">{author.name}</dd></div>)}
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

            {project.resources.length > 0 && <section aria-labelledby="chip-resources" className="mt-10 border-t border-border pt-8">
              <h2 id="chip-resources" className="text-xl font-semibold">Explore further</h2>
              <ul className="mt-4 flex flex-wrap gap-3">
                {project.resources.map((resource) => <li key={resource.href}><Link href={resource.href} className="inline-flex min-h-11 items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-secondary">{resource.label}<ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link></li>)}
              </ul>
            </section>}
          </div>
        </section>
      </main>
      <Footer content={content.footer.data} />
    </div>
  )
}
