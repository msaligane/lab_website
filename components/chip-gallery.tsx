"use client"

import { useEffect, useState } from "react"
import { responsiveImage } from "@/lib/responsive-images"

export type ChipSlide = {
  src: string
  label: string
  alt: string
}

// Time each chip stays in front before the cover flow advances.
const ROTATE_MS = 4500

const STAGE = {
  detail: {
    box: "h-[10.5rem] w-[14rem]",
    translate: 60,
    scale: 0.7,
    rotate: 36,
    sizes: "(max-width: 768px) 60vw, 300px",
  },
  compact: {
    box: "h-[7.5rem] w-[10rem]",
    translate: 52,
    scale: 0.62,
    rotate: 30,
    sizes: "(max-width: 768px) 40vw, 160px",
  },
}

// Narrower stages keep the side chips inside the figure panel on phones.
const NARROW_STAGE = {
  detail: {
    box: "h-[8rem] w-[10.5rem]",
    translate: 44,
    scale: 0.66,
    rotate: 32,
    sizes: "(max-width: 768px) 50vw, 220px",
  },
  compact: {
    box: "h-[6.5rem] w-[8.5rem]",
    translate: 45,
    scale: 0.6,
    rotate: 28,
    sizes: "(max-width: 768px) 34vw, 140px",
  },
}

function signedOffset(index: number, active: number, total: number) {
  const offset = (index - active + total) % total
  return offset > total / 2 ? offset - total : offset
}

/**
 * Cover-flow gallery for records with more than one chip. Rotation runs
 * continuously, only holding while keyboard focus is inside the gallery, and it
 * never starts for people who prefer reduced motion.
 *
 * `compact` renders the decorative card preview used in the gallery listings:
 * no controls and hidden from assistive technology, because the card link
 * already names the project.
 */
export function ChipGallery({ slides, compact = false }: { slides: ChipSlide[]; compact?: boolean }) {
  const [active, setActive] = useState(0)
  const [keyboardPaused, setKeyboardPaused] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [narrow, setNarrow] = useState(false)

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReduceMotion(query.matches)
    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])

  useEffect(() => {
    const query = window.matchMedia("(max-width: 700px)")
    const update = () => setNarrow(query.matches)
    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])

  useEffect(() => {
    if (keyboardPaused || reduceMotion || slides.length < 2) return
    const timer = window.setInterval(
      () => setActive((current) => (current + 1) % slides.length),
      ROTATE_MS,
    )
    return () => window.clearInterval(timer)
  }, [keyboardPaused, reduceMotion, slides.length, active])

  if (slides.length === 0) return null
  const stage = narrow ? NARROW_STAGE[compact ? "compact" : "detail"] : STAGE[compact ? "compact" : "detail"]
  const current = slides[active]

  const flow = (
    <div
      className={`relative mx-auto flex w-full items-center justify-center [perspective:1100px] ${
        compact ? "h-full" : narrow ? "h-48" : "h-60"
      }`}
    >
      {slides.map((slide, index) => {
        const offset = signedOffset(index, active, slides.length)
        const isActive = offset === 0
        const hidden = Math.abs(offset) > 1
        const style = {
          transform: `translate(-50%, -50%) translateX(${offset * stage.translate}%) rotateY(${offset * -stage.rotate}deg) scale(${isActive ? 1 : stage.scale})`,
          zIndex: hidden ? 0 : 20 - Math.abs(offset),
          opacity: hidden ? 0 : isActive ? 1 : 0.55,
          pointerEvents: hidden ? ("none" as const) : ("auto" as const),
          // Cards beyond the two neighbours would otherwise widen the page on
          // phones, where five slides sit at offsets -2..2.
          display: hidden ? ("none" as const) : undefined,
        }
        const image = (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            {...responsiveImage(slide.src, stage.sizes, 384)}
            alt={compact ? "" : slide.alt}
            style={{
              width: "auto",
              height: "auto",
              // Square-cornered shadow that follows the bitmap's own box.
              boxShadow: "0 14px 28px -10px rgba(0, 0, 0, 0.45)",
            }}
            className="max-h-full max-w-full object-contain"
          />
        )
        const className = `absolute left-1/2 top-1/2 flex ${stage.box} items-center justify-center p-0 transition-[transform,opacity] duration-700 ease-out motion-reduce:transition-none`

        if (compact) {
          return (
            <div key={`${slide.src}-${index}`} className={className} style={style}>
              {image}
            </div>
          )
        }

        return (
          <button
            key={`${slide.src}-${index}`}
            type="button"
            onClick={() => setActive(index)}
            aria-label={`Show ${slide.label} chip layout`}
            aria-current={isActive ? "true" : undefined}
            tabIndex={isActive ? 0 : -1}
            className={`${className} cursor-pointer border-0 bg-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-text`}
            style={style}
          >
            {image}
          </button>
        )
      })}
    </div>
  )

  if (compact) {
    return (
      <div aria-hidden="true" className="relative h-full w-full">
        {flow}
      </div>
    )
  }

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Chip layouts"
      className="relative w-full"
      onFocusCapture={() => setKeyboardPaused(true)}
      onBlurCapture={(event) => {
        const next = event.relatedTarget as Node | null
        if (!next || !event.currentTarget.contains(next)) setKeyboardPaused(false)
      }}
    >
      {flow}

      <div className="mt-5 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{current.label}</span>
        <a href={current.src} className="mt-2 block text-xs underline underline-offset-4">
          View original chip image
        </a>
      </div>

      <div className="mt-3 flex items-center justify-center gap-2">
        {slides.map((slide, index) => (
          <button
            key={`dot-${slide.src}-${index}`}
            type="button"
            onClick={() => setActive(index)}
            aria-label={`Show ${slide.label} chip layout`}
            aria-current={index === active ? "true" : undefined}
            className={`h-2.5 w-2.5 rounded-full border border-primary-text/50 transition-colors ${
              index === active ? "bg-primary-text" : "bg-transparent hover:bg-primary-text/30"
            }`}
          />
        ))}
      </div>

      <p aria-live="polite" className="sr-only">
        {`Chip ${active + 1} of ${slides.length}: ${current.label}`}
      </p>
    </div>
  )
}
