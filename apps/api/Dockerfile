FROM oven/bun:1.2-alpine AS base
WORKDIR /app

COPY apps/api/package.json ./package.json
RUN bun -e "const pkg = await Bun.file('package.json').json(); delete pkg.devDependencies; await Bun.write('package.json', JSON.stringify(pkg, null, 2));"
RUN bun install --production

COPY apps/api/ ./

ARG DEPLOY_SHA=unknown
ENV DEPLOY_SHA=$DEPLOY_SHA

RUN bun run build

RUN apk add --no-cache wget

ENV NODE_ENV=production
EXPOSE 3001

RUN chmod +x docker-entrypoint.sh

ENTRYPOINT ["./docker-entrypoint.sh"]
