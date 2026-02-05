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

    const user = await db.sys_user.findUnique({
      where: { userId: Number(uid) }
    })
    
    // 转换 BigInt 为 string/number 以避免 JSON 序列化错误
    const safeUser = JSON.parse(JSON.stringify(user, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ))

    return Result.ok(c, {
      user: safeUser,
      roles: ['admin'], // 简化：暂时硬编码
      permissions: ['*:*:*'] // 简化：暂时硬编码
    })
  }
}

