# SSL Certificate Fix Guide for sightterp.com

## Issues Fixed

1. ✅ **Removed HTTP localhost URLs** from `contact.html` - Changed to HTTPS production URLs
2. ✅ **Fixed .htaccess redirect order** - HTTPS redirect now happens before www redirect

## Additional Steps Required on Hostinger

### 1. Verify SSL Certificate Installation

1. Log into your **Hostinger hPanel**
2. Go to **Domains** → Select `sightterp.com`
3. Check **SSL/TLS Status**:
   - Ensure SSL certificate is **Active** and **Valid**
   - Certificate should cover both `sightterp.com` AND `www.sightterp.com`
   - If only one is covered, you may need to install a certificate for both

### 2. Install SSL Certificate (if not already done)

**Option A: Free SSL (Let's Encrypt) - Recommended**
1. In hPanel, go to **SSL/TLS** section
2. Click **Install SSL Certificate**
3. Select **Let's Encrypt** (free)
4. Choose **Both** `sightterp.com` and `www.sightterp.com`
5. Click **Install**

**Option B: Auto SSL**
- Hostinger may have auto-SSL enabled
- Check if it's active in **SSL/TLS** settings

### 3. Force HTTPS Redirect (if not working)

The `.htaccess` file has been updated, but verify:
1. Upload the updated `.htaccess` file to your web root (`public_html` folder)
2. Ensure file permissions are correct (644)
3. Test by visiting `http://sightterp.com` - it should redirect to `https://sightterp.com`

### 4. Check DNS Settings

1. Go to **Domains** → **DNS Zone Editor**
2. Ensure A records point to your server IP:
   - `sightterp.com` → Your server IP
   - `www.sightterp.com` → Your server IP (or CNAME to `sightterp.com`)

### 5. Clear Browser Cache

After fixing SSL:
- Clear browser cache (Ctrl+Shift+Delete / Cmd+Shift+Delete)
- Try incognito/private browsing mode
- Test in different browsers

### 6. Verify SSL Certificate

Test your SSL certificate:
- Visit: https://www.ssllabs.com/ssltest/analyze.html?d=sightterp.com
- Check for any warnings or errors
- Ensure certificate grade is A or higher

## Common SSL Issues on Hostinger

### Issue: "Your connection is not secure" error

**Possible causes:**
1. **Mixed Content** - HTTP resources on HTTPS page ✅ FIXED
2. **Certificate not installed** - Install SSL certificate
3. **Certificate expired** - Renew SSL certificate
4. **Wrong domain** - Certificate doesn't match domain
5. **DNS propagation** - Wait 24-48 hours after DNS changes

### Issue: SSL works for non-www but not www (or vice versa)

**Solution:**
- Install SSL certificate for BOTH `sightterp.com` AND `www.sightterp.com`
- Or use a wildcard certificate `*.sightterp.com`
- The `.htaccess` file redirects www to non-www, so ensure non-www has SSL

### Issue: Redirect loop

**Solution:**
- Check `.htaccess` file (already fixed)
- Ensure only ONE `RewriteEngine On` statement
- Verify redirect order: HTTPS first, then www redirect

## Testing Checklist

- [ ] Visit `http://sightterp.com` → Should redirect to `https://sightterp.com`
- [ ] Visit `http://www.sightterp.com` → Should redirect to `https://sightterp.com`
- [ ] Visit `https://sightterp.com` → Should show green padlock
- [ ] Check browser console (F12) → No mixed content warnings
- [ ] Test contact form → Should work without SSL warnings
- [ ] Test all pages → No SSL warnings

## Contact Hostinger Support

If issues persist:
1. Contact Hostinger support via live chat
2. Ask them to:
   - Verify SSL certificate installation
   - Check server SSL configuration
   - Ensure mod_rewrite is enabled
   - Check for any server-level SSL issues

## Files Modified

1. `contact.html` - Fixed HTTP localhost URLs
2. `.htaccess` - Fixed redirect order and combined RewriteEngine statements

## Notes

- SVG `xmlns="http://www.w3.org/2000/svg"` attributes are **safe** - browsers accept HTTP for SVG namespaces
- External images from `cihanunlu.com` use HTTPS, so they're safe
- All internal links should use relative paths or HTTPS URLs

