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

# 配置 pnpm 使用官方镜像源并增加网络超时时间
RUN pnpm config set registry https://registry.npmjs.org/
RUN pnpm config set network-timeout 300000

# 复制工作区配置
COPY pnpm-workspace.yaml ./
COPY package.json ./

# 复制 packages 目录
COPY packages ./packages

# 复制 API 应用
COPY apps/api ./apps/api

# 安装所有依赖，包括开发和生产依赖
RUN pnpm install

# 生成 Prisma 客户端
RUN pnpm --filter @repo/database db:gen

# 构建项目
RUN pnpm --filter api build

# 创建生产环境依赖 - 继续使用 pnpm
RUN pnpm --filter api deploy --prod ./prod

# 设置环境变量
ENV NODE_ENV=production

# 启动应用
CMD ["node", "/app/apps/api/dist/main.js"]

# FROM base AS runner
# WORKDIR /app

# # 安装运行时需要的依赖
# RUN apk add --no-cache \
#     openssl \
#     openssl-dev

# # 复制构建产物和依赖
# COPY --from=builder /app/prod/node_modules ./node_modules
# COPY --from=builder /app/apps/api/dist ./dist
# COPY --from=builder /app/apps/api/package.json ./

# # 设置环境变量
# ENV NODE_ENV=production

# # 启动应用
# CMD ["node", "dist/main.js"]