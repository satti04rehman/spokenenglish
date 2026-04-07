# Production Deployment Checklist

## ✅ Pre-Deployment

### Security Configuration
- [ ] Generate new strong `JWT_SECRET` (min 32 chars)
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- [ ] Generate new strong `JWT_REFRESH_SECRET`
- [ ] Change default admin credentials
- [ ] Enable HTTPS/SSL (Let's Encrypt free)
- [ ] Set `NODE_ENV=production`

### Database Setup
- [ ] MongoDB Atlas cluster created (M0 free or higher)
- [ ] Database user created with strong password
- [ ] IP whitelist updated (or allow all for testing)
- [ ] Connection string verified
- [ ] Backups enabled (automatic in Atlas)

### Environment Variables
- [ ] Copy `.env.example` to `.env.production`
- [ ] Set all required variables:
  - `MONGODB_URI` - Database connection
  - `JWT_SECRET` - Auth secret
  - `JWT_REFRESH_SECRET` - Refresh auth secret
  - `CLIENT_URL` - Frontend domain
  - `PORT` - Server port (default 4000)
- [ ] Verify no hardcoded secrets in code

### Application Build
- [ ] Client production build created
  ```bash
  npm run build --prefix client
  ```
- [ ] Build output exists in `client/dist/`
- [ ] No development dependencies in production
- [ ] Git repository cleaned (no uncommitted changes)

---

## 🐳 Docker Deployment

### Build Image
```bash
# Build
docker build -t engteach:prod .

# Test locally
docker run -p 4000:4000 \
  -e MONGODB_URI="your-uri" \
  -e JWT_SECRET="your-secret" \
  -e NODE_ENV="production" \
  engteach:prod
```

### Push to Registry
```bash
# Docker Hub
docker tag engteach:prod username/engteach:latest
docker push username/engteach:latest

# Or your private registry
docker tag engteach:prod registry.example.com/engteach:prod
docker push registry.example.com/engteach:prod
```

---

## 🚀 Deployment Platforms

### Vercel (Frontend Only)
- [ ] Connect GitHub repository
- [ ] Build command: `npm run build --prefix client`
- [ ] Output directory: `client/dist`
- [ ] Add environment: `VITE_API_URL=https://your-api.com`

### Railway (Backend Recommended)
- [ ] Connect GitHub repo
- [ ] Root directory: `server`
- [ ] Run command: `npm start`
- [ ] Add all `.env.production` variables
- [ ] Configure domain/custom URL

### DigitalOcean App Platform
- [ ] Create App from GitHub
- [ ] Add two services:
  1. **Frontend**: Build `npm run build --prefix client`, output `client/dist`
  2. **Backend**: Run `npm start --prefix server`
- [ ] Configure environment variables
- [ ] Set up domain

### AWS (EC2 + ALB)
- [ ] Launch EC2 instance (t2.micro to t2.small)
- [ ] Install Node.js 18+
- [ ] Clone repository
- [ ] Configure `.env` with production values
- [ ] Run: `npm start --prefix server`
- [ ] Set up load balancer for HTTPS
- [ ] Configure auto-scaling if needed

### Docker Swarm/Kubernetes
- [ ] Build image
- [ ] Push to registry
- [ ] Deploy with orchestrator
- [ ] Configure persistent volumes for logs
- [ ] Set up health checks

---

## 🌐 CORS & Domain Setup

### Update Client URL
In `.env.production`:
```env
CLIENT_URL=https://yourdomain.com
```

### Configure CORS Headers
Server automatically configured for:
- Jitsi Meet integration
- CORS from CLIENT_URL
- Rate limiting enabled
- Security headers enabled

---

## 🔒 SSL/TLS Configuration

### Let's Encrypt (Free)
```bash
# Using Certbot
sudo certbot certonly --standalone -d yourdomain.com
```

### Nginx Reverse Proxy
```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 📊 Monitoring & Logging

### Application Monitoring
- [ ] Set up error tracking (Sentry, LogRocket)
- [ ] Configure uptime monitoring (StatusCake, Uptime Robot)
- [ ] Enable application logging
- [ ] Monitor database performance

### Health Check
```bash
curl https://yourdomain.com/api/health
# Expected response: {"status":"ok","timestamp":"2024-04-07T..."}
```

### Log Aggregation
- [ ] Configure centralized logging (LogStash, Elasticsearch)
- [ ] Set retention policies
- [ ] Create dashboards
- [ ] Set up alerts

---

## 🧪 Post-Deployment Testing

### Functional Testing
- [ ] Login with admin credentials works
- [ ] Create student account succeeds
- [ ] Create class succeeds
- [ ] Enroll student in class
- [ ] Join video meeting (Jitsi)
- [ ] Request/grant permissions
- [ ] Export activity logs
- [ ] View student credentials

### Performance Testing
- [ ] Home page loads in < 3 seconds
- [ ] Database queries respond in < 100ms
- [ ] No memory leaks (monitor over 24 hours)
- [ ] Concurrent user testing

### Security Testing
- [ ] SQL injection attempts blocked
- [ ] XSS attempts blocked
- [ ] CSRF tokens working
- [ ] Rate limiting active
- [ ] JWT expiration working
- [ ] Password requirements enforced

---

## 🔄 CI/CD Setup (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build Docker image
        run: docker build -t engteach:${{ github.sha }} .

      - name: Push to registry
        run: |
          echo ${{ secrets.REGISTRY_TOKEN }} | docker login --username ${{ secrets.REGISTRY_USER }} --password-stdin
          docker push engteach:${{ github.sha }}

      - name: Deploy
        run: |
          curl -X POST ${{ secrets.DEPLOY_WEBHOOK }} \
            -H "Authorization: Bearer ${{ secrets.DEPLOY_TOKEN }}"
```

---

## 📋 Maintenance Schedule

### Daily
- [ ] Monitor error logs
- [ ] Check application health

### Weekly
- [ ] Database size review
- [ ] User activity analysis
- [ ] Performance metrics review

### Monthly
- [ ] Full backup verification
- [ ] Security audit
- [ ] Update dependencies
- [ ] Review logs for anomalies

### Quarterly
- [ ] Load testing
- [ ] Disaster recovery test
- [ ] Security assessment

---

## 🚨 Rollback Plan

### Quick Rollback
```bash
# If using Docker
docker pull engteach:previous-tag
docker stop engteach
docker run -d engteach:previous-tag [ENV_VARS]

# If using git
git revert [commit-hash]
npm start
```

### Database Rollback
- MongoDB Atlas: Restore from automatic backup
- Contact support if manual intervention needed

---

## 📞 Emergency Contacts

- **MongoDB Support**: https://support.mongodb.com
- **Hosting Provider Support**: [Your provider]
- **SSL Certificate**: https://letsencrypt.org/support/
- **Emergency Hotline**: [Your number]

---

## ✨ Final Verification

Before marking as production-ready:
- [ ] All tests passing
- [ ] No console errors/warnings
- [ ] Performance acceptable
- [ ] Security audit passed
- [ ] Team sign-off obtained
- [ ] Documentation complete
- [ ] Disaster recovery tested
- [ ] Monitoring active
- [ ] Backups verified
- [ ] Staff trained

---

**Last Updated**: 2024-04-07
**Next Review**: 2024-05-07
