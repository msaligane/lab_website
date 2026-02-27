"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { ContactContent, SectionContent } from "@/lib/content"
import { MapPin, Mail, Phone, Clock } from "lucide-react"

const iconMap = { MapPin, Mail, Phone, Clock }

type ContactSectionProps = {
  content: SectionContent<ContactContent>
}

export function ContactSection({ content }: ContactSectionProps) {
  const { data, html } = content

  return (
    <section id="contact" className="py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-primary">
            {data.eyebrow}
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            {data.title}
          </p>
          <div
            className="mt-4 text-lg text-muted-foreground text-pretty"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Contact Form */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">{data.formTitle}</CardTitle>
              <CardDescription className="text-muted-foreground">
                {data.formDescription}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">{data.labels.firstName}</Label>
                    <Input id="firstName" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">{data.labels.lastName}</Label>
                    <Input id="lastName" placeholder="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{data.labels.email}</Label>
                  <Input id="email" type="email" placeholder="john.doe@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">{data.labels.subject}</Label>
                  <Input id="subject" placeholder="Research Collaboration" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">{data.labels.message}</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us about your interest in our research..."
                    rows={4}
                  />
                </div>
                <Button type="submit" className="w-full">
                  {data.labels.submit}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-6">
            {data.info.map((info) => {
              const Icon = iconMap[info.icon as keyof typeof iconMap] ?? MapPin

              return (
                <Card key={info.title} className="bg-card">
                  <CardContent className="flex items-start gap-4 pt-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{info.title}</h3>
                      {info.details.map((detail, index) => (
                        <p key={index} className="text-sm text-muted-foreground">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
