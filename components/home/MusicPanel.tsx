'use client'

import { useEffect, useState } from 'react'
import { MUSIC_TRACKS } from '@/lib/music-tracks'
import { trackEvent } from '@/lib/analytics'
import styles from './home.module.css'

const FALLBACK_PLAYS: Record<string, string> = {
  'nothin-like': '923,456',
  'road-to-damascus': '156,904',
}

interface SongCardProps {
  title: string
  credits: string
  plays: string
  spotifyUrl: string
}

function SongCard({ title, credits, plays, spotifyUrl }: SongCardProps) {
  const trackId = spotifyUrl.split('/track/')[1]?.split('?')[0]

  return (
    <div className={styles.card}>
      <span className={styles.cardMeta}>{plays} plays · Spotify</span>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardCredits}>{credits}</p>
      {trackId && (
        <div className={styles.embedWrap}>
          <iframe
            src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`}
            width="100%"
            height="152"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title={title}
          />
        </div>
      )}
    </div>
  )
}

export default function MusicPanel() {
  const [playsBySlug, setPlaysBySlug] = useState<Record<string, string>>(FALLBACK_PLAYS)

  useEffect(() => {
    trackEvent.musicPanelView()
  }, [])

  useEffect(() => {
    let cancelled = false

    async function loadStats() {
      try {
        const response = await fetch('/api/music/stats')
        if (!response.ok) return
        const data = (await response.json()) as {
          tracks?: Record<string, { playsFormatted?: string }>
        }
        if (cancelled || !data.tracks) return

        const next: Record<string, string> = { ...FALLBACK_PLAYS }
        for (const track of MUSIC_TRACKS) {
          const formatted = data.tracks[track.slug]?.playsFormatted
          if (formatted) next[track.slug] = formatted
        }
        setPlaysBySlug(next)
      } catch {
        // Keep fallback values
      }
    }

    loadStats()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className={styles.grid}>
      {MUSIC_TRACKS.map((track) => (
        <SongCard
          key={track.slug}
          title={track.title}
          credits={track.credits}
          plays={playsBySlug[track.slug] ?? FALLBACK_PLAYS[track.slug]}
          spotifyUrl={track.spotifyUrl}
        />
      ))}
    </div>
  )
}
