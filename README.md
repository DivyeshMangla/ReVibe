# ReVibe HRMS

Modern HR Management & Payroll System built with NestJS, React, and PostgreSQL.

## 🚀 Quick Deploy

### Vercel (Frontend) + Railway (Backend)

```bash
# 1. Deploy Backend (Railway)
cd backend
railway login
railway init
railway up

# 2. Deploy Frontend (Vercel)
cd frontend
vercel --prod
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment guide.

## 🏗️ Tech Stack

- **Backend**: NestJS, TypeScript, Prisma, PostgreSQL
- **Frontend**: React, Vite, TailwindCSS, Lucide Icons
- **Auth**: JWT Authentication
- **Deployment**: Vercel (Frontend) + Railway/Render (Backend)

## ✨ Features

- Employee Management
- Payroll Processing with Approval Workflow
- Leave Management
- Performance Reviews & ACR
- Training Management
- Promotion Workflow
- Salary Corrections
- Job Profile Tracking
- eService Book Management

## 📦 Local Development

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npx prisma migrate dev
npx prisma generate
npm run start:dev
```

Backend runs at http://localhost:3000

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at http://localhost:5173

### Environment Variables

#### Backend (.env)
```
DATABASE_URL="postgresql://user:password@localhost:5432/hrms"
JWT_SECRET="your-secret-key"
PORT=3000
```

#### Frontend (.env)
```
VITE_API_URL=http://localhost:3000/api
```

## 📚 Documentation

- [Deployment Guide](DEPLOYMENT.md) - Production deployment steps
- [Project Guide](PROJECT_GUIDE.md) - Architecture and API docs

## 🐳 Docker (Optional)

```bash
docker-compose up -d
```

Access at http://localhost (frontend) and http://localhost:3000 (backend)

## 📝 License

MIT
