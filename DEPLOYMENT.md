# Deployment Guide - Vercel + Cloudflare

This guide will walk you through deploying your portfolio website to Vercel and configuring Cloudflare for DNS/CDN.

## Prerequisites

- A GitHub account
- A Vercel account (free tier available)
- A Cloudflare account (free tier available)
- A domain name (optional, but recommended)

---

## Step 1: Prepare Your Code

### 1.1 Check for Environment Variables

You'll need to set up environment variables for:
- **Resend API Key** (for contact form emails)
- Any other API keys you're using

Create a `.env.example` file (already done) and note what variables you need.

### 1.2 Test Your Build Locally

```bash
npm run build
```

If the build succeeds, you're ready to deploy!

---

## Step 2: Deploy to Vercel

### 2.1 Push Code to GitHub

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit - ready for deployment"
   ```

2. **Create a GitHub Repository**:
   - Go to [github.com](https://github.com)
   - Click "New repository"
   - Name it (e.g., `oluwatimilehin-portfolio`)
   - Don't initialize with README (you already have files)
   - Click "Create repository"

3. **Push Your Code**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

### 2.2 Deploy to Vercel

1. **Sign Up/Login to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub

2. **Import Your Project**:
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Project Settings**:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

4. **Add Environment Variables**:
   Click "Environment Variables" and add:
   ```
   RESEND_API_KEY=your_resend_api_key_here
   RESEND_FROM_EMAIL=onboarding@resend.dev
   ```
   
   **To get Resend API Key**:
   - Sign up at [resend.com](https://resend.com)
   - Go to API Keys section
   - Create a new API key
   - Copy and paste it into Vercel

5. **Deploy**:
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - Your site will be live at `your-project.vercel.app`

---

## Step 3: Configure Custom Domain (Optional)

### 3.1 Add Domain in Vercel

1. Go to your project in Vercel dashboard
2. Click "Settings" → "Domains"
3. Add your domain (e.g., `oluwatimilehin.com`)
4. Vercel will show you DNS records to add

### 3.2 Configure Cloudflare DNS

1. **Add Domain to Cloudflare**:
   - Go to [cloudflare.com](https://cloudflare.com)
   - Sign up/login
   - Click "Add a Site"
   - Enter your domain
   - Choose the free plan
   - Cloudflare will scan your DNS records

2. **Update Nameservers**:
   - Cloudflare will give you new nameservers
   - Go to your domain registrar (where you bought the domain)
   - Replace the nameservers with Cloudflare's nameservers
   - Wait 24-48 hours for propagation

3. **Add DNS Records in Cloudflare**:
   - Go to DNS → Records
   - Add the DNS records Vercel provided:
     - **Type**: `CNAME`
     - **Name**: `@` (or your subdomain)
     - **Target**: `cname.vercel-dns.com`
     - **Proxy status**: Proxied (orange cloud) ✅
   
   For `www` subdomain:
     - **Type**: `CNAME`
     - **Name**: `www`
     - **Target**: `cname.vercel-dns.com`
     - **Proxy status**: Proxied (orange cloud) ✅

4. **SSL/TLS Settings**:
   - Go to SSL/TLS → Overview
   - Set to "Full" or "Full (strict)"
   - Vercel will automatically provision SSL certificates

---

## Step 4: Post-Deployment Checklist

### 4.1 Verify Everything Works

- [ ] Homepage loads correctly
- [ ] Navigation works
- [ ] Music section displays Spotify embeds
- [ ] Commercial work video plays
- [ ] Creative projects game loads
- [ ] Contact form submits (check Resend dashboard)
- [ ] Calendly widget loads
- [ ] Mobile responsive design works

### 4.2 Update Any Hardcoded URLs

- Check for any `localhost:3000` references
- Update API endpoints if needed
- Verify all external links work

### 4.3 Test Contact Form

1. Submit a test message through the contact form
2. Check your email (`lehinadenekan@gmail.com`)
3. Verify Resend dashboard shows the email was sent

### 4.4 Test Calendly Integration

1. Visit your live site
2. Scroll to "Schedule a Call" section
3. Verify Calendly widget loads
4. Test booking flow

---

## Step 5: Cloudflare Optimization (Optional)

### 5.1 Enable Cloudflare Features

1. **Speed Optimization**:
   - Go to Speed → Optimization
   - Enable "Auto Minify" (HTML, CSS, JavaScript)
   - Enable "Brotli" compression

2. **Caching**:
   - Go to Caching → Configuration
   - Set Browser Cache TTL to "Respect Existing Headers"
   - Vercel handles caching, so Cloudflare should respect it

3. **Security**:
   - Go to Security → Settings
   - Security Level: Medium
   - Enable "Always Use HTTPS"
   - Enable "Automatic HTTPS Rewrites"

### 5.2 Page Rules (Optional)

Create page rules for better caching:
- Pattern: `yourdomain.com/_next/static/*`
- Cache Level: Cache Everything
- Edge Cache TTL: 1 month

---

## Troubleshooting

### Build Fails on Vercel

1. **Check Build Logs**:
   - Go to Vercel dashboard → Deployments
   - Click on failed deployment
   - Check error messages

2. **Common Issues**:
   - Missing environment variables
   - TypeScript errors
   - Missing dependencies
   - Build command issues

### Domain Not Working

1. **Check DNS Propagation**:
   - Use [whatsmydns.net](https://www.whatsmydns.net)
   - Verify DNS records are correct

2. **SSL Certificate Issues**:
   - Wait 24-48 hours for SSL to provision
   - Check Vercel domain settings

### Contact Form Not Working

1. **Check Resend API Key**:
   - Verify it's set in Vercel environment variables
   - Check Resend dashboard for errors

2. **Check API Route**:
   - View Vercel function logs
   - Check browser console for errors

### Calendly Not Loading

1. **Check Calendly URL**:
   - Verify `https://calendly.com/oluwatimilehinonline` is correct
   - Make sure your Calendly page is public

2. **Check Script Loading**:
   - View browser console for errors
   - Verify Next.js Script component is working

---

## Environment Variables Summary

Add these in Vercel → Settings → Environment Variables:

```
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=onboarding@resend.dev
```

**Note**: For production, you'll want to verify your domain in Resend and use a custom email address.

---

## Quick Deploy Commands

If you prefer CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

---

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Cloudflare Docs**: https://developers.cloudflare.com
- **Resend Docs**: https://resend.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment

---

## Next Steps After Deployment

1. Set up Google Analytics (optional)
2. Set up error monitoring (Sentry, etc.)
3. Configure custom email domain in Resend
4. Set up backup/version control
5. Monitor performance and optimize
