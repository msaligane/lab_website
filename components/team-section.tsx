"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Markdown } from "@/components/markdown"
import type { SectionContent, TeamContent } from "@/lib/content"
import { Linkedin, Mail, Minus, Plus } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

type TeamSectionProps = {
  content: SectionContent<TeamContent>
}

function normalizeEmailLink(email?: string) {
  if (!email || email === "#") {
    return null
  }
  if (email.startsWith("mailto:") || email.startsWith("http")) {
    return email
  }
  return `mailto:${email}`
}

function normalizeExternalLink(href?: string) {
  return href && href !== "#" ? href : null
}

export function TeamSection({ content }: TeamSectionProps) {
  const { data, html } = content
  const [openAlumni, setOpenAlumni] = useState<Record<string, boolean>>({})
  const piEmailHref = normalizeEmailLink(data.pi.email)
  const piLinkedInHref = normalizeExternalLink(data.pi.linkedin)
  const piMoreInfoHref = normalizeExternalLink(data.pi.moreInfoUrl)

  const toggleAlumni = (name: string) => {
    setOpenAlumni((current) => ({ ...current, [name]: !current[name] }))
  }

  return (
    <section id="team" className="section-shell bg-secondary/35">
      <div className="site-container">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="section-eyebrow">
            {data.eyebrow}
          </h2>
          <p className="section-title text-balance">
            {data.title}
          </p>
          <Markdown
            html={html}
            className="section-copy text-pretty"
          />
        </div>

        <div className="mt-14 space-y-16">
          <div className="surface-card overflow-hidden p-2 sm:p-3">
            <img
              src="/images/team/group_photo.png"
              alt="Lab group photo"
              className="aspect-[16/7] w-full rounded-xl object-cover"
            />
          </div>
          <div>
            <h3 className="mb-7 text-center text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Principal investigator</h3>
            <Card className="surface-card group mx-auto max-w-xl border-border/70 transition-all hover:border-primary/45">
              <CardHeader className="text-center">
                <Avatar className="mx-auto mb-4 h-28 w-28 ring-4 ring-primary/10">
                  {data.pi.image ? (
                    <AvatarImage src={data.pi.image} alt={data.pi.name} />
                  ) : null}
                  <AvatarFallback className="bg-primary/10 text-primary text-lg">
                    {data.pi.initials}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-2xl text-foreground">{data.pi.name}</CardTitle>
                <CardDescription className="text-primary font-medium">
                  {data.pi.role}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                {piMoreInfoHref ? (
                  <Link
                    href={piMoreInfoHref}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-muted-foreground underline underline-offset-4 hover:text-primary"
                  >
                    More Info
                  </Link>
                ) : (
                  <p className="text-sm text-muted-foreground mb-4">
                    {data.pi.specialty}
                  </p>
                )}
                <div className="mt-5 flex justify-center gap-3">
                  {piEmailHref ? (
                    <Link
                      href={piEmailHref}
                      className="p-2 rounded-full bg-secondary hover:bg-primary/20 transition-colors"
                    >
                      <Mail className="h-4 w-4 text-muted-foreground hover:text-primary" />
                      <span className="sr-only">Email {data.pi.name}</span>
                    </Link>
                  ) : null}
                  {piLinkedInHref ? (
                    <Link
                      href={piLinkedInHref}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-full bg-secondary hover:bg-primary/20 transition-colors"
                    >
                      <Linkedin className="h-4 w-4 text-muted-foreground hover:text-primary" />
                      <span className="sr-only">{data.pi.name} on LinkedIn</span>
                    </Link>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          </div>

          {data.groups.map((group) => {
            if (!group.members.length) {
              return null
            }

            const isAlumni = group.title.toLowerCase().includes("alumni")

            return (
              <div key={group.title} className="space-y-7">
                <div className="flex items-center gap-5">
                  <div className="h-px flex-1 bg-border" />
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground text-center">
                  {group.title}
                </h3>
                  <div className="h-px flex-1 bg-border" />
                </div>
                {isAlumni ? (
                  <div className="space-y-3">
                    {group.members.map((member) => (
                      <div
                        key={member.name}
                        className="surface-card rounded-xl px-5 py-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-medium text-foreground">
                              {member.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {member.role}
                            </p>
                          </div>
                          {member.introduction || member.specialty ? (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => toggleAlumni(member.name)}
                              aria-expanded={!!openAlumni[member.name]}
                              aria-label={`Toggle introduction for ${member.name}`}
                            >
                              {openAlumni[member.name] ? (
                                <Minus className="h-4 w-4" />
                              ) : (
                                <Plus className="h-4 w-4" />
                              )}
                            </Button>
                          ) : null}
                        </div>
                        {openAlumni[member.name] && (member.introduction || member.specialty) ? (
                          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                            {member.introduction || member.specialty}
                          </p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {group.members.map((member) => {
                      const emailHref = normalizeEmailLink(member.email)
                      const linkedInHref = normalizeExternalLink(member.linkedin)

                      return (
                        <Card
                          key={member.name}
                          className="surface-card group h-full border-border/70 transition-all duration-300 hover:-translate-y-1 hover:border-primary/45"
                        >
                        <CardHeader className="text-center">
                          <Avatar className="mx-auto mb-4 h-28 w-28 ring-4 ring-primary/10">
                            {member.image ? (
                              <AvatarImage src={member.image} alt={member.name} />
                            ) : null}
                            <AvatarFallback className="bg-primary/10 text-primary text-lg">
                              {member.initials}
                            </AvatarFallback>
                          </Avatar>
                          <CardTitle className="text-xl text-foreground">{member.name}</CardTitle>
                          <CardDescription className="text-primary font-medium">
                            {member.role}
                            {member.started ? (
                              <span className="block text-xs text-muted-foreground mt-1">
                                Started {member.started}
                              </span>
                            ) : null}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                          {member.specialty && (
                            <p className="text-sm text-muted-foreground mb-4">
                              {member.specialty}
                            </p>
                          )}
                          <div className="flex justify-center gap-3">
                            {emailHref ? (
                              <Link
                                href={emailHref}
                                className="p-2 rounded-full bg-secondary hover:bg-primary/20 transition-colors"
                              >
                                <Mail className="h-4 w-4 text-muted-foreground hover:text-primary" />
                                <span className="sr-only">Email {member.name}</span>
                              </Link>
                            ) : null}
                            {linkedInHref ? (
                              <Link
                                href={linkedInHref}
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 rounded-full bg-secondary hover:bg-primary/20 transition-colors"
                              >
                                <Linkedin className="h-4 w-4 text-muted-foreground hover:text-primary" />
                                <span className="sr-only">{member.name} on LinkedIn</span>
                              </Link>
                            ) : null}
                          </div>
                        </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
