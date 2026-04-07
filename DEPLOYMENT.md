# EngTeach. - Deployment Guide

## Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier available)
- Hosting platform (Vercel, Heroku, Railway, DigitalOcean, AWS, etc.)
- Domain name (optional)

---

## Deployment Steps

### 1. **Prepare Environment Variables**

Copy `.env.example` to `.env.production`:

```bash
cp .env.example .env.production
```

Update the following values:

```env
# Change to production
NODE_ENV=production

# MongoDB Atlas URI with your credentials
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=spoken-english

# Generate strong random JWT secrets (use a password generator)
JWT_SECRET=generate_random_secret_here
JWT_REFRESH_SECRET=generate_another_random_secret_here

# Update to your deployed domain
CLIENT_URL=https://yourdomain.com
```

### 2. **Build for Production**

```bash
# Install dependencies
npm install --prefix client
npm install --prefix server

# Build client
npm run build --prefix client

# Server uses Node.js directly (no build needed)
```

### 3. **Database Setup (MongoDB Atlas)**

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Set up a database user with a strong password
4. Get your connection string
5. Replace `username:password` in your `.env` file

### 4. **Deploy to Hosting Platform**

#### **Option A: Vercel + Railway**

**Deploy Backend (Railway):**
1. Push code to GitHub
2. Go to [Railway.app](https://railway.app)
3. Connect GitHub repo
4. Rename root `server` folder → create `Procfile`:
```
web: node server/server.js
```
5. Add environment variables from `.env.production`
6. Deploy

**Deploy Frontend (Vercel):**
1. Go to [Vercel.com](https://vercel.com)
2. Import repository
3. Set build command: `npm run build --prefix client`
4. Set output directory: `client/dist`
5. Add environment: `VITE_API_URL=https://your-backend-url.railway.app`
6. Deploy

#### **Option B: DigitalOcean App Platform**

1. Create DigitalOcean account
2. Go to App Platform
3. Connect GitHub repository
4. Create two apps:
   - **Backend**: Run `npm start --prefix server`
   - **Frontend**: Build with `npm run build --prefix client`
5. Add environment variables
6. Deploy

#### **Option C: Docker + DigitalOcean/AWS**

Create `Dockerfile` in root:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY server ./server
COPY client ./client

# Install server dependencies
WORKDIR /app/server
RUN npm install

# Build client
WORKDIR /app/client
RUN npm install && npm run build

WORKDIR /app/server
EXPOSE 4000
CMD ["npm", "start"]
```

Build and push:
```bash
docker build -t engteach .
docker tag engteach yourusername/engteach
docker push yourusername/engteach
```

### 5. **Update Client API URL**

In `client/src/api/axios.js`, ensure it points to your backend:

```javascript
const API_URL = process.env.VITE_API_URL || 'https://your-backend-url.com';
```

### 6. **Security Checklist**

- [ ] Change `JWT_SECRET` and `JWT_REFRESH_SECRET`
- [ ] Enable HTTPS (let's Encrypt free SSL)
- [ ] Set `NODE_ENV=production`
- [ ] Disable debug mode
- [ ] Configure CORS properly
- [ ] Use strong MongoDB password
- [ ] Enable IP whitelist for MongoDB (if applicable)
- [ ] Set up rate limiting (already configured)
- [ ] Enable HSTS headers (already configured)

### 7. **Production Performance**

**Enable Redis Cache (optional but recommended):**

```bash
npm install redis --prefix server
```

Then in `server/.env`:
```env
REDIS_URL=redis://your-redis-url
```

### 8. **Domain Setup**

1. Purchase domain from registrar (Namecheap, GoDaddy, etc.)
2. Point A record to your hosting IP
3. Set up SSL certificate (automatic on most platforms)
4. Update `CLIENT_URL` in environment

### 9. **Testing Deployment**

```bash
# Test locally first
NODE_ENV=production npm start --prefix server

# Test with production .env
curl https://yourdomain.com/api/health
```

Should return: `{"status":"ok","timestamp":"..."}`

### 10. **Monitoring & Logs**

- Set up error tracking: Sentry, LogRocket
- Monitor performance: New Relic, DataDog
- Database backups: MongoDB Atlas auto-backups
- Logs: Use platform's built-in logging

---

## Deployment Checklist

- [ ] MongoDB Atlas cluster created and URI obtained
- [ ] `.env.production` configured with production values
- [ ] Client built successfully (`client/dist` folder exists)
- [ ] GitHub repository pushed
- [ ] Hosting platform connected
- [ ] Environment variables added to hosting platform
- [ ] Domain name configured
- [ ] SSL certificate active
- [ ] Health check endpoint responding
- [ ] Login tested with admin credentials
- [ ] Student/teacher functionalities tested
- [ ] Jitsi Meet integration working
- [ ] Activity logs recording correctly
- [ ] Permission system working

---

## Troubleshooting

### **"MongoDB Connection Failed"**
- Check `MONGODB_URI` is correct
- Verify IP whitelist in MongoDB Atlas
- Test connection string locally

### **"CORS Error"**
- Update `CLIENT_URL` in server `.env`
- Check CORS middleware in `server.js`

### **"Port Already in Use"**
- Change `PORT` in `.env`
- Or kill process: `lsof -ti:4000 | xargs kill -9`

### **"Static Files Not Loading"**
- Ensure `client/dist` folder exists
- Check server serves static files from `client/dist`

---

## Support & Documentation

- **Jitsi Meet API:** https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-iframe
- **MongoDB Atlas:** https://docs.atlas.mongodb.com/
- **Express.js:** https://expressjs.com/
- **React:** https://react.dev/

