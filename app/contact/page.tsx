import { pageMetadata } from "@/lib/metadata"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { getPageContent } from "@/lib/content"

export const metadata = pageMetadata({
  title: "Contact",
  description: "Get in touch with me and our team at the ReaLLMASIC Lab at Brown University for collaborations, talks, and student inquiries.",
  path: "/contact",
})

export default async function ContactPage() {
  const content = await getPageContent()

  return (
    <div className="min-h-screen bg-background">
      <Header content={content.header.data} />
      <main id="main-content" tabIndex={-1}>
        <ContactSection content={content.contact} />
      </main>
      <Footer content={content.footer.data} />
    </div>
  )
}
