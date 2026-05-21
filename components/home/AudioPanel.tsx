'use client'

import { useRef, useEffect } from 'react'
import { trackEvent } from '@/lib/analytics'
import styles from './home.module.css'

export default function AudioPanel() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handlePlay = () => {
      trackEvent.videoPlay('Chanel x Vogue Magazine')
    }

    video.addEventListener('play', handlePlay)
    return () => video.removeEventListener('play', handlePlay)
  }, [])

  return (
    <div className={styles.grid}>
      <div className={styles.card}>
        <span className={styles.cardMeta}>Commercial · Sound design</span>
        <h3 className={styles.cardTitle}>Chanel x Vogue Magazine</h3>
        <p className={styles.cardBody}>
          Soundtrack composition and sound design for a collaborative luxury fashion commercial.
        </p>
        <div className={styles.mediaWrap}>
          <video
            ref={videoRef}
            controls
            poster="/videos/chanel-vogue-magazine-poster.jpg"
            preload="metadata"
            playsInline
          >
            <source src="/videos/chanel-vogue-magazine-sound-design.webm" type="video/webm" />
            <source src="/videos/chanel-vogue-magazine-sound-design-original.mp4" type="video/mp4" />
            <source src="/videos/chanel-vogue-magazine-sound-design-copy.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      <div className={styles.card}>
        <span className={styles.cardMeta}>Podcast · BBC Sounds</span>
        <h3 className={styles.cardTitle}>BBC Podcast Production</h3>
        <p className={styles.cardBody}>
          Field recording and audio editing for BBC podcast series &quot;The Reset&quot; by Jade Scott.
        </p>
        <div className={styles.mediaWrap}>
          <img
            src="/images/bbc-podcast-the-reset.webp"
            alt="BBC Podcast The Reset"
          />
        </div>
        <div style={{ marginTop: '1.25rem' }}>
          <a
            href="https://www.bbc.co.uk/sounds/play/p0cw9yfk"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent.externalLink('https://www.bbc.co.uk/sounds/play/p0cw9yfk', 'BBC Sounds')}
            className={styles.btnPrimary}
          >
            Listen on BBC Sounds
          </a>
        </div>
      </div>
    </div>
  )
}
