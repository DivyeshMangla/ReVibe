# HR/Payroll System

Production-grade HRMS payroll platform built with NestJS, React, and PostgreSQL.

## Quick Start

### Option 1: Docker (Recommended)

```bash
# Start all services with one command
docker-compose up -d

# Access the application
# Frontend: http://localhost
# Backend: http://localhost:3000
# Database: localhost:5432
```

See [DOCKER.md](DOCKER.md) for detailed Docker documentation.

### Option 2: Local Development

#### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

#### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npx prisma migrate dev --name init
npx prisma generate
npm run start:dev
```

#### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Documentation

All project documentation is maintained in **PROJECT_GUIDE.md**, including:
- Architecture overview
- API specifications
- Data models
- Setup instructions
- Extension guidelines

## Features

- Payroll management with approval workflow
- Salary slip corrections
- Employee job profile tracking
- Promotion management
- HR chatbot (stub for LLM integration)

## Tech Stack

- **Backend**: NestJS, TypeScript, Prisma, PostgreSQL
- **Frontend**: React, Vite, TailwindCSS, React Query
- **Auth**: JWT (stub implementation)

## License

MIT
