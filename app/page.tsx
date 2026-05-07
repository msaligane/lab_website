import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ResearchSection } from "@/components/research-section"
import { TapeoutsSection } from "@/components/tapeouts-section"
import { InTheNewsSection } from "@/components/in-the-news-section"
import { Footer } from "@/components/footer"
import { getPageContent } from "@/lib/content"

export default async function Home() {
  const content = await getPageContent()

  return (
    <main className="min-h-screen bg-background">
      <Header content={content.header.data} />
      <HeroSection content={content.hero} />
      <InTheNewsSection content={content.news} />
      <ResearchSection content={content.research} />
      <TapeoutsSection />
      <Footer content={content.footer.data} />
    </main>
  )
}
