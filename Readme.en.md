# Lumi-CMS

<div align="center">
  <p>Default local development path: SQLite + MockRedis + Nest API</p>
  <p>Default users: admin / 123456, lumi / 123456</p>
</div>

<span>English | [简体中文](https://github.com/CodeKungfu/lumi-cms/blob/main/Readme.md)</span>

## Default local workflow

The repo now treats `SQLite` and `MockRedis` as the default local development path. You do not need MySQL or Redis installed to run the main API locally.

Recommended startup sequence:

```bash
pnpm install
pnpm db:init
pnpm --filter api dev
pnpm --filter web dev
```

Default local URLs:

- API: `http://localhost:7071`
- Swagger: `http://localhost:7071/swagger-api`
- Web: `http://localhost:4080`

## Repository layout

```text
lumi-cms/
├── apps/api        # Default local backend, Nest.js + Fastify
├── apps/hono       # Cloudflare Workers / D1 runtime path
├── apps/web        # Vue3 admin frontend
├── packages/database
└── packages/eslint-config
```

## SQLite and MockRedis

- SQLite file: `packages/database/prisma/dev.db`
- Seed source: `packages/database/sql/d1_seed.sql`
- `apps/api` now checks SQLite initialization before startup
- `USE_REAL_REDIS=false` keeps the repo on in-memory MockRedis

Common commands:

```bash
pnpm db:init
pnpm db:check
pnpm db:reset
pnpm test:p0
```

## Switch to MySQL / Redis

If you want the MySQL / Redis stack instead:

```bash
pnpm --filter @repo/database db:gen:mysql
```

Then provide:

- `DATABASE_URL`
- `USE_REAL_REDIS=true`
- `REDIS_HOST`
- `REDIS_PORT`
- `REDIS_PASSWORD`
- `REDIS_DB`

After that, start your external MySQL / Redis services and run the API.

## Hono runtime notes

- `apps/api` is the only default local development and regression-test path
- `apps/hono` targets Cloudflare Workers / D1
- Hono does not use the local `dev.db`
- Running Hono requires your own Wrangler D1 bindings

## P0 acceptance path

The local P0 validation flow is:

1. `pnpm db:init`
2. `pnpm --filter api dev`
3. `GET /captchaImage`
4. `POST /login`
5. `GET /getInfo`
6. `GET /getRouters`
7. `GET /system/user/list`

## Development notes

- Prisma MySQL schema: `packages/database/prisma/schema.prisma`
- Prisma SQLite schema: `packages/database/prisma/schema.sqlite.prisma`
- API e2e coverage: `apps/api/test/app.e2e-spec.ts`
- Hono deployment remains under `apps/hono`

## Deployment

- Docker Compose: `docker-compose -f docker-compose.all.yml up -d`
- Hono deployment uses the Wrangler workflow inside `apps/hono`
