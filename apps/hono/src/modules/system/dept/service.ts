import { Context } from 'hono'
import { getPrisma } from '../../../lib/prisma'
import { Result } from '../../../common/result'
import { Utils } from '../../../common/utils'

export class DeptService {
  static async list(c: Context) {
    const env = c.env as any
    const db = getPrisma(env.DB)
    
    const { deptName, status } = await c.req.query()
    
    const where: any = {}
    if (deptName) where.deptName = { contains: deptName }
    if (status) where.status = status

    const list = await db.sys_dept.findMany({
      where,
      orderBy: { orderNum: 'asc' }
    })

    const total = await db.sys_dept.count({ where })
    
    const safeList = JSON.parse(JSON.stringify(list, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ))

    return Result.ok(c, { total, rows: safeList })
  }

  static async exclude(c: Context) {
    const id = Number(c.req.param('id'))
    const env = c.env as any
    const db = getPrisma(env.DB)

    const list = await db.sys_dept.findMany({
      where: {
        deptId: { not: id }
      },
      orderBy: { orderNum: 'asc' }
    })

    const safeList = JSON.parse(JSON.stringify(list, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ))

    // return Result.ok(c, safeList)
    return Result.ok(c, { total: safeList.length, rows: safeList })
  }

  static async deptTree(c: Context) {
    const env = c.env as any
    const db = getPrisma(env.DB)

    const list = await db.sys_dept.findMany({
      orderBy: { orderNum: 'asc' }
    })

    const deptArr = list.map((item: any) => ({
      parentId: Number(item.parentId ?? 0),
      id: Number(item.deptId),
      label: item.deptName
    }))

    const tree = Utils.buildTreeData(deptArr, 'id', 'parentId', 'children')
    return Result.ok(c, tree)
  }

  static async get(c: Context) {
    const id = Number(c.req.param('id'))
    const env = c.env as any
    const db = getPrisma(env.DB)

    const dept = await db.sys_dept.findUnique({
      where: { deptId: id }
    })

    if (!dept) return Result.fail(c, '部门不存在')

    const safeDept = JSON.parse(JSON.stringify(dept, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ))

    return Result.ok(c, { data: safeDept })
  }

  static async add(c: Context) {
    const body = await c.req.json()
    const env = c.env as any
    const db = getPrisma(env.DB)

    try {
      await db.sys_dept.create({
        data: {
          parentId: body.parentId,
          deptName: body.deptName,
          orderNum: body.orderNum,
          leader: body.leader,
          phone: body.phone,
          email: body.email,
          status: body.status,
          createTime: new Date(),
          createBy: body.createBy || ''
        }
      })
      return Result.ok(c, null, '新增成功')
    } catch (e) {
      return Result.fail(c, '新增失败: ' + (e as Error).message)
    }
  }

  static async update(c: Context) {
    const body = await c.req.json()
    const env = c.env as any
    const db = getPrisma(env.DB)

    if (!body.deptId) return Result.fail(c, 'ID不能为空')

    try {
      await db.sys_dept.update({
        where: { deptId: body.deptId },
        data: {
          parentId: body.parentId,
          deptName: body.deptName,
          orderNum: body.orderNum,
          leader: body.leader,
          phone: body.phone,
          email: body.email,
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
    const id = Number(c.req.param('id'))
    const env = c.env as any
    const db = getPrisma(env.DB)

    // 检查是否有子部门
    const hasChildren = await db.sys_dept.findFirst({
      where: { parentId: id }
    })
    if (hasChildren) {
      return Result.fail(c, '存在子部门,不允许删除')
    }

    // 检查是否有用户分配到该部门
    const hasUser = await db.sys_user.findFirst({
      where: { deptId: id }
    })
    if (hasUser) {
      return Result.fail(c, '部门下存在用户,不允许删除')
    }

    try {
      await db.sys_dept.delete({
        where: { deptId: id }
      })
      return Result.ok(c, null, '删除成功')
    } catch (e) {
      return Result.fail(c, '删除失败')
    }
  }
}
