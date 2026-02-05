import { Context } from 'hono'
import { getPrisma } from '../../../lib/prisma'
import { Result } from '../../../common/result'

export class PostService {
  static async list(c: Context) {
    const env = c.env as any
    const db = getPrisma(env.DB)
    const query = c.req.query()
    
    const page = Number(query.pageNum || 1)
    const pageSize = Number(query.pageSize || 10)
    const skip = (page - 1) * pageSize

    const where: any = {}
    if (query.postCode) where.postCode = { contains: query.postCode }
    if (query.postName) where.postName = { contains: query.postName }
    if (query.status) where.status = query.status

    const [total, rows] = await Promise.all([
      db.sys_post.count({ where }),
      db.sys_post.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { postSort: 'asc' }
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
    const data = await db.sys_post.findUnique({ where: { postId: id } })
    
    if (!data) return Result.fail(c, '岗位不存在')

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
      await db.sys_post.create({
        data: {
          postCode: body.postCode,
          postName: body.postName,
          postSort: body.postSort,
          status: body.status,
          remark: body.remark,
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
      await db.sys_post.update({
        where: { postId: body.postId },
        data: {
          postCode: body.postCode,
          postName: body.postName,
          postSort: body.postSort,
          status: body.status,
          remark: body.remark,
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
      await db.sys_post.deleteMany({
        where: { postId: { in: ids } }
      })
      return Result.ok(c, null, '删除成功')
    } catch (e) {
      return Result.fail(c, '删除失败')
    }
  }
}
