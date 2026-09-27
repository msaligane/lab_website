import type { Metadata } from "next"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { NewsSection } from "@/components/news-section"
import { getPageContent } from "@/lib/content"

export const metadata: Metadata = {
  title: "News & Talks — Prof. Mehdi Saligane",
  description:
    "My latest talks and invited lectures, alongside milestones from our ReaLLMASIC Lab at Brown University.",
  alternates: { canonical: "/news" },
  openGraph: {
    title: "News & Talks — Prof. Mehdi Saligane",
    description:
      "My latest talks and milestones from our ReaLLMASIC Lab.",
    url: "/news",
  },
}

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
