import path from 'node:path';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSQLite3 } from '@prisma/adapter-better-sqlite3';

// 本地默认使用 SQLite，且生成的客户端启用了 driverAdapters(engineType=wasm)，
// 因此必须传入 driver adapter，否则 DateTime 等类型的读写格式不一致会报错。
// 切换到 MySQL 时(设置 DATABASE_URL 并执行 db:gen:mysql)生成的客户端不含 driverAdapters，
// 此时使用原生 PrismaClient，不传 adapter。
function createPrismaClient(): PrismaClient {
  if (process.env.DATABASE_URL) {
    return new PrismaClient();
  }

  // dist/client.js -> ../prisma/dev.db (packages/database/prisma/dev.db)
  const dbPath = path.resolve(__dirname, '../prisma/dev.db');
  const adapter = new PrismaBetterSQLite3({ url: `file:${dbPath}` });
  return new PrismaClient({ adapter });
}

// 创建 Prisma 客户端实例
export const prisma = createPrismaClient();

// 导出 PrismaClient 类型
export { PrismaClient };

// 导出所有 Prisma 生成的类型
export * from '@prisma/client';
