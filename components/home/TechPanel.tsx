'use client'

import Image from 'next/image'
import Link from 'next/link'
import { trackEvent } from '@/lib/analytics'
import styles from './home.module.css'

export default function TechPanel() {
  return (
    <div className={styles.techCard}>
      <div className={styles.techLogoWrap}>
        <Image
          src="/images/yoruba-deck-logo.png"
          alt="Yorùbá Deck logo"
          width={160}
          height={160}
          className={styles.techLogo}
          priority
        />
      </div>
      <span className={styles.techEyebrow}>Creative technology</span>
      <h3 className={styles.cardTitle}>Yorùbá Deck</h3>
      <p className={styles.cardBody}>
        Conceived, developed, and manage the continuous growth of a Yorùbá language platform
        including a dictionary, word game, and mobile application.
      </p>
      <div className={styles.ctaRow}>
        <Link
          href="/yorubadeck"
          className={styles.btnPrimaryLight}
          onClick={() => trackEvent.buttonClick('Read the case study', 'tech_panel')}
        >
          Read the case study
        </Link>
        <a
          href="https://www.yorubadeck.com"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.btnOutlineLight}
          onClick={() =>
            trackEvent.externalLink('https://www.yorubadeck.com', 'Visit Yorùbá Deck')
          }
        >
          Visit Yorùbá Deck
        </a>
      </div>
    </div>
  )
}
