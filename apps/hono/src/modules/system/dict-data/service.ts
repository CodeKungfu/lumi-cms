import { Context } from 'hono'
import { getPrisma } from '../../../lib/prisma'
import { Result } from '../../../common/result'

export class DictDataService {
  static async list(c: Context) {
    const env = c.env as any
    const db = getPrisma(env.DB)
    const query = c.req.query()
    
    const page = Number(query.pageNum || 1)
    const pageSize = Number(query.pageSize || 10)
    const skip = (page - 1) * pageSize

    const where: any = {}
    if (query.dictType) where.dictType = query.dictType
    if (query.dictLabel) where.dictLabel = { contains: query.dictLabel }
    if (query.status) where.status = query.status

    const [total, rows] = await Promise.all([
      db.sys_dict_data.count({ where }),
      db.sys_dict_data.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { dictSort: 'asc' }
      })
    ])

    const safeRows = JSON.parse(JSON.stringify(rows, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ))

    return Result.ok(c, { total, rows: safeRows })
  }

  static async getByType(c: Context) {
    const dictType = c.req.param('type')
    const env = c.env as any
    const db = getPrisma(env.DB)

    const list = await db.sys_dict_data.findMany({
      where: {
        dictType: dictType,
        status: '0'
      },
      orderBy: { dictSort: 'asc' }
    })

    const safeList = JSON.parse(JSON.stringify(list, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ))

    return Result.ok(c, safeList)
  }

  static async get(c: Context) {
    const id = Number(c.req.param('id'))
    const env = c.env as any
    const db = getPrisma(env.DB)
    const data = await db.sys_dict_data.findUnique({ where: { dictCode: id } })
    
    if (!data) return Result.fail(c, '数据不存在')

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
      await db.sys_dict_data.create({
        data: {
          dictSort: body.dictSort,
          dictLabel: body.dictLabel,
          dictValue: body.dictValue,
          dictType: body.dictType,
          cssClass: body.cssClass,
          listClass: body.listClass,
          isDefault: body.isDefault,
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
      await db.sys_dict_data.update({
        where: { dictCode: body.dictCode },
        data: {
          dictSort: body.dictSort,
          dictLabel: body.dictLabel,
          dictValue: body.dictValue,
          dictType: body.dictType,
          cssClass: body.cssClass,
          listClass: body.listClass,
          isDefault: body.isDefault,
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
      await db.sys_dict_data.deleteMany({
        where: { dictCode: { in: ids } }
      })
      return Result.ok(c, null, '删除成功')
    } catch (e) {
      return Result.fail(c, '删除失败')
    }
  }
}
