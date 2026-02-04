# Lumi-CMS

<div align="center">
  <img src="https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/Vue.js-%2335495e.svg?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D" alt="Vue.js" />
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
  <img src="https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white" alt="Redis" />
</div>

<div align="center">
  <p>Lumi-CMS 是一个基于 Nest.js、Prisma 和 Vue3 的现代化内容管理系统，采用 monorepo 结构管理多个应用和包。</p>
</div>


<span>[English](https://github.com/CodeKungfu/lumi-cms/blob/main/Readme.en.md) | 简体中文</span>

## 🏢 平台简介

特别鸣谢Ruoyi 原版开发者无私开源及支持我的伙伴们。让我有很大的动力去开发一版基于Nodejs的Ruoyi。目前还是处于（WIP）, 早期的一个状态，欢迎大家提建议, 提issue, 提PullRequest。

Java版若依是一套流行的快速开发平台, 但是对于不熟悉或不擅长Java但是擅长Nodejs或前端的开发人员来，本项目可以作为一个学习和参考。

本项目代码是个人开发，未经大量测试和专业测试，不建议用于生产环境。也因为如此，现在做了一个重构，把前端和后端代码放在同一个项目中，也是前端和后端分离的模式，后续功能会主要在这里开发升级。

## 📖 项目介绍

本项目是一个现代化的全栈应用框架，结合了：

- **前端**：基于 RuoYi 的 Vue 管理系统
- **后端**：使用 Nest.js 构建的 API 服务
- **数据库**：通过 Prisma ORM 连接 MySQL 数据库 (支持 SQLite 本地开发)
- **缓存**：Redis 用于缓存和会话管理 (支持 MockRedis 本地开发)

项目采用 pnpm workspace 管理的 monorepo 结构，便于代码共享和统一管理。

## 🏗️ 项目结构
```
lumi-cms/
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

<details open>
<summary><b>前端 (apps/web)</b></summary>

- Vue.js
- Vite
- Element UI
- Axios
</details>

<details open>
<summary><b>后端 (apps/api)</b></summary>

- Nest.js
- Prisma ORM
- JWT 认证
- Redis 缓存

</details>

<details open>
<summary><b>开发工具</b></summary>

- TypeScript
- ESLint
- Prettier
- Jest 测试框架
</details>

## ⚡️ 零依赖快速启动 (Zero Dependency)

本项目默认配置了 **SQLite** 和 **MockRedis**，旨在让开发者**无需安装 MySQL 和 Redis** 即可直接运行项目。

- **极速体验**：Clone 项目后，仅需安装依赖即可启动，无需配置繁琐的数据库环境。
- **开箱即用**：适合快速预览项目功能、学习源码或进行简单的二次开发。
- **平滑切换**：生产环境或需要更高性能时，可随时通过环境变量切换回 MySQL 和 Redis。

## 📋 环境要求

- Node.js 18+
- pnpm 7+
- MySQL 8.0+ (可选，本地开发可使用 SQLite)
- Redis 6.2+ (可选，本地开发可使用 MockRedis)
- Docker & Docker Compose (可选，用于容器化部署)

## 🚀 快速开始

### 开发环境运行 (Zero Dependency)

```bash
# 安装 pnpm (如果尚未安装)
npm install -g pnpm

# 安装项目依赖
pnpm install

# 启动项目 (同时启动前后端)
pnpm dev
```

#### 分别启动服务 (可选)

启动后端服务:
```bash
pnpm --filter api dev
```

启动前端服务:
```bash
pnpm --filter web dev
```

## 开发环境运行(需要redis 和 mysql)
1. 启动数据库和 Redis (使用 Docker，可选)
> 如果使用 SQLite 和 MockRedis (默认配置)，可跳过此步骤。
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
- 基于 JWT 的认证机制
- 基于 Winston 的日志记录
- 基于 TypeScript 的开发
- 基于 ESLint 和 Prettier 的代码规范
- 基于 Jest 的单元测试
- 基于 Docker 和 Docker Compose 的容器化部署

## 📝 内置功能（复刻若依功能，当前版本相应支持情况）
1. 用户管理：用户是系统操作者，该功能主要完成系统用户配置。（已支持）
2. 部门管理：配置系统组织机构（公司、部门、小组），树结构展现支持数据权限。（已支持）
3. 岗位管理：配置系统用户所属担任职务。（已支持）
4. 菜单管理：配置系统菜单，操作权限，按钮权限标识等。（已支持）
5. 角色管理：角色菜单权限分配、设置角色按机构进行数据范围权限划分。（已支持）
6. 字典管理：对系统中经常使用的一些较为固定的数据进行维护。（已支持）
7. 参数管理：对系统动态配置常用参数。（已支持）
8. 通知公告：系统通知公告信息发布维护。（已支持）
9. 操作日志：系统正常操作日志记录和查询；系统异常信息日志记录和查询。（已支持）
10. 登录日志：系统登录日志记录查询包含登录异常。（已支持）
11. 系统接口：根据业务代码自动生成相关的api接口文档。（已支持）

## 🤝 贡献指南
1. Fork 本仓库
2. 创建特性分支 (git checkout -b feature/amazing-feature)
3. 提交更改 (git commit -m 'Add some amazing feature')
4. 推送到分支 (git push origin feature/amazing-feature)
5. 创建 Pull Request

## 📞 联系
- 作者: CodeKungfu
- 邮箱:

## 💴 捐赠支持
<div align="center">
    <img src="https://raw.githubusercontent.com/CodeKungfu/lumi-cms/main/apps/web/src/assets/images/pay.jpgs" alt="Donate" width="300" />
    <p>你可以请作者喝杯咖啡表示鼓励</p>
</div>

## 项目 Star 历史

[![Star History Chart](https://api.star-history.com/svg?repos=codeKungfu/lumi-cms&type=Date)](https://star-history.com/#codeKungfu/lumi-cms&Date)

## 📄 许可证
MIT License


