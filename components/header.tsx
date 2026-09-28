"use client"

import Link from "next/link"
import { NavigationDropdown } from "@/components/navigation-dropdown"
import { responsiveImage } from "@/lib/responsive-images"
import { useRef, useState } from "react"
import { Menu, Moon, Sun, X } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import type { HeaderContent } from "@/lib/content"

type HeaderProps = {
  content: HeaderContent
}

export function Header({ content }: HeaderProps) {
  const mobileTrigger = useRef<HTMLButtonElement>(null)
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
    <>
    <a href="#main-content" className="skip-link">Skip to content</a>
    <header onKeyDown={event => {
      if (event.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false)
        mobileTrigger.current?.focus()
      }
    }} className="sticky top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <nav aria-label="Main navigation" className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-3">
            <img
              {...responsiveImage("/images/lab_logo.png", "120px", 192)}
              loading="eager"
              alt="ReaLLMASIC Lab logo"
              className="h-10 w-auto"
            />
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
        <div className="flex lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            ref={mobileTrigger}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            <span className="sr-only">{mobileMenuOpen ? "Close main menu" : "Open main menu"}</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
        <div className="hidden lg:flex lg:gap-x-8">
          {content.links.map((link) =>
            link.children && link.children.length > 0 ? (
              <NavigationDropdown key={link.name} link={link} />
            ) : (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary-text"
              >
                {link.name}
              </Link>
            ),
          )}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
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
        </div>
      </nav>

      {/* Mobile menu */}
        <div id="mobile-navigation" hidden={!mobileMenuOpen} className="lg:hidden">
          <div className="space-y-1 px-6 pb-4">
            {content.links.map((link) => (
              <div key={link.name}>
                <Link
                  href={link.href}
                  className="block py-2 text-base font-medium text-muted-foreground transition-colors hover:text-primary-text"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
                {link.children && link.children.length > 0 ? (
                  <div className="ml-4 border-l border-border pl-4">
                    {link.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className="block py-1.5 text-sm text-muted-foreground transition-colors hover:text-primary-text"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className="mt-4"
            >
              {isDark ? (
                <Sun className="h-5 w-5 transition-transform duration-300 ease-out hover:rotate-12" />
              ) : (
                <Moon className="h-5 w-5 transition-transform duration-300 ease-out hover:-rotate-12" />
              )}
            </Button>
          </div>
        </div>
    </header>
    </>
  )
}
