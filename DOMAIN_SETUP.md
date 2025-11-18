# Domain Setup Guide: Vercel + Cloudflare

This guide will help you connect `www.oluwatimilehin.com` to your Vercel deployment using Cloudflare for DNS.

## Prerequisites

- ✅ Vercel deployment is live (you should have a `*.vercel.app` URL)
- ✅ Cloudflare account with your domain added
- ✅ Domain `oluwatimilehin.com` is managed by Cloudflare

---

## Step 1: Add Domain to Vercel

1. **Go to your Vercel Dashboard**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Select your `oluwatimilehin` project

2. **Navigate to Settings → Domains**
   - Click on your project
   - Go to the **Settings** tab
   - Click **Domains** in the left sidebar

3. **Add Your Domain**
   - Enter `www.oluwatimilehin.com` in the domain input field
   - Click **Add**
   - Vercel will show you DNS records you need to configure

4. **Note the DNS Records**
   - Vercel will display something like:
     ```
     Type: CNAME
     Name: www
     Value: cname.vercel-dns.com
     ```
   - **Copy these values** - you'll need them for Cloudflare

---

## Step 2: Configure Cloudflare DNS

1. **Log into Cloudflare Dashboard**
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com)
   - Select your domain `oluwatimilehin.com`

2. **Go to DNS Settings**
   - Click **DNS** in the left sidebar
   - You'll see your current DNS records

3. **Add/Update the CNAME Record for www**
   - Find any existing `www` record (if it exists, edit it; if not, add new)
   - **Type**: `CNAME`
   - **Name**: `www`
   - **Target**: `cname.vercel-dns.com` (or whatever Vercel shows you)
   - **Proxy status**: ⚠️ **Turn OFF proxy** (gray cloud, not orange)
     - This is important! Vercel needs direct DNS, not proxied through Cloudflare
   - Click **Save**

4. **Optional: Add Root Domain (oluwatimilehin.com)**
   - If you want the root domain to work too:
   - **Type**: `A`
   - **Name**: `@` (or `oluwatimilehin.com`)
   - **Target**: `76.76.21.21` (Vercel's IP - check Vercel dashboard for current IP)
   - **Proxy status**: ⚠️ **Turn OFF proxy** (gray cloud)
   - OR use a CNAME flattening approach (Cloudflare Pro feature)

---

## Step 3: SSL/TLS Configuration

1. **In Cloudflare Dashboard**
   - Go to **SSL/TLS** → **Overview**
   - Set encryption mode to **Full** or **Full (strict)**
   - This ensures HTTPS works properly

2. **Vercel SSL**
   - Vercel automatically provisions SSL certificates via Let's Encrypt
   - This happens automatically once DNS is configured correctly
   - Wait 5-10 minutes after DNS changes

---

## Step 4: Verify Configuration

1. **Check DNS Propagation**
   - Use [whatsmydns.net](https://www.whatsmydns.net/#CNAME/www.oluwatimilehin.com)
   - Enter `www.oluwatimilehin.com`
   - Verify it points to Vercel's CNAME

2. **Wait for SSL Certificate**
   - Vercel will automatically issue an SSL certificate
   - This can take 5-60 minutes
   - Check Vercel dashboard → Domains → SSL status

3. **Test Your Site**
   - Visit `https://www.oluwatimilehin.com`
   - Should load your Vercel deployment
   - Check that HTTPS works (green lock icon)

---

## Step 5: Cloudflare Settings (Optional Optimizations)

### 5.1 Page Rules (Optional)
- You can add page rules for caching, but Vercel already handles this well
- Generally not needed unless you have specific requirements

### 5.2 Speed Optimizations
- **Auto Minify**: Enable in Speed → Optimization
- **Brotli Compression**: Already enabled by default
- **Caching**: Vercel handles this, but you can add Cloudflare caching rules

### 5.3 Security
- **Security Level**: Medium (default is fine)
- **Bot Fight Mode**: Can enable if you want extra protection
- **WAF Rules**: Available on paid plans

---

## Troubleshooting

### Domain Not Working?
1. **Check DNS Propagation**
   - DNS changes can take up to 48 hours (usually 5-30 minutes)
   - Verify with `dig www.oluwatimilehin.com` or online DNS checkers

2. **Verify Proxy is OFF**
   - In Cloudflare DNS, make sure the cloud icon is **gray** (not orange)
   - Orange cloud = proxied = won't work with Vercel

3. **Check Vercel Domain Status**
   - Go to Vercel → Settings → Domains
   - Should show "Valid Configuration" when DNS is correct
   - If it shows errors, check the error message

4. **SSL Certificate Issues**
   - Wait longer (can take up to 1 hour)
   - Check Vercel dashboard for SSL status
   - Make sure DNS is pointing correctly first

### Common Issues

**Issue**: "Domain not configured correctly"
- **Solution**: Double-check CNAME target matches exactly what Vercel shows
- Make sure proxy is OFF in Cloudflare

**Issue**: "SSL certificate pending"
- **Solution**: Wait 10-60 minutes. Vercel auto-provisions SSL.

**Issue**: "Site loads but shows Vercel default page"
- **Solution**: Check that you added the correct domain in Vercel project settings

---

## Important Notes

⚠️ **Proxy Status**: 
- Keep Cloudflare proxy **OFF** (gray cloud) for Vercel domains
- Vercel handles CDN, caching, and SSL automatically
- Cloudflare proxy can interfere with Vercel's edge network

✅ **What Cloudflare Provides**:
- DNS management
- DDoS protection (even with proxy off)
- Additional security features

✅ **What Vercel Provides**:
- Hosting and deployment
- Automatic SSL certificates
- Global CDN
- Edge functions and optimizations

---

## Next Steps

Once your domain is working:

1. **Update any hardcoded URLs** in your code (if any)
2. **Test the contact form** with the new domain
3. **Set up redirects** if needed (e.g., `oluwatimilehin.com` → `www.oluwatimilehin.com`)
4. **Monitor performance** in both Vercel and Cloudflare dashboards

---

## Quick Reference

- **Vercel Dashboard**: [vercel.com/dashboard](https://vercel.com/dashboard)
- **Cloudflare Dashboard**: [dash.cloudflare.com](https://dash.cloudflare.com)
- **DNS Checker**: [whatsmydns.net](https://www.whatsmydns.net)
- **Vercel Docs**: [vercel.com/docs/concepts/projects/domains](https://vercel.com/docs/concepts/projects/domains)

