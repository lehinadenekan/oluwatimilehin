# Spotify play count auto-sync

The site refreshes Lehin track play counts once per day and shows them on the **music** panel.

## How it works

1. **Daily cron** (06:00 UTC) calls `/api/cron/sync-music-stats` on Vercel.
2. Sync uses Spotify’s **Pathfinder** API (same data as the Spotify web player) to read play counts for your tracks.
3. Results are **cached for 24 hours** via Next.js (`/api/music/stats`).
4. Each successful sync **overwrites** the last recorded values in `data/music-stats.json` (and in Vercel Blob on production).
5. If a daily sync fails, the site shows the **last successful Spotify sync** from that JSON — not stale manual numbers.

> Spotify’s official Web API does **not** expose stream/play counts. Pathfinder is an undocumented partner API used by the web player; it can change without notice. An optional **Apify** scraper is supported as backup.

## Required setup (Vercel)

### 1. Spotify Developer app (free)

1. Open [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
2. Create an app.
3. Copy **Client ID** and **Client Secret**.

Add to Vercel → Project → Settings → Environment Variables:

| Variable | Value |
|----------|--------|
| `SPOTIFY_CLIENT_ID` | Your client ID |
| `SPOTIFY_CLIENT_SECRET` | Your client secret |

These are used only to resolve the artist ID from your track IDs (Client Credentials flow). They are not exposed to the browser.

### 2. Cron secret (recommended)

Vercel sends `Authorization: Bearer <CRON_SECRET>` when invoking cron routes.

| Variable | Value |
|----------|--------|
| `CRON_SECRET` | A long random string (generate with `openssl rand -hex 32`) |

Add the same value in Vercel. The cron route rejects requests without it.

### 3. Vercel Blob (production persistence)

On Vercel the app filesystem is read-only, so successful syncs are also saved to **Vercel Blob** (same JSON shape as `data/music-stats.json`).

1. In the Vercel project, go to **Storage** → create a **Blob** store (or connect an existing one).
2. Vercel adds `BLOB_READ_WRITE_TOKEN` automatically.

Without Blob, the 24-hour API cache still works, but a failed sync after cache expiry may not have a durable fallback until the next successful run.

### 4. Deploy

After env vars are set, redeploy. Cron is configured in `vercel.json` (`0 6 * * *` = daily at 06:00 UTC).

## Optional: Apify fallback

If Pathfinder stops working, set:

| Variable | Value |
|----------|--------|
| `APIFY_API_TOKEN` | Token from [Apify Console](https://console.apify.com/account/integrations) |

Uses actor `beatanalytics/spotify-play-count-scraper` (paid per run; a few URLs per day is very cheap).

## Manual test

```bash
# Refresh cache locally (no auth if CRON_SECRET is unset)
curl http://localhost:3000/api/cron/sync-music-stats

# Read cached stats
curl http://localhost:3000/api/music/stats
```

## Tracks configured

Edit `lib/music-tracks.ts` to change titles, credits, or Spotify track IDs.

`data/music-stats.json` holds the last successful sync locally. After the first successful cron on Vercel, Blob holds the same data for production fallbacks.
