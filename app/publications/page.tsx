import type { Metadata } from "next"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { PublicationsSection } from "@/components/publications-section"
import { getPageContent } from "@/lib/content"

export const metadata: Metadata = {
  title: "Publications — Prof. Mehdi Saligane",
  description:
    "Publications from Prof. Mehdi Saligane and the ReaLLMASIC Lab at Brown University: open-source silicon, agentic analog layout (GLayout), edge AI accelerators, and cryogenic circuits.",
  alternates: { canonical: "/publications" },
  openGraph: {
    title: "Publications — Prof. Mehdi Saligane",
    description:
      "Selected papers from Prof. Mehdi Saligane and the ReaLLMASIC Lab.",
    url: "/publications",
  },
}

export default async function PublicationsPage() {
  const content = await getPageContent()

  return (
    <main className="min-h-screen bg-background">
      <Header content={content.header.data} />
      <PublicationsSection content={content.publications} />
      <Footer content={content.footer.data} />
    </main>
  )
}
