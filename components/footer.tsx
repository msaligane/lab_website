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
            {content.fundingImage ? (
              <img
                {...responsiveImage(content.fundingImage, "(max-width: 816px) calc(100vw - 48px), 768px")}
                alt="Funding partners"
                className="mt-6 w-full max-w-3xl mx-auto object-contain opacity-100"
              />
            ) : null}
            {content.fundingLogos?.map((funder) => (
              <Link key={funder.name} href={funder.href}
                className="mx-auto mt-6 flex w-fit flex-col items-center gap-2 rounded text-sm text-muted-foreground hover:text-primary-text">
                <span className="rounded bg-[#002b49] px-5 py-3">
                  <img src={funder.image} alt={funder.name} width={152} height={84}
                    loading="lazy" decoding="async" className="h-auto w-28" />
                </span>
                <span>{funder.caption}</span>
              </Link>
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
