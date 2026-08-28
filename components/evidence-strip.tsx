import Link from "next/link"
import { ArrowUpRight, BookOpenText, Cpu, Github } from "lucide-react"

const evidenceLinks = [
  {
    label: "Publications",
    description: "Browse papers and preprints",
    href: "/publications",
    icon: BookOpenText,
  },
  {
    label: "Tapeouts",
    description: "View fabricated designs",
    href: "/#tapeouts",
    icon: Cpu,
  },
  {
    label: "Open-source work",
    description: "Explore group repositories",
    href: "https://github.com/ReaLLMASIC",
    icon: Github,
    external: true,
  },
]

export function EvidenceStrip() {
  return (
    <section aria-label="Explore the lab's work" className="border-b border-border/70 bg-card/70">
      <div className="site-container grid divide-y divide-border/70 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {evidenceLinks.map((item) => {
          const Icon = item.icon

          return (
            <Link
              key={item.label}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noreferrer" : undefined}
              className="group flex min-h-28 items-center gap-4 px-2 py-6 transition-colors hover:bg-secondary/65 sm:px-5 lg:px-8"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-foreground">{item.label}</span>
                <span className="mt-1 block text-sm text-muted-foreground">{item.description}</span>
              </span>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
            </Link>
          )
        })}
      </div>
    </section>
  )
}
