import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { ChipGallery } from "@/components/chip-gallery"
import { TimelineFigure } from "@/components/timeline-figure"
import { responsiveImage } from "@/lib/responsive-images"
import { chipLabel, getPublishedTapeouts, getTimelineLayout } from "@/lib/tapeouts"

export async function TapeoutsSection({ featured = false }: { featured?: boolean }) {
  const entries = await getPublishedTapeouts()
  const projects = featured ? entries.filter((project) => project.featured) : entries
  const timeline = await getTimelineLayout()

  return (
    <section id="tapeouts" aria-labelledby="tapeouts-heading" className="scroll-mt-28 py-16">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-text">From design to silicon</p>
            <h2 id="tapeouts-heading" className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{featured ? "Featured Tapeouts" : "Explore Our Chips"}</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              {featured ? "Discover the research, people, and publications behind our silicon." : "Explore our documented projects, from open-source circuit generators to edge AI and cryogenic computing."}
            </p>
          </div>
          {featured && <Link href="/research#tapeouts" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary-text hover:underline">Explore all tapeouts <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link>}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const publication = [...project.publications].sort((a, b) => b.year - a.year)[0]
            const venue = publication.venue.match(/\(([^()]+)\)$/)?.[1] ?? publication.venue
            const slides = project.chips.map((chip) => ({
              src: chip.image,
              label: chipLabel(chip),
              alt: `${project.title} — ${chipLabel(chip)} chip layout`,
            }))
            return (
              <article key={project.slug} className="min-w-0">
                <Link
                  href={`/tapeouts/${project.slug}`}
                  aria-labelledby={`chip-title-${project.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-background transition-colors hover:border-primary-text motion-reduce:transition-none"
                >
                  <div className="relative flex h-56 items-center justify-center bg-secondary/50 px-6 pt-5 pb-12">
                    {slides.length > 1 ? (
                      <ChipGallery compact slides={slides} />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        {...responsiveImage(project.cover, "152px", 192)}
                        alt={`${project.title} chip layout`}
                        className="mx-auto h-full max-w-full object-contain"
                        style={{ maxHeight: 152 }}
                      />
                    )}
                    <span className="absolute bottom-4 left-5 text-xs text-muted-foreground">{slides.length > 1 ? `${slides.length} chips` : chipLabel(project.chips[0])}</span>
                  </div>
                  <div className="flex flex-1 flex-col p-5 pb-2">
                    <p className="text-xs font-medium text-primary-text">{project.category}</p>
                    <h3 id={`chip-title-${project.slug}`} className="mt-2 text-xl font-semibold leading-snug tracking-tight text-balance">{project.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{project.tagline}</p>
                    <div className="mt-auto pt-6">
                      <p className="flex flex-wrap justify-between gap-x-3 gap-y-1 border-t border-border pt-3 text-sm">
                        <span className="font-medium">{venue} {publication.year}</span>
                        <span className="text-xs text-muted-foreground">{publication.related ? "Related publication" : "Publication"}</span>
                      </p>
                      <p className="mt-4 text-sm"><span className="mb-1 block text-xs text-muted-foreground">{publication.credit}</span>{publication.authors}</p>
                      {project.publications.length > 1 && <p className="mt-2 text-xs text-muted-foreground">{project.publications.length} publications available</p>}
                      <span className="mt-5 flex min-h-11 items-center justify-between border-t border-border text-sm font-medium text-primary-text">Explore chip <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></span>
                    </div>
                  </div>
                </Link>
              </article>
            )
          })}
        </div>

        {!featured && (
          <div className="mt-12 border-t border-border pt-8">
            <h2 id="timeline-heading" className="text-2xl font-semibold">Timeline of tape outs</h2>
            <div className="mt-6">
              <TimelineFigure
                layout={timeline}
                alt="Lab tapeout timeline from 2021 to 2026: rows are technology nodes, horizontal position is the tapeout date."
              />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
