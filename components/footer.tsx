import Link from "next/link"
import { responsiveImage } from "@/lib/responsive-images"
import type { FooterContent } from "@/lib/content"
import { Github, Linkedin, Mail } from "lucide-react"

const iconMap = { Linkedin, Github, Mail }

type FooterProps = {
  content: FooterContent
}

export function Footer({ content }: FooterProps) {
  const showAccent = content.brand.includes(content.brandAccent)
  const brandRemainder = showAccent
    ? content.brand.replace(content.brandAccent, "").trim()
    : content.brand

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-6 items-start">
          <Link href="/" className="inline-flex items-center gap-3">
            {content.logoPath ? (
              <img
                {...responsiveImage(content.logoPath, "144px", 192)}
                alt="ReaLLMASIC Lab logo"
                className="h-12 w-auto object-contain"
              />
            ) : null}
            <span className="text-xl font-bold tracking-tight text-foreground">
              {showAccent ? (
                <>
                  <span className="text-primary-text">{content.brandAccent}</span>{" "}
                  {brandRemainder}
                </>
              ) : (
                content.brand
              )}
            </span>
          </Link>
        </div>

        {content.fundingTitle && content.fundingNote ? (
          <div className="mt-10">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary-text">
              {content.fundingTitle}
            </p>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              {content.fundingNote}
            </p>
            {content.fundingImage && !content.fundingLogos?.length ? (
              <img
                {...responsiveImage(content.fundingImage, "(max-width: 816px) calc(100vw - 48px), 768px")}
                alt="Funding partners"
                className="mt-6 w-full max-w-3xl mx-auto object-contain opacity-100"
              />
            ) : null}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              {content.fundingLogos?.map((funder) => {
                const logo = (
                  <span className={`flex h-20 w-32 items-center justify-center rounded p-3 ${funder.name === "DARPA" ? "bg-[#002b49]" : "bg-white"}`}>
                    {funder.viewBox ? (
                      <svg role="img" aria-label={funder.name} viewBox={funder.viewBox}
                        className="h-12 w-26" preserveAspectRatio="xMidYMid meet">
                        <image href={responsiveImage(funder.image, "104px", 1993).src} width="1993" height="135" />
                      </svg>
                    ) : (
                      <img src={funder.image} alt={funder.name} width={152} height={84}
                        loading="lazy" decoding="async" className="h-12 w-26 object-contain" />
                    )}
                  </span>
                )
                return funder.href ? (
                  <Link key={funder.name} href={funder.href} className="rounded" title={funder.caption}>
                    {logo}
                  </Link>
                ) : <span key={funder.name}>{logo}</span>
              })}
            </div>
            {content.fundingLogos?.filter(funder => funder.caption && funder.href).map(funder => (
              <p key={funder.name} className="mt-3 text-center text-sm text-muted-foreground">
                <Link href={funder.href!} className="hover:text-primary-text">{funder.name}: {funder.caption}</Link>
              </p>
            ))}
          </div>
        ) : null}

        <div className="mt-12 border-t border-border pt-8">
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-4">
              {content.social.map((link) => {
                const Icon = iconMap[link.icon as keyof typeof iconMap] ?? Mail

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-muted-foreground hover:text-primary-text transition-colors"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="sr-only">{link.name}</span>
                  </Link>
                )
              })}
            </div>
            <p className="text-center text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} {content.brand}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
