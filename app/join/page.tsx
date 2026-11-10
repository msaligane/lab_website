import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { JoinSection } from "@/components/join-section"
import { getPageContent } from "@/lib/content"
import { pageMetadata } from "@/lib/metadata"
import "../recruitment.css"

export const metadata = pageMetadata({
  title: "Join Us",
  description: "Explore PhD, postdoctoral, and student research opportunities at the ReaLLMASIC Lab at Brown University.",
  path: "/join",
})

export default async function JoinPage() {
  const content = await getPageContent()
  return (
    <div className="min-h-screen bg-background">
      <Header content={content.header.data} />
      <main id="main-content" tabIndex={-1}>
        <JoinSection />
      </main>
      <Footer content={content.footer.data} />
    </div>
  )
}
