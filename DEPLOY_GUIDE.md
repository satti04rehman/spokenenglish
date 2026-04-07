# Deploy Your App - Complete Guide

## 🏆 Deployment Comparison

| Platform | Difficulty | Cost | Best For | Speed |
|----------|-----------|------|----------|-------|
| **Railway** | ⭐ Easy | $5/mo | Backend only | 5 min |
| **Vercel** | ⭐ Easy | Free | Frontend only | 3 min |
| **Heroku** | ⭐ Easy | $7/mo | Full stack | 10 min |
| **DigitalOcean** | ⭐⭐ Medium | $5/mo | Full control | 15 min |
| **AWS** | ⭐⭐⭐ Hard | Pay-as-go | Heavy workloads | 30 min |
| **Docker** | ⭐⭐ Medium | Varies | Containerized | 20 min |

---

## 🚀 RECOMMENDED: Railway + Vercel (Free to $5/mo)

### Why This Setup?
✅ **Free frontend hosting** (Vercel)
✅ **Cheap backend** ($5/mo - Railway)
✅ **Super simple** (Connect GitHub, done!)
✅ **Auto-scaling included**
✅ **Best for beginners**

---

# OPTION 1: Railway (Backend) + Vercel (Frontend)

## Step 1️⃣: Deploy Backend to Railway

### 1.1 Create Railway Account
1. Go to https://railway.app/
2. Click "Start Project"
3. Sign in with GitHub (easiest)

### 1.2 Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub"
3. Authorize Railway to access GitHub
4. Select your `spoken-english` repository

### 1.3 Configure Backend
1. In railway.app dashboard:
2. Click "Add Service" → "GitHub"
3. Select repository → `spoken-english`
4. Click "Deploy"

### 1.4 Set Environment Variables
1. Go to your Railway project
2. Click on the deployed service
3. Go to "Variables" tab
4. Add these variables:

```
MONGODB_URI = mongodb+srv://spoken108english:spoken108english@spoken-english.4ruepyi.mongodb.net/?appName=spoken-english
JWT_SECRET = generate-random-secret-here
JWT_REFRESH_SECRET = generate-another-secret-here
CLIENT_URL = https://your-frontend-url.vercel.app
NODE_ENV = production
PORT = 4000
```

**To generate secrets:**
```bash
# On Windows PowerShell or Linux terminal:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 1.5 Railway Configuration
1. Go to Deployments tab
2. Click "Settings"
3. Find "Start Command": Keep default (npm start)
4. Root Directory: Set to `server`
5. Build Command: `npm install --prefix server && npm run build --prefix server` (if needed)
6. Watch for deployment ✅

### 1.6 Get Your Backend URL
1. Go to "Domain" tab
2. Copy your auto-generated URL (like `https://spoken-english-prod.railway.app`)
3. **Save this - you'll need it for frontend!**

### Railway Dashboard Screenshots:
```
Dashboard → Project → Service → Variables
                              → Domain
                              → Deployments
```

---

## Step 2️⃣: Deploy Frontend to Vercel

### 2.1 Create Vercel Account
1. Go to https://vercel.com/
2. Click "Sign Up"
3. Select "Continue with GitHub"
4. Authorize Vercel

### 2.2 Import Project
1. Click "Add New..." → "Project"
2. Search for `spoken-english` repository
3. Click "Import"
4. Click "Continue"

### 2.3 Configure Build
1. **Framework**: Select "Vite"
2. **Root Directory**: Set to `client`
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. Click "Continue"

### 2.4 Set Environment Variables
1. In "Environment Variables" section:
2. Add variable:
   - Name: `VITE_API_URL`
   - Value: `https://your-railway-url.railway.app` (from Step 1.6)
3. Click "Add"
4. Click "Deploy"

### 2.5 Wait for Deployment
- Vercel will build and deploy automatically
- Watch the build logs
- Once done, you'll get a URL like `https://xxx.vercel.app`

### Vercel Dashboard Screenshots:
```
Dashboard → Import Project → Configure → Environment Variables
                                      → Deploy
```

---

## ✅ You're Live!

Your app is now available at:
- **Frontend**: `https://xxx.vercel.app`
- **Backend**: `https://xxx.railway.app`
- **Database**: MongoDB Atlas (cloud)

---

# OPTION 2: Heroku (All-in-One, Simpler but Limited)

## Why Heroku?
✅ All in one place
✅ Very simple setup
❌ More expensive ($14/mo minimum)
❌ Going away in Nov 2024 (use Render instead)

### Use "Render" instead (better alternative):

1. Go to https://render.com/
2. Click "New Web Service"
3. Connect GitHub repo
4. **Name**: `spoken-english-app`
5. **Runtime**: Node
6. **Start Command**: `npm start --prefix server`
7. **Build Command**: `npm install --prefix server && npm run build --prefix client`
8. Add environment variables (same as Railway)
9. Click "Create Web Service"

---

# OPTION 3: DigitalOcean (More Control)

## Best for: Developers who want control + cheap ($5/month)

### 3.1 Create DigitalOcean Account
1. Go to https://www.digitalocean.com/
2. Sign up
3. Add payment method

### 3.2 Create App Platform App
1. Click "Create" → "Apps"
2. Connect GitHub repo
3. Select branch: `main`
4. Assign resources

### 3.3 Configure Services
**Create 2 services:**

**Service 1 - Backend:**
- Name: `api`
- Build Command: `npm install --prefix server`
- Run Command: `npm start --prefix server`
- HTTP Port: `4000`

