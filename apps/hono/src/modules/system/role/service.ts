import { Context } from 'hono'
import { getPrisma } from '../../../lib/prisma'
import { Result } from '../../../common/result'

export class RoleService {
  static async list(c: Context) {
    const env = c.env as any
    const db = getPrisma(env.DB)
    
    const { roleName, roleKey, status, pageNum, pageSize } = c.req.query()
    
    const where: any = {
      roleId: { not: 1 } // 排除超级管理员
    }
    if (roleName) where.roleName = { contains: roleName }
    if (roleKey) where.roleKey = { contains: roleKey }
    if (status) where.status = status

    // 分页
    const page = Number(pageNum || 1)
    const limit = Number(pageSize || 10)
    const skip = (page - 1) * limit

    const [total, rows] = await Promise.all([
      db.sys_role.count({ where }),
      db.sys_role.findMany({
        where,
        skip,
        take: limit,
        orderBy: { roleSort: 'asc' }
      })
    ])

    const safeRows = JSON.parse(JSON.stringify(rows, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ))

    return Result.ok(c, {
      rows: safeRows,
      total
    })
  }

  static async get(c: Context) {
    const id = Number(c.req.param('id'))
    const env = c.env as any
    const db = getPrisma(env.DB)

    const role = await db.sys_role.findUnique({
      where: { roleId: id }
    })

    if (!role) return Result.fail(c, '角色不存在')

    const safeRole = JSON.parse(JSON.stringify(role, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ))

    return Result.ok(c, { data: safeRole })
  }

  static async add(c: Context) {
    const body = await c.req.json()
    const env = c.env as any
    const db = getPrisma(env.DB)

    // 开启事务处理角色和菜单关联
    try {
      await db.$transaction(async (tx: any) => {
        const role = await tx.sys_role.create({
          data: {
            roleName: body.roleName,
            roleKey: body.roleKey,
            roleSort: body.roleSort,
            status: body.status,
            remark: body.remark,
            createTime: new Date(),
            createBy: body.createBy || ''
          }
        })

        // 处理菜单关联
        if (body.menuIds && body.menuIds.length > 0) {
          const menuData = body.menuIds.map((menuId: number) => ({
            roleId: role.roleId,
            menuId
          }))
          // D1 不支持 createMany，需要循环
          for (const item of menuData) {
            await tx.sys_role_menu.create({ data: item })
          }
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

    if (!body.roleId) return Result.fail(c, 'ID不能为空')

    try {
      await db.$transaction(async (tx: any) => {
        await tx.sys_role.update({
          where: { roleId: body.roleId },
          data: {
            roleName: body.roleName,
            roleKey: body.roleKey,
            roleSort: body.roleSort,
            status: body.status,
            remark: body.remark,
            updateTime: new Date(),
            updateBy: body.updateBy || ''
          }
        })

        const roleId = body.roleId

        // 更新菜单关联
        if (body.menuIds) {
          // 先删除
          await tx.sys_role_menu.deleteMany({
            where: { roleId: roleId }
          })
          // 后新增
          const menuData = body.menuIds.map((menuId: number) => ({
            roleId: roleId,
            menuId
          }))
          for (const item of menuData) {
            await tx.sys_role_menu.create({ data: item })
          }
        }
      })
      return Result.ok(c, null, '修改成功')
    } catch (e) {
      return Result.fail(c, '修改失败: ' + (e as Error).message)
    }
  }

  static async remove(c: Context) {
    const ids = c.req.param('ids').split(',').map(Number)
    const env = c.env as any
    const db = getPrisma(env.DB)

    try {
      await db.$transaction(async (tx: any) => {
        // 删除关联
        await tx.sys_role_menu.deleteMany({
          where: { roleId: { in: ids } }
        })
        await tx.sys_role_dept.deleteMany({
          where: { roleId: { in: ids } }
        })
        await tx.sys_user_role.deleteMany({
          where: { roleId: { in: ids } }
        })
        // 删除角色
        await tx.sys_role.deleteMany({
          where: { roleId: { in: ids } }
        })
      })
      return Result.ok(c, null, '删除成功')
    } catch (e) {
      return Result.fail(c, '删除失败')
    }
  }
}
