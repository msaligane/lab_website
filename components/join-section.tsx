export function JoinSection() {
  return (
<div className="join-wrap">
    <div className="join-intro">
      <div className="recruit-kicker">ReaLLMASIC Lab · Brown University</div>
      <h1>Join our group</h1>
      <p>If you’re excited about our research and believe you could contribute, we’d love to hear from you.</p>
      <nav className="join-jumps" aria-label="Research opportunities">
        <a href="#phd">PhD students <span aria-hidden="true">↓</span></a>
        <a href="#postdoc">Postdoctoral researcher <span aria-hidden="true">↓</span></a>
        <a href="#students">Other student opportunities <span aria-hidden="true">↓</span></a>
      </nav>
    </div>

    <section className="join-role join-featured" id="phd" aria-labelledby="phd-title">
      <div className="join-role-heading"><span className="recruit-kicker">Doctoral research</span><h2 id="phd-title">PhD students</h2></div>
      <div className="join-columns">
        <div className="join-copy">
          <p>We welcome inquiries from prospective PhD students interested in <strong>analog and mixed-signal (AMS) circuits for biosensors, AI for chip design, and energy-efficient computing</strong>.</p>
          <p>We value strong technical foundations, curiosity, and initiative. If you’re excited about our research and believe you could contribute to the group, I’d love to hear from you.</p>
        </div>
        <div className="join-apply">
          <h3>Introduce yourself</h3>
          <ul><li>Your CV</li><li>A short note about your research interests, relevant experience, and how you’d like to contribute</li></ul>
          <a className="recruit-cta" href="mailto:mehdi_saligane@brown.edu?subject=Prospective%20PhD%20student">Get in touch <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </section>

    <section className="join-role" id="postdoc" aria-labelledby="postdoc-title">
      <div className="join-role-heading"><span className="recruit-kicker">Postdoctoral opportunity</span><h2 id="postdoc-title">Postdoctoral researcher</h2><p className="join-focus">Surface chemistry for DNA synthesis · Nanofabrication · Chip design</p></div>
      <div className="join-columns">
        <div className="join-copy">
          <p>We are seeking a postdoctoral researcher with a <strong>strong publication record</strong> to contribute to research connecting molecular technologies with integrated circuits.</p>
          <p>We welcome expertise in one or more of these areas and a strong interest in working across disciplines.</p>
        </div>
        <div className="join-apply">
          <h3>Tell us about your work</h3>
          <ul><li>Your CV and selected publications</li><li>A brief description of your research interests and how you would contribute</li></ul>
          <a className="join-action" href="mailto:mehdi_saligane@brown.edu?subject=Postdoctoral%20opportunity">Discuss the opportunity <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </section>

    <section className="join-role join-other" id="students" aria-labelledby="students-title">
      <div className="join-role-heading"><span className="recruit-kicker">Student research</span><h2 id="students-title">Undergraduate &amp; master’s students</h2></div>
      <div className="join-columns">
        <div className="join-copy"><p>We welcome motivated undergraduate and master’s students looking to gain more research experience. If you’re curious, eager to learn, and interested in contributing to our work, we’d love to hear from you.</p></div>
        <div className="join-apply"><h3>Share your interests</h3><p>Send your CV and a short note about your interests, relevant experience, and how you’d like to contribute.</p><a className="join-action" href="mailto:mehdi_saligane@brown.edu?subject=Student%20research%20opportunities">Get in touch <span aria-hidden="true">↗</span></a></div>
      </div>
    </section>
    <div className="join-contact">Contact Mehdi Saligane <a href="mailto:mehdi_saligane@brown.edu">mehdi_saligane@brown.edu</a></div>
  </div>
  )
}
