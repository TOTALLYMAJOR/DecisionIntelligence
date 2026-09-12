# syntax=docker/dockerfile:1

FROM node:22-bookworm-slim AS dependencies
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

# Copy only manifests first so dependency installation remains cacheable.
COPY package*.json ./
COPY apps/web/package.json apps/web/package.json
COPY apps/worker/package.json apps/worker/package.json
COPY packages/ai/package.json packages/ai/package.json
COPY packages/core/package.json packages/core/package.json
COPY packages/db/package.json packages/db/package.json
COPY packages/ingestion/package.json packages/ingestion/package.json

RUN if [ -f package-lock.json ]; then npm ci; else npm install --no-audit --no-fund; fi

FROM dependencies AS source
COPY . .
# Prisma 7 loads DATABASE_URL while reading prisma.config.ts, even for client generation.
RUN DATABASE_URL=postgresql://limitless:limitless@postgres:5432/limitless?schema=public npm run db:generate

FROM source AS web-builder
ENV NODE_ENV=production
RUN npm run build -w @limitless/web

FROM node:22-bookworm-slim AS web
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=3000
COPY --from=web-builder --chown=node:node /app/apps/web/.next/standalone ./
COPY --from=web-builder --chown=node:node /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=web-builder --chown=node:node /app/apps/web/public ./apps/web/public
USER node
EXPOSE 3000
CMD ["node", "apps/web/server.js"]

FROM source AS worker
ENV NODE_ENV=production
USER node
CMD ["npm", "run", "start", "-w", "@limitless/worker"]

FROM source AS tools
ENV NODE_ENV=production
CMD ["node", "--version"]
