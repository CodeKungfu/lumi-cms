import { Hono } from 'hono'
import { AuthService } from './service'
import { jwt } from 'hono/jwt'

const app = new Hono()

// 公开接口
app.post('/login', AuthService.login)
app.get('/captchaImage', AuthService.getCaptcha)

// 需要认证的接口
app.use('/*', (c, next) => {
  const jwtMiddleware = jwt({
    secret: (c.env as any).JWT_SECRET || 'supersecretkey',
    alg: 'HS256'
  })
  return jwtMiddleware(c, next)
})

app.get('/getInfo', AuthService.getInfo)

export default app
