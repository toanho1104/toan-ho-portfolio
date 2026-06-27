FROM oven/bun:1.2-alpine AS base
WORKDIR /app

COPY apps/api/package.json ./
RUN bun install --production

COPY apps/api/ ./

RUN bun run build

ENV NODE_ENV=production
EXPOSE 3001

CMD ["bun", "run", "start"]
