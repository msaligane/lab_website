import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { NewsSection } from "@/components/news-section"
import { getPageContent } from "@/lib/content"

export default async function NewsPage() {
  const content = await getPageContent()

  return (
    <main className="min-h-screen bg-background">
      <Header content={content.header.data} />
      <NewsSection content={content.news} />
      <Footer content={content.footer.data} />
    </main>
  )
}
