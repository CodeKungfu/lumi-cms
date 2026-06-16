# Cloudflare 部署指南

Lumi CMS 现在是「Cloudflare 原生」架构：后端 `apps/hono` 跑在 Cloudflare Workers + D1，前端 `apps/web` 部署到 Cloudflare Pages。两者都通过 `wrangler` 部署。

## 1. 后端 (Cloudflare Workers + D1)

1. 登录：`npx wrangler login`
2. 创建 / 选择 D1 数据库，并把 `apps/hono/wrangler.toml` 里的 `database_name` / `database_id` 换成真实值：
   ```bash
   npx wrangler d1 create lumi-cms      # 首次创建，记下 database_id
   npx wrangler d1 list                 # 或查看已有库
   ```
3. 初始化线上 D1（建表 + 种子）：
   ```bash
   cd apps/hono
   npx wrangler d1 execute DB --remote --file=../../packages/database/sql/d1_seed.sql
   ```
4. 设置密钥（可选，替代 wrangler.toml 里的明文 JWT_SECRET）：
   ```bash
   npx wrangler secret put JWT_SECRET
   ```
5. 部署：
   ```bash
   pnpm deploy            # 即 pnpm --filter @repo/database build && wrangler deploy
   ```

## 2. 前端 (Cloudflare Pages)

前端 (`apps/web`) 是 Vue3 + Vite SPA。`apps/web/.env.cf` 的 `VITE_APP_BASE_API` 应指向已部署的 Worker 地址。

```bash
npx wrangler login
pnpm --filter web deploy:cf   # vite build --mode cf && wrangler pages deploy dist
```

## 本地预览

本地无需账号即可联调：见根目录 `Readme.md`（`wrangler dev` 用 Miniflare 在本地以 SQLite 模拟 D1）。
