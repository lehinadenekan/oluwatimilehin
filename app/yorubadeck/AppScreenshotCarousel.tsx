'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { trackEvent } from '@/lib/analytics'
import styles from './yoruba-deck.module.css'

const APP_SCREENSHOTS = [
  {
    src: '/images/yoruba-deck/screen-01-setup.png',
    alt: 'Yorùbá Deck iOS app — Set up your Yorùbá keyboard onboarding',
  },
  {
    src: '/images/yoruba-deck/screen-02-add-keyboard.png',
    alt: 'Yorùbá Deck iOS app — Add keyboard setup walkthrough',
  },
  {
    src: '/images/yoruba-deck/screen-03-youre-all-set.png',
    alt: 'Yorùbá Deck iOS app — Setup complete, switch keyboards with the globe key',
  },
  {
    src: '/images/yoruba-deck/screen-04-keyboard-themes.png',
    alt: 'Yorùbá Deck iOS app — Keyboard themes selection',
  },
  {
    src: '/images/yoruba-deck/screen-05-settings.png',
    alt: 'Yorùbá Deck iOS app — Keyboard settings and behaviour',
  },
  {
    src: '/images/yoruba-deck/screen-06-keyboard-features-1.png',
    alt: 'Yorùbá Deck iOS app — Full Yorùbá character set and tonal marks',
  },
  {
    src: '/images/yoruba-deck/screen-07-keyboard-features-2.png',
    alt: 'Yorùbá Deck iOS app — Personal dictionary and Yorùbá-only layout',
  },
] as const

export default function AppScreenshotCarousel() {
  const [index, setIndex] = useState(0)
  const [modalIndex, setModalIndex] = useState<number | null>(null)
  const total = APP_SCREENSHOTS.length

  const goTo = useCallback(
    (next: number) => {
      setIndex((next + total) % total)
    },
    [total]
  )

  const goPrev = useCallback(() => {
    trackEvent.carousel('prev', index)
    goTo(index - 1)
  }, [goTo, index])

  const goNext = useCallback(() => {
    trackEvent.carousel('next', index)
    goTo(index + 1)
  }, [goTo, index])

  useEffect(() => {
    if (modalIndex === null) return

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModalIndex(null)
      if (e.key === 'ArrowLeft') {
        setModalIndex((i) => {
          const next = i === null ? null : (i - 1 + total) % total
          if (next !== null) setIndex(next)
          return next
        })
      }
      if (e.key === 'ArrowRight') {
        setModalIndex((i) => {
          const next = i === null ? null : (i + 1) % total
          if (next !== null) setIndex(next)
          return next
        })
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKey)
    }
  }, [modalIndex, total])

  const current = APP_SCREENSHOTS[index]

  return (
    <>
      <div className={styles.carousel}>
        <button
          type="button"
          className={styles.carouselNav}
          onClick={goPrev}
          aria-label="Previous screenshot"
        >
          ←
        </button>

        <div className={styles.carouselMain}>
          <div className={styles.carouselPhoneFrame}>
            <button
              type="button"
              className={styles.carouselSlideBtn}
              onClick={() => {
                trackEvent.carousel('enlarge', index)
                setModalIndex(index)
                setIndex(index)
              }}
              aria-label={`Enlarge screenshot ${index + 1} of ${total}`}
            >
              <Image
                src={current.src}
                alt={current.alt}
                width={280}
                height={560}
                className={styles.carouselImage}
                priority={index === 0}
              />
            </button>
          </div>
          <p className={styles.carouselCaption}>
            {index + 1} / {total} · Tap to enlarge
          </p>
          <div className={styles.carouselDots} role="tablist" aria-label="Screenshot navigation">
            {APP_SCREENSHOTS.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Screenshot ${i + 1}`}
                className={`${styles.carouselDot} ${i === index ? styles.carouselDotActive : ''}`}
                onClick={() => {
                  trackEvent.carousel('dot', i)
                  setIndex(i)
                }}
              />
            ))}
          </div>
        </div>

        <button
          type="button"
          className={styles.carouselNav}
          onClick={goNext}
          aria-label="Next screenshot"
        >
          →
        </button>
      </div>

      {modalIndex !== null && (
        <div
          className={styles.carouselModal}
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged app screenshot"
          onClick={() => {
            trackEvent.carousel('close', modalIndex ?? undefined)
            setModalIndex(null)
          }}
        >
          <button
            type="button"
            className={styles.carouselModalClose}
            onClick={() => {
              trackEvent.carousel('close', modalIndex ?? undefined)
              setModalIndex(null)
            }}
            aria-label="Close"
          >
            ×
          </button>
          <button
            type="button"
            className={`${styles.carouselModalNav} ${styles.carouselModalNavLeft}`}
            onClick={(e) => {
              e.stopPropagation()
              setModalIndex((i) => {
                const next = i === null ? 0 : (i - 1 + total) % total
                setIndex(next)
                return next
              })
            }}
            aria-label="Previous screenshot"
          >
            ←
          </button>
          <div
            className={styles.carouselModalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.carouselModalPhoneFrame}>
              <Image
                src={APP_SCREENSHOTS[modalIndex].src}
                alt={APP_SCREENSHOTS[modalIndex].alt}
                width={390}
                height={780}
                className={styles.carouselModalImage}
              />
            </div>
            <p className={styles.carouselModalCaption}>
              {modalIndex + 1} / {total}
            </p>
          </div>
          <button
            type="button"
            className={`${styles.carouselModalNav} ${styles.carouselModalNavRight}`}
            onClick={(e) => {
              e.stopPropagation()
              setModalIndex((i) => {
                const next = i === null ? 0 : (i + 1) % total
                setIndex(next)
                return next
              })
            }}
            aria-label="Next screenshot"
          >
            →
          </button>
        </div>
      )}
    </>
  )
}
