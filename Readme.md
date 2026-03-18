# Lumi-CMS

<div align="center">
  <p>默认本地开发路径: SQLite + MockRedis + Nest API</p>
  <p>默认用户: admin / 123456, lumi / 123456</p>
</div>

<span>[English](https://github.com/CodeKungfu/lumi-cms/blob/main/Readme.en.md) | 简体中文</span>

## 默认本地开发路径

本仓库默认用 `SQLite` 和 `MockRedis` 跑通本地开发，不要求安装 MySQL 或 Redis。

推荐启动顺序:

```bash
pnpm install
pnpm db:init
pnpm --filter api dev
pnpm --filter web dev
```

默认本地地址:

- API: `http://localhost:7071`
- Swagger: `http://localhost:7071/swagger-api`
- Web: `http://localhost:4080`

## 仓库结构

```text
lumi-cms/
├── apps/api        # 默认本地开发主后端，Nest.js + Fastify
├── apps/hono       # Cloudflare Workers / D1 路径，非默认本地开发主线
├── apps/web        # Vue3 管理端
├── packages/database
└── packages/eslint-config
```

## SQLite 与 MockRedis

- SQLite 文件默认位于 `packages/database/prisma/dev.db`
- 初始化命令会自动建表并导入 `packages/database/sql/d1_seed.sql`
- `apps/api` 启动前会自动确保 SQLite 已初始化
- 默认不开启真实 Redis，`USE_REAL_REDIS=false` 时走内存 MockRedis

常用命令:

```bash
pnpm db:init
pnpm db:check
pnpm db:reset
pnpm test:p0
```

## 切换到 MySQL / Redis

如果你需要切回真实 MySQL 和 Redis:

```bash
pnpm --filter @repo/database db:gen:mysql
```

然后配置环境变量:

- `DATABASE_URL`
- `USE_REAL_REDIS=true`
- `REDIS_HOST`
- `REDIS_PORT`
- `REDIS_PASSWORD`
- `REDIS_DB`

最后启动外部 MySQL / Redis 服务，再运行 API。

## Hono 路径说明

- `apps/api` 是默认本地开发和回归测试主线
- `apps/hono` 用于 Cloudflare Workers / D1 运行时
- Hono 不依赖本地 `dev.db`
- 若要运行 Hono，需要你自己提供 Wrangler D1 绑定配置

## 验收路径

P0 本地验收至少覆盖:

1. `pnpm db:init` 成功
2. `pnpm --filter api dev` 成功
3. `GET /captchaImage`
4. `POST /login`
5. `GET /getInfo`
6. `GET /getRouters`
7. `GET /system/user/list`

## 开发说明

- Prisma MySQL schema: `packages/database/prisma/schema.prisma`
- Prisma SQLite schema: `packages/database/prisma/schema.sqlite.prisma`
- SQLite seed: `packages/database/sql/d1_seed.sql`
- API e2e: `apps/api/test/app.e2e-spec.ts`

## 生产与部署

- Docker 一键部署: `docker-compose -f docker-compose.all.yml up -d`
- Hono 部署请使用 `apps/hono` 内的 Wrangler 工作流
