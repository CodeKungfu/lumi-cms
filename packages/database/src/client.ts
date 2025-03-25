import { PrismaClient } from '@prisma/client';

// 创建 Prisma 客户端实例
export const prisma = new PrismaClient();

// 导出 PrismaClient 类型
export { PrismaClient };

// 导出所有 Prisma 生成的类型
export * from '@prisma/client';