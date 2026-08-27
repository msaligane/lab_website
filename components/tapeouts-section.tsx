export function TapeoutsSection() {
  return (
    <section id="tapeouts" className="section-shell bg-secondary/45">
      <div className="site-container">
        <div className="surface-card overflow-hidden p-6 sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.28fr_0.72fr] lg:items-center">
            <div>
              <p className="section-eyebrow">Tapeouts</p>
              <p className="section-title text-balance">Ideas made tangible</p>
              <p className="section-copy text-pretty">
                A growing portfolio of fabricated designs across AI, sensing, security, and cryogenic systems.
              </p>
            </div>
            <div className="rounded-xl border border-border/70 bg-background/70 p-4 sm:p-6">
              <img
                src="/images/research/tapeouts.png"
                alt="ReaLLMASIC Lab tapeout portfolio"
                className="mx-auto w-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
