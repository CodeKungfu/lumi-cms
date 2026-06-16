import { Context } from 'hono'
import { getPrisma } from '../../../lib/prisma'
import { Utils } from '../../../common/utils'
import { Result } from '../../../common/result'
import { sign, verify } from 'hono/jwt'
import { CaptchaGenerator } from '../../../lib/captcha'

export class AuthService {
  static async login(c: Context) {
    const body = await c.req.json()
    // 兼容前端参数 verifyCode -> code, captchaId -> uuid
    const username = body.username
    const password = body.password
    const code = body.code || body.verifyCode
    const uuid = body.uuid || body.captchaId

    const env = c.env as any
    const db = getPrisma(env.DB)

    // 1. 校验验证码 (无状态 JWT 校验)
    try {
      if (!code || !uuid) {
        return Result.fail(c, '验证码不能为空', 500)
      }
      
      // uuid 实际上是加密后的 token
      const payload = await verify(uuid, env.JWT_SECRET || 'supersecretkey', 'HS256')
      
      // 检查过期时间 (虽然 verify 会检查 exp，但双重保险)
      if (Date.now() / 1000 > (payload.exp as number)) {
        return Result.fail(c, '验证码已过期', 500)
      }
      
      // 检查验证码内容 (忽略大小写)
      if ((payload.code as string).toLowerCase() !== code.toLowerCase()) {
        return Result.fail(c, '验证码错误', 500)
      }
    } catch (e) {
      return Result.fail(c, '验证码无效或已过期', 500)
    }

    // 2. 查询用户
    const user = await db.sys_user.findFirst({
      where: { userName: username }
    })

    if (!user) {
      return Result.fail(c, '用户不存在', 500)
    }

    // 3. 校验密码
    // 假设密码是 MD5 加密
    if (user.password !== Utils.md5(password)) {
      return Result.fail(c, '密码错误', 500)
    }

    // 4. 生成 Token
    const payload = {
      uid: Number(user.userId),
      username: user.userName,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 1 day
    }
    const token = await sign(payload, env.JWT_SECRET || 'supersecretkey')

    return Result.ok(c, { token })
  }

  static async logout(c: Context) {
    return Result.ok(c, null, '退出成功')
  }

  static async getCaptcha(c: Context) {
    // 生成随机 4 位验证码
    const code = CaptchaGenerator.randomCode(4)
    
    // 生成 SVG
    const svg = CaptchaGenerator.create(code)
    
    // 生成加密 Token 作为 uuid
    // 将 code 加密到 token 中，设置 5 分钟过期
    const env = c.env as any
    const secret = env.JWT_SECRET || 'supersecretkey'
    
    const uuid = await sign({
      code: code,
      exp: Math.floor(Date.now() / 1000) + 60 * 5 // 5 minutes
    }, secret)

    return Result.ok(c, {
      img: `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`,
      uuid,
      id: uuid // 兼容前端 res.data.id
    })
  }

  static async getInfo(c: Context) {
    // ... 保持不变
    // 从 JWT 中获取 uid
    const payload = c.get('jwtPayload')
    const uid = payload.uid
    
    const env = c.env as any
    const db = getPrisma(env.DB)

    const userId = Number(uid)
    const user = await db.sys_user.findUnique({
      where: { userId }
    })

    // 计算真实的角色标识与权限（超管直接给全量）
    let roles: string[]
    let permissions: string[]
    if (userId === 1) {
      roles = ['admin']
      permissions = ['*:*:*']
    } else {
      const userRoles = await db.sys_user_role.findMany({ where: { userId } })
      const roleIds = userRoles.map((r: any) => Number(r.roleId))
      const roleRows = roleIds.length
        ? await db.sys_role.findMany({ where: { roleId: { in: roleIds }, status: '0' } })
        : []
      roles = roleRows.map((r: any) => r.roleKey).filter(Boolean)

      const roleMenus = roleIds.length
        ? await db.sys_role_menu.findMany({ where: { roleId: { in: roleIds } } })
        : []
      const menuIds = [...new Set(roleMenus.map((rm: any) => Number(rm.menuId)))]
      const menus = menuIds.length
        ? await db.sys_menu.findMany({ where: { menuId: { in: menuIds } } })
        : []
      permissions = [...new Set(
        menus.map((m: any) => m.perms).filter((p: any) => p && String(p).trim())
      )]
    }

    // 转换 BigInt 为 string/number 以避免 JSON 序列化错误
    const safeUser = JSON.parse(JSON.stringify(user, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ))

    return Result.ok(c, {
      user: safeUser,
      roles,
      permissions
    })
  }

  static async register(c: Context) {
    const body = await c.req.json()
    const username = body.username
    const password = body.password
    const code = body.code || body.verifyCode
    const uuid = body.uuid || body.captchaId

    const env = c.env as any
    const db = getPrisma(env.DB)

    // 校验验证码（与登录一致，无状态 JWT）
    if (uuid) {
      try {
        const payload = await verify(uuid, env.JWT_SECRET || 'supersecretkey', 'HS256')
        if ((payload.code as string).toLowerCase() !== (code || '').toLowerCase()) {
          return Result.fail(c, '验证码错误', 500)
        }
      } catch (e) {
        return Result.fail(c, '验证码无效或已过期', 500)
      }
    }

    if (!username || !password) return Result.fail(c, '用户名或密码不能为空')

    const exists = await db.sys_user.findFirst({ where: { userName: username } })
    if (exists) return Result.fail(c, '注册失败，用户已存在')

    await db.sys_user.create({
      data: {
        userName: username,
        nickName: username,
        password: Utils.md5(password),
        status: '0',
        delFlag: '0',
        createTime: new Date(),
        createBy: username
      }
    })
    return Result.ok(c, null, '注册成功')
  }
}

