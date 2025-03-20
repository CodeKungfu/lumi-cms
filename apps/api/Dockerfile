FROM node:20-alpine AS base

FROM base AS builder
# 安装必要的依赖
RUN apk update && apk add --no-cache \
    libc6-compat \
    openssl \
    openssl-dev \
    openssl-libs-static
WORKDIR /app

# 复制 package.json 相关文件
COPY turbo.json .
COPY apps/api/package.json ./apps/api/
COPY packages/database/package.json ./packages/database/
COPY packages/eslint-config/package.json ./packages/eslint-config/

# 安装依赖
RUN yarn install

# 复制源代码
COPY . .

# 生成 Prisma 客户端
RUN cd apps/api && yarn db:gen

# 构建项目
RUN cd apps/api && yarn build

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

# 启动应用
CMD ["node", "dist/main.js"]