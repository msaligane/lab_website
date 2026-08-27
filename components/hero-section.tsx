"use client"

import { Button } from "@/components/ui/button"
import { Markdown } from "@/components/markdown"
import { ArrowRight, Github } from "lucide-react"
import type { HeroContent, SectionContent } from "@/lib/content"
import Link from "next/link"

type HeroSectionProps = {
  content: SectionContent<HeroContent>
}

const gdsLayers = [
  { src: "/images/gds/sscl2024.png", width: "38%", left: "2%", top: "6%", delay: "-2s", duration: "18s" },
  { src: "/images/gds/probe_attack_detector.png", width: "42%", left: "55%", top: "8%", delay: "-6s", duration: "21s" },
  { src: "/images/gds/edgellm.png", width: "36%", left: "5%", top: "50%", delay: "-10s", duration: "17s" },
  { src: "/images/gds/sscm2024.png", width: "40%", left: "58%", top: "54%", delay: "-14s", duration: "22s" },
  { src: "/images/gds/sscm24.png", width: "34%", left: "27%", top: "19%", delay: "-18s", duration: "19s" },
  { src: "/images/gds/bcc.png", width: "39%", left: "31%", top: "60%", delay: "-22s", duration: "20s" },
]

export function HeroSection({ content }: HeroSectionProps) {
  const { data, html } = content

  return (
    <section className="relative min-h-[55vh] flex items-center justify-center overflow-hidden pt-20 pb-4">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a2e_1px,transparent_1px),linear-gradient(to_bottom,#1a1a2e_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.25)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.25)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* Fading GDS background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {gdsLayers.map((layer) => (
          <img
            key={layer.src}
            src={layer.src}
            alt=""
            className="gds-hero-layer absolute max-w-3xl rounded-3xl border border-border/40 shadow-2xl"
            style={{
              width: layer.width,
              left: layer.left,
              top: layer.top,
              animationDelay: layer.delay,
              animationDuration: layer.duration,
            }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/75 to-background" />
      </div>
      
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl text-balance">
          <span className="text-primary">{data.titleHighlight}</span> {data.titleLineOne}
          <br />
          {data.titleLineTwo}
        </h1>

        <Markdown
          html={html}
          className="mt-6 text-lg leading-relaxed text-muted-foreground max-w-2xl mx-auto text-pretty"
        />
        
        <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
          <Button size="lg" className="gap-2" asChild>
            <Link href="#research">
              {data.primaryButton}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/publications">{data.secondaryButton}</Link>
          </Button>
        </div>
        <div className="mt-4 flex items-center justify-center">
          <Button
            size="lg"
            className="gap-2 bg-[#24292f] text-white hover:bg-[#1f2328]"
            asChild
          >
            <Link href="https://github.com/ReaLLMASIC" target="_blank" rel="noreferrer">
              <Github className="h-4 w-4" />
              Check Our Group Repo
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
