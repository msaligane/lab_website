import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { EvidenceStrip } from "@/components/evidence-strip"
import { ResearchSection } from "@/components/research-section"
import { FeaturedWorkSection } from "@/components/featured-work-section"
import { TapeoutsSection } from "@/components/tapeouts-section"
import { TeamPreviewSection } from "@/components/team-preview-section"
import { InTheNewsSection } from "@/components/in-the-news-section"
import { Footer } from "@/components/footer"
import { getPageContent } from "@/lib/content"

export default async function Home() {
  const content = await getPageContent()

  return (
    <main className="min-h-screen bg-background">
      <Header content={content.header.data} />
      <HeroSection content={content.hero} />
      <EvidenceStrip />
      <ResearchSection content={content.research} />
      <FeaturedWorkSection content={content.publications} />
      <TapeoutsSection />
      <TeamPreviewSection content={content.team} />
      <InTheNewsSection content={content.news} />
      <Footer content={content.footer.data} />
    </main>
  )
}
