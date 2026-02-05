# Cloudflare 部署指南

Lumi CMS 支持将前端应用部署到 Cloudflare Pages。由于后端架构特性（NestJS + Fastify + MySQL），目前建议将前端部署在 Cloudflare，后端部署在支持 Docker 或 Node.js 的平台（如 Render、Railway 或自有 VPS），或者通过 Cloudflare Tunnel 将本地/VPS 服务暴露给前端。

## 1. 前端部署 (Cloudflare Pages)

前端项目 (`apps/web`) 是一个标准的 Vue 3 + Vite 单页应用，非常适合部署到 Cloudflare Pages。

### 方法 A: 命令行部署 (推荐)

我们已经在项目中集成了 `wrangler` CLI。

1.  **登录 Cloudflare**:
    ```bash
    npx wrangler login
    ```

2.  **构建并部署**:
    在项目根目录下运行：
    ```bash
    pnpm --filter web deploy:cf
    ```
    
    该命令会自动执行以下操作：
    - 构建前端项目 (`vite build`)
    - 将 `dist` 目录上传到 Cloudflare Pages

3.  **首次部署设置**:
    - 如果是首次运行，CLI 会提示你创建一个新的 Pages 项目（例如输入 `lumi-cms-web`）。
    - 部署完成后，你会获得一个 `*.pages.dev` 的访问域名。

### 方法 B: Cloudflare Dashboard (Git 集成)

你也可以在 Cloudflare 控制台连接你的 GitHub 仓库进行自动部署。

1.  进入 [Cloudflare Dashboard](https://dash.cloudflare.com/) > **Pages** > **Connect to Git**。
2.  选择 `lumi-cms` 仓库。
3.  **构建配置**:
    - **Project name**: `lumi-cms-web` (自定义)
    - **Framework preset**: `Vite`
    - **Build command**: `pnpm --filter web build` (或者 `cd apps/web && pnpm build`)
    - **Build output directory**: `apps/web/dist`
4.  **环境变量**:
    - 点击 **Environment variables**。
    - 添加 `VITE_APP_BASE_API`: 填入你后端服务的完整 URL (例如 `https://api.your-domain.com`)。

---

## 2. 后端部署方案

由于 `apps/api` 使用了 NestJS (依赖 Node.js Runtime) 和 Prisma (连接 MySQL)，直接部署到 **Cloudflare Workers** 需要进行大量架构改造（迁移到 D1 数据库、适配 Worker Runtime 等）。

推荐以下两种方案：

### 方案 A: 传统 Node.js 托管 (推荐生产环境)

将后端部署到支持 Node.js 的平台：
- **Render / Railway / Fly.io / Heroku**
- **自有 VPS (使用 Docker)**

部署后，获取后端的 HTTPS URL，并在前端 Cloudflare Pages 的设置中配置 `VITE_APP_BASE_API` 环境变量指向该 URL。

### 方案 B: Cloudflare Tunnel (适合 SQLite 用户)

如果您使用 **SQLite** 数据库，**强烈建议**使用 Cloudflare Tunnel 方案。
因为 Cloudflare Workers/Pages 运行在无状态环境中，不支持持久化的文件写入，这意味标准的 SQLite 文件 (`dev.db`) 无法在上面运行（每次重启数据都会丢失）。

通过 Tunnel，您可以将运行在本地电脑或 VPS 上的后端服务直接暴露给 Cloudflare，既保留了 SQLite 的简单性，又享受了 Cloudflare 的 CDN 和防护。

1.  **启动后端**:
    确保您的后端服务已在本地运行 (默认端口 7071)。
    ```bash
    pnpm --filter api dev
    ```

2.  **启动 Tunnel**:
    我们已经内置了便捷脚本，直接运行：
    ```bash
    pnpm tunnel:api
    ```
    
    终端会输出类似以下的日志：
    ```
    INF +--------------------------------------------------------------------------------------+
    INF |  Your quick Tunnel has been created! Visit it at (it may take some time to be reachable):  |
    INF |  https://random-name-xyz.trycloudflare.com                                           |
    INF +--------------------------------------------------------------------------------------+
    ```

3.  **配置前端**:
    在 Cloudflare Pages 的 **Environment variables** 中，设置 `VITE_APP_BASE_API` 为您的 Hono 后端地址：
    `https://lumi-cms-hono.mike473091010.workers.dev`

    或者在本地构建时：
    ```bash
    export VITE_APP_BASE_API=https://lumi-cms-hono.mike473091010.workers.dev
    pnpm --filter web deploy:cf
    ```

---

## 3. 常见问题

**Q: 为什么不能直接把后端也部署到 Cloudflare Workers?**
A: Cloudflare Workers 是一个基于 V8 Isolate 的 Serverless 环境，不是标准的 Node.js 环境。虽然支持 `nodejs_compat`，但 NestJS + Fastify + Prisma (MySQL) 的组合依赖许多 Node.js 原生特性和 TCP 连接，直接迁移成本较高且容易遇到兼容性问题。如果必须使用 Workers，建议重构为使用 Hono 框架 + D1 数据库。

**Q: 前端访问后端出现 CORS 跨域错误？**
A: 请确保后端 (`apps/api/src/main.ts`) 中的 `app.enableCors()` 已开启，或者配置了允许的前端域名。
