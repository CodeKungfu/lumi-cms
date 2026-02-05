# Lumi-CMS

<div align="center">
  <img src="https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/Vue.js-%2335495e.svg?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D" alt="Vue.js" />
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
  <img src="https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white" alt="Redis" />
  <img src="https://img.shields.io/badge/cloudflare-%23F38020.svg?style=for-the-badge&logo=cloudflare&logoColor=white" alt="Cloudflare" />
</div>

<div align="center">
   <p>A full-stack application based on Nest.js, Hono, Prisma, and Vue3, using a monorepo structure to manage multiple applications and packages.</p>
   <p>Official Website: <a href="https://lumi-cms-web.pages.dev/">https://lumi-cms-web.pages.dev/</a></p>
</div>

<span> English | [简体中文](https://github.com/CodeKungfu/lumi-cms/blob/main/Readme.md)</span>

## 🏢 Platform Introduction

Lumi CMS is dedicated to building an independent, modern Node.js content management system. Moving beyond being just a replica of the Java version, we combine cutting-edge technologies like NestJS, Prisma, and Vue3 to explore the best practices in full-stack development.

We warmly welcome everyone to **Star** and use Lumi CMS. The project is actively maintained, and if you find any bugs or have suggestions, please feel free to submit an Issue. We will fix them promptly and continuously improve the platform together with the community.

## 📖 Project Introduction

This project is a modern full-stack application framework that combines:

- **Frontend**: Modern Vue management system
- **Backend**: 
  - **Node.js**: API service built with Nest.js
  - **Serverless**: Cloudflare Workers service built with Hono
- **Database**: MySQL database connected via Prisma ORM (Supports SQLite/Cloudflare D1 for local development)
- **Cache**: Redis for caching and session management (Supports MockRedis for local development)

The project uses a pnpm workspace managed monorepo structure for easy code sharing and unified management.

## 🏗️ Project Structure
```
lumi-cms/
├── apps/                      # Applications directory
│   ├── api/                   # Backend Nest.js application (Node.js)
│   ├── hono/                  # Backend Hono application (Cloudflare Workers)
│   └── web/                   # Frontend Vue application
├── packages/                  # Shared packages directory
│   ├── database/              # Prisma database models and client
│   └── eslint-config/         # Shared ESLint configuration
├── docker-compose.all.yml     # Docker Compose configuration file
├── pnpm-workspace.yaml        # pnpm workspace configuration
└── README.en.md               # Project documentation
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
<summary><b>Backend (apps/api & apps/hono)</b></summary>

- Nest.js (Node.js Runtime)
- Hono (Cloudflare Workers Runtime)
- Prisma ORM
- JWT Authentication
- Redis Cache
- Cloudflare D1 (Serverless Database)

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
- MySQL 8.0+ (Optional, SQLite available for local dev)
- Redis 6.2+ (Optional, MockRedis available for local dev)
- Cloudflare Wrangler (Optional, for Cloudflare deployment)
- Docker & Docker Compose (Optional, for containerized deployment)

## 🚀 Quick Start

### Development Environment Run (Zero Dependency)

```bash
# Install pnpm (if not already installed)
npm install -g pnpm

# Install dependencies
pnpm install

# Start all services (Frontend + Backend API)
pnpm dev
```

#### Start Services Separately (Optional)

Start Backend Service:
```bash
pnpm --filter api dev
```

Start Frontend Service:
```bash
pnpm --filter web dev
```

### Cloudflare Workers Development

```bash
# Start Hono backend (Workers)
cd apps/hono
pnpm dev

# Start frontend (Connect to Workers backend)
cd apps/web
pnpm dev:cf
```

### Development Environment Run (Requires Redis & MySQL)

1. Start Database and Redis (Using Docker, Optional)
> If using SQLite and MockRedis (default config), skip this step.
```bash
docker-compose up mysql redis -d
```

2. Start Backend Service
```bash
pnpm --filter api dev
```

3. Start Frontend Service
```bash
pnpm --filter web dev
```

## 📦 Production Deployment

Deploy all services with one click using Docker Compose:
```bash
docker-compose -f docker-compose.all.yml up -d
```

## ⚙️ Configuration
### Environment Variables

Backend Service (apps/api):

- NODE_ENV: Environment mode (development/production)
- JWT_SECRET: JWT Secret
- DATABASE_URL: Database connection URL
- SERVER_PORT: API service port
- MYSQL_*: MySQL database configuration
- REDIS_*: Redis configuration

Frontend Service (apps/web) supports:

- VITE_APP_BASE_API: API base path

## 👨‍💻 Development Guide
### Database Migration

Run database migrations using Prisma:
```bash
cd packages/database
npx prisma migrate dev --name <migration-name>
```

✨ Project Features
- Separated Frontend and Backend Architecture
- Frontend Management System based on Vue.js
- Backend API Service based on Nest.js
- Database Operations based on Prisma ORM
- Caching and Session Management based on Redis
- Authentication based on JWT
- Logging based on Winston
- Development based on TypeScript
- Code Standards based on ESLint and Prettier
- Unit Testing based on Jest
- Containerized Deployment based on Docker and Docker Compose

## 📝 Built-in Features (Lumi CMS Capabilities)
1. User Management: System operators management and configuration. (Supported)
2. Department Management: Organizational structure configuration (companies, departments, groups), tree structure display with data permissions. (Supported)
3. Post Management: Configuration of positions held by system users. (Supported)
4. Menu Management: Configuration of system menus, operation permissions, button permission identifiers, etc. (Supported)
5. Role Management: Role menu permission assignment, setting role data scope permissions by organization. (Supported)
6. Dictionary Management: Maintenance of fixed data frequently used in the system. (Supported)
7. Parameter Management: Dynamic configuration of common system parameters. (Supported)
8. Notice/Announcement: System notice and announcement publishing and maintenance. (Supported)
9. Operation Log: System normal operation log recording and querying; system exception information log recording and querying. (Supported)
10. Login Log: System login log recording and querying, including login exceptions. (Supported)
11. System Interface: Automatically generate related API documentation based on business code. (Supported)

## 🤝 Contribution
1. Fork this repository
2. Create a feature branch (git checkout -b feature/amazing-feature)
3. Commit your changes (git commit -m 'Add some amazing feature')
4. Push to the branch (git push origin feature/amazing-feature)
5. Create a Pull Request

## 📞 Contact
- Author: CodeKungfu
- Email:

## 💴 Donation
<div align="center">
    <img src="https://raw.githubusercontent.com/CodeKungfu/lumi-cms/main/apps/web/src/assets/images/pay.jpg" alt="Donate" width="300" />
    <p>You can buy the author a coffee to show your support</p>
</div>

## Project Star History

[![Star History Chart](https://api.star-history.com/svg?repos=codeKungfu/lumi-cms&type=Date)](https://star-history.com/#codeKungfu/lumi-cms&Date)

## 📄 License
MIT License
