"use client"

import Link from "next/link"
import { useState } from "react"
import { ChevronDown, Menu, Moon, Sun, X } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import type { HeaderContent } from "@/lib/content"

type HeaderProps = {
  content: HeaderContent
}

export function Header({ content }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()
  const showAccent = content.brand.includes(content.brandAccent)
  const brandRemainder = showAccent
    ? content.brand.replace(content.brandAccent, "").trim()
    : content.brand
  const isDark = resolvedTheme === "dark"

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark")
  }

  return (
    <header className="sticky top-0 left-0 right-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
      <nav className="site-container flex min-h-16 items-center justify-between py-2">
        <div className="flex lg:flex-1">
          <Link href="/" className="group -m-1.5 flex items-center gap-3 p-1.5">
            <img
              src="/images/lab_logo.png"
              alt="ReaLLMASIC Lab logo"
              className="h-9 w-auto transition-transform duration-300 group-hover:scale-105 sm:h-10"
            />
            <span className="text-lg font-semibold tracking-[-0.025em] text-foreground sm:text-xl">
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
        <div className="flex lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            <span className="sr-only">Open main menu</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
        <div className="hidden lg:flex lg:items-center lg:gap-x-1">
          {content.links.map((link) =>
            link.children && link.children.length > 0 ? (
              <div key={link.name} className="relative group">
                <Link
                  href={link.href}
                  className="flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  aria-haspopup="true"
                >
                  {link.name}
                  <ChevronDown className="h-4 w-4" />
                </Link>
                <div className="invisible absolute left-0 top-full mt-2 min-w-[18rem] translate-y-1 rounded-xl border border-border/80 bg-card/95 opacity-0 shadow-xl backdrop-blur-xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                  <div className="p-2">
                    {link.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className="block rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={link.name}
                href={link.href}
                className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {link.name}
              </Link>
            ),
          )}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? (
              <Sun className="h-5 w-5 transition-transform duration-300 ease-out hover:rotate-12" />
            ) : (
              <Moon className="h-5 w-5 transition-transform duration-300 ease-out hover:-rotate-12" />
            )}
          </Button>
          <Button size="sm" className="rounded-full px-4 shadow-sm" asChild>
            <Link href="/contact">{content.cta}</Link>
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div id="mobile-navigation" className="border-t border-border/60 bg-background/95 lg:hidden">
          <div className="site-container space-y-1 py-4">
            {content.links.map((link) => (
              <div key={link.name}>
                <Link
                  href={link.href}
                  className="block rounded-lg px-3 py-2.5 text-base font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
                {link.children && link.children.length > 0 ? (
                  <div className="ml-3 border-l border-border pl-3">
                    {link.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className="block rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
            <div className="mt-3 flex items-center gap-2 border-t border-border/60 pt-4">
              <Button variant="outline" size="icon" onClick={toggleTheme} aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}>
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Button className="flex-1" asChild>
                <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>{content.cta}</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
