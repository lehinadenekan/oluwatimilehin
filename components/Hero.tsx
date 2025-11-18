'use client'

import { useState, useEffect } from 'react'

const text = "olúwatìmílẹ́hìn"
const typingSpeed = 100 // milliseconds per character
const pauseDuration = 4000 // 4 seconds pause before restart

export default function Hero() {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      // Typing phase
      const timer = setTimeout(() => {
        setDisplayedText(text.slice(0, currentIndex + 1))
        setCurrentIndex(currentIndex + 1)
      }, typingSpeed)
      return () => clearTimeout(timer)
    } else {
      // Finished typing, wait 4 seconds then restart
      const timer = setTimeout(() => {
        setDisplayedText('')
        setCurrentIndex(0)
      }, pauseDuration)
      return () => clearTimeout(timer)
    }
  }, [currentIndex])

  return (
    <section id="home" className="min-h-screen flex items-center justify-center bg-black overflow-x-hidden">
      <div className="text-center px-4 sm:px-0 w-full">
        <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif', fontVariant: 'normal', textRendering: 'optimizeLegibility', fontFeatureSettings: '"kern" 1, "liga" 1' }}>
          {displayedText}
          <span className="animate-blink text-purple-500">|</span>
        </h1>
      </div>
    </section>
  )
}

