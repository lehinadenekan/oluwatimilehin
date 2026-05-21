import type { Metadata } from 'next'
import YorubaDeckCaseStudy from './YorubaDeckCaseStudy'

export const metadata: Metadata = {
  title: 'Yorùbá Deck: Case Study | olúwatìmílẹ́hìn',
  description:
    'How I conceived, built, and operate a Yorùbá language learning platform end to end — product, technology, content, growth, and a remote team in Nigeria.',
  openGraph: {
    title: 'Yorùbá Deck: Case Study',
    description:
      'Solo founder. Full-stack. AI-powered content pipeline. Remote Nigeria team. This is how Yorùbá Deck was built.',
    url: 'https://www.oluwatimilehin.com/yoruba-deck',
    siteName: 'olúwatìmílẹ́hìn',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yorùbá Deck: Case Study',
    description: 'How I built a Yorùbá language learning platform from scratch.',
  },
}

export default function YorubaDeckPage() {
  return <YorubaDeckCaseStudy />
}
