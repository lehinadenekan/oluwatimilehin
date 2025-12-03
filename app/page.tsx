'use client'

import { useState, useEffect } from 'react'
import Sidebar, { useSidebar } from '@/components/Sidebar'
import Hero from '@/components/Hero'
import Music from '@/components/Music'
import CommercialWork from '@/components/CommercialWork'
import CreativeProjects from '@/components/CreativeProjects'
import Services from '@/components/Services'
import PasswordGate from '@/components/PasswordGate'
import DetailedPortfolio from '@/components/DetailedPortfolio'
import { PortfolioSection } from '@/types/portfolio'

// Portfolio data organized by sections
const portfolioSections: PortfolioSection[] = [
  {
    title: 'Professional Certifications',
    items: [
      {
        type: 'image',
        title: 'Oracle AI Foundations',
        role: 'Certification',
        description: 'Oracle Certified AI Foundations certification demonstrating expertise in artificial intelligence fundamentals and Oracle AI technologies.',
        impact: 'Validates foundational knowledge in AI concepts, machine learning principles, and Oracle\'s AI platform capabilities.',
        tags: ['Oracle', 'AI', 'Machine Learning', 'Certification'],
        mediaPath: '/images/certifications/oracle-ai-foundations.png'
      },
      {
        type: 'image',
        title: 'Oracle Cloud Infrastructure',
        role: 'Certification',
        description: 'Oracle Certified Cloud Infrastructure certification showcasing proficiency in Oracle Cloud services and infrastructure management.',
        impact: 'Demonstrates expertise in cloud architecture, infrastructure deployment, and Oracle Cloud platform administration.',
        tags: ['Oracle', 'Cloud Infrastructure', 'Certification'],
        mediaPath: '/images/certifications/oracle-cloud-infrastructure.png'
      },
      {
        type: 'image',
        title: 'Oracle Generative AI Professional',
        role: 'Certification',
        description: 'Oracle Certified Generative AI Professional certification highlighting advanced skills in generative AI technologies and applications.',
        impact: 'Validates professional-level expertise in generative AI, including model development, deployment, and integration with Oracle platforms.',
        tags: ['Oracle', 'Generative AI', 'Professional Certification'],
        mediaPath: '/images/certifications/oracle-generative-ai-professional.png'
      },
      {
        type: 'image',
        title: 'ServiceNow Certified System Administrator',
        role: 'Certification',
        description: 'ServiceNow Certified System Administrator (CSA) certification demonstrating expertise in ServiceNow platform administration and configuration.',
        impact: 'Validates skills in ServiceNow platform administration, configuration, and best practices for enterprise service management.',
        tags: ['ServiceNow', 'CSA', 'System Administration', 'Certification'],
        mediaPath: '/images/certifications/servicenow-cis.pdf'
      }
    ]
  },
  {
    title: 'Reform Radio',
    items: [
      {
        type: 'video',
        title: 'shortaFORM',
        role: 'Programme Lead & Creative Producer',
        description: 'Led end-to-end delivery of shortaFORM, a creative media training programme for unemployed young people across two cohorts. Managed workshop planning, session facilitation, and outcome tracking while designing inclusive learning pathways for neurodivergent and visually impaired participants.',
        impact: 'Delivered accessible training programmes that prepared young people for careers in media and creative industries, with tailored placements, apprenticeships, and mentoring opportunities. Built partnerships with national creative employers and provided 1:1 coaching to support participants facing barriers to engagement.',
        tags: ['Programme Management', 'Youth Training', 'Inclusive Design', 'Safeguarding', 'Stakeholder Engagement', 'Reform Radio'],
        mediaPath: 'https://drive.google.com/file/d/1Ejby24xMgkuReDa_PXvb2GQI_SPK2sxw/preview'
      },
      {
        type: 'image',
        title: 'Letter of Support',
        role: 'Professional Reference',
        description: 'Letter of support from Reform Radio acknowledging professional contributions as project manager of shortaFORM and Chairman of the Reform Radio Advisory Board, a position held for 2 years.',
        impact: 'Demonstrates strong professional relationships, leadership recognition, and sustained commitment to Reform Radio\'s mission and governance.',
        tags: ['Reform Radio', 'Reference', 'Letter of Support', 'Advisory Board', 'Leadership'],
        mediaPath: '/images/certifications/rachel-reform-letter-of-support.png'
      }
    ]
  },
  {
    title: 'University of Warwick',
    items: [
      {
        type: 'video',
        title: 'How to make fake drugs',
        role: 'Multimedia Producer & Video Editor',
        description: 'Translated academic research into accessible multimedia content for a Wellcome Trust-funded project examining fake drugs and global health. Edited a long video conference recording to extract and highlight crucial research findings, creating a concise video that effectively communicates the project\'s critical examination of claims about Indian pharmaceuticals and African markets.',
        impact: 'Enabled the research team to effectively communicate complex academic work to broader audiences, translating dense conference discussions into clear, engaging multimedia content that conveys the project\'s focus on understanding the social and political dimensions of fake drug concerns.',
        tags: ['Video Editing', 'Academic Translation', 'Multimedia Production', 'Research Communication', 'Warwick University', 'Wellcome Trust'],
        mediaPath: 'https://drive.google.com/file/d/1D-x6athq5-n-NgTVRARy3t5XLchfOOEF/preview'
      }
    ]
  },
  {
    title: 'Yorùbá Deck',
    items: [
      {
        type: 'video',
        title: 'Deep Dive with Tobi',
        role: 'Creative Technologist & Developer',
        description: 'I\'m a few months deep into the audacious mission of creating the most robust learning platform for the Yorùbá language. Part of this mission involves creating the Yorùbá dictionary, which has required careful documentation and database management for word metadata, parts of speech, example sentences, and audio. This video shows a snippet of conversation between myself and Tobi, from Ibadan, Nigeria, where we discuss specificities regarding the Yorùbá language.',
        impact: 'Showcasing innovative approach to language learning and cultural preservation through technology.',
        tags: ['Creative Technology', 'Interactive Design', 'Language Learning', 'Yorùbá', 'Education'],
        mediaPath: 'https://drive.google.com/file/d/1cXVInYeUoP6R56l61zoowWW8Z_esBtR-/preview'
      },
      {
        type: 'image',
        title: 'Yorùbá Deck TikTok',
        role: 'Content Strategy & Automation',
        description: 'Screenshot of the Yorùbá Deck TikTok page. I am in charge of content strategy and work with Damola on this. Content includes video recordings of Yorùbá Word Master gameplay, bespoke content from Damola including Yorùbá proverbs breakdowns, grammar explanations, film subtitle analysis, song analysis, and Yorùbá book readings. I created a script to fully automate the generation of Yorùbá Word of the Day content, which fetches metadata from the database.',
        impact: 'Demonstrates strategic content planning and technical automation capabilities, combining creative content curation with automated content generation to support language learning outreach.',
        tags: ['Yorùbá Deck', 'Content Strategy', 'Automation', 'Social Media', 'TikTok'],
        mediaPath: '/images/certifications/wisdom-deck-screenshot.png'
      }
    ]
  },
  {
    title: 'Barking & Dagenham Community Music Service',
    items: [
      {
        type: 'video',
        title: 'Community Music Service',
        role: 'Project Manager and Lead Facilitator',
        description: 'Challenged the initial brief to establish a Youth Voice Forum after discovering young people\'s real need: affordable, accessible studio spaces for quality music production. Convinced senior leadership to pivot the project, resulting in studio access at UD Stratford and the establishment of a new music studio in Barking & Dagenham. Sourced equipment from multiple sources and transformed a disused community centre into a fully functioning music studio.',
        impact: 'Delivered tangible outcomes that directly addressed young people\'s needs, creating sustainable infrastructure for music production in the borough and demonstrating the value of listening to community voices in project design.',
        tags: ['Community Music', 'Barking & Dagenham'],
        mediaPath: 'https://drive.google.com/file/d/1nvv9Er-oozaNWRV0IpZiwkIoQrELv9SE/preview'
      }
    ]
  }
]

