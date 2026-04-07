# Deploy to Vercel - Complete Free Guide

## 🎯 What You'll Deploy
- **Frontend (React)** - on Vercel (FREE ✅)
- **Backend (Node.js)** - keep on Railway or use alternative
- **Database** - MongoDB Atlas (FREE ✅)

---

## Step 1️⃣: Create Vercel Account

### 1.1 Sign Up
1. Go to https://vercel.com/
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your GitHub

### 1.2 You're Now Logged In
✅ Ready to deploy!

---

## Step 2️⃣: Import Your Repository

### 2.1 Click "Add New Project"
1. On Vercel dashboard, click **"Add New..."** button (top right)
2. Select **"Project"**

### 2.2 Select Your GitHub Repo
1. Search for **`spoken-english`**
2. Click on your repository: `satti04rehman/spoken-english`
3. Click **"Import"**

---

## Step 3️⃣: Configure Project Settings

### 3.1 Framework Detection
When you see the import screen:

**Framework Preset:**
- Vercel auto-detects your project
- Leave it as-is (should show Vite)

### 3.2 Root Directory
This is IMPORTANT! ⚠️

**Change Setting:**
- Find "Root Directory" dropdown
- Select: **`client`** (NOT the default)
- This tells Vercel to deploy only the React app

### 3.3 Build Settings
Should auto-populate as:
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

If not, set them manually:
```
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

---

## Step 4️⃣: Set Environment Variables

### 4.1 Add Environment Variables
1. Look for **"Environment Variables"** section
2. Click **"Add"**

### 4.2 Add Your Backend URL
Add this variable:

**Name:** `VITE_API_URL`

**Value:**
- If Railway deployed: `https://your-railway-url.railway.app`
- If local testing: `http://localhost:4000`
- If using ngrok: `https://your-ngrok-url.ngrok.io`

**For Testing Locally First:**
```
VITE_API_URL=http://localhost:4000
```

### 4.3 Example Screenshot:
```
Environment Variables
┌─────────────────────┬──────────────────────────────┐
│ Name                │ Value                        │
├─────────────────────┼──────────────────────────────┤
│ VITE_API_URL        │ https://api.railway.app      │
└─────────────────────┴──────────────────────────────┘
```

---

## Step 5️⃣: Deploy! 🚀

### 5.1 Click Deploy Button
1. Review all settings one more time
2. Click **"Deploy"** button (bottom right)
3. Wait for build to complete (usually 2-5 minutes)

### 5.2 Watch the Build Logs
- Vercel shows real-time build logs
- You should see:
  ```
  ✓ Built successfully
  ✓ Framework detected: Vue
  ✓ Installing dependencies...
  ✓ Running build script...
  ✓ Uploading build artifacts...
  ✓ Deployment complete!
  ```

### 5.3 Get Your URL
Once deployed, you'll get a URL like:
```
https://spoken-english-xxx.vercel.app
```

---

## ✅ Your App is Live!

**Frontend URL:** `https://spoken-english-xxx.vercel.app`

**Access your app:**
- Open in browser: `https://spoken-english-xxx.vercel.app`
- Login: `admin` / `admin123`

---

# 🔧 Troubleshooting

## Build Failed: "Module not found"

**Error:**
```
Error: Cannot find module 'react'
```

**Fix:**
1. Go back to Vercel project settings
2. Check "Root Directory" is set to `client`
3. Redeploy

## "Blank Page" or "API Errors"

**Cause:** Backend URL not set correctly

**Fix:**
1. Go to **Settings** → **Environment Variables**
2. Update `VITE_API_URL` to your actual backend URL
3. Redeploy (click "Redeploy" button)

## "Cannot GET /"

**Cause:** Express not serving React app

**Fix (for backend):**
1. Make sure `server/server.js` has SPA fallback
2. Should have this code:
```javascript
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});
```

---

# 🔗 Deploy Backend Too (Free Options)

## Option A: Railway
1. Same GitHub connection
2. Separate project for backend
3. Free tier: $5/month after free credits

## Option B: Render
1. Go to https://render.com/
2. Sign up with GitHub
3. Deploy backend for FREE (has free tier)

## Option C: Heroku Alternative
1. Use Heroku (paid option, $7+/mo)
2. Or try Railway/Render

---

# 📋 Setup Checklist

### Before Deploying:
- [ ] GitHub repo pushed with all code
- [ ] MongoDB Atlas cluster created
- [ ] Backend running locally (test on http://localhost:4000)
- [ ] Backend API responding (`GET /api/health`)

### During Deployment:
- [ ] Vercel account created
- [ ] GitHub repo imported
- [ ] Root directory set to `client`
- [ ] Environment variables added
- [ ] Build completed successfully

### After Deployment:
- [ ] Open Vercel URL in browser
- [ ] Login works (admin/admin123)
- [ ] Check browser console for errors
- [ ] Test features (create students, etc.)

---

# 🎯 Complete Flow Summary

```
1. GitHub: Push code ✅
   ↓
2. Vercel: Import repo
   ├─ Set root directory: client
   ├─ Add env vars (VITE_API_URL)
   └─ Deploy
   ↓
3. Get URL: https://xxx.vercel.app
   ↓
4. Open in browser
   ↓
5. Test login: admin / admin123
```

---

# 📊 Deployment Comparison

| Feature | Vercel | Railway | Render |
|---------|--------|---------|--------|
| Frontend | ✅ Free | Paid | Free |
| Backend | ❌ No | Paid | ✅ Free |
| Database | External | External | External |
| Easiest | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ |

**Recommendation:**
- **Frontend:** Vercel (FREE)
- **Backend:** Render (FREE) or Railway (Paid)
- **Database:** MongoDB Atlas (FREE)

---

# 🚀 Quick Deploy Steps (TL;DR)

1. Go to https://vercel.com → Sign with GitHub
2. Click "Add New" → "Project"
3. Select `satti04rehman/spoken-english`
4. Set Root Directory: `client`
5. Add env var: `VITE_API_URL=http://localhost:4000` (for testing)
6. Click "Deploy"
7. Wait 2-5 minutes
8. Open your URL
9. Login: `admin` / `admin123`

**Done! 🎉**

---

# ❓ Common Questions

**Q: How much does Vercel cost?**
A: Frontend deploy is completely FREE! No limits on free tier.

**Q: Can I use custom domain?**
A: Yes, for free! Just update DNS settings.

**Q: How do I update my app?**
A: Just push to GitHub. Vercel auto-redeploys!

**Q: Can I deploy backend on Vercel?**
A: No (Vercel is frontend-only). Use Railway/Render for backend.

**Q: Is SSL/HTTPS included?**
A: Yes! Automatic SSL for free.

**Q: How to rollback if something breaks?**
A: Vercel keeps deployment history. Click "Deployments" → select previous version → "Promote to Production".

---

## Support Links
- Vercel Docs: https://vercel.com/docs
- React/Vite Setup: https://vitejs.dev/guide/
- Next Steps: See DEPLOY_GUIDE.md in your repo

