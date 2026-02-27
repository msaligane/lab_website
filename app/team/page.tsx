import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { TeamSection } from "@/components/team-section"
import { getPageContent } from "@/lib/content"

export default async function TeamPage() {
  const content = await getPageContent()

  return (
    <main className="min-h-screen bg-background">
      <Header content={content.header.data} />
      <TeamSection content={content.team} />
      <Footer content={content.footer.data} />
    </main>
  )
}
