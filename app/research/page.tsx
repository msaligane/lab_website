import type { Metadata } from "next"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { ResearchSection } from "@/components/research-section"
import { TapeoutsSection } from "@/components/tapeouts-section"
import { getPageContent } from "@/lib/content"

export const metadata: Metadata = {
  title: "Research — Prof. Mehdi Saligane & ReaLLMASIC Lab",
  description:
    "Research from Prof. Mehdi Saligane and the ReaLLMASIC Lab: open-source EDA flows, agentic analog layout automation, edge AI accelerators, and hardware-software co-design.",
  alternates: { canonical: "/research" },
  openGraph: {
    title: "Research — Prof. Mehdi Saligane & ReaLLMASIC Lab",
    description:
      "Open-source and AI-driven chip design research from the ReaLLMASIC Lab.",
    url: "/research",
  },
}

export default async function ResearchPage() {
  const content = await getPageContent()

  return (
    <main className="min-h-screen bg-background">
      <Header content={content.header.data} />
      <ResearchSection content={content.research} />
      <TapeoutsSection />
      <Footer content={content.footer.data} />
    </main>
  )
}
