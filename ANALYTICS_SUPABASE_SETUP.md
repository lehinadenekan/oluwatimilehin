# Analytics: Google Analytics + Supabase

Click and interaction events are sent to **both** Google Analytics 4 (when configured) and your Supabase `analytics_events` table (when configured). GA is optional for storage; Supabase is optional for GA — each works independently.

## 1. Run the database migration

In the [Supabase Dashboard](https://supabase.com/dashboard) → **SQL Editor**, run:

1. `supabase/migrations/20260521000000_analytics_events.sql` (create table)
2. `supabase/migrations/20260522000000_analytics_events_visitor.sql` (add `visitor_id`)
3. `supabase/migrations/20260523000000_drop_ip_address.sql` (drop `ip_address` if you added it earlier)

Or link the CLI and run `supabase db push` if you use local Supabase for this project.

Recommended: create a **dedicated Supabase project** for oluwatimilehin.com (separate from Yorùbá Deck / other apps).

## 2. Environment variables (Vercel)

| Variable | Where to find it | Required for |
|----------|------------------|--------------|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | GA4 → Admin → Data Streams → Measurement ID | Google Analytics |
| `SUPABASE_URL` | Project Settings → API → Project URL | Supabase storage |
| `SUPABASE_SERVICE_ROLE_KEY` | Project Settings → API → `service_role` (secret) | Supabase storage |

Add all three in Vercel → **Settings** → **Environment Variables**, then redeploy.

**Security:** Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser. Inserts go through `POST /api/analytics/track` on the server only.

## 3. What gets tracked

| Area | Events (examples) |
|------|-------------------|
| Homepage | `music` / `audio` / `tech` arm clicks, scroll cue, music panel view |
| Music | Panel view when music tab opens |
| Audio | Video play, BBC Sounds link |
| Tech | Case study link, Visit Yorùbá Deck |
| Contact | Form submit/success/error, Calendly widget + scheduled booking |
| Case study | Nav anchors, CTAs, TikTok profile link, carousel prev/next/dot/enlarge/close |
| Portfolio gate | Password success, logout, image enlarge |

## 4. Query events in Supabase

### Recent events

```sql
select created_at, event_name, event_category, label, page_path,
       visitor_id, metadata
from analytics_events
order by created_at desc
limit 100;
```

### Unique visitors vs repeat activity

**`visitor_id`** — anonymous UUID stored in the visitor’s browser (`localStorage`). Same ID across clicks = same person on that device until they clear site data.

```sql
-- How many distinct visitors today?
select count(distinct visitor_id) as unique_visitors,
       count(*) as total_events
from analytics_events
where created_at >= current_date;
```

```sql
-- Events grouped by visitor (who clicked what)
select visitor_id,
       count(*) as events,
       min(created_at) as first_seen,
       max(created_at) as last_seen,
       array_agg(distinct event_category) as categories
from analytics_events
where visitor_id is not null
group by visitor_id
order by last_seen desc;
```

Filter by category:

```sql
select * from analytics_events
where event_category = 'Portfolio'
order by created_at desc;
```

## 5. How it works in code

- Client: `trackInteraction()` / `trackEvent.*` in `lib/analytics.ts`
- API: `app/api/analytics/track/route.ts` inserts with the service role
- Admin client: `lib/supabase/admin.ts`

To add a new event:

```ts
import { trackInteraction } from '@/lib/analytics'

trackInteraction({
  action: 'click',
  category: 'My Feature',
  label: 'button_name',
  metadata: { extra: 'data' },
})
```

## 6. Verify

1. Set env vars locally in `.env.local` (do not commit).
2. `npm run dev` → click a few links.
3. GA: **Realtime** in Google Analytics.
4. Supabase: run the SQL query above — new rows should appear within seconds.

If Supabase is not configured, the API returns `503` with `not_configured`; the site still works and GA still fires when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set.
