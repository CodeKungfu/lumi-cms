# 构建阶段
FROM node:22-alpine as builder

# 启用 Corepack 来管理 pnpm
RUN corepack enable

WORKDIR /app

# 复制源代码
COPY . .

RUN rm -rf /app/apps/api

# 修改这一行
RUN pnpm install --filter web
# 构建应用
RUN pnpm --filter web build:docker

# 生产阶段
FROM nginx:alpine

# 复制构建产物
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

COPY apps/web/default.conf.template /etc/nginx/templates/

# 暴露端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]