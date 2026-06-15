import { PrismaClient } from '@prisma/client';

let instance: PrismaClient | undefined;

// 本地默认使用 SQLite，且生成的客户端启用了 driverAdapters(engineType=wasm)，
// 因此必须传入 driver adapter，否则 DateTime 等类型的读写格式不一致会报错。
// 切换到 MySQL 时(设置 DATABASE_URL 并执行 db:gen:mysql)生成的客户端不含 driverAdapters，
// 此时使用原生 PrismaClient，不传 adapter。
function createPrismaClient(): PrismaClient {
  if (process.env.DATABASE_URL) {
    return new PrismaClient();
  }

  // 仅在本地 Node + SQLite 时按需加载原生 better-sqlite3。
  // 使用运行时 require + 惰性单例，确保该原生模块不会在 Cloudflare Workers
  // (apps/hono 走 D1，仅使用 PrismaClient 类、不访问下面的 prisma 单例) 启动时被加载。
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const path = require('node:path');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { PrismaBetterSQLite3 } = require('@prisma/adapter-better-sqlite3');
  // dist/client.js -> ../prisma/dev.db (packages/database/prisma/dev.db)
  const dbPath = path.resolve(__dirname, '../prisma/dev.db');
  const adapter = new PrismaBetterSQLite3({ url: `file:${dbPath}` });
  return new PrismaClient({ adapter });
}

function getPrismaClient(): PrismaClient {
  if (!instance) {
    instance = createPrismaClient();
  }
  return instance;
}

// 惰性单例：只有真正访问 prisma 的属性时才创建客户端。
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient();
    const value = Reflect.get(client, prop, client);
    return typeof value === 'function' ? value.bind(client) : value;
  },
});

// 导出 PrismaClient 类型
export { PrismaClient };

// 导出所有 Prisma 生成的类型
export * from '@prisma/client';
