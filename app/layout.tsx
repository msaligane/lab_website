import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.saliganelab.com'

const siteDescription =
  'ReaLLMASIC Lab, led by Prof. Mehdi Saligane at Brown University, advances open-source and AI-driven chip design — agentic analog layout (GLayout), efficient AI accelerators, and open EDA flows (OpenROAD, OpenFASOC).'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'ReaLLMASIC Lab — Prof. Mehdi Saligane (Brown University)',
    template: '%s · ReaLLMASIC Lab — Prof. Mehdi Saligane',
  },
  description: siteDescription,
  applicationName: 'ReaLLMASIC Lab',
  keywords: [
    'Mehdi Saligane',
    'ReaLLMASIC',
    'ReaLLMASIC Lab',
    'Brown University',
    'open-source silicon',
    'analog layout automation',
    'GLayout',
    'OpenROAD',
    'OpenFASOC',
    'AI accelerator',
    'edge AI',
    'chip design',
    'EDA',
  ],
  authors: [
    { name: 'Mehdi Saligane', url: 'https://vivo.brown.edu/display/msaligan' },
  ],
  creator: 'Mehdi Saligane',
  publisher: 'ReaLLMASIC Lab',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: 'ReaLLMASIC Lab',
    title: 'ReaLLMASIC Lab — Prof. Mehdi Saligane (Brown University)',
    description: siteDescription,
    images: ['/reallmasic_icon.png'],
  },
  twitter: {
    card: 'summary',
    title: 'ReaLLMASIC Lab — Prof. Mehdi Saligane (Brown University)',
    description: siteDescription,
    images: ['/reallmasic_icon.png'],
  },
  robots: { index: true, follow: true },
  verification: {
    google: 'ld-nRURMtvsKIvSY_efSS35sQLgs9Dh5Iklp77vPaPE',
  },
  icons: {
    icon: '/reallmasic_icon.png',
    apple: '/reallmasic_icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
        >
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
