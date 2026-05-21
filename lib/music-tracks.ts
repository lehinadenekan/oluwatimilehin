export interface MusicTrack {
  slug: string
  title: string
  credits: string
  spotifyTrackId: string
  spotifyUrl: string
}

export const MUSIC_TRACKS: MusicTrack[] = [
  {
    slug: 'nothin-like',
    title: "Nothin' Like",
    credits: 'Oluwatimilehin Adenekan, Thomas Strike, Finlay Green',
    spotifyTrackId: '3JnpP0izcjNtopwxWJJN6Y',
    spotifyUrl: 'https://open.spotify.com/track/3JnpP0izcjNtopwxWJJN6Y',
  },
  {
    slug: 'road-to-damascus',
    title: 'Road to Damascus',
    credits: 'Oluwatimilehin Adenekan, Thomas Strike, Finlay Green, Olivia McShane',
    spotifyTrackId: '3Fn053srWfUf7aTIryw6Ib',
    spotifyUrl: 'https://open.spotify.com/track/3Fn053srWfUf7aTIryw6Ib',
  },
]

export function formatPlayCount(count: number): string {
  return count.toLocaleString('en-GB')
}

export interface MusicStatsSnapshot {
  updatedAt: string
  source: 'spotify-pathfinder' | 'apify' | 'fallback'
  tracks: Record<string, { plays: number; playsFormatted: string }>
}
