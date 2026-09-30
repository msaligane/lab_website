"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Markdown } from "@/components/markdown"
import type { SectionContent, TeamContent } from "@/lib/content"
import { Linkedin, Mail, Minus, Plus } from "lucide-react"
import Link from "next/link"
import { responsiveImage } from "@/lib/responsive-images"
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
    <section id="team" className="py-24 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-text">
            {data.eyebrow}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            {data.title}
          </h1>
          <Markdown
            html={html}
            className="mt-4 text-lg text-muted-foreground text-pretty"
          />
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6">
          <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-2">
            <img
              {...responsiveImage(data.groupPhoto?.image ?? "/images/team/group_photo.png", "(max-width: 767px) calc(100vw - 48px), (max-width: 1280px) calc(50vw - 44px), 596px")}
              alt={data.groupPhoto?.alt ?? "Lab group photo"}
              loading="eager"
              className="h-auto w-full max-w-5xl mx-auto rounded-xl"
            />
            {data.groupPhoto ? (
              <img
                {...responsiveImage("/images/team/group_photo.png", "(max-width: 767px) calc(100vw - 48px), (max-width: 1280px) calc(50vw - 44px), 596px")}
                alt="Earlier ReaLLMASIC Lab group photo"
                className="h-auto w-full mx-auto rounded-xl"
              />
            ) : null}
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="group transition-all hover:border-primary/50 bg-card">
              <CardHeader className="text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  {data.pi.image ? (
                    <AvatarImage {...responsiveImage(data.pi.image, "96px", 192)} alt={data.pi.name} />
                  ) : null}
                  <AvatarFallback className="bg-primary/10 text-primary-text text-lg">
                    {data.pi.initials}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-foreground">{data.pi.name}</CardTitle>
                <CardDescription className="text-primary-text font-medium">
                  {data.pi.role}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                {piMoreInfoHref ? (
                  <Link
                    href={piMoreInfoHref}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-muted-foreground underline underline-offset-4 hover:text-primary-text"
                  >
                    More Info
                  </Link>
                ) : (
                  <p className="text-sm text-muted-foreground mb-4">
                    {data.pi.specialty}
                  </p>
                )}
                <div className="flex justify-center gap-3">
                  {piEmailHref ? (
                    <Link
                      href={piEmailHref}
                      className="p-2 rounded-full bg-secondary hover:bg-primary/20 transition-colors"
                    >
                      <Mail className="h-4 w-4 text-muted-foreground hover:text-primary-text" />
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
                      <Linkedin className="h-4 w-4 text-muted-foreground hover:text-primary-text" />
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
              <div key={group.title} className="space-y-6">
                <h2 className="text-lg font-semibold text-foreground text-center">
                  {group.title}
                </h2>
                {isAlumni ? (
                  <div className="space-y-3">
                    {group.members.map((member) => (
                      <div
                        key={member.name}
                        className="rounded-md border border-border bg-card/60 px-4 py-3"
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
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {group.members.map((member) => {
                      const emailHref = normalizeEmailLink(member.email)
                      const linkedInHref = normalizeExternalLink(member.linkedin)

                      return (
                        <Card
                          key={member.name}
                          className="group transition-all hover:border-primary/50 bg-card"
                        >
                        <CardHeader className="text-center">
                          <Avatar className="h-24 w-24 mx-auto mb-4">
                            {member.image ? (
                              <AvatarImage {...responsiveImage(member.image, "96px", 192)} alt={member.name} />
                            ) : null}
                            <AvatarFallback className="bg-primary/10 text-primary-text text-lg">
                              {member.initials}
                            </AvatarFallback>
                          </Avatar>
                          <CardTitle className="text-foreground">{member.name}</CardTitle>
                          <CardDescription className="text-primary-text font-medium">
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
                                <Mail className="h-4 w-4 text-muted-foreground hover:text-primary-text" />
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
                                <Linkedin className="h-4 w-4 text-muted-foreground hover:text-primary-text" />
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
        {data.gallery ? (
          <section aria-labelledby="lab-gallery-title" className="mt-20">
            <h2 id="lab-gallery-title" className="text-center text-3xl font-bold text-foreground">{data.gallery.title}</h2>
            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
              {data.gallery.photos.map(photo => (
                <figure key={photo.image}>
                  <a href={photo.image} target="_blank" rel="noreferrer" className="block rounded-xl">
                    <img {...responsiveImage(photo.image, "(max-width: 768px) calc(100vw - 48px), (max-width: 1280px) calc(50vw - 48px), 592px")}
                      alt={photo.alt} className="h-auto w-full rounded-xl" />
                    <span className="sr-only">Open larger photo (new tab)</span>
                  </a>
                </figure>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </section>
  )
}
