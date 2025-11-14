# Stage 1: Builder
FROM node:18-alpine AS builder

WORKDIR /app

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build application
RUN npm run build

# Stage 2: Runner
FROM node:18-alpine AS runner

WORKDIR /app

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

# Copy package files and lock file from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# Install ALL dependencies (including dev dependencies for Prisma CLI)
RUN npm install

# Generate Prisma Client in runner stage
RUN npx prisma generate

# Copy built application
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3000

# Start application
CMD ["node", "dist/src/main.js"]