function MainContent() {
  const { isCollapsed } = useSidebar()
  const [isPortfolioAuthenticated, setIsPortfolioAuthenticated] = useState(false)

  useEffect(() => {
    // Prevent browser from restoring scroll position
    if (typeof window !== 'undefined') {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual'
      }
    }
    
    // Check portfolio authentication status on mount
    const portfolioAuthStatus = sessionStorage.getItem('portfolioAuthenticated')
    setIsPortfolioAuthenticated(portfolioAuthStatus === 'true')
    
    // Listen for authentication changes (from PasswordModal or other sources)
    const handleAuthChange = () => {
      const authStatus = sessionStorage.getItem('portfolioAuthenticated')
      setIsPortfolioAuthenticated((prevAuth) => {
        const newAuth = authStatus === 'true'
        
        // If just authenticated (was false, now true), scroll to portfolio
        if (!prevAuth && newAuth) {
          // Wait for DetailedPortfolio to render before scrolling
          setTimeout(() => {
            const element = document.getElementById('detailed-portfolio')
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
          }, 200)
        }
        
        return newAuth
      })
    }
    
    // Listen for custom authentication event
    window.addEventListener('portfolioAuthenticated', handleAuthChange)
    
    // Listen for storage events (for cross-tab scenarios)
    window.addEventListener('storage', (e) => {
      if (e.key === 'portfolioAuthenticated') {
        handleAuthChange()
      }
    })
    
    return () => {
      window.removeEventListener('portfolioAuthenticated', handleAuthChange)
      window.removeEventListener('storage', handleAuthChange)
    }
  }, [])

  const handlePortfolioAuthenticated = () => {
    setIsPortfolioAuthenticated(true)
    // Wait for DetailedPortfolio to render before scrolling
    setTimeout(() => {
      const element = document.getElementById('detailed-portfolio')
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 200)
  }

  const handlePortfolioLogout = () => {
    sessionStorage.removeItem('portfolioAuthenticated')
    setIsPortfolioAuthenticated(false)
    // Scroll back to password gate
    setTimeout(() => {
      const element = document.getElementById('password-gate')
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }
  
  return (
    <div className={`transition-all duration-300 ${
      isCollapsed ? 'lg:ml-16' : 'lg:ml-64'
    }`}>
      <Hero />
      <Music />
      <CommercialWork />
      <CreativeProjects />
      <Services />
      
      {/* Password Gate - shown when not authenticated */}
      {!isPortfolioAuthenticated && (
        <PasswordGate onAuthenticated={handlePortfolioAuthenticated} />
      )}
      
      {/* Exclusive Portfolio Access - shown when authenticated */}
      {isPortfolioAuthenticated && (
        <DetailedPortfolio sections={portfolioSections} onLogout={handlePortfolioLogout} />
      )}
    </div>
  )
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden w-full">
      <Sidebar />
      <MainContent />
    </main>
  )
}

