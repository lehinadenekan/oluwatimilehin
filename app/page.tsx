'use client'

import { useState, useEffect } from 'react'
import Sidebar, { useSidebar } from '@/components/Sidebar'
import Hero from '@/components/Hero'
import Music from '@/components/Music'
import CommercialWork from '@/components/CommercialWork'
import CreativeProjects from '@/components/CreativeProjects'
import Services from '@/components/Services'
import Exclusive from '@/components/Exclusive'

function MainContent() {
  const { isCollapsed } = useSidebar()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check authentication status on mount
    const authStatus = localStorage.getItem('exclusive_access')
    setIsAuthenticated(authStatus === 'true')

    // Listen for storage changes (in case user authenticates in another tab)
    const handleStorageChange = () => {
      const authStatus = localStorage.getItem('exclusive_access')
      setIsAuthenticated(authStatus === 'true')
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])
  
  return (
    <div className={`transition-all duration-300 ${
      isCollapsed ? 'lg:ml-16' : 'lg:ml-64'
    }`}>
      <Hero />
      <Music />
      <CommercialWork />
      <CreativeProjects />
      <Services />
      {isAuthenticated && <Exclusive />}
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

