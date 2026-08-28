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
    <footer className="border-t border-border/70 bg-card/65">
      <div className="site-container py-14 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[0.35fr_0.65fr] lg:gap-20">
          <div>
          <Link href="/" className="inline-flex items-center gap-3">
            {content.logoPath ? (
              <img
                src={content.logoPath}
                alt="ReaLLMASIC Lab logo"
                className="h-11 w-auto object-contain"
              />
            ) : null}
            <span className="text-xl font-semibold tracking-[-0.025em] text-foreground">
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
          <div className="mt-7 flex gap-2">
            {content.social.map((link) => {
              const Icon = iconMap[link.icon as keyof typeof iconMap] ?? Mail

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                >
                  <Icon className="h-4 w-4" />
                  <span className="sr-only">{link.name}</span>
                </Link>
              )
            })}
          </div>
          </div>

        {content.fundingTitle && content.fundingNote ? (
          <div>
            <p className="section-eyebrow">
              {content.fundingTitle}
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
              {content.fundingNote}
            </p>
            {content.fundingImage ? (
              <div className="mt-6 rounded-xl border border-border/70 bg-white p-4 sm:p-5">
                <img
                  src={content.fundingImage}
                  alt="Funding partners"
                  className="mx-auto w-full max-w-3xl object-contain"
                />
              </div>
            ) : null}
          </div>
        ) : null}
        </div>

        <div className="mt-12 border-t border-border/70 pt-7">
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <p className="text-center text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} {content.brand}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
