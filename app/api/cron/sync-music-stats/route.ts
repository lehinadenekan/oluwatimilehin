import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'
import { syncSpotifyPlayCounts } from '@/lib/spotify-play-count'

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    revalidateTag('music-stats')
    const stats = await syncSpotifyPlayCounts()
    return NextResponse.json({
      ok: true,
      updatedAt: stats.updatedAt,
      source: stats.source,
      tracks: stats.tracks,
    })
  } catch (error) {
    console.error('Music stats cron error:', error)
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 })
  }
}
