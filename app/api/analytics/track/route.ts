import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin, isSupabaseAnalyticsConfigured } from '@/lib/supabase/admin'

const MAX_LABEL_LENGTH = 500
const MAX_PATH_LENGTH = 2048
const MAX_METADATA_KEYS = 32

type TrackBody = {
  event_name?: string
  event_category?: string
  label?: string
  page_path?: string
  referrer?: string
  visitor_id?: string
  metadata?: Record<string, unknown>
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function parseVisitorId(value: unknown): string | null {
  const id = trimString(value, 36)
  if (!id || !UUID_RE.test(id)) return null
  return id
}

function trimString(value: unknown, max: number): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  if (!trimmed) return null
  return trimmed.slice(0, max)
}

function sanitizeMetadata(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {}
  }

  const entries = Object.entries(value as Record<string, unknown>).slice(0, MAX_METADATA_KEYS)
  const out: Record<string, unknown> = {}

  for (const [key, val] of entries) {
    if (typeof key !== 'string' || key.length > 64) continue
    if (
      typeof val === 'string' ||
      typeof val === 'number' ||
      typeof val === 'boolean' ||
      val === null
    ) {
      out[key] = typeof val === 'string' ? val.slice(0, 500) : val
    }
  }

  return out
}

export async function POST(request: NextRequest) {
  if (!isSupabaseAnalyticsConfigured()) {
    return NextResponse.json({ ok: false, stored: false, reason: 'not_configured' }, { status: 503 })
  }

  let body: TrackBody
  try {
    body = (await request.json()) as TrackBody
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const event_name = trimString(body.event_name, 120)
  const event_category = trimString(body.event_category, 120)

  if (!event_name || !event_category) {
    return NextResponse.json({ error: 'event_name and event_category are required' }, { status: 400 })
  }

  const supabase = getSupabaseAdmin()
  if (!supabase) {
    return NextResponse.json({ ok: false, stored: false, reason: 'not_configured' }, { status: 503 })
  }

  const userAgent = request.headers.get('user-agent')
  const referrer =
    trimString(body.referrer, MAX_PATH_LENGTH) ??
    trimString(request.headers.get('referer'), MAX_PATH_LENGTH)

  const { error } = await supabase.from('analytics_events').insert({
    event_name,
    event_category,
    label: trimString(body.label, MAX_LABEL_LENGTH),
    page_path: trimString(body.page_path, MAX_PATH_LENGTH),
    referrer,
    user_agent: userAgent ? userAgent.slice(0, 512) : null,
    visitor_id: parseVisitorId(body.visitor_id),
    metadata: sanitizeMetadata(body.metadata),
  })

  if (error) {
    console.error('analytics_events insert failed:', error.message)
    return NextResponse.json({ error: 'Failed to store event' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, stored: true })
}
