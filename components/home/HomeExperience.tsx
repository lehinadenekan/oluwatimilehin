'use client'

import { useState, useEffect } from 'react'
import { trackEvent } from '@/lib/analytics'
import styles from './home.module.css'
import MusicPanel from './MusicPanel'
import AudioPanel from './AudioPanel'
import TechPanel from './TechPanel'

const typewriterText = 'olúwatìmílẹ́hìn'
const typingSpeed = 90
const pauseDuration = 4000

type Arm = 'music' | 'audio' | 'tech'

const arms: { id: Arm; label: string }[] = [
  { id: 'music', label: 'music' },
  { id: 'audio', label: 'audio' },
  { id: 'tech', label: 'tech' },
]

export default function HomeExperience() {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [activeArm, setActiveArm] = useState<Arm | null>(null)

  useEffect(() => {
    if (currentIndex < typewriterText.length) {
      const timer = setTimeout(() => {
        setDisplayedText(typewriterText.slice(0, currentIndex + 1))
        setCurrentIndex(currentIndex + 1)
      }, typingSpeed)
      return () => clearTimeout(timer)
    }

    const restartTimer = setTimeout(() => {
      setDisplayedText('')
      setCurrentIndex(0)
    }, pauseDuration)

    return () => clearTimeout(restartTimer)
  }, [currentIndex])

  const handleArmClick = (arm: Arm) => {
    trackEvent.portfolioArm(arm)
    setActiveArm(arm)
    requestAnimationFrame(() => {
      const panel = document.getElementById('work-panel')
      panel?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    })
  }

  return (
    <div className={styles.site}>
      <section id="home" className={styles.hero}>
        <h1 className={styles.heroTitle}>
          {displayedText}
          <span className={styles.cursor}>|</span>
        </h1>
        <div className="sr-only">
          <p>
            olúwatìmílẹ́hìn — Professional audio production, music production, web design, and
            creative technology. Yoruba language expert.
          </p>
        </div>
        <a
          href="#work"
          className={styles.scrollCue}
          onClick={() => trackEvent.scrollCue()}
        >
          Scroll
        </a>
      </section>

      <section id="work" className={styles.hub}>
        <nav className={styles.arms} aria-label="Portfolio categories">
          {arms.map((arm, index) => (
            <span key={arm.id} style={{ display: 'contents' }}>
              {index > 0 && <span className={styles.armSep} aria-hidden="true">·</span>}
              <button
                type="button"
                className={`${styles.armBtn} ${activeArm === arm.id ? styles.armActive : ''}`}
                onClick={() => handleArmClick(arm.id)}
                aria-pressed={activeArm === arm.id}
              >
                {arm.label}
              </button>
            </span>
          ))}
        </nav>

        <div id="work-panel" className={styles.panel}>
          {activeArm === null && (
            <p className={styles.panelHint}>Select music, audio, or tech</p>
          )}
          {activeArm === 'music' && <MusicPanel />}
          {activeArm === 'audio' && <AudioPanel />}
          {activeArm === 'tech' && <TechPanel />}
        </div>
      </section>
    </div>
  )
}
