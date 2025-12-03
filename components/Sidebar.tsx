'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import Link from 'next/link'
import PasswordModal from './PasswordModal'

// Context for sidebar collapsed state
const SidebarContext = createContext<{ isCollapsed: boolean }>({ isCollapsed: false })
export const useSidebar = () => useContext(SidebarContext)

interface NavigationItem {
  id: string
  label: string
  href: string
  requiresAuth?: boolean
}

const navigationItems: NavigationItem[] = [
  { id: 'home', label: 'Home', href: '#home' },
  { id: 'music', label: 'Music', href: '#music' },
  { id: 'commercial', label: 'Commercial Work', href: '#commercial' },
  { id: 'creative', label: 'Creative Projects', href: '#creative' },
  { id: 'services', label: "Let's Work Together", href: '#services' },
  { id: 'exclusive', label: 'Exclusive', href: '#detailed-portfolio', requiresAuth: true },
]

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false) // Collapse state (all screen sizes)
  const [activeSection, setActiveSection] = useState('home')
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is already authenticated (using sessionStorage to match page.tsx)
    const checkAuth = () => {
      const authStatus = sessionStorage.getItem('portfolioAuthenticated')
      setIsAuthenticated(authStatus === 'true')
    }
    
    checkAuth()
    
    // Listen for storage changes to sync authentication state
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'portfolioAuthenticated') {
        checkAuth()
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const sections = navigationItems.map(item => item.id)
      const scrollPosition = window.scrollY + 200

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, requiresAuth?: boolean) => {
    e.preventDefault()
    
    // If it's the exclusive section and requires auth
    if (requiresAuth) {
      // Re-check auth status in case it changed
      const currentAuth = sessionStorage.getItem('portfolioAuthenticated') === 'true'
      
      if (!currentAuth) {
        setIsPasswordModalOpen(true)
        return
      }
      
      // User is authenticated, scroll to detailed portfolio
      setTimeout(() => {
        const element = document.getElementById('detailed-portfolio')
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 50)
      return
    }

    // Scroll to target section for non-exclusive links
    const targetId = href.replace('#', '')
    const element = document.getElementById(targetId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handlePasswordSuccess = () => {
    setIsAuthenticated(true)
    // Note: sessionStorage is already set by PasswordModal
    // MainContent will detect the change and handle scrolling
    // This just updates the Sidebar's local state for UI purposes
  }

  return (
    <SidebarContext.Provider value={{ isCollapsed }}>
      {/* Sidebar - Always visible, collapsible on all screen sizes */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gray-900 border-r border-gray-800 z-50 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        <div className="flex flex-col h-full p-3 sm:p-6 relative">
          {/* Collapse Toggle Button - Works on all screen sizes */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute top-1/2 -translate-y-1/2 right-2 p-2 hover:bg-gray-800 rounded transition-colors z-10"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            )}
          </button>

          {/* Name and Title */}
          <div className={`mb-3 sm:mb-8 transition-opacity duration-300 ${isCollapsed ? 'opacity-0 pointer-events-none' : ''}`}>
            <h1 className="text-lg sm:text-2xl font-bold text-white mb-0.5 sm:mb-1 whitespace-nowrap">olúwatìmílẹ́hìn</h1>
            <p className="text-xs sm:text-sm text-gray-400 whitespace-nowrap">audio, music, culture, technology.</p>
          </div>

          {/* Navigation - No overflow, all items should fit */}
          <nav className={`flex-1 flex flex-col justify-start ${isCollapsed ? 'hidden' : ''}`}>
            <ul className="space-y-1">
              {navigationItems.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href, item.requiresAuth)}
                    className={`block px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-all duration-300 font-semibold text-sm sm:text-base ${
                      activeSection === item.id
                        ? 'bg-purple-700 text-white'
                        : 'text-white hover:bg-gray-800'
                    }`}
                  >
                    <span className="whitespace-nowrap">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>

      {/* Password Modal */}
      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSuccess={handlePasswordSuccess}
      />
    </SidebarContext.Provider>
  )
}

