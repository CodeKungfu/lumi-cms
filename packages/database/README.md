# @repo/database

Shared database package using Prisma ORM. This package manages the database schema, client generation, and initialization scripts for the Lumi CMS project.

## 📦 Contents

- **Prisma Schema**:
  - `prisma/schema.prisma`: Main schema for MySQL (Production).
  - `prisma/schema.sqlite.prisma`: Auto-generated schema for SQLite (Local Development).
- **SQL Scripts**:
  - `sql/ry_20231130.sql`: Initial database schema and data (compatible with MySQL).
- **Client**: Generated Prisma Client exported for use in other applications.

## 🚀 Usage

### Installation

This package is a workspace dependency. To use it in another package (e.g., `apps/api`), add it to `package.json`:

```json
"dependencies": {
  "@repo/database": "workspace:*"
}
```

### Importing Prisma Client

```typescript
import { prisma } from '@repo/database';

// Use prisma instance
const users = await prisma.sys_user.findMany();
```

## 🛠️ Scripts

Run these commands from the root or within `packages/database`:

- `pnpm db:gen`: Generate Prisma Client (automatically detects environment).
- `pnpm db:push`: Push schema changes to the database (prototyping).
- `pnpm db:migrate:dev`: Create a migration and apply it (development).
- `pnpm db:migrate:deploy`: Apply pending migrations (production).
- `pnpm db:seed`: Seed the database (currently via SQL file for MySQL).

## 🗄️ Database Initialization

### MySQL (Production/Docker)

The `sql/` directory is mounted to the MySQL container's `/docker-entrypoint-initdb.d` directory in `docker-compose.yml`. This means that when the MySQL container starts for the first time, it will automatically execute the SQL files to initialize the database structure and default data.

If you are setting up MySQL manually:
1. Create a database named `lumi-cms`.
2. Import `sql/ry_20231130.sql` into the database.

### SQLite (Local Development)

For local development without Docker, the project can use SQLite.
1. The schema is automatically adapted for SQLite in `prisma/schema.sqlite.prisma`.
2. To initialize the SQLite database with data, you may need to execute the SQL statements from `sql/ry_20231130.sql` (adapted for SQLite syntax) or rely on Prisma migrations if configured.
   *(Note: The `apps/api` application has logic to handle SQLite initialization in some contexts, or you can use `prisma db push` to create tables).*

## 📝 SQL Files

- **`ry_20231130.sql`**: The base SQL file containing the table structures and initial data (users, roles, menus, etc.).
  - Default Admin: `admin` / `123456`
  - Default Test User: `lumi` / `123456`

## 🔄 Schema Synchronization

When you modify `prisma/schema.prisma` (MySQL), remember to regenerate the SQLite schema:

```bash
pnpm db:gen
```

This command runs a script to transform the MySQL schema into an SQLite-compatible schema (`prisma/schema.sqlite.prisma`) and generates the client.
