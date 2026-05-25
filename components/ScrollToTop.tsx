'use client'

import { useCallback, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { trackEvent } from '@/lib/analytics'
import styles from './ScrollToTop.module.css'

const SCROLL_THRESHOLD_PX = 480

function getScrollThreshold(): number {
  if (typeof window === 'undefined') return SCROLL_THRESHOLD_PX
  return Math.max(SCROLL_THRESHOLD_PX, window.innerHeight * 0.35)
}

function isModalOpen(): boolean {
  return Boolean(document.querySelector('[aria-modal="true"]'))
}

export default function ScrollToTop() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)

  const updateVisibility = useCallback(() => {
    if (isModalOpen()) {
      setVisible(false)
      return
    }
    setVisible(window.scrollY > getScrollThreshold())
  }, [])

  useEffect(() => {
    updateVisibility()

    window.addEventListener('scroll', updateVisibility, { passive: true })
    window.addEventListener('resize', updateVisibility)

    const observer = new MutationObserver(updateVisibility)
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['aria-modal'],
    })

    return () => {
      window.removeEventListener('scroll', updateVisibility)
      window.removeEventListener('resize', updateVisibility)
      observer.disconnect()
    }
  }, [updateVisibility, pathname])

  const scrollToTop = () => {
    trackEvent.scrollToTop(pathname)

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    })
  }

  return (
    <button
      type="button"
      className={`${styles.button} ${visible ? styles.buttonVisible : ''}`}
      onClick={scrollToTop}
      aria-label="Scroll back to top"
      title="Back to top"
    >
      ↑
    </button>
  )
}
