# 构建阶段
FROM node:18-alpine as builder

WORKDIR /app

# 首先复制 package.json 相关文件
# COPY package.json .
# COPY yarn.lock .
COPY turbo.json .
COPY apps/web/package.json ./apps/web/
COPY packages/database/package.json ./packages/database/
COPY packages/eslint-config/package.json ./packages/eslint-config/

# 安装依赖
RUN yarn install

# 然后复制源代码
COPY apps/web ./apps/web
COPY packages/database ./packages/database
COPY packages/eslint-config ./packages/eslint-config

# 构建
RUN yarn --cwd apps/web build

# 运行阶段
FROM nginx:alpine

COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]