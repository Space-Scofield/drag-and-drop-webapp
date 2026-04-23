FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate
WORKDIR /app

# Install deps (cached layer)
FROM base AS deps
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/web/package.json ./apps/web/
COPY apps/api/package.json ./apps/api/
COPY packages/schema/package.json ./packages/schema/
COPY packages/editor-core/package.json ./packages/editor-core/
COPY packages/exporter/package.json ./packages/exporter/
RUN pnpm install --frozen-lockfile

# Build all packages + web app
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm build --filter=@drag-builder/schema \
               --filter=@drag-builder/editor-core \
               --filter=@drag-builder/exporter \
               --filter=@drag-builder/web

# Production web image (Next.js standalone)
FROM base AS web
ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public
EXPOSE 3000
CMD ["node", "apps/web/server.js"]

# Production api image
FROM base AS api
ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/node_modules ./node_modules
COPY --from=builder /app/apps/api/package.json ./
EXPOSE 4000
CMD ["node", "dist/index.js"]
