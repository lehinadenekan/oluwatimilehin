import { readFile, writeFile } from 'fs/promises'
import path from 'path'
import type { MusicStatsSnapshot } from './music-tracks'

const STATS_FILE = path.join(process.cwd(), 'data', 'music-stats.json')
const BLOB_PATHNAME = 'music-stats.json'

function isSpotifySyncedSource(source: MusicStatsSnapshot['source']): boolean {
  return source === 'spotify-pathfinder' || source === 'apify'
}

/** Persist last successful stats (local JSON + optional Vercel Blob on production). */
export async function saveMusicStats(snapshot: MusicStatsSnapshot): Promise<void> {
  const body = `${JSON.stringify(snapshot, null, 2)}\n`

  try {
    await writeFile(STATS_FILE, body, 'utf8')
  } catch (error) {
    console.warn('Could not write data/music-stats.json:', error)
  }

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { put } = await import('@vercel/blob')
      await put(BLOB_PATHNAME, body, {
        access: 'public',
        addRandomSuffix: false,
      })
    } catch (error) {
      console.warn('Could not write music stats to Vercel Blob:', error)
    }
  }
}

/** Load last stored stats (Blob on Vercel, then local JSON). */
export async function loadStoredMusicStats(): Promise<MusicStatsSnapshot | null> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { list } = await import('@vercel/blob')
      const { blobs } = await list({ prefix: BLOB_PATHNAME, limit: 1 })
      const url = blobs[0]?.downloadUrl ?? blobs[0]?.url
      if (url) {
        const response = await fetch(url, { cache: 'no-store' })
        if (response.ok) {
          return (await response.json()) as MusicStatsSnapshot
        }
      }
    } catch (error) {
      console.warn('Could not read music stats from Vercel Blob:', error)
    }
  }

  try {
    const raw = await readFile(STATS_FILE, 'utf8')
    return JSON.parse(raw) as MusicStatsSnapshot
  } catch {
    return null
  }
}

/** Last successful Spotify sync, or null if none saved yet. */
export async function loadLastSpotifyMusicStats(): Promise<MusicStatsSnapshot | null> {
  const stored = await loadStoredMusicStats()
  if (!stored || !isSpotifySyncedSource(stored.source)) return null
  return stored
}
