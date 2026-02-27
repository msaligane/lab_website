import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { getPageContent } from "@/lib/content"

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
