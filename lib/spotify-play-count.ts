import {
  loadLastSpotifyMusicStats,
  loadStoredMusicStats,
  saveMusicStats,
} from './music-stats-store'
import {
  formatPlayCount,
  MUSIC_TRACKS,
  type MusicStatsSnapshot,
  type MusicTrack,
} from './music-tracks'

export type { MusicStatsSnapshot } from './music-tracks'

const PATHFINDER_ARTIST_HASH = 'd66221ea13998b2f81883c5187d174c8646e4041d67f5b1e103bc262d447e3a0'
const WEB_PLAYER_TOKEN_URL =
  'https://open.spotify.com/get_access_token?reason=transport&productType=web_player'

export interface TrackPlayStats {
  slug: string
  plays: number
  playsFormatted: string
}

async function getSpotifyClientCredentialsToken(): Promise<string | null> {
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
  if (!clientId || !clientSecret) return null

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
    cache: 'no-store',
  })

  if (!response.ok) {
    console.error('Spotify client credentials failed:', response.status)
    return null
  }

  const data = (await response.json()) as { access_token?: string }
  return data.access_token ?? null
}

async function getArtistIdForTrack(
  apiToken: string,
  trackId: string
): Promise<string | null> {
  const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
    headers: { Authorization: `Bearer ${apiToken}` },
    cache: 'no-store',
  })

  if (!response.ok) {
    console.error('Spotify track lookup failed:', trackId, response.status)
    return null
  }

  const data = (await response.json()) as {
    artists?: { id?: string }[]
  }

  return data.artists?.[0]?.id ?? null
}

async function getWebPlayerAccessToken(): Promise<string | null> {
  const response = await fetch(WEB_PLAYER_TOKEN_URL, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Accept: 'application/json',
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    console.error('Spotify web player token failed:', response.status)
    return null
  }

  const data = (await response.json()) as { accessToken?: string }
  return data.accessToken ?? null
}

function extractPlaycountsFromPayload(
  payload: unknown,
  trackIds: string[]
): Map<string, number> {
  const results = new Map<string, number>()
  const remaining = new Set(trackIds)

  const visit = (node: unknown): void => {
    if (!node || typeof node !== 'object' || remaining.size === 0) return

    if (Array.isArray(node)) {
      for (const item of node) visit(item)
      return
    }

    const record = node as Record<string, unknown>
    const uri =
      typeof record.uri === 'string'
        ? record.uri
        : typeof record.id === 'string' && record.id.length === 22
          ? `spotify:track:${record.id}`
          : null

    const playcount =
      typeof record.playcount === 'number'
        ? record.playcount
        : typeof record.playCount === 'number'
          ? record.playCount
          : null

    if (uri && playcount !== null) {
      for (const trackId of Array.from(remaining)) {
        if (uri.includes(trackId)) {
          results.set(trackId, playcount)
          remaining.delete(trackId)
        }
      }
    }

    for (const value of Object.values(record)) {
      if (value && typeof value === 'object') visit(value)
    }
  }

  visit(payload)
  return results
}

