import { unstable_cache } from 'next/cache'
import { NextResponse } from 'next/server'
import { syncSpotifyPlayCounts } from '@/lib/spotify-play-count'

const getCachedMusicStats = unstable_cache(
  async () => syncSpotifyPlayCounts(),
  ['music-stats'],
  { revalidate: 86400, tags: ['music-stats'] }
)

export async function GET() {
  try {
    const stats = await getCachedMusicStats()
    return NextResponse.json(stats, {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
      },
    })
  } catch (error) {
    console.error('Music stats API error:', error)
    return NextResponse.json({ error: 'Failed to load music stats' }, { status: 500 })
  }
}
