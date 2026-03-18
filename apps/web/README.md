# Web App

`apps/web` is the default admin frontend for local development.

## Recommended local flow

Run the backend first:

```bash
pnpm db:init
pnpm --filter api dev
```

Then start the frontend:

```bash
pnpm --filter web dev
```

Default local URL:

- Web: `http://localhost:4080`

The Vite dev server proxies `VITE_APP_BASE_API=/dev-api` to `http://127.0.0.1:7071`.
That proxy expects the current Nest API routes:

- `GET /captchaImage`
- `POST /login`
- `GET /getInfo`
- `GET /getRouters`
- `GET /system/user/list`

## Environment

Use `.env.development` for the default local SQLite + Nest API path.

Use `.env.cf` only when you explicitly want to point the frontend at the Hono / Workers deployment.
