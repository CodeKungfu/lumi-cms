# Lumi-CMS

<div align="center">
  <img src="https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/Vue.js-%2335495e.svg?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D" alt="Vue.js" />
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
  <img src="https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white" alt="Redis" />
</div>

<div align="center">
   <p>A full-stack application based on Nest.js, Prisma, and RuoYi, using a monorepo structure to manage multiple applications and packages.</p>
</div>

<span> English | [简体中文](https://github.com/CodeKungfu/lumi-cms/blob/main/Readme.md)</span>

## 🏢 Platform Introduction

Special thanks to the original RuoYi developers for their open-source contributions and to my partners for their support. This has greatly motivated me to develop a Node.js version of RuoYi. The project is still in its early stages (WIP), and I welcome suggestions, issues, and pull requests.

The Java version of RuoYi is a popular rapid development platform, but this project serves as a learning reference for developers who are more familiar with Node.js or frontend development rather than Java.

This project is developed by an individual and has not undergone extensive or professional testing, so it is not recommended for production environments. For this reason, I've restructured the project to place both frontend and backend code in the same repository while maintaining a frontend-backend separation model. Future features will primarily be developed and upgraded here.

## 📖 Project Introduction

This project is a modern full-stack application framework that combines:

- **Frontend**: Vue management system based on RuoYi
- **Backend**: API service built with Nest.js
- **Database**: MySQL database connected via Prisma ORM (Supports SQLite for local development)
- **Cache**: Redis for caching and session management (Supports MockRedis for local development)

The project uses a pnpm workspace managed monorepo structure for easy code sharing and unified management.

## 🏗️ Project Structure
```
lumi-cms/
├── apps/                      # Applications directory
│   ├── api/                   # Backend Nest.js application
│   └── web/                   # Frontend Vue application
├── packages/                  # Shared packages directory
│   ├── database/              # risma database models and client
│   └── eslint-config/         # Shared ESLint configuration
├── docker-compose.all.yml     # Docker Compose configuration file
├── pnpm-workspace.yaml        # pnpm workspace configuration
└── README.en.md                  # Project documentation
```
## 🛠️ Technology Stack

<details open>
<summary><b>Frontend (apps/web)</b></summary>

- Vue.js
- Vite
- Element UI
- Axios
</details>

<details open>
<summary><b>Backend (apps/api)</b></summary>

- Nest.js
- Prisma ORM
- JWT Authentication
- Redis Cache
- Bull Queue
- Winston Logger
</details>

<details open>
<summary><b>Development Tools</b></summary>

- TypeScript
- ESLint
- Prettier
- Jest Testing Framework
</details>

## ⚡️ Zero Dependency Quick Start

This project is configured with **SQLite** and **MockRedis** by default, allowing developers to **run the project immediately without installing MySQL or Redis**.

- **Instant Setup**: Just clone the repo and install dependencies. No database setup required.
- **Out of the Box**: Perfect for quickly previewing features, learning the codebase, or simple development.
- **Seamless Switch**: Easily switch back to MySQL and Redis for production or higher performance needs via environment variables.

## 📋 Requirements

- Node.js 18+
- pnpm 7+
- MySQL 8.0+
- Redis 6.2+
- Docker & Docker Compose (optional, for containerized deployment)

## 🚀 Quick Start

### Development Environment Run (Zero Dependency)

```bash
# Install pnpm (if not already installed)
npm install -g pnpm

# Install project dependencies
pnpm install

# Start project (Starts both backend and frontend)
pnpm dev
```

#### Run Services Separately (Optional)

Start backend service:
```bash
pnpm --filter api dev
```

Start frontend service:
```bash
pnpm --filter web dev
```

## Development Environment Run (Requires Redis and MySQL)
1. 1. Start the database and Redis (using Docker, optional)
> If using SQLite and MockRedis (default configuration), you can skip this step.

```bash
docker-compose up mysql redis -d
```
2. Start the backend service
```bash
pnpm --filter api dev
```
3.  Start the frontend service
```bash
pnpm --filter web dev
```
## Production Deployment
Deploy all services with Docker Compose:

```bash
docker-compose -f docker-compose.all.yml up -d
```
## ⚙️ Configuration
### 环境变量

Backend service (apps/api) supports the following environment variables:

- NODE_ENV: Environment mode (development/production)
- JWT_SECRET: JWT secret key
- DATABASE_URL: Database connection URL
- SERVER_PORT: API service port
- MYSQL_*: MySQL database configuration
- REDIS_*: Redis configuration

Frontend service (apps/web) supports the following environment variables:：

- VITE_APP_BASE_API: API base path

## 👨‍💻 Development Guide
### Database Migration

Use Prisma for database migrations:
```bash
cd packages/database
npx prisma migrate dev --name <migration-name>
```

## ✨ Project Features
- Frontend-backend separation architecture
- Vue.js-based frontend management system
- Nest.js-based backend API service
- Prisma ORM-based database operations
- Redis-based caching and session management
- Bull-based queue management
- Winston-based logging
- TypeScript-based development
- ESLint and Prettier code standards
- Jest unit testing
- Docker and Docker Compose containerized deployment
## 📝 Built-in Features (reproduced RuoYi features, current version support)
1.  User Management: System operators, mainly for system user configuration. (Supported)
2.  Department Management: Configure system organizational structure (company, department, team), tree structure with data permission support. (Supported)
3.  Position Management: Configure system user positions. (Supported)
4.  Menu Management: Configure system menus, operation permissions, button permission identifiers, etc. (Supported)
5.  Role Management: Role menu permission assignment, setting role data scope permissions by organization. (Supported)
6.  Dictionary Management: Maintain relatively fixed data frequently used in the system. (Supported)
7.  Parameter Management: Configure common dynamic system parameters. (Supported)
8.  Notifications: System notification publishing and maintenance. (Supported)
9.  Operation Logs: Record and query system normal operation logs and exception logs.
10.  Login Logs: Record and query system login logs including login exceptions.
11.  Online Users: Monitor active user status in the current system.
12.  System Interfaces: Automatically generate relevant API documentation based on business code. (Supported)
## 🤝 Contribution Guidelines
1. Fork the repository
2. Create a feature branch (git checkout -b feature/amazing-feature)
3. Commit your changes (git commit -m 'Add some amazing feature')
4. Push to the branch (git push origin feature/amazing-feature)
5. Open a Pull Request
## 📞 Contact
- Author: CodeKungfu
- Email:

## � Donate
<div align="center">
    <img src="https://raw.githubusercontent.com/CodeKungfu/lumi-cms/main/apps/web/src/assets/images/pay.png" alt="Donate" width="300" />
    <p>You can buy the author a coffee to show your support</p>
</div>

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=codeKungfu/lumi-cms&type=Date)](https://star-history.com/#codeKungfu/lumi-cms&Date)

## �📄 License
MIT License

