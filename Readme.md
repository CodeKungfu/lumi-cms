# Lumi-CMS

<div align="center">
  <p>单一后端：apps/hono（Cloudflare Workers + D1），本地用 wrangler 模拟 D1（SQLite）</p>
  <p>默认用户: admin / 123456, lumi / 123456</p>
</div>

<span>[English](https://github.com/CodeKungfu/lumi-cms/blob/main/Readme.en.md) | 简体中文</span>

## 架构

```text
lumi-cms/
├── apps/hono       # 唯一后端：Hono + Cloudflare Workers + D1
├── apps/web        # Vue3 管理端
├── packages/database
└── packages/eslint-config
```

> 旧的 `apps/api`（NestJS）已合并进 `apps/hono` 并删除；如需旧版本，见 `no-agent` 分支。

## 本地开发

`apps/hono` 通过 `wrangler dev` 在本地运行：Miniflare 会用本地 SQLite 模拟 D1，无需远程 D1、也无需登录 Cloudflare。

```bash
pnpm install

# 1) 初始化本地 D1（建表 + 种子，--local 不需要登录）
cd apps/hono
npx wrangler d1 execute DB --local --file=../../packages/database/sql/d1_seed.sql

# 2) 启动后端（http://localhost:8787）
pnpm dev

# 3) 启动前端（另开终端，http://localhost:4080）
cd ../web && pnpm dev
```

默认地址：

- 后端 API: `http://localhost:8787`
- Web: `http://localhost:4080`（dev 代理 `/dev-api` → `http://127.0.0.1:8787`）

本地 D1 的 SQLite 文件位于 `apps/hono/.wrangler/state/v3/d1/`。

## 数据导出

列表导出已改为**前端生成 CSV**（`apps/web/src/utils/exportCsv.js`），不依赖后端导出接口，也不需要 xlsx 库。

## 默认账号

- `admin / 123456`、`lumi / 123456`
- 登录需输入图形验证码（验证码为无状态实现：答案签入 JWT，登录时验签比对）。

## 部署

- 后端 hono：在 `apps/hono` 配置好真实的 D1 绑定（`wrangler.toml` 的 `database_name` / `database_id`，`npx wrangler d1 list`）后，`pnpm deploy`（即 `wrangler deploy`）。
- 前端 web：`pnpm --filter web deploy:cf`（`vite build --mode cf && wrangler pages deploy dist`）。
- `docker-compose.yml` 仅用于容器化前端 web，其 API 指向已部署的 hono Worker。

## 开发说明

- Prisma SQLite/D1 schema: `packages/database/prisma/schema.sqlite.prisma`
- D1 建表 + 种子: `packages/database/sql/d1_seed.sql`（时间戳为 RFC3339，Prisma 读取所需）
- `apps/hono` 仅使用 `@repo/database` 导出的 `PrismaClient` 类，配合 `PrismaD1` adapter
