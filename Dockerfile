FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies only when needed
FROM base AS deps

RUN apk add --no-cache libc6-compat

# Copy dependency manifests
COPY package.json package-lock.json* ./

# Cài toàn bộ dependencies (bao gồm dev) để build Next.js (cần TypeScript, v.v.)
RUN if [ -f package-lock.json ]; then \
      npm ci; \
    else \
      npm install; \
    fi

# Build the app
FROM base AS builder

ENV NODE_ENV=production

COPY . .
COPY --from=deps /app/node_modules ./node_modules

RUN npm run build

# Production image
FROM base AS runner

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]


