import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { ResearchSection } from "@/components/research-section"
import { TapeoutsSection } from "@/components/tapeouts-section"
import { getPageContent } from "@/lib/content"

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
