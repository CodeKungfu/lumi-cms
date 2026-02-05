import { PrismaD1 } from '@prisma/adapter-d1'
import { PrismaClient } from '@repo/database'

// 定义全局类型以防止 TS 报错
declare global {
  var prisma: PrismaClient | undefined
}

export function getPrisma(db: any) {
  // 关键修复：Cannot read properties of undefined (reading 'bind')
  if (!db) {
    throw new Error('D1Database binding is missing')
  }

  const adapter = new PrismaD1(db)
  return new PrismaClient({ adapter })
}
