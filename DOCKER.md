# Docker Deployment Guide

Complete Docker support for the HR/Payroll System with production and development configurations.

## Quick Start

### Full Stack (Production)

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Application will be available at:
- **Frontend**: http://localhost
- **Backend API**: http://localhost:3000
- **PostgreSQL**: localhost:5432

### Development (PostgreSQL Only)

```bash
# Start only PostgreSQL for local development
docker-compose -f docker-compose.dev.yml up -d

# Then run backend and frontend locally
cd backend && npm run start:dev
cd frontend && npm run dev
```

## Architecture

```
┌─────────────────┐
│   Frontend      │
│   (nginx:80)    │
└────────┬────────┘
         │
         ├─→ Static Files
         │
         └─→ /api/* ──────┐
                          │
                   ┌──────▼──────┐
                   │   Backend   │
                   │ (Node:3000) │
                   └──────┬──────┘
                          │
                   ┌──────▼──────┐
                   │  PostgreSQL │
                   │   (:5432)   │
                   └─────────────┘
```

## Services

### 1. PostgreSQL
- **Image**: postgres:15-alpine
- **Port**: 5432
- **Volume**: postgres_data (persistent)
- **Database**: hrms_payroll
- **User**: postgres
- **Password**: postgres (change in production)

### 2. Backend
- **Build**: ./backend/Dockerfile
- **Port**: 3000
- **Environment**:
  - DATABASE_URL
  - JWT_SECRET
  - NODE_ENV=production
- **Startup**:
  1. Waits for PostgreSQL health check
  2. Runs `prisma migrate deploy`
  3. Seeds database (first run)
  4. Starts NestJS server

