import { pageMetadata } from "@/lib/metadata"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { TeamSection } from "@/components/team-section"
import { getPageContent } from "@/lib/content"
import { siteUrl } from "@/app/layout"

export const metadata = pageMetadata({
  title: "Team",
  description: "Meet our team at the ReaLLMASIC Lab at Brown University, where we work on open-source and AI-driven chip design, analog layout automation (GLayout), and efficient AI accelerators.",
  path: "/team",
})

export default async function TeamPage() {
  const content = await getPageContent()
  const pi = content.team.data.pi

  const sameAs = [
    pi.moreInfoUrl,
    pi.linkedin && pi.linkedin !== "#" ? pi.linkedin : null,
  ].filter((value): value is string => Boolean(value))

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: pi.name,
    givenName: "Mehdi",
    familyName: "Saligane",
    jobTitle: pi.role,
    affiliation: {
      "@type": "CollegeOrUniversity",
      name: "Brown University",
    },
    worksFor: {
      "@type": "Organization",
      name: "ReaLLMASIC Lab",
      url: siteUrl,
    },
    url: `${siteUrl}/team`,
    image: pi.image ? `${siteUrl}${pi.image}` : undefined,
    sameAs,
  }

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <Header content={content.header.data} />
      <main id="main-content" tabIndex={-1}>
        <TeamSection content={content.team} />
      </main>
      <Footer content={content.footer.data} />
    </div>
  )
}
