"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Markdown } from "@/components/markdown"
import { ArrowRight, Github } from "lucide-react"
import type { HeroContent, SectionContent } from "@/lib/content"
import Link from "next/link"

type HeroSectionProps = {
  content: SectionContent<HeroContent>
}

export function HeroSection({ content }: HeroSectionProps) {
  const { data, html } = content
  const [mounted, setMounted] = useState(false)
  const gdsSources = [
    "/images/gds/sscl2024.png",
    "/images/gds/probe_attack_detector.png",
    "/images/gds/edgellm.png",
    "/images/gds/sscm2024.png",
    "/images/gds/sscm24.png",
    "/images/gds/bcc.png",
  ]
  const gdsLayers = useMemo(
    () =>
      mounted
        ? gdsSources.map((src, index) => {
        const anchors = [
          { left: 4, top: 8 },
          { left: 52, top: 10 },
          { left: 8, top: 48 },
          { left: 56, top: 52 },
          { left: 28, top: 20 },
          { left: 32, top: 58 },
        ]
        const anchor = anchors[index % anchors.length]
        const size = randomBetween(32, 48)
        const left = anchor.left + randomBetween(-10, 10)
        const top = anchor.top + randomBetween(-8, 10)
        const duration = randomBetween(16, 22)
        const delay = -2 - index * 4

        return {
          src,
          style: {
            width: `${size}%`,
            left: `${clamp(left, -6, 62)}%`,
            top: `${clamp(top, -2, 66)}%`,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`,
          },
        }
        })
        : [],
    [mounted],
  )

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a2e_1px,transparent_1px),linear-gradient(to_bottom,#1a1a2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* Fading GDS background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {gdsLayers.map((layer) => (
          <img
            key={layer.src}
            src={layer.src}
            alt=""
            className="gds-hero-layer absolute max-w-3xl rounded-3xl border border-border/40 shadow-2xl"
            style={layer.style}
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

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}
