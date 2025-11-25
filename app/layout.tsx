import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

export const metadata: Metadata = {
  title: 'oluwatimilehin - audio, music, culture, technology.',
  description: 'portfolio of oluwatimilehin',
  openGraph: {
    title: 'oluwatimilehin - audio, music, culture, technology.',
    description: 'portfolio of oluwatimilehin',
    url: 'https://www.oluwatimilehin.com',
    siteName: 'oluwatimilehin',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'oluwatimilehin - audio, music, culture, technology.',
    description: 'portfolio of oluwatimilehin',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}

