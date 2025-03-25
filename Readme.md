# Nest-RuoYi-Prisma

<div align="center">
  <img src="https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/Vue.js-%2335495e.svg?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D" alt="Vue.js" />
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
  <img src="https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white" alt="Redis" />
</div>

<div align="center">
  <p>基于 Nest.js、Prisma 和 RuoYi 的全栈应用项目，采用 monorepo 结构管理多个应用和包。</p>
</div>

## 📖 项目介绍

本项目是一个现代化的全栈应用框架，结合了：

- **前端**：基于 RuoYi 的 Vue 管理系统
- **后端**：使用 Nest.js 构建的 API 服务
- **数据库**：通过 Prisma ORM 连接 MySQL 数据库
- **缓存**：Redis 用于缓存和会话管理

项目采用 pnpm workspace 管理的 monorepo 结构，便于代码共享和统一管理。

## 🏗️ 项目结构
```
nest-ruoyi-prisma/
├── apps/                      # 应用目录
│   ├── api/                   # 后端 Nest.js 应用
│   └── web/                   # 前端 Vue 应用
├── packages/                  # 共享包目录
│   ├── database/              # Prisma 数据库模型和客户端
│   └── eslint-config/         # 共享 ESLint 配置
├── docker-compose.all.yml     # Docker Compose 配置文件
├── pnpm-workspace.yaml        # pnpm 工作区配置
└── README.md                  # 项目文档
```
## 🛠️ 技术栈

<details>
<summary><b>前端 (apps/web)</b></summary>

- Vue.js
- Vite
- Element UI
- Axios
</details>

<details>
<summary><b>后端 (apps/api)</b></summary>

- Nest.js
- Prisma ORM
- JWT 认证
- Redis 缓存
- Bull 队列
- Winston 日志
</details>

<details>
<summary><b>开发工具</b></summary>

- TypeScript
- ESLint
- Prettier
- Jest 测试框架
</details>

## 📋 环境要求

- Node.js 16+
- pnpm 7+
- MySQL 8.0+
- Redis 6.2+
- Docker & Docker Compose (可选，用于容器化部署)

## 🚀 快速开始

### 安装依赖

```bash
# 安装 pnpm (如果尚未安装)
npm install -g pnpm

# 安装项目依赖
pnpm install
```

## 开发环境运行
1. 启动数据库和 Redis (使用 Docker)
```bash
docker-compose up mysql redis -d
```
2. 启动后端服务
```bash
pnpm --filter api dev
```
3.  启动前端服务
```bash
pnpm --filter web dev
```
## 生产环境部署
使用 Docker Compose 一键部署所有服务：
```bash
docker-compose -f docker-compose.all.yml up -d
```
## ⚙️ 配置说明
### 环境变量

后端服务 (apps/api) 

- NODE_ENV: 环境模式 (development/production)
- JWT_SECRET: JWT 密钥
- DATABASE_URL: 数据库连接 URL
- SERVER_PORT: API 服务端口
- WS_PORT: WebSocket 服务端口
- MYSQL_*: MySQL 数据库配置
- REDIS_*: Redis 配置

前端服务 (apps/web) 支持以下环境变量：

- VITE_APP_BASE_API: API 基础路径

## 👨‍💻 开发指南
### 数据库迁移

使用 Prisma 进行数据库迁移：
```bash
cd packages/database
npx prisma migrate dev --name <migration-name>
```

✨ 项目特性
- 前后端分离的架构
- 基于 Vue.js 的前端管理系统
- 基于 Nest.js 的后端 API 服务
- 基于 Prisma ORM 的数据库操作
- 基于 Redis 的缓存和会话管理
- 基于 Bull 的队列管理
- 基于 Winston 的日志记录
- 基于 TypeScript 的开发
- 基于 ESLint 和 Prettier 的代码规范
- 基于 Jest 的单元测试
- 基于 Docker 和 Docker Compose 的容器化部署
## 📝 功能列表
- 基于角色的访问控制 (RBAC)
- JWT 认证和授权
- 系统监控和日志
- 用户和权限管理
- 部门和岗位管理
- 菜单和权限配置
- 字典和参数管理
- 定时任务
- 操作日志和登录日志

## 🤝 贡献指南
1. Fork 本仓库
2. 创建特性分支 (git checkout -b feature/amazing-feature)
3. 提交更改 (git commit -m 'Add some amazing feature')
4. 推送到分支 (git push origin feature/amazing-feature)
5. 创建 Pull Request

## 联系
- 作者: Trae
- 邮箱:

## 📄 许可证
MIT License

