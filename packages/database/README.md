# @repo/database

Shared Prisma layer for Lumi CMS. The single backend `apps/hono` runs on
Cloudflare Workers + D1, so this package just generates a Prisma Client from the
SQLite/D1 schema and re-exports it.

## Contents

- `prisma/schema.sqlite.prisma` — the Prisma schema (SQLite/D1 dialect, `engineType=wasm` + `driverAdapters`). Source of truth.
- `sql/d1_seed.sql` — D1 schema (DDL) + seed data in one file. Timestamps are RFC3339 (what Prisma reads on SQLite/D1). Default users `admin/123456`, `lumi/123456`.
- `src/client.ts` / `index.d.ts` — re-export `@prisma/client` (incl. `PrismaClient`).

## Usage

```ts
import { PrismaClient } from '@repo/database'
import { PrismaD1 } from '@prisma/adapter-d1'

const prisma = new PrismaClient({ adapter: new PrismaD1(env.DB) })
```

## Scripts

- `pnpm db:gen` — `prisma generate --schema=./prisma/schema.sqlite.prisma` (runs on postinstall)
- `pnpm build` — bundle the re-export (`tsup`)
- `pnpm studio` — open Prisma Studio against the schema

## Seeding a (local) D1

```bash
cd apps/hono
npx wrangler d1 execute DB --local --file=../../packages/database/sql/d1_seed.sql
```
