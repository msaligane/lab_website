"use client"

import { useMemo, useState } from "react"

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
    <div className="relative mx-auto mt-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-white">
      <div className="relative aspect-[16/9]">
        {sanitized.map((src, idx) => (
          <img
            key={src}
            src={src}
            alt={`${altPrefix} ${idx + 1}`}
            className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-500 ${
              idx === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>
      <div className="absolute inset-y-0 left-3 flex items-center">
        <button
          type="button"
          onClick={goPrev}
          className="rounded-full border border-border bg-white/80 px-3 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:bg-white"
          aria-label="Previous photo"
        >
          &lt;
        </button>
      </div>
      <div className="absolute inset-y-0 right-3 flex items-center">
        <button
          type="button"
          onClick={goNext}
          className="rounded-full border border-border bg-white/80 px-3 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:bg-white"
          aria-label="Next photo"
        >
          &gt;
        </button>
      </div>
      <div className="flex items-center justify-center gap-2 px-4 py-3">
        {sanitized.map((_, idx) => (
          <button
            key={`dot-${idx}`}
            type="button"
            onClick={() => setIndex(idx)}
            className={`h-2.5 w-2.5 rounded-full transition ${
              idx === index ? "bg-primary" : "bg-muted"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
