import type { Metadata } from "next"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { getPageContent } from "@/lib/content"

export const metadata: Metadata = {
  title: "Contact — Prof. Mehdi Saligane & ReaLLMASIC Lab",
  description:
    "Get in touch with me and our team at the ReaLLMASIC Lab at Brown University for collaborations, talks, and student inquiries.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact — Prof. Mehdi Saligane & ReaLLMASIC Lab",
    description:
      "Contact me and our team at the ReaLLMASIC Lab.",
    url: "/contact",
  },
}

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
