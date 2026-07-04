# --- Stage 1: Build Phase ---
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

RUN apk add --no-cache python3 make g++

COPY package*.json ./
COPY tsconfig.json ./

RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

COPY nestjs-backend ./nestjs-backend

WORKDIR /usr/src/app/nestjs-backend
RUN npm run build

# --- Stage 2: Runtime Production Phase ---
FROM node:18-alpine AS runner

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY package*.json ./

RUN npm ci --only=production

COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /usr/src/app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /usr/src/app/nestjs-backend/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma

# The worker does not expose public ports, but processes background events
CMD ["node", "dist/main.js", "--run-worker"]
