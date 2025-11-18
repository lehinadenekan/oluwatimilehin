import type { Metadata } from 'next'
import { Noto_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

const notoSans = Noto_Sans({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-noto',
  weight: ['400', '500', '600', '700', '800', '900'],
})

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
    <html lang="en" className={notoSans.variable}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}