async function fetchPlaycountsViaPathfinder(
  artistId: string,
  trackIds: string[]
): Promise<Map<string, number>> {
  const token = await getWebPlayerAccessToken()
  if (!token) return new Map()

  const params = new URLSearchParams({
    operationName: 'queryArtistOverview',
    variables: JSON.stringify({ uri: `spotify:artist:${artistId}` }),
    extensions: JSON.stringify({
      persistedQuery: { version: 1, sha256Hash: PATHFINDER_ARTIST_HASH },
    }),
  })

  const response = await fetch(
    `https://api-partner.spotify.com/pathfinder/v1/query?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'App-Platform': 'WebPlayer',
        'spotify-app-version': '1.2.63.359.g1d9ded22',
      },
      cache: 'no-store',
    }
  )

  if (!response.ok) {
    console.error('Spotify pathfinder failed:', response.status)
    return new Map()
  }

  const payload = await response.json()
  return extractPlaycountsFromPayload(payload, trackIds)
}

async function fetchPlaycountsViaApify(
  tracks: MusicTrack[]
): Promise<Map<string, number>> {
  const token = process.env.APIFY_API_TOKEN
  if (!token) return new Map()

  const actorId = 'beatanalytics~spotify-play-count-scraper'
  const startResponse = await fetch(
    `https://api.apify.com/v2/acts/${actorId}/runs?token=${token}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        urls: tracks.map((t) => t.spotifyUrl),
      }),
      cache: 'no-store',
    }
  )

  if (!startResponse.ok) {
    console.error('Apify actor start failed:', startResponse.status)
    return new Map()
  }

  const started = (await startResponse.json()) as {
    data?: { id?: string; defaultDatasetId?: string }
  }
  const runId = started.data?.id
  if (!runId) return new Map()

  let datasetId = started.data?.defaultDatasetId
  for (let attempt = 0; attempt < 30; attempt++) {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    const statusResponse = await fetch(
      `https://api.apify.com/v2/actor-runs/${runId}?token=${token}`,
      { cache: 'no-store' }
    )
    if (!statusResponse.ok) continue

    const statusData = (await statusResponse.json()) as {
      data?: { status?: string; defaultDatasetId?: string }
    }
    datasetId = statusData.data?.defaultDatasetId ?? datasetId
    if (statusData.data?.status === 'SUCCEEDED') break
    if (statusData.data?.status === 'FAILED') return new Map()
  }

  if (!datasetId) return new Map()

  const itemsResponse = await fetch(
    `https://api.apify.com/v2/datasets/${datasetId}/items?token=${token}&clean=true`,
    { cache: 'no-store' }
  )
  if (!itemsResponse.ok) return new Map()

  const items = (await itemsResponse.json()) as Record<string, unknown>[]
  const results = new Map<string, number>()

  for (const item of items) {
    const url = typeof item.url === 'string' ? item.url : ''
    const playcount =
      typeof item.playcount === 'number'
        ? item.playcount
        : typeof item.playCount === 'number'
          ? item.playCount
          : typeof item.streams === 'number'
            ? item.streams
            : null

    if (!url || playcount === null) continue

    for (const track of tracks) {
      if (url.includes(track.spotifyTrackId)) {
        results.set(track.spotifyTrackId, playcount)
      }
    }
  }

  return results
}

/** Use last saved Spotify sync; otherwise whatever is in music-stats.json. */
export async function loadFallbackMusicStats(): Promise<MusicStatsSnapshot> {
  const lastSpotify = await loadLastSpotifyMusicStats()
  if (lastSpotify) return lastSpotify

  const stored = await loadStoredMusicStats()
  if (stored) return stored

  return {
    updatedAt: new Date(0).toISOString(),
    source: 'fallback',
    tracks: {},
  }
}

function mergeWithStoredTracks(
  snapshot: MusicStatsSnapshot,
  stored: MusicStatsSnapshot | null
): MusicStatsSnapshot {
  if (!stored) return snapshot

  for (const track of MUSIC_TRACKS) {
    if (!snapshot.tracks[track.slug] && stored.tracks[track.slug]) {
      snapshot.tracks[track.slug] = stored.tracks[track.slug]
    }
  }
  return snapshot
}

export async function syncSpotifyPlayCounts(): Promise<MusicStatsSnapshot> {
  const trackIds = MUSIC_TRACKS.map((t) => t.spotifyTrackId)
  let playcounts = new Map<string, number>()
  let source: MusicStatsSnapshot['source'] = 'spotify-pathfinder'

  const apiToken = await getSpotifyClientCredentialsToken()
  if (apiToken) {
    const artistId = await getArtistIdForTrack(apiToken, trackIds[0])
    if (artistId) {
      playcounts = await fetchPlaycountsViaPathfinder(artistId, trackIds)
    }
  }

  if (playcounts.size < trackIds.length) {
    const apifyCounts = await fetchPlaycountsViaApify(MUSIC_TRACKS)
    Array.from(apifyCounts.entries()).forEach(([trackId, count]) => {
      if (!playcounts.has(trackId)) playcounts.set(trackId, count)
    })
    if (apifyCounts.size > playcounts.size) source = 'apify'
  }

  if (playcounts.size === 0) {
    const fallback = await loadFallbackMusicStats()
    return fallback
  }

  const tracks: MusicStatsSnapshot['tracks'] = {}
  for (const track of MUSIC_TRACKS) {
    const plays = playcounts.get(track.spotifyTrackId)
    if (plays === undefined) continue
    tracks[track.slug] = {
      plays,
      playsFormatted: formatPlayCount(plays),
    }
  }

  if (Object.keys(tracks).length === 0) {
    return loadFallbackMusicStats()
  }

  const stored = await loadStoredMusicStats()
  const snapshot: MusicStatsSnapshot = {
    updatedAt: new Date().toISOString(),
    source,
    tracks,
  }

  mergeWithStoredTracks(snapshot, stored)

  await saveMusicStats(snapshot)
  return snapshot
}
