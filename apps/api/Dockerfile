FROM node:22-alpine AS base
# 设置环境变量
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
# 启用 Corepack 来管理 pnpm
RUN corepack enable

FROM base AS builder

COPY . /app
RUN rm -rf /app/apps/web
WORKDIR /app

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install ---no-frozen-lockfile

# 构建项目
RUN pnpm run -r build

# 修改部署命令，包含开发依赖
RUN pnpm deploy --filter=api /prod/api

FROM base AS runner
COPY --from=builder /prod/api/node_modules /prod/api/node_modules
COPY --from=builder /app/apps/api/dist /prod/api/dist
WORKDIR /prod/api

# 设置环境变量
ENV NODE_ENV=production

# 启动应用
CMD ["node", "/prod/api/dist/main.js"]