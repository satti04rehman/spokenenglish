# 🚀 DEPLOYMENT QUICK START (Choose One)

## ⭐ RECOMMENDED: Railway + Vercel

```
┌─────────────────────────────────────────────────────────┐
│                    YOUR APPLICATION                     │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Frontend (React)          Backend (Node.js)            │
│  ✅ vercel.app             ✅ railway.app               │
│  👤 Deployed on Vercel     👤 Deployed on Railway       │
│  Cost: FREE                Cost: $5/month               │
│                                                           │
│           ↓ (API Calls) ↓                               │
│        mongodb.com (Cloud Database)                     │
│           🗄️ MongoDB Atlas (FREE)                       │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## STEP-BY-STEP DEPLOYMENT

### 1️⃣ GitHub Setup (2 minutes)

```bash
# See if you have git repo
cd "C:\Users\PMAS\Desktop\spoken english"
git status

# If not initialized:
git init
git add .
git commit -m "Initial commit - ready for deployment"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/spoken-english.git
git push -u origin main
```

**Required**: Create GitHub account → https://github.com/signup

---

### 2️⃣ Deploy Backend to Railway (3 minutes)

**Click**: https://railway.app/

**Step by step:**

```
1. Click "Start Project"
   ↓
2. Click "Deploy from GitHub"
   ↓
3. Authorize Railway to access GitHub
   ↓
4. Select your "spoken-english" repo
   ↓
5. Wait for deployment (watch logs)
   ↓
6. Go to "Domain" tab → Copy your URL
   ✅ SAVE THIS URL (example: https://spoken-english-prod.railway.app)
```

**Add Environment Variables:**

```
In Railway Dashboard:
Variables Tab:

MONGODB_URI = mongodb+srv://spoken108english:spoken108english@spoken-english.4ruepyi.mongodb.net/?appName=spoken-english
JWT_SECRET = (run this in terminal: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_REFRESH_SECRET = (same - generate another)
CLIENT_URL = https://your-vercel-url.vercel.app (you'll set this in step 3)
NODE_ENV = production
```

✅ **BACKEND DEPLOYED!**

---

### 3️⃣ Deploy Frontend to Vercel (2 minutes)

**Click**: https://vercel.com/new

**Step by step:**

```
1. Click "Sign Up" → "Continue with GitHub"
   ↓
2. Authorize Vercel
   ↓
3. Click "Add New Project" → "Import"
   ↓
4. Search & select "spoken-english"
   ↓
5. Configure:
   - Framework: Vite
   - Root Directory: client
   - Build Command: npm run build
   ↓
6. Environment Variables:

   Name: VITE_API_URL
   Value: https://your-railway-url.railway.app

   (Use the URL you saved from Railway!)
   ↓
7. Click "Deploy"
   ✅ VERCEL GIVES YOU YOUR FRONTEND URL
```

✅ **FRONTEND DEPLOYED!**

---

## 🎉 YOU'RE LIVE!

```
Open browser:
  Frontend: https://xxxx.vercel.app
  Backend: https://xxxx.railway.app

Login:
  ID: admin
  Password: admin123

Test Features:
  ✅ Login page
  ✅ Create student
  ✅ Create class
  ✅ See data in MongoDB
```

---

## 📱 Access on Mobile

1. Find your PC IP:
   ```
   On Windows: ipconfig
   Look for IPv4 Address (e.g., 192.168.1.100)
   ```

2. On mobile phone (same WiFi):
   ```
   Browser → https://xxxx.vercel.app
   ```

   OR (for local testing):
   ```
   Browser → http://192.168.1.100:5173
   ```

---

## 🌐 Custom Domain (Optional)

### Add Your Own Domain

**For Frontend (Vercel)**:
1. Buy domain: namecheap.com, godaddy.com, etc.
2. Vercel Dashboard → Settings → Domains
3. Add your domain
4. Follow DNS instructions
5. Free SSL ✅

**For Backend (Railway)**:
1. Same domain (different subdomain)
2. Railway Dashboard → Domain
3. Add `api.yourdomain.com`
4. Follow DNS instructions
5. Free SSL ✅

---

## 💰 COSTS

| Item | Cost |
|------|------|
| Frontend (Vercel) | FREE |
| Backend (Railway) | $5/month |
| Database (MongoDB) | FREE |
| **Total** | **$5/month** |

---

## ❌ TROUBLESHOOTING

### "Cannot connect to database"
```
Fix: Check MONGODB_URI in Railway environment variables
Verify: MongoDB Atlas → Database Access → Check user
Whitelist: MongoDB Atlas → Network Access → Add IP
```

### "Frontend not connecting to backend"
```
Fix: Check VITE_API_URL matches your Railway URL
Verify: Railway URL is correct (no typos)
Check: CORS is enabled in backend
```

### "Build failed"
```
Fix: Check build logs in Vercel/Railway dashboard
Try: Delete node_modules and reinstall locally
Verify: All dependencies installed (npm install --prefix client)
```

### "Getting 404 errors"
```
Fix: Check if API endpoint exists
Verify: MongoDB connection working
Check: Environment variables set correctly
```

---

## 📋 VERIFICATION CHECKLIST

Before considering deployment complete:

- [ ] GitHub repo created and pushed
- [ ] Railway deployed (backend URL visible)
- [ ] Vercel deployed (frontend URL visible)
- [ ] Frontend loads without errors
- [ ] Can login with admin/admin123
- [ ] Can create a student
- [ ] Can create a class
- [ ] Activity logs showing data
- [ ] API health check works: `(backend-url)/api/health`
- [ ] No console errors

---

## 🎯 NEXT STEPS

1. **Change Admin Password**
   - Login to deployed app
   - Change password immediately

2. **Enable Monitoring**
   - Set up error alerts (Sentry)
   - Monitor uptime (UptimeRobot)
   - Enable database backups

3. **Add Custom Domain**
   - Buy domain
   - Point to Vercel/Railway
   - Enable SSL

4. **Scale if Needed**
   - Add more students/teachers
   - Monitor performance
   - Upgrade if needed

---

## 📞 SUPPORT LINKS

- Railway Docs: https://docs.railway.app/
- Vercel Docs: https://vercel.com/docs
- MongoDB Help: https://support.mongodb.com
- GitHub: https://docs.github.com/

---

## ⏱️ TIME BREAKDOWN

- GitHub setup: 2-5 min
- Railway deployment: 3-5 min
- Vercel deployment: 2-3 min
- Configuration: 2-3 min
- **TOTAL: ~10 minutes**

---

**Ready? Go to → https://railway.app/ and start deploying! 🚀**
