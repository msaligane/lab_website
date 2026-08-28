import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Markdown } from "@/components/markdown"
import type { SectionContent, TeamContent } from "@/lib/content"

type TeamPreviewSectionProps = {
  content: SectionContent<TeamContent>
}

export function TeamPreviewSection({ content }: TeamPreviewSectionProps) {
  return (
    <section className="section-shell">
      <div className="site-container grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <div className="surface-card overflow-hidden p-2 sm:p-3">
          <img
            src="/images/team/group_photo.png"
            alt="ReaLLMASIC Lab group"
            className="aspect-[16/9] w-full rounded-xl object-cover"
          />
        </div>
        <div>
          <p className="section-eyebrow">{content.data.eyebrow}</p>
          <h2 className="section-title text-balance">{content.data.title}</h2>
          <Markdown html={content.html} className="section-copy text-pretty" />
          <Link
            href="/team"
            className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-primary"
          >
            Meet the team
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
