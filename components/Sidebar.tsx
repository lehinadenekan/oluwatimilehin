'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import Link from 'next/link'

// Context for sidebar collapsed state
const SidebarContext = createContext<{ isCollapsed: boolean }>({ isCollapsed: false })
export const useSidebar = () => useContext(SidebarContext)

const navigationItems = [
  { id: 'home', label: 'Home', href: '#home' },
  { id: 'music', label: 'Music', href: '#music' },
  { id: 'commercial', label: 'Commercial Work', href: '#commercial' },
  { id: 'creative', label: 'Creative Projects', href: '#creative' },
  { id: 'services', label: "Let's Work Together", href: '#services' },
]

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false) // Mobile menu state
  const [isCollapsed, setIsCollapsed] = useState(false) // Desktop collapse state
  const [activeSection, setActiveSection] = useState('home')

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

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const targetId = href.replace('#', '')
    const element = document.getElementById(targetId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsOpen(false)
    }
  }

  return (
    <SidebarContext.Provider value={{ isCollapsed }}>
      {/* Floating Hamburger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-50 p-3 bg-gray-900 hover:bg-gray-800 rounded-lg transition-all duration-300 shadow-lg border border-gray-700"
          aria-label="Open menu"
        >
          <div className="space-y-1.5 w-6">
            <div className="h-0.5 bg-white rounded"></div>
            <div className="h-0.5 bg-white rounded"></div>
            <div className="h-0.5 bg-white rounded"></div>
          </div>
        </button>
      )}

      {/* Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gray-900 border-r border-gray-800 z-50 transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 ${
          isCollapsed ? 'lg:w-16' : 'lg:w-64'
        } w-64`}
      >
        <div className="flex flex-col h-full p-6 relative">
          {/* Close Button (Mobile) */}
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden self-end mb-6 p-2 hover:bg-gray-800 rounded transition-colors"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Collapse Toggle Button (Desktop) - Positioned in the middle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex absolute top-1/2 -translate-y-1/2 right-2 p-2 hover:bg-gray-800 rounded transition-colors z-10"
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
          <div className={`mb-8 transition-opacity duration-300 ${isCollapsed ? 'lg:opacity-0 lg:pointer-events-none' : ''}`}>
            <h1 className="text-2xl font-bold text-white mb-1 whitespace-nowrap">olúwatìmílẹ́hìn</h1>
            <p className="text-sm text-gray-400 whitespace-nowrap">audio, music, culture, technology.</p>
          </div>

          {/* Navigation */}
          <nav className={`flex-1 ${isCollapsed ? 'lg:hidden' : ''}`}>
            <ul className="space-y-2">
              {navigationItems.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={`block px-6 py-3 rounded-lg transition-all duration-300 font-semibold ${
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
    </SidebarContext.Provider>
  )
}

