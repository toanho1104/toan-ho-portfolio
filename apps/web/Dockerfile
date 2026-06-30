FROM node:22-alpine AS base
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json .npmrc ./
COPY apps/web/package.json apps/web/
COPY packages/ui/package.json packages/ui/
COPY packages/typescript-config/package.json packages/typescript-config/

RUN pnpm install --frozen-lockfile --filter web...

COPY apps/web/ apps/web/
COPY packages/ui/ packages/ui/
COPY packages/typescript-config/ packages/typescript-config/

ARG NEXT_PUBLIC_API_URL=https://api.toanhodev.com
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

ARG DEPLOY_SHA=unknown
ENV DEPLOY_SHA=$DEPLOY_SHA

RUN TURBO_FORCE=true pnpm turbo build --filter=web

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=base /app/apps/web/public ./apps/web/public
COPY --from=base --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=base --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

USER nextjs
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "apps/web/server.js"]
