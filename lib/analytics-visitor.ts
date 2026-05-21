const VISITOR_STORAGE_KEY = 'oluwatimilehin_visitor_id'

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

/** Anonymous ID persisted in the browser — use to group events from the same visitor. */
export function getVisitorId(): string | null {
  if (typeof window === 'undefined') return null

  try {
    const existing = localStorage.getItem(VISITOR_STORAGE_KEY)
    if (existing && UUID_RE.test(existing)) {
      return existing
    }

    const id = crypto.randomUUID()
    localStorage.setItem(VISITOR_STORAGE_KEY, id)
    return id
  } catch {
    return null
  }
}
