import { Context } from 'hono'
import { getPrisma } from '../../../lib/prisma'
import { Result } from '../../../common/result'

export class LoginInforService {
  static async list(c: Context) {
    const env = c.env as any
    const db = getPrisma(env.DB)
    const query = c.req.query()
    
    const page = Number(query.pageNum || 1)
    const pageSize = Number(query.pageSize || 10)
    const skip = (page - 1) * pageSize

    const where: any = {}
    if (query.userName) where.userName = { contains: query.userName }
    if (query.ipaddr) where.ipaddr = { contains: query.ipaddr }
    if (query.status) where.status = query.status

    const [total, rows] = await Promise.all([
      db.sys_logininfor.count({ where }),
      db.sys_logininfor.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { loginTime: 'desc' }
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
      await db.sys_logininfor.deleteMany({
        where: { infoId: { in: ids } }
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
      await db.sys_logininfor.deleteMany()
      return Result.ok(c, null, '清空成功')
    } catch (e) {
      return Result.fail(c, '清空失败')
    }
  }
}