**Service 2 - Frontend (Static):**
- Name: `web`
- Build Command: `npm install --prefix client && npm run build --prefix client`
- Output Directory: `client/dist`
- HTTP Port: `3000`

### 3.4 Add Environment Variables
In App Platform settings:
```
MONGODB_URI = your-mongodb-uri
JWT_SECRET = generated-secret
JWT_REFRESH_SECRET = generated-secret
CLIENT_URL = https://your-domain.ondigitalocean.app
NODE_ENV = production
```

### 3.5 Deploy
Click "Deploy" and wait ~5 minutes

---

# OPTION 4: Docker to Your Own Server (Advanced)

## Best for: Full control, self-hosted

### 4.1 Push Docker Image
```bash
# Build image
docker build -t myapp:latest .

# Tag for Docker Hub
docker tag myapp:latest yourusername/myapp:latest

# Login to Docker Hub
docker login

# Push
docker push yourusername/myapp:latest
```

### 4.2 On Your Server
```bash
# Pull image
docker pull yourusername/myapp:latest

# Run container
docker run -d \
  --name engteach \
  -p 80:4000 \
  -e MONGODB_URI="your-uri" \
  -e JWT_SECRET="your-secret" \
  -e NODE_ENV="production" \
  yourusername/myapp:latest
```

---

# 🎯 QUICK START RECOMMENDATION

## For Beginners: Railway + Vercel (5 minutes)

**Cost**: $0-5/month
**Difficulty**: ⭐ Easy
**Setup Time**: 5 minutes

### Quick Steps:
1. **Railway** (Backend)
   - Go to railway.app
   - Click "New Project" → "Deploy from GitHub"
   - Select repo
   - Add env variables
   - Done! (2 min)

2. **Vercel** (Frontend)
   - Go to vercel.com
   - Click "Add Project" → Select repo
   - Set `client` as root directory
   - Add `VITE_API_URL` = your Railway URL
   - Deploy (2 min)

3. **Test**
   - Open Vercel URL
   - Login: `admin` / `admin123`
   - Done! ✅

---

# 🔗 Setup Custom Domain

### With Vercel (Frontend)
1. Go to Vercel dashboard
2. Project → Settings → Domains
3. Add your domain (e.g., `yourdomain.com`)
4. Follow DNS instructions
5. Free SSL certificate automatic ✅

### With Railway (Backend)
1. Go to Railway dashboard
2. Service → Domain
3. Add custom domain (e.g., `api.yourdomain.com`)
4. Update DNS records
5. SSL automatic ✅

### Update .env Everywhere
Update these in production:
```
CLIENT_URL=https://yourdomain.com
VITE_API_URL=https://api.yourdomain.com
```

---

# 📊 Cost Comparison

| Service | Frontend | Backend | Database | Total/mo |
|---------|----------|---------|----------|----------|
| **Railway+Vercel** | Free | $5 | Free (Atlas) | $5 |
| **Heroku** | - | $14+ | $15+ | $29+ |
| **DigitalOcean** | $5+ | $5+ | - | $10+ |
| **AWS** | Free (S3) | Pay-as-go | Pay-as-go | $10-50 |

---

# ✅ Final Checklist

Before going live:

### Pre-Launch
- [ ] Push all code to GitHub
- [ ] Build client: `npm run build --prefix client`
- [ ] Test locally: `npm start --prefix server` & `npm run dev --prefix client`
- [ ] MongoDB Atlas cluster created
- [ ] New JWT secrets generated
- [ ] Admin password works

### Deployment
- [ ] Backend deployed (Railway/Heroku/DigitalOcean)
- [ ] Frontend deployed (Vercel)
- [ ] Environment variables set on platform
- [ ] Domain configured
- [ ] SSL certificate active

### Testing After Deploy
- [ ] Open frontend URL
- [ ] Login works (`admin`/`admin123`)
- [ ] Create student works
- [ ] API responding (`/api/health`)
- [ ] Database connected
- [ ] Activity logs working

### Post-Launch
- [ ] Change admin password
- [ ] Monitor logs
- [ ] Set up uptime alerts
- [ ] Enable database backups
- [ ] Create monitoring dashboard

---

# 🆘 Common Issues & Fixes

## "Cannot connect to MongoDB"
```
❌ Error: Cannot connect to MongoDB
✅ Fix:
1. Check MONGODB_URI in environment variables
2. Verify in MongoDB Atlas IP whitelist
3. Check username/password are correct
4. Database user has proper permissions
```

## "CORS Error"
```
❌ Error: CORS blocked
✅ Fix:
1. Update CLIENT_URL in backend .env
2. For Vercel: VITE_API_URL points to correct backend
3. Check origin in CORS middleware
```

## "Build Failed"
```
❌ Error: Build failed
✅ Fix:
1. Check build logs for errors
2. Verify dependencies installed
3. Check root directory setting
4. Look for port conflicts
```

## "Static Files Not Loading"
```
❌ Error: CSS/JS not loading
✅ Fix:
1. Ensure client/dist exists
2. Check build output directory
3. Verify static file serving
4. Clear cache and reload
```

---

# 📞 Useful Links

- **Railway Support**: https://docs.railway.app/
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas**: https://docs.atlas.mongodb.com/
- **DigitalOcean**: https://docs.digitalocean.com/
- **Render**: https://render.com/docs

---

## 🎓 Summary

**Easiest Path** (Recommended): Railway + Vercel
1. Push to GitHub
2. Connect Railway for backend
3. Connect Vercel for frontend
4. Add env variables
5. Done! ✅

**Time**: 5-10 minutes
**Cost**: $5/month
**Difficulty**: Very Easy

---

**Ready? Start with Railway! → https://railway.app/**
