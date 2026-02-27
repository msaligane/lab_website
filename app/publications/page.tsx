import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { PublicationsSection } from "@/components/publications-section"
import { getPageContent } from "@/lib/content"

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
