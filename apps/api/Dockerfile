FROM oven/bun:1.2-alpine AS base
WORKDIR /app

COPY apps/api/package.json ./package.json
RUN bun -e "const pkg = await Bun.file('package.json').json(); delete pkg.devDependencies; await Bun.write('package.json', JSON.stringify(pkg, null, 2));"
RUN bun install --production

COPY apps/api/ ./

RUN bun run build

ENV NODE_ENV=production
EXPOSE 3001

CMD ["bun", "run", "start"]
