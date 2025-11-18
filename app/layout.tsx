import type { Metadata } from 'next'
import { Noto_Sans } from 'next/font/google'
import './globals.css'

const notoSans = Noto_Sans({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-noto',
  weight: ['400', '500', '600', '700', '800', '900'],
})

export const metadata: Metadata = {
  title: 'oluwatimilehin - music, culture, technology.',
  description: 'Portfolio of oluwatimilehin - Music Producer, Audio Engineer, and Creative Technologist',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={notoSans.variable}>
      <body>{children}</body>
    </html>
  )
}

