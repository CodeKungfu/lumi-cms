import { Context } from 'hono'
import { getPrisma } from '../../../lib/prisma'
import { Result } from '../../../common/result'

export class OperLogService {
  static async list(c: Context) {
    const env = c.env as any
    const db = getPrisma(env.DB)
    const query = c.req.query()
    
    const page = Number(query.pageNum || 1)
    const pageSize = Number(query.pageSize || 10)
    const skip = (page - 1) * pageSize

    const where: any = {}
    if (query.title) where.title = { contains: query.title }
    if (query.operName) where.operName = { contains: query.operName }
    if (query.status) where.status = Number(query.status)
    if (query.businessType) where.businessType = Number(query.businessType)

    const [total, rows] = await Promise.all([
      db.sys_oper_log.count({ where }),
      db.sys_oper_log.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { operTime: 'desc' }
      })
    ])

    const safeRows = JSON.parse(JSON.stringify(rows, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ))

    return Result.ok(c, { total, rows: safeRows })
  }

  static async remove(c: Context) {
    const ids = c.req.param('ids').split(',').map(Number)
    const env = c.env as any
    const db = getPrisma(env.DB)
    
    try {
      await db.sys_oper_log.deleteMany({
        where: { operId: { in: ids } }
      })
      return Result.ok(c, null, '删除成功')
    } catch (e) {
      return Result.fail(c, '删除失败')
    }
  }

  static async clean(c: Context) {
    const env = c.env as any
    const db = getPrisma(env.DB)
    try {
      await db.sys_oper_log.deleteMany()
      return Result.ok(c, null, '清空成功')
    } catch (e) {
      return Result.fail(c, '清空失败')
    }
  }
}
