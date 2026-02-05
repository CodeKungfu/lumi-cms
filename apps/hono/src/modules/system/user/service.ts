import { Context } from 'hono'
import { getPrisma } from '../../../lib/prisma'
import { Result } from '../../../common/result'
import { Utils } from '../../../common/utils'

export class UserService {
  static async list(c: Context) {
    const env = c.env as any
    const db = getPrisma(env.DB)
    
    const query = c.req.query()
    const page = Number(query.pageNum || 1)
    const pageSize = Number(query.pageSize || 10)
    const skip = (page - 1) * pageSize

    const where: any = {
      delFlag: '0'
    }

    if (query.userName) where.userName = { contains: query.userName }
    if (query.phonenumber) where.phonenumber = { contains: query.phonenumber }
    if (query.status) where.status = query.status
    if (query.deptId) where.deptId = Number(query.deptId)

    const [total, rows] = await Promise.all([
      db.sys_user.count({ where }),
      db.sys_user.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createTime: 'desc' },
        include: {
          dept: true
        }
      })
    ])

    const safeRows = JSON.parse(JSON.stringify(rows, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ))

    return Result.ok(c, {
      total,
      rows: safeRows,
    })
  }

  static async get(c: Context) {
    const idParam = c.req.param('id')
    const env = c.env as any
    const db = getPrisma(env.DB)

    let id: number
    if (idParam === 'profile') {
       const payload = c.get('jwtPayload')
       id = payload.uid
    } else {
       id = Number(idParam)
    }

    // Check if user exists
    const user = await db.sys_user.findUnique({
      where: { userId: id }
    })

    if (!user) return Result.fail(c, '用户不存在')

    // Get roles and posts for selection
    const [roles, posts, userRoles, userPosts] = await Promise.all([
      db.sys_role.findMany(),
      db.sys_post.findMany(),
      db.sys_user_role.findMany({ where: { userId: id } }),
      db.sys_user_post.findMany({ where: { userId: id } })
    ])

    const roleIds = userRoles.map((ur: any) => Number(ur.roleId))
    const postIds = userPosts.map((up: any) => Number(up.postId))

    const safeUser = JSON.parse(JSON.stringify(user, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ))

    return Result.ok(c, {
      data: safeUser,
      roles,
      posts,
      roleIds,
      postIds
    })
  }

  static async add(c: Context) {
    const body = await c.req.json()
    const env = c.env as any
    const db = getPrisma(env.DB)

    if (!body.userName || !body.password) {
      return Result.fail(c, '用户名和密码不能为空')
    }

    // Check unique
    const exists = await db.sys_user.findFirst({
      where: { userName: body.userName }
    })
    if (exists) return Result.fail(c, '用户已存在')

    try {
      await db.$transaction(async (tx: any) => {
        const newUser = await tx.sys_user.create({
          data: {
            deptId: body.deptId,
            userName: body.userName,
            nickName: body.nickName || body.userName,
            password: Utils.md5(body.password),
            email: body.email,
            phonenumber: body.phonenumber,
            sex: body.sex,
            avatar: body.avatar,
            status: body.status || '0',
            delFlag: '0',
            remark: body.remark,
            createTime: new Date(),
            createBy: body.createBy || ''
          }
        })

        const userId = newUser.userId

        if (body.roleIds && body.roleIds.length > 0) {
          for (const roleId of body.roleIds) {
            await tx.sys_user_role.create({
              data: { userId, roleId: Number(roleId) }
            })
          }
        }

        if (body.postIds && body.postIds.length > 0) {
          for (const postId of body.postIds) {
            await tx.sys_user_post.create({
              data: { userId, postId: Number(postId) }
            })
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

    if (!body.userId) return Result.fail(c, 'ID不能为空')

    try {
      await db.$transaction(async (tx: any) => {
        await tx.sys_user.update({
          where: { userId: body.userId },
          data: {
            deptId: body.deptId,
            nickName: body.nickName,
            email: body.email,
            phonenumber: body.phonenumber,
            sex: body.sex,
            avatar: body.avatar,
            status: body.status,
            remark: body.remark,
            updateTime: new Date(),
            updateBy: body.updateBy || ''
          }
        })

        const userId = body.userId

        // Update roles
        if (body.roleIds) {
          await tx.sys_user_role.deleteMany({ where: { userId } })
          for (const roleId of body.roleIds) {
            await tx.sys_user_role.create({
              data: { userId, roleId: Number(roleId) }
            })
          }
        }

        // Update posts
        if (body.postIds) {
          await tx.sys_user_post.deleteMany({ where: { userId } })
          for (const postId of body.postIds) {
            await tx.sys_user_post.create({
              data: { userId, postId: Number(postId) }
            })
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

    if (ids.includes(1)) return Result.fail(c, '不能删除超级管理员')

    try {
      await db.$transaction(async (tx: any) => {
        await tx.sys_user_role.deleteMany({
          where: { userId: { in: ids } }
        })
        await tx.sys_user_post.deleteMany({
          where: { userId: { in: ids } }
        })
        await tx.sys_user.deleteMany({
          where: { userId: { in: ids } }
        })
      })
      return Result.ok(c, null, '删除成功')
    } catch (e) {
      return Result.fail(c, '删除失败')
    }
  }

  static async changeStatus(c: Context) {
    const body = await c.req.json()
    const env = c.env as any
    const db = getPrisma(env.DB)

    try {
      await db.sys_user.update({
        where: { userId: body.userId },
        data: { status: body.status }
      })
      return Result.ok(c, null, '修改成功')
    } catch (e) {
      return Result.fail(c, '修改失败')
    }
  }

  static async resetPwd(c: Context) {
    const body = await c.req.json()
    const env = c.env as any
    const db = getPrisma(env.DB)

    try {
      await db.sys_user.update({
        where: { userId: body.userId },
        data: { password: Utils.md5(body.password) }
      })
      return Result.ok(c, null, '重置成功')
    } catch (e) {
      return Result.fail(c, '重置失败')
    }
  }

  static async updateProfile(c: Context) {
    const body = await c.req.json()
    const env = c.env as any
    const db = getPrisma(env.DB)
    const payload = c.get('jwtPayload')
    const userId = payload.uid

    try {
      await db.sys_user.update({
        where: { userId },
        data: {
          nickName: body.nickName,
          email: body.email,
          phonenumber: body.phonenumber,
          sex: body.sex,
          avatar: body.avatar
        }
      })
      return Result.ok(c, null, '修改成功')
    } catch (e) {
      return Result.fail(c, '修改失败')
    }
  }

  static async getAuthRole(c: Context) {
    const userId = Number(c.req.param('userId'))
    const env = c.env as any
    const db = getPrisma(env.DB)

    const user = await db.sys_user.findUnique({ where: { userId } })
    const roles = await db.sys_role.findMany({ where: { delFlag: '0' } })
    const userRoles = await db.sys_user_role.findMany({ where: { userId } })

    const userRoleIds = userRoles.map((ur: any) => Number(ur.roleId))

    // Mark checked roles
    const rolesWithFlag = roles.map((role: any) => ({
      ...role,
      flag: userRoleIds.includes(Number(role.roleId))
    }))

    const safeUser = JSON.parse(JSON.stringify(user, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ))

    const safeRoles = JSON.parse(JSON.stringify(rolesWithFlag, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ))

    return Result.ok(c, {
      user: safeUser,
      roles: safeRoles
    })
  }

  static async updateAuthRole(c: Context) {
    const query = c.req.query()
    const userId = Number(query.userId)
    const roleIds = query.roleIds

    const env = c.env as any
    const db = getPrisma(env.DB)

    try {
      await db.$transaction(async (tx: any) => {
        await tx.sys_user_role.deleteMany({ where: { userId } })
        
        if (roleIds) {
          const ids = roleIds.split(',')
          for (const roleId of ids) {
            await tx.sys_user_role.create({
              data: { userId, roleId: Number(roleId) }
            })
          }
        }
      })
      return Result.ok(c, null, '授权成功')
    } catch (e) {
      return Result.fail(c, '授权失败')
    }
  }
}
