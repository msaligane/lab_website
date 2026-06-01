import type { Metadata } from "next"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { getPageContent } from "@/lib/content"

export const metadata: Metadata = {
  title: "Contact — Prof. Mehdi Saligane & ReaLLMASIC Lab",
  description:
    "Get in touch with Prof. Mehdi Saligane and the ReaLLMASIC Lab at Brown University for collaborations, talks, and student inquiries.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact — Prof. Mehdi Saligane & ReaLLMASIC Lab",
    description:
      "Contact Prof. Mehdi Saligane and the ReaLLMASIC Lab.",
    url: "/contact",
  },
}

export default async function ContactPage() {
  const content = await getPageContent()

  return (
    <main className="min-h-screen bg-background">
      <Header content={content.header.data} />
      <ContactSection content={content.contact} />
      <Footer content={content.footer.data} />
    </main>
  )
}
