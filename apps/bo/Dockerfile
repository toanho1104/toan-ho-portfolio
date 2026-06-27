FROM node:22-alpine AS base
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json .npmrc ./
COPY apps/bo/package.json apps/bo/
COPY packages/ui/package.json packages/ui/
COPY packages/typescript-config/package.json packages/typescript-config/

RUN pnpm install --frozen-lockfile --filter bo...

COPY apps/bo/ apps/bo/
COPY packages/ui/ packages/ui/
COPY packages/typescript-config/ packages/typescript-config/

RUN pnpm turbo build --filter=bo

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=base /app/apps/bo/public ./apps/bo/public
COPY --from=base --chown=nextjs:nodejs /app/apps/bo/.next/standalone ./
COPY --from=base --chown=nextjs:nodejs /app/apps/bo/.next/static ./apps/bo/.next/static

USER nextjs
EXPOSE 3002

ENV PORT=3002
ENV HOSTNAME=0.0.0.0

CMD ["node", "apps/bo/server.js"]