### 3. Frontend
- **Build**: ./frontend/Dockerfile
- **Port**: 80
- **Server**: nginx
- **Features**:
  - Serves static React build
  - Proxies /api/* to backend
  - SPA routing support
  - Gzip compression
  - Asset caching

## Configuration

### Environment Variables

Create `.env` files for custom configuration:

**Backend (.env)**:
```env
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/hrms_payroll
JWT_SECRET=your-strong-secret-key
JWT_EXPIRATION=24h
PORT=3000
NODE_ENV=production
```

**Frontend (.env.production)**:
```env
VITE_API_URL=http://localhost:3000/api
```

### Docker Compose Override

Create `docker-compose.override.yml` for local customization:

```yaml
version: '3.8'
services:
  backend:
    environment:
      JWT_SECRET: my-custom-secret
  postgres:
    ports:
      - "5433:5432"  # Use different port
```

## Commands

### Build

```bash
# Build all images
docker-compose build

# Build specific service
docker-compose build backend
docker-compose build frontend

# Build without cache
docker-compose build --no-cache
```

### Start/Stop

```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d backend

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Logs

```bash
# View all logs
docker-compose logs

# Follow logs
docker-compose logs -f

# Service-specific logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Database Operations

```bash
# Run migrations
docker-compose exec backend npx prisma migrate deploy

# Seed database
docker-compose exec backend npx prisma db seed

# Reset database
docker-compose exec backend npx prisma migrate reset --force

# Access PostgreSQL CLI
docker-compose exec postgres psql -U postgres -d hrms_payroll
```

### Shell Access

```bash
# Backend container
docker-compose exec backend sh

# Frontend container
docker-compose exec frontend sh

# PostgreSQL container
docker-compose exec postgres bash
```

## Production Deployment

### 1. Update Secrets

```bash
# Generate strong JWT secret
openssl rand -base64 32

# Update docker-compose.yml
vim docker-compose.yml
# Change JWT_SECRET and POSTGRES_PASSWORD
```

### 2. Use Environment Files

```bash
# Create production env file
cat > .env.production << EOF
POSTGRES_PASSWORD=your-secure-password
JWT_SECRET=your-generated-secret
EOF

# Reference in docker-compose
docker-compose --env-file .env.production up -d
```

### 3. Enable HTTPS

Update nginx configuration or use reverse proxy:

```bash
# Option 1: Update frontend/nginx.conf with SSL
# Option 2: Use Traefik/Nginx reverse proxy
```

### 4. Database Backups

```bash
# Manual backup
docker-compose exec postgres pg_dump -U postgres hrms_payroll > backup.sql

# Automated backups
docker run --rm \
  --link hrms-postgres:db \
  -v $(pwd)/backups:/backups \
  postgres:15-alpine \
  pg_dump -h db -U postgres hrms_payroll > /backups/backup_$(date +%Y%m%d).sql
```

### 5. Resource Limits

Add to docker-compose.yml:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```

## Troubleshooting

### Backend won't start

```bash
# Check logs
docker-compose logs backend

# Common issues:
# 1. Database not ready - wait for health check
# 2. Migration failed - check DATABASE_URL
# 3. Port conflict - change port mapping
```

### Frontend 502 Bad Gateway

```bash
# Check backend is running
docker-compose ps

# Verify backend connectivity
docker-compose exec frontend curl http://backend:3000/api/health

# Check nginx logs
docker-compose logs frontend
```

### Database connection issues

```bash
# Test connection from backend
docker-compose exec backend node -e "require('@prisma/client').PrismaClient().$connect().then(() => console.log('Connected'))"

# Check PostgreSQL logs
docker-compose logs postgres

# Verify credentials
docker-compose exec postgres psql -U postgres -c "\l"
```

### Prisma errors

```bash
# Regenerate Prisma client
docker-compose exec backend npx prisma generate

# Check schema
docker-compose exec backend npx prisma validate

# View database structure
docker-compose exec backend npx prisma studio
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Docker Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build images
        run: docker-compose build
      
      - name: Run tests
        run: docker-compose run backend npm test
      
      - name: Deploy
        run: docker-compose up -d
```

### GitLab CI Example

```yaml
stages:
  - build
  - deploy

build:
  stage: build
  script:
    - docker-compose build

deploy:
  stage: deploy
  script:
    - docker-compose up -d
  only:
    - main
```

## Monitoring

### Health Checks

```bash
# Check all services
docker-compose ps

# Backend health
curl http://localhost:3000/api/health

# Frontend health
curl http://localhost/

# Database health
docker-compose exec postgres pg_isready
```

### Resource Usage

```bash
# View stats
docker stats

# Specific service
docker stats hrms-backend

# Disk usage
docker system df
```

## Cleanup

```bash
# Stop and remove containers
docker-compose down

# Remove volumes
docker-compose down -v

# Remove images
docker rmi $(docker images -q hrms-*)

# Full cleanup
docker system prune -a --volumes
```

## Development Tips

### Hot Reload in Docker

For development with hot reload:

```yaml
# docker-compose.dev.yml
services:
  backend:
    volumes:
      - ./backend/src:/app/src
    command: npm run start:dev
```

### Debug Mode

```yaml
services:
  backend:
    environment:
      NODE_ENV: development
    ports:
      - "9229:9229"  # Debug port
    command: npm run start:debug
```

### Use Compose Profiles

```yaml
services:
  backend:
    profiles: ["dev", "prod"]
  
  frontend:
    profiles: ["prod"]
```

```bash
# Start only dev profile
docker-compose --profile dev up
```

## Best Practices

1. **Never commit secrets** - Use .env files and .gitignore
2. **Use health checks** - Ensure dependent services are ready
3. **Multi-stage builds** - Keep production images minimal
4. **Layer caching** - Copy package.json before source
5. **Non-root user** - Run containers as non-root (future enhancement)
6. **Volume for data** - Persist PostgreSQL data
7. **Restart policies** - Use `unless-stopped` for reliability
8. **Resource limits** - Prevent resource exhaustion
9. **Regular updates** - Keep base images updated
10. **Automated backups** - Schedule database backups

---

**Status**: ✅ Production-ready Docker setup with full orchestration
