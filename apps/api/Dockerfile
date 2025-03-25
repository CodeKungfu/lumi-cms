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

# 复制 pnpm 工作空间配置
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY turbo.json ./

# 复制所有 package.json 文件
COPY apps/api/package.json ./apps/api/
COPY packages/database/package.json ./packages/database/
COPY packages/eslint-config/package.json ./packages/eslint-config/

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 生成 Prisma 客户端
RUN pnpm --filter @repo/database db:gen

# 构建项目
RUN pnpm --filter api build

FROM base AS runner
WORKDIR /app

# 安装运行时需要的依赖
RUN apk add --no-cache \
    openssl \
    openssl-dev

# 创建非 root 用户
RUN addgroup --system --gid 1001 api
RUN adduser --system --uid 1001 api
USER api

# 只复制必要的文件
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/node_modules ./node_modules
COPY --from=builder /app/apps/api/package.json .
# 删除下面这行
# COPY --from=builder /app/apps/api/prisma ./prisma

# 设置环境变量
ENV NODE_ENV=production

# 启动应用
CMD ["node", "dist/main.js"]