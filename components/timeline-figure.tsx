"use client"

import Link from "next/link"
import { useRef, useState } from "react"
import type { TimelineChip, TimelineLayout } from "@/lib/tapeouts"

/**
 * The timeline figure, generated from the JSON chips: lanes are technology
 * nodes, horizontal position is the tapeout date. Chips that belong to the same
 * entry are grouped: hovering one lights up the union of all its chips (a single
 * blurred silhouette, so overlaps never show interior outlines) and shows a
 * card. Chips without a project page are inert: no glow, no card, no link.
 */
export function TimelineFigure({ layout, alt }: { layout: TimelineLayout; alt: string }) {
  const [active, setActive] = useState<{
    slug: string
    index: number
    anchor: { left: number; top: number; width: number; height: number }
    viewport: { width: number; height: number }
  } | null>(null)
  const scrollReady = useRef(false)
  const scrollerRef = useRef<HTMLDivElement | null>(null)
  // The figure opens on its newest end; the reader scrolls left into the past.
  const attachScroller = (node: HTMLDivElement | null) => {
    scrollerRef.current = node
    if (!node || scrollReady.current) return
    scrollReady.current = true
    node.scrollLeft = node.scrollWidth
  }
  const { viewBox, lanes, years, chips, axis } = layout
  const activeSlug = active?.slug ?? null
  const glowFor = new Map(lanes.map((lane) => [lane.id, lane.glow]))
  const activeChip: TimelineChip | null = active ? chips[active.index] : null
  const percent = (value: number, total: number) => `${(value / total) * 100}%`

  // Draw the active entry last so its chips sit above the shared glow.
  const order = chips.map((chip, index) => ({ index, active: chip.slug === activeSlug }))
    .sort((left, right) => Number(left.active) - Number(right.active))
    .map((entry) => entry.index)

  const CARD_WIDTH = 240
  const card = active
    ? (() => {
        const half = CARD_WIDTH / 2 + 10
        const center = active.anchor.left + active.anchor.width / 2
        const left = Math.min(Math.max(center, half), Math.max(half, active.viewport.width - half))
        const above = active.anchor.top > active.viewport.height * 0.32
        return {
          left,
          top: above ? active.anchor.top - 10 : active.anchor.top + active.anchor.height + 10,
          transform: above ? "translate(-50%, -100%)" : "translate(-50%, 0)",
        }
      })()
    : null

  return (
    <div className="relative rounded-xl border border-border bg-white">
      <div
        ref={attachScroller}
        role="region"
        aria-label="Timeline figure — scroll horizontally to see the full range"
        tabIndex={0}
        onScroll={() => setActive(null)}
        className="overflow-x-auto overscroll-x-contain focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary-text"
      >
        <div className="relative w-[1100px] sm:w-[1400px]">
      <svg
        viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
        role="img"
        aria-label={alt}
        className="block h-auto w-full"
      >
        <defs>
          <filter id="timeline-glow" x="-20%" y="-60%" width="140%" height="220%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
          {chips.map((chip, index) => (
            <clipPath key={`clip-${index}`} id={`timeline-clip-${index}`}>
              <rect x={chip.x} y={chip.y} width={chip.width} height={chip.height} />
            </clipPath>
          ))}
        </defs>

        {lanes.map((lane) => (
          <rect key={lane.id} x={0} y={lane.y} width={viewBox.width} height={lane.height} fill={lane.color} />
        ))}

        {years.map((year) => (
          <g key={year.year}>
            <line x1={year.x} y1={lanes[0].y} x2={year.x} y2={axis.y} stroke="#c9b89f" strokeWidth={1} strokeDasharray="3 6" />
            <text x={year.x} y={axis.y + 20} fontSize={12} textAnchor="middle" fill="#6f5e47">{year.year}</text>
          </g>
        ))}
        <line x1={40} y1={axis.y} x2={viewBox.width - 20} y2={axis.y} stroke="#7c8f57" strokeWidth={2} />

        {activeSlug && (
          <g filter="url(#timeline-glow)" opacity={0.85}>
            {chips.filter((chip) => chip.slug === activeSlug).map((chip, index) => (
              // Chips of one entry touch edge-to-edge, so this barely-grown
              // silhouette is continuous: the blur only shows the group's outer
              // boundary, never seams between its chips.
              <rect
                key={`glow-${index}`}
                x={chip.x - 0.5}
                y={chip.y - 0.5}
                width={chip.width + 1}
                height={chip.height + 1}
                fill={glowFor.get(chip.lane) ?? "currentColor"}
              />
            ))}
          </g>
        )}

        {order.map((index) => {
          const chip = chips[index]
          const scaleX = chip.width / chip.crop.width
          const scaleY = chip.height / chip.crop.height
          return (
            <g key={`chip-${index}`} clipPath={`url(#timeline-clip-${index})`}>
              <image
                href={chip.image}
                x={chip.x - chip.crop.x * scaleX}
                y={chip.y - chip.crop.y * scaleY}
                width={chip.imageWidth * scaleX}
                height={chip.imageHeight * scaleY}
                preserveAspectRatio="none"
              />
            </g>
          )
        })}
      </svg>

      {chips.map((chip, index) => {
        if (!chip.page) return null
        const style = {
          left: percent(chip.x, viewBox.width),
          top: percent(chip.y, viewBox.height),
          width: percent(chip.width, viewBox.width),
          height: percent(chip.height, viewBox.height),
        }
        const showCard = (event: React.SyntheticEvent<HTMLElement>) => {
          const scroller = scrollerRef.current
          if (!scroller) return
          const anchor = event.currentTarget.getBoundingClientRect()
          const box = scroller.getBoundingClientRect()
          setActive({
            slug: chip.slug,
            index,
            anchor: {
              left: anchor.left - box.left,
              top: anchor.top - box.top,
              width: anchor.width,
              height: anchor.height,
            },
            viewport: { width: box.width, height: box.height },
          })
        }
        const hideCard = () => setActive((current) => (current?.index === index ? null : current))
        const handlers = {
          onMouseEnter: showCard,
          onMouseLeave: hideCard,
          onFocus: showCard,
          onBlur: hideCard,
        }
        return (
          <Link
            key={`hotspot-${index}`}
            href={`/tapeouts/${chip.slug}`}
            aria-label={`${chip.title} — open project`}
            className="absolute z-10 rounded-[3px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-text"
            style={style}
            {...handlers}
          />
        )
      })}
 
        </div>
      </div>

      {activeChip && card && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute z-40 rounded-lg border border-border bg-background/95 p-3 text-left shadow-xl backdrop-blur-sm"
          style={{ left: card.left, top: card.top, transform: card.transform, width: 240 }}
        >
          <p className="text-[10px] font-semibold uppercase tracking-widest text-primary-text">{activeChip.category}</p>
          <p className="mt-1 text-sm font-semibold leading-snug text-foreground">{activeChip.title}</p>
          <p className="mt-1 text-xs leading-snug text-muted-foreground">{activeChip.tagline}</p>
          <p className="mt-2 text-[11px] leading-snug text-muted-foreground">
            {activeChip.entryChips.length > 1 ? `${activeChip.entryChips.length} chips · ` : ""}
            {activeChip.entryChips.map((chip) => `${chip.node}${chip.date ? ` (${chip.date})` : ""}`).join(", ")}
          </p>
          <p className="mt-2 text-xs font-medium text-primary-text">View project →</p>
        </div>
      )}

      {/* Fixed technology rail: stays put while the figure scrolls sideways and
          sits above the chips, glowing in the stripe colour on its edge. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-30 w-[86px] sm:w-[110px]">
        {lanes.map((lane) => (
          <div
            key={lane.id}
            className="absolute left-0 flex w-full items-center justify-center"
            style={{
              top: `${(lane.y / viewBox.height) * 100}%`,
              height: `${(lane.height / viewBox.height) * 100}%`,
            }}
          >
            <div
              className="flex items-center justify-center gap-[7px]"
              style={{
                filter: `drop-shadow(0 0 6px ${lane.color}) drop-shadow(0 0 16px ${lane.color}) drop-shadow(0 0 30px ${lane.color}) drop-shadow(0 0 46px ${lane.color})`,
              }}
            >
              {lane.labels.map((label) => (
                <span
                  key={label}
                  className="text-[17px] font-bold leading-none text-black sm:text-[22px]"
                  style={{
                    fontFamily: "var(--font-michroma), var(--font-geist-sans), sans-serif",
                    writingMode: "vertical-rl",
                    transform: "rotate(180deg)",
                  }}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
