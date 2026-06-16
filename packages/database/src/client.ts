// @repo/database 仅作为 @prisma/client 的统一出口：
// apps/hono 从这里 import { PrismaClient }，并在运行时配合 @prisma/adapter-d1(PrismaD1) 使用。
export * from '@prisma/client';
