# 构建阶段
FROM node:22-alpine as builder

# 启用 Corepack 来管理 pnpm
RUN corepack enable

WORKDIR /app

# 复制 pnpm 工作空间配置
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY turbo.json ./

# 复制所有 package.json 文件
COPY apps/web/package.json ./apps/web/
COPY packages/database/package.json ./packages/database/
COPY packages/eslint-config/package.json ./packages/eslint-config/

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY apps/web ./apps/web
COPY packages/database ./packages/database
COPY packages/eslint-config ./packages/eslint-config

# 构建
RUN pnpm --filter web build:docker

# 运行阶段
FROM nginx:alpine

COPY --from=builder /app/apps/web/dist /usr/share/nginx/html
COPY apps/web/default.conf.template /etc/nginx/templates/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]