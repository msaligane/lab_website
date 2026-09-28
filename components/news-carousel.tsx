"use client"

import { useMemo, useState } from "react"
import { responsiveImage } from "@/lib/responsive-images"

type NewsCarouselProps = {
  images: string[]
  altPrefix?: string
}

export function NewsCarousel({ images, altPrefix = "Event photo" }: NewsCarouselProps) {
  const sanitized = useMemo(
    () => images.filter((src) => src && typeof src === "string"),
    [images],
  )
  const [index, setIndex] = useState(0)

  if (sanitized.length === 0) {
    return null
  }

  const goPrev = () => {
    setIndex((current) => (current - 1 + sanitized.length) % sanitized.length)
  }

  const goNext = () => {
    setIndex((current) => (current + 1) % sanitized.length)
  }

  return (
    <div role="region" aria-roledescription="carousel" aria-label={`${altPrefix} gallery`} className="relative mx-auto mt-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-white">
      <div className="relative aspect-[16/9]">
        {sanitized.map((src, idx) => idx === index ? (
          <img
            key={src}
            {...responsiveImage(src, "(max-width: 720px) calc(100vw - 48px), 672px")}
            alt={`${altPrefix} ${idx + 1}`}
            className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-500 ${
              idx === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ) : null)}
      </div>
      <div className="absolute inset-y-0 left-3 flex items-center">
        <button
          type="button"
          onClick={goPrev}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background text-sm font-semibold text-foreground shadow-sm hover:bg-secondary"
          aria-label="Previous photo"
        >
          &lt;
        </button>
      </div>
      <div className="absolute inset-y-0 right-3 flex items-center">
        <button
          type="button"
          onClick={goNext}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background text-sm font-semibold text-foreground shadow-sm hover:bg-secondary"
          aria-label="Next photo"
        >
          &gt;
        </button>
      </div>
      <p className="sr-only" aria-live="polite" aria-atomic="true">Photo {index + 1} of {sanitized.length}</p>
      <div className="flex flex-wrap items-center justify-center gap-1 bg-background px-4 py-2">
        {sanitized.map((_, idx) => (
          <button
            key={`dot-${idx}`}
            type="button"
            onClick={() => setIndex(idx)}
            className="flex h-11 w-11 items-center justify-center rounded-full"
            aria-current={idx === index ? "true" : undefined}
            aria-label={`Go to slide ${idx + 1}`}
          >
            <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${idx === index ? "bg-primary-text" : "border border-foreground bg-background"}`} />
          </button>
        ))}
      </div>
    </div>
  )
}
