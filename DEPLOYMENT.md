# Vercel Deployment Guide

## Prerequisites

- Vercel account
- GitHub repository connected
- Backend deployed separately (Railway, Render, or similar)

## Frontend Deployment Steps

### 1. Deploy Backend First

Your backend needs to be deployed separately. Options:

#### Railway.app (Recommended)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy from backend directory
cd backend
railway init
railway up
```

#### Render.com
1. Create new Web Service
2. Connect GitHub repo
3. Set Build Command: `cd backend && npm install && npx prisma generate && npm run build`
4. Set Start Command: `cd backend && npm run start:prod`
5. Add environment variables (see below)

### 2. Configure Environment Variables

#### Backend Environment Variables (Railway/Render)
```
DATABASE_URL=postgresql://user:password@host:5432/dbname
JWT_SECRET=your-secret-key-here
NODE_ENV=production
PORT=3000
```

#### Frontend Environment Variables (Vercel)
```
VITE_API_URL=https://your-backend-url.com/api
```

### 3. Deploy Frontend to Vercel

#### Option A: Via Vercel Dashboard
1. Go to https://vercel.com
2. Import your GitHub repository
3. Configure:
   - Framework Preset: **Vite**
   - Root Directory: **frontend**
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add environment variable: `VITE_API_URL`
5. Deploy

#### Option B: Via Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy from frontend directory
cd frontend
vercel --prod
```

### 4. Database Setup

Your backend hosting provider should handle database:

#### Railway Database
```bash
# Add PostgreSQL plugin in Railway dashboard
# Copy DATABASE_URL to backend environment
```

#### External Database (Supabase/Neon)
1. Create database
2. Copy connection string
3. Add to backend environment as DATABASE_URL

### 5. Run Migrations

After backend deployment:

```bash
# Via Railway CLI
railway run npx prisma migrate deploy

# Or add to build script
# In package.json: "build": "npx prisma migrate deploy && nest build"
```

## Post-Deployment

### Update API URL
In Vercel dashboard:
1. Go to Project Settings > Environment Variables
2. Update `VITE_API_URL` with your backend URL
3. Redeploy frontend

### Enable CORS on Backend
Update `backend/src/main.ts`:

```typescript
app.enableCors({
  origin: ['https://your-frontend.vercel.app'],
  credentials: true,
});
```

### Test Deployment
1. Visit frontend URL
2. Check browser console for errors
3. Test login and API calls
4. Verify database connectivity

## Troubleshooting

### API Calls Failing
- Check VITE_API_URL is correct
- Verify CORS settings on backend
- Check backend logs

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check database is running
- Ensure migrations are deployed

### Build Failures
- Clear Vercel cache and rebuild
- Check all dependencies are in package.json
- Verify Node version compatibility

## Architecture

```
┌─────────────────┐
│  Vercel         │
│  (Frontend)     │
│  React + Vite   │
└────────┬────────┘
         │ HTTPS
         ↓
┌─────────────────┐
│  Railway/Render │
│  (Backend)      │
│  NestJS + API   │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  PostgreSQL     │
│  (Database)     │
└─────────────────┘
```

## Quick Deploy Commands

```bash
# Backend (Railway)
cd backend
railway init
railway up

# Frontend (Vercel)
cd frontend
vercel --prod
```

## Important Notes

- Never commit `.env` files
- Use environment variables for all secrets
- Backend must be deployed before frontend
- Update CORS settings after frontend deployment
- Run database migrations after backend deployment
