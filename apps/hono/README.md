# Hono Runtime

`apps/hono` is the Cloudflare Workers / D1 runtime path for Lumi CMS.

This app is not the default local development entrypoint. The default local path is:

```bash
pnpm db:init
pnpm --filter api dev
pnpm --filter web dev
```

Important constraints for `apps/hono`:

- It targets Cloudflare Workers, not the local SQLite file in `packages/database/prisma/dev.db`
- It expects Wrangler-managed D1 bindings
- The committed `wrangler.toml` should be treated as an example, not as the default local onboarding path

Typical workflow:

```bash
pnpm --filter @repo/database db:gen
cd apps/hono
pnpm dev
```

Before running it, make sure your own D1 database binding and Wrangler credentials are configured.
