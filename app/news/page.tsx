import { pageMetadata } from "@/lib/metadata"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { NewsSection } from "@/components/news-section"
import { getPageContent } from "@/lib/content"

export const metadata = pageMetadata({
  title: "News & Talks",
  description: "My latest talks and invited lectures, alongside milestones from our ReaLLMASIC Lab at Brown University.",
  path: "/news",
})

export default async function NewsPage() {
  const content = await getPageContent()

  return (
    <div className="min-h-screen bg-background">
      <Header content={content.header.data} />
      <main id="main-content" tabIndex={-1}>
        <NewsSection content={content.news} />
      </main>
      <Footer content={content.footer.data} />
    </div>
  )
}
