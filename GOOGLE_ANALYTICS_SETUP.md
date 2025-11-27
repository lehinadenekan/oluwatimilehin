# Google Analytics Setup Guide

## Step 1: Create Google Analytics Account

1. Go to: https://analytics.google.com
2. Click "Start measuring"
3. Sign in with your Google account (or create one)

## Step 2: Create a Property

1. Click "Create Property"
2. **Property name**: `oluwatimilehin.com` (or your preferred name)
3. **Reporting time zone**: Select your timezone (UK/London)
4. **Currency**: GBP (or your preferred currency)
5. Click "Next"

## Step 3: Set Up Data Stream

1. Select "Web" platform
2. **Website URL**: `https://www.oluwatimilehin.com`
3. **Stream name**: `oluwatimilehin.com` (or your preferred name)
4. Click "Create stream"

## Step 4: Get Your Measurement ID

After creating the stream, you'll see:
- **Measurement ID**: Format `G-XXXXXXXXXX` (starts with G-)
- Copy this ID - you'll need it for the next step

## Step 5: Add to Vercel Environment Variables

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project: `oluwatimilehin`
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. **Name**: `NEXT_PUBLIC_GA_MEASUREMENT_ID`
6. **Value**: Paste your Measurement ID (e.g., `G-XXXXXXXXXX`)
7. **Environment**: Select all (Production, Preview, Development)
8. Click **Save**

## Step 6: Redeploy

After adding the environment variable:
- Vercel will automatically redeploy, OR
- Go to **Deployments** tab and click **Redeploy** on the latest deployment

## Done! 🎉

Once deployed, Google Analytics will start tracking:
- Page views
- User behavior
- Button clicks
- Form submissions
- Video plays
- And more!

## Verify It's Working

1. Visit your site: https://www.oluwatimilehin.com
2. Go to Google Analytics → **Reports** → **Realtime**
3. You should see yourself as an active user within 30 seconds

---

**Need Help?** If you get stuck, let me know and I can help troubleshoot!

