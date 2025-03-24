# 构建阶段
FROM node:18-alpine as builder

WORKDIR /app

# 首先复制 package.json 相关文件
COPY turbo.json .
COPY apps/web/package.json ./apps/web/
COPY packages/database/package.json ./packages/database/
COPY packages/eslint-config/package.json ./packages/eslint-config/

# 安装依赖
RUN  cd apps/web && yarn install

# 然后复制源代码
COPY apps/web ./apps/web
COPY packages/database ./packages/database
COPY packages/eslint-config ./packages/eslint-config

# 构建 - 使用 npx 运行 vite
RUN cd apps/web && yarn build:docker

# 运行阶段
FROM nginx:alpine

COPY --from=builder /app/apps/web/dist /usr/share/nginx/html
COPY apps/web/default.conf.template /etc/nginx/templates/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]