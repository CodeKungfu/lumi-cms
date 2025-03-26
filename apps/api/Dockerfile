FROM node:22-alpine AS base

# 启用 Corepack 来管理 pnpm
RUN corepack enable

FROM base AS builder
# 安装必要的依赖
RUN apk update && apk add --no-cache \
    libc6-compat \
    openssl \
    openssl-dev \
    openssl-libs-static
WORKDIR /app

# 配置 pnpm 使用淘宝镜像源并增加网络超时时间
RUN pnpm config set registry https://registry.npmmirror.com
RUN pnpm config set network-timeout 300000

# 全局安装 cross-env
RUN npm install -g cross-env

# 复制工作区配置
COPY pnpm-workspace.yaml ./
COPY package.json ./

# 复制 packages 目录
COPY packages ./packages

# 复制 API 应用
COPY apps/api ./apps/api

# 安装所有依赖
RUN pnpm install

# 生成 Prisma 客户端
RUN pnpm --filter @repo/database db:gen

# 构建项目
RUN pnpm --filter api build

# 在构建阶段检查 @nestjs/common 是否存在
RUN find /app -name "@nestjs" -type d

FROM base AS runner
WORKDIR /app

# 安装运行时需要的依赖
RUN apk add --no-cache \
    openssl \
    openssl-dev

# 创建非 root 用户
RUN addgroup --system --gid 1001 api
RUN adduser --system --uid 1001 api

# 复制整个 node_modules 目录（包括根目录和子项目的）
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./

# 复制 Prisma 客户端
COPY --from=builder /app/packages/database/node_modules/.prisma ./node_modules/.prisma

# 设置环境变量
ENV NODE_ENV=production
ENV PATH="/app/node_modules/.bin:${PATH}"

# 切换到非 root 用户
USER api

# 启动应用
CMD ["node", "dist/main.js"]