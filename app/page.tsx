'use client'

import Sidebar, { useSidebar } from '@/components/Sidebar'
import Hero from '@/components/Hero'
import Music from '@/components/Music'
import CommercialWork from '@/components/CommercialWork'
import CreativeProjects from '@/components/CreativeProjects'
import Services from '@/components/Services'

function MainContent() {
  const { isCollapsed } = useSidebar()
  
  return (
    <div className={`transition-all duration-300 ${
      isCollapsed ? 'lg:ml-16' : 'lg:ml-64'
    }`}>
      <Hero />
      <Music />
      <CommercialWork />
      <CreativeProjects />
      <Services />
    </div>
  )
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <Sidebar />
      <MainContent />
    </main>
  )
}

