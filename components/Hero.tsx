'use client'

import { useState, useEffect } from 'react'

const text = "olúwatìmílẹ́hìn"
const typingSpeed = 100 // milliseconds per character
const pauseDuration = 4000 // 4 seconds pause before restart

export default function Hero() {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showTagline, setShowTagline] = useState(false)

  useEffect(() => {
    if (currentIndex < text.length) {
      // Typing phase
      const timer = setTimeout(() => {
        setDisplayedText(text.slice(0, currentIndex + 1))
        setCurrentIndex(currentIndex + 1)
      }, typingSpeed)
      return () => clearTimeout(timer)
    } else {
      // Finished typing - show tagline after a brief delay
      const taglineTimer = setTimeout(() => {
        setShowTagline(true)
      }, 300) // Small delay after typing completes
      
      // Hide tagline 1 second before restart (to allow fade-out to complete)
      const hideTaglineTimer = setTimeout(() => {
        setShowTagline(false)
      }, pauseDuration - 1000) // 3 seconds (1 second before restart)
      
      // Wait 4 seconds then restart
      const restartTimer = setTimeout(() => {
        setDisplayedText('')
        setCurrentIndex(0)
      }, pauseDuration)
      
      return () => {
        clearTimeout(taglineTimer)
        clearTimeout(hideTaglineTimer)
        clearTimeout(restartTimer)
      }
    }
  }, [currentIndex])

  return (
    <section id="home" className="min-h-screen flex items-center justify-center bg-black overflow-x-hidden">
      <div className="text-center px-4 sm:px-0 w-full">
        <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif', fontVariant: 'normal', textRendering: 'optimizeLegibility', fontFeatureSettings: '"kern" 1, "liga" 1' }}>
          {displayedText}
          <span className="animate-blink text-purple-700">|</span>
        </h1>
        <p 
          className={`text-sm sm:text-base md:text-lg lg:text-xl text-gray-400 transition-opacity duration-1000 ${
            showTagline ? 'opacity-100' : 'opacity-0'
          }`}
        >
          audio, music, culture, technology.
        </p>
      </div>
    </section>
  )
}

