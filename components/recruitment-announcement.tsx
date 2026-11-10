import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function RecruitmentAnnouncement() {
  return (
    <div className="recruit-wrap">
      <section className="recruit-banner" aria-labelledby="recruit-title">
        <div>
          <p className="recruit-kicker">Join our group</p>
          <h2 id="recruit-title">PhD students &amp; postdoctoral researchers</h2>
          <p>We’re looking for curious, motivated researchers to join our group. If you’re excited about our research and believe you could contribute, we’d love to hear from you.</p>
        </div>
        <Link className="recruit-cta" href="/join">Explore opportunities <ArrowRight size={16} aria-hidden="true" /></Link>
      </section>
    </div>
  )
}
