import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'ReaLLMASIC_Lab',
  description: 'Cutting-edge research in electrical and computer engineering. Explore our research areas, team, publications, and news & talks.',
  generator: 'v0.app',
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
      <body className="font-sans antialiased">
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
