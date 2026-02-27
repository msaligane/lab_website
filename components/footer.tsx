import Link from "next/link"
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
                src={content.logoPath}
                alt="ReaLLM of ASIC Lab logo"
                className="h-12 w-auto object-contain"
              />
            ) : null}
            <span className="text-xl font-bold tracking-tight text-foreground">
              {showAccent ? (
                <>
                  <span className="text-primary">{content.brandAccent}</span>{" "}
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
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              {content.fundingTitle}
            </p>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              {content.fundingNote}
            </p>
            {content.fundingImage ? (
              <img
                src={content.fundingImage}
                alt="Funding partners"
                className="mt-6 w-full max-w-3xl mx-auto object-contain opacity-100"
              />
            ) : null}
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
                    className="text-muted-foreground hover:text-primary transition-colors"
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
