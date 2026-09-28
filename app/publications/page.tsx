import { pageMetadata } from "@/lib/metadata"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { PublicationsSection } from "@/components/publications-section"
import { getPageContent } from "@/lib/content"

export const metadata = pageMetadata({
  title: "Publications",
  description: "Our publications at the ReaLLMASIC Lab at Brown University: open-source silicon, agentic analog layout (GLayout), edge AI accelerators, and cryogenic circuits.",
  path: "/publications",
})

export default async function PublicationsPage() {
  const content = await getPageContent()

  return (
    <div className="min-h-screen bg-background">
      <Header content={content.header.data} />
      <main id="main-content" tabIndex={-1}>
        <PublicationsSection content={content.publications} />
      </main>
      <Footer content={content.footer.data} />
    </div>
  )
}
