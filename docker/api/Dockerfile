# --- Stage 1: Build Phase ---
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy dependency configs
COPY package*.json ./
COPY tsconfig.json ./

# Install packages
RUN npm ci

# Copy database schema and generate Prisma client
COPY prisma ./prisma
RUN npx prisma generate

# Copy source code files
COPY nestjs-backend ./nestjs-backend

# Build the application
WORKDIR /usr/src/app/nestjs-backend
RUN npm run build

# --- Stage 2: Runtime Production Phase ---
FROM node:18-alpine AS runner

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built artifacts from the builder stage
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /usr/src/app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /usr/src/app/nestjs-backend/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma

EXPOSE 3000

CMD ["node", "dist/main.js"]
