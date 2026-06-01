import type { Metadata } from "next"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { TeamSection } from "@/components/team-section"
import { getPageContent } from "@/lib/content"
import { siteUrl } from "@/app/layout"

export const metadata: Metadata = {
  title: "Team — Prof. Mehdi Saligane & ReaLLMASIC Lab",
  description:
    "Meet Prof. Mehdi Saligane (Brown University) and the ReaLLMASIC Lab researchers working on open-source and AI-driven chip design, analog layout automation (GLayout), and efficient AI accelerators.",
  alternates: { canonical: "/team" },
  openGraph: {
    title: "Team — Prof. Mehdi Saligane & ReaLLMASIC Lab",
    description:
      "Prof. Mehdi Saligane and the ReaLLMASIC Lab at Brown University.",
    url: "/team",
  },
}

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
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <Header content={content.header.data} />
      <TeamSection content={content.team} />
      <Footer content={content.footer.data} />
    </main>
  )
}
