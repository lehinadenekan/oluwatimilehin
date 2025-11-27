import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { Suspense } from 'react'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import './globals.css'

export const metadata: Metadata = {
  title: 'oluwatimilehin - Audio Production, Web Design & App Design | Yoruba Language Expert',
  description: 'Professional audio production, music production, web design, and app design services by oluwatimilehin. Specializing in Yoruba language technology, podcast production, and creative technology solutions. Based in the UK, serving clients worldwide.',
  keywords: [
    'oluwatimilehin',
    'yoruba',
    'audio production',
    'web design',
    'app design',
    'music production',
    'podcast production',
    'sound design',
    'yoruba language',
    'creative technology',
    'web applications',
    'interactive design',
    'audio editing',
    'post-production',
    'yoruba word master',
    'yoruba deck',
    'custom web development',
    'technology solutions',
  ],
  authors: [{ name: 'oluwatimilehin' }],
  creator: 'oluwatimilehin',
  publisher: 'oluwatimilehin',
  openGraph: {
    title: 'oluwatimilehin - Audio Production, Web Design & App Design | Yoruba Language Expert',
    description: 'Professional audio production, music production, web design, and app design services. Specializing in Yoruba language technology and creative solutions.',
    url: 'https://www.oluwatimilehin.com',
    siteName: 'oluwatimilehin',
    type: 'website',
    locale: 'en_GB',
    images: [
      {
        url: 'https://www.oluwatimilehin.com/images/bbc-podcast-the-reset.webp',
        width: 1200,
        height: 630,
        alt: 'oluwatimilehin - Audio Production Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'oluwatimilehin - Audio Production, Web Design & App Design',
    description: 'Professional audio production, music production, web design, and app design services. Yoruba language technology expert.',
    images: ['https://www.oluwatimilehin.com/images/bbc-podcast-the-reset.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://www.oluwatimilehin.com',
  },
  category: 'Portfolio',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'oluwatimilehin',
    alternateName: 'olúwatìmílẹ́hìn',
    jobTitle: 'Audio Producer, Music Producer, Web Designer, App Designer, Creative Technologist',
    description: 'Professional audio production, music production, web design, and app design services. Specializing in Yoruba language technology and creative solutions.',
    email: 'lehinadenekan@gmail.com',
    url: 'https://www.oluwatimilehin.com',
    sameAs: [
      'https://calendly.com/oluwatimilehinonline',
    ],
    knowsAbout: [
      'Audio Production',
      'Music Production',
      'Web Design',
      'App Design',
      'Yoruba Language',
      'Podcast Production',
      'Sound Design',
      'Creative Technology',
      'Web Development',
    ],
    offers: {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: 'Audio Production Services',
        description: 'Audio recording, editing, and post-production services for podcasts and multimedia content.',
        serviceType: 'Audio Production',
      },
    },
  }

  const localBusinessData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://www.oluwatimilehin.com',
    name: 'oluwatimilehin',
    description: 'Professional audio production, web design, and app design services',
    url: 'https://www.oluwatimilehin.com',
    email: 'lehinadenekan@gmail.com',
    telephone: '',
    priceRange: '$$',
    areaServed: {
      '@type': 'Country',
      name: 'United Kingdom',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Audio Production',
            description: 'Audio recording, editing, and post-production services for podcasts and multimedia content.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Music Production',
            description: 'End-to-end music production from composition to final mastering.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Web Design & App Design',
            description: 'Custom web applications, interactive experiences and creative technology solutions.',
          },
        },
      ],
    },
  }

  return (
    <html lang="en-GB">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessData) }}
        />
        {children}
        <Analytics />
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
      </body>
    </html>
  )
}

