# Lumi-CMS

<div align="center">
  <p>Single backend: apps/hono (Cloudflare Workers + D1). Locally, wrangler emulates D1 with SQLite.</p>
  <p>Default users: admin / 123456, lumi / 123456</p>
</div>

<span>English | [简体中文](https://github.com/CodeKungfu/lumi-cms/blob/main/Readme.md)</span>

## Architecture

```text
lumi-cms/
├── apps/hono       # The only backend: Hono + Cloudflare Workers + D1
├── apps/web        # Vue3 admin frontend
├── packages/database
└── packages/eslint-config
```

> The old `apps/api` (NestJS) was merged into `apps/hono` and removed. For the previous version see the `no-agent` branch.

## Local development

`apps/hono` runs locally via `wrangler dev`: Miniflare emulates the D1 binding with a
local SQLite file — no remote D1 and no Cloudflare login required.

```bash
pnpm install

# 1) seed the local D1 (DDL + data; --local needs no login)
cd apps/hono
npx wrangler d1 execute DB --local --file=../../packages/database/sql/d1_seed.sql

# 2) start the backend (http://localhost:8787)
pnpm dev

# 3) start the frontend (new terminal, http://localhost:4080)
cd ../web && pnpm dev
```

- Backend API: `http://localhost:8787`
- Web: `http://localhost:4080` (dev proxies `/dev-api` → `http://127.0.0.1:8787`)

The local D1 SQLite file lives under `apps/hono/.wrangler/state/v3/d1/`.

## Data export / import

- Export: list exports are generated as **CSV on the client** (`apps/web/src/utils/exportCsv.js`), no backend export endpoint, no xlsx library.
- Import: the user import parses a CSV in the browser and POSTs JSON to `POST /system/user/importData`.

## Deployment

- Backend hono: set a real D1 binding in `apps/hono/wrangler.toml` (`npx wrangler d1 list`) then `pnpm deploy` (`wrangler deploy`).
- Frontend web: `pnpm --filter web deploy:cf` (`vite build --mode cf && wrangler pages deploy dist`).
- `docker-compose.yml` only containerizes the web frontend, pointing its API at the deployed hono Worker.
