import type { Metadata } from "next"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { ResearchSection } from "@/components/research-section"
import { TapeoutsSection } from "@/components/tapeouts-section"
import { getPageContent } from "@/lib/content"

export const metadata: Metadata = {
  title: "Research — Prof. Mehdi Saligane & ReaLLMASIC Lab",
  description:
    "Our research at the ReaLLMASIC Lab: open-source EDA flows, agentic analog layout automation, edge AI accelerators, and hardware-software co-design.",
  alternates: { canonical: "/research" },
  openGraph: {
    title: "Research — Prof. Mehdi Saligane & ReaLLMASIC Lab",
    description:
      "Our research on open-source and AI-driven chip design at the ReaLLMASIC Lab.",
    url: "/research",
  },
}

export default async function ResearchPage() {
  const content = await getPageContent()

  return (
    <div className="min-h-screen bg-background">
      <Header content={content.header.data} />
      <main id="main-content" tabIndex={-1}>
        <ResearchSection content={content.research} pageTitle />
        <TapeoutsSection />
      </main>
      <Footer content={content.footer.data} />
    </div>
  )
}
