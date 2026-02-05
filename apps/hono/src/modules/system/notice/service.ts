import { Context } from 'hono'
import { getPrisma } from '../../../lib/prisma'
import { Result } from '../../../common/result'

export class NoticeService {
  static async list(c: Context) {
    const env = c.env as any
    const db = getPrisma(env.DB)
    const query = c.req.query()
    
    const page = Number(query.pageNum || 1)
    const pageSize = Number(query.pageSize || 10)
    const skip = (page - 1) * pageSize

    const where: any = {}
    if (query.noticeTitle) where.noticeTitle = { contains: query.noticeTitle }
    if (query.noticeType) where.noticeType = query.noticeType
    if (query.createBy) where.createBy = { contains: query.createBy }

    const [total, rows] = await Promise.all([
      db.sys_notice.count({ where }),
      db.sys_notice.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createTime: 'desc' }
      })
    ])

    const safeRows = JSON.parse(JSON.stringify(rows, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ))

    return Result.ok(c, { total, rows: safeRows })
  }

  static async get(c: Context) {
    const id = Number(c.req.param('id'))
    const env = c.env as any
    const db = getPrisma(env.DB)
    const data = await db.sys_notice.findUnique({ where: { noticeId: id } })
    
    if (!data) return Result.fail(c, '通知不存在')

    const safeData = JSON.parse(JSON.stringify(data, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ))
    return Result.ok(c, { data: safeData })
  }

  static async add(c: Context) {
    const body = await c.req.json()
    const env = c.env as any
    const db = getPrisma(env.DB)
    
    try {
      await db.sys_notice.create({
        data: {
          noticeTitle: body.noticeTitle,
          noticeType: body.noticeType,
          noticeContent: body.noticeContent,
          status: body.status,
          createTime: new Date(),
          createBy: body.createBy || ''
        }
      })
      return Result.ok(c, null, '新增成功')
    } catch (e) {
      return Result.fail(c, '新增失败')
    }
  }

  static async update(c: Context) {
    const body = await c.req.json()
    const env = c.env as any
    const db = getPrisma(env.DB)
    
    try {
      await db.sys_notice.update({
        where: { noticeId: body.noticeId },
        data: {
          noticeTitle: body.noticeTitle,
          noticeType: body.noticeType,
          noticeContent: body.noticeContent,
          status: body.status,
          updateTime: new Date(),
          updateBy: body.updateBy || ''
        }
      })
      return Result.ok(c, null, '修改成功')
    } catch (e) {
      return Result.fail(c, '修改失败')
    }
  }

  static async remove(c: Context) {
    const ids = c.req.param('ids').split(',').map(Number)
    const env = c.env as any
    const db = getPrisma(env.DB)
    
    try {
      await db.sys_notice.deleteMany({
        where: { noticeId: { in: ids } }
      })
      return Result.ok(c, null, '删除成功')
    } catch (e) {
      return Result.fail(c, '删除失败')
    }
  }
}
