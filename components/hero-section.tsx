"use client"

import { Button } from "@/components/ui/button"
import { Markdown } from "@/components/markdown"
import { ArrowRight, Github, Sparkles } from "lucide-react"
import type { HeroContent, SectionContent } from "@/lib/content"
import Link from "next/link"

type HeroSectionProps = {
  content: SectionContent<HeroContent>
}

const gdsLayers = [
  "/images/gds/sscl2024.png",
  "/images/gds/probe_attack_detector.png",
  "/images/gds/edgellm.png",
  "/images/gds/sscm2024.png",
]

export function HeroSection({ content }: HeroSectionProps) {
  const { data, html } = content

  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_oklab,var(--border)_55%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--border)_55%,transparent)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:linear-gradient(to_bottom,#000,transparent_90%)] opacity-45" />
      <div className="absolute -left-32 top-10 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute -right-28 bottom-0 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />

      <div className="site-container relative z-10 grid min-h-[calc(100svh-4rem)] items-center gap-14 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:py-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Integrated circuits · Systems · AI
          </div>
          <h1 className="mt-7 text-5xl font-semibold tracking-[-0.055em] text-foreground sm:text-6xl lg:text-7xl xl:text-[5.25rem] xl:leading-[0.95]">
            <span className="text-primary">{data.titleHighlight}</span>{" "}
            <span>{data.titleLineOne}</span>
            {data.titleLineTwo ? <span className="block">{data.titleLineTwo}</span> : null}
          </h1>

          <Markdown
            html={html}
            className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground text-pretty sm:text-xl"
          />

          <div className="mt-9 flex flex-wrap items-center gap-3">
          <Button size="lg" className="h-12 rounded-full px-6 shadow-md shadow-primary/15" asChild>
            <Link href="#research">
              {data.primaryButton}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="h-12 rounded-full bg-background/70 px-6" asChild>
            <Link href="/publications">{data.secondaryButton}</Link>
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="h-12 rounded-full px-5 text-muted-foreground hover:text-foreground"
            asChild
          >
            <Link href="https://github.com/ReaLLMASIC" target="_blank" rel="noreferrer">
              <Github className="h-4 w-4" />
              GitHub
            </Link>
          </Button>
        </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:mx-0">
          <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-primary/25 via-transparent to-accent/15 blur-2xl" />
          <div className="surface-card relative grid aspect-[5/4] grid-cols-2 gap-3 overflow-hidden p-3 sm:gap-4 sm:p-4">
            {gdsLayers.map((src, index) => (
              <div key={src} className="relative overflow-hidden rounded-xl border border-border/70 bg-secondary">
                <img
                  src={src}
                  alt=""
                  className="h-full w-full object-cover opacity-85 transition duration-500 hover:scale-105 hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
                <span className="absolute bottom-2 left-2 rounded-full border border-white/20 bg-black/35 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-white backdrop-blur-sm">
                  Silicon {String(index + 1).padStart(2, "0")}
                </span>
              </div>
            ))}
          </div>
          <div className="absolute -bottom-5 right-5 rounded-xl border border-border/70 bg-card/95 px-4 py-3 shadow-xl backdrop-blur sm:right-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">From ideas</p>
            <p className="mt-1 text-sm font-semibold text-foreground">to working silicon</p>
          </div>
        </div>
      </div>
    </section>
  )
}
