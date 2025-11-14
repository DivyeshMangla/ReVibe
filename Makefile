.PHONY: help build up down restart logs shell db-migrate db-seed clean dev prod

help:
	@echo "HR/Payroll System - Docker Commands"
	@echo ""
	@echo "Development:"
	@echo "  make dev          - Start PostgreSQL for local development"
	@echo "  make dev-down     - Stop development database"
	@echo ""
	@echo "Production:"
	@echo "  make build        - Build all Docker images"
	@echo "  make up           - Start all services"
	@echo "  make down         - Stop all services"
	@echo "  make restart      - Restart all services"
	@echo "  make logs         - View logs (all services)"
	@echo "  make logs-backend - View backend logs"
	@echo "  make logs-frontend- View frontend logs"
	@echo ""
	@echo "Database:"
	@echo "  make db-migrate   - Run Prisma migrations"
	@echo "  make db-seed      - Seed database with test data"
	@echo "  make db-reset     - Reset database (WARNING: deletes data)"
	@echo "  make db-shell     - Access PostgreSQL shell"
	@echo "  make db-backup    - Backup database to backups/"
	@echo ""
	@echo "Utilities:"
	@echo "  make shell-backend - Shell access to backend container"
	@echo "  make shell-frontend- Shell access to frontend container"
	@echo "  make clean        - Stop and remove all containers, volumes, images"
	@echo "  make status       - Show running containers"
	@echo ""

# Development
dev:
	docker-compose -f docker-compose.dev.yml up -d
	@echo "PostgreSQL started on localhost:5432"
	@echo "Run: cd backend && npm run start:dev"
	@echo "Run: cd frontend && npm run dev"

dev-down:
	docker-compose -f docker-compose.dev.yml down

# Production
build:
	docker-compose build

up:
	docker-compose up -d
	@echo "Services started:"
	@echo "  Frontend: http://localhost"
	@echo "  Backend:  http://localhost:3000"
	@echo "  Database: localhost:5432"

down:
	docker-compose down

restart:
	docker-compose restart

logs:
	docker-compose logs -f

logs-backend:
	docker-compose logs -f backend

logs-frontend:
	docker-compose logs -f frontend

logs-postgres:
	docker-compose logs -f postgres

# Database
db-migrate:
	docker-compose exec backend npx prisma migrate deploy

db-seed:
	docker-compose exec backend npx prisma db seed

db-reset:
	@echo "WARNING: This will delete all data!"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		docker-compose exec backend npx prisma migrate reset --force; \
	fi

db-shell:
	docker-compose exec postgres psql -U postgres -d hrms_payroll

db-backup:
	mkdir -p backups
	docker-compose exec postgres pg_dump -U postgres hrms_payroll > backups/backup_$$(date +%Y%m%d_%H%M%S).sql
	@echo "Backup created in backups/"

# Utilities
shell-backend:
	docker-compose exec backend sh

shell-frontend:
	docker-compose exec frontend sh

status:
	docker-compose ps

clean:
	docker-compose down -v
	docker rmi $$(docker images -q "revibe*" 2>/dev/null) 2>/dev/null || true
	@echo "Cleaned up containers, volumes, and images"

# Convenience aliases
prod: build up

install-backend:
	cd backend && npm install

install-frontend:
	cd frontend && npm install

install: install-backend install-frontend
