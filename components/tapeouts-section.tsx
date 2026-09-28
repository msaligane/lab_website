import { responsiveImage } from "@/lib/responsive-images"

export function TapeoutsSection() {
  return (
    <section id="tapeouts" className="py-16">
      <div className="mx-auto max-w-6xl px-6 lg:px-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary-text">
          Tapeouts
        </p>
        <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
          Our Tapeouts
        </p>
        <img
          {...responsiveImage("/images/research/tapeouts.png", "(max-width: 960px) calc(100vw - 48px), 896px")}
          alt="Our Tapeouts"
          className="mt-6 w-full max-w-4xl mx-auto object-contain"
        />
      </div>
    </section>
  )
}
