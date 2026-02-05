import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { jwt } from 'hono/jwt'
import loginRoute from './modules/admin/login/controller'
import userRoute from './modules/system/user/controller'
import menuRoute from './modules/system/menu/controller'
import deptRoute from './modules/system/dept/controller'
import roleRoute from './modules/system/role/controller'
import dictTypeRoute from './modules/system/dict-type/controller'
import dictDataRoute from './modules/system/dict-data/controller'
import postRoute from './modules/system/post/controller'
import configRoute from './modules/system/config/controller'
import noticeRoute from './modules/system/notice/controller'
import loginInforRoute from './modules/monitor/logininfor/controller'
import operLogRoute from './modules/monitor/operlog/controller'
import { MenuService } from './modules/system/menu/service'

type Bindings = {
  DB: any // 使用 any 临时绕过 D1Database 类型检查，实际类型由 @cloudflare/workers-types 提供但这里未正确加载
  JWT_SECRET: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('*', cors())

app.get('/', (c) => {
  return c.text('Lumi CMS API (Hono) is running!')
})

app.onError((err, c) => {
  console.error('Global Error:', err)
  return c.json({
    code: 500,
    msg: err.message || 'Internal Server Error',
    data: null
  }, 500)
})

// JWT 中间件
const jwtMiddleware = (c: any, next: any) => {
  const handler = jwt({
    secret: c.env.JWT_SECRET || 'supersecretkey',
    alg: 'HS256'
  })
  return handler(c, next)
}

// 注册子路由
app.route('/', loginRoute)

// 保护路由
app.get('/getRouters', jwtMiddleware, MenuService.getRouters)
app.use('/system/*', jwtMiddleware)

app.route('/system/user', userRoute)
app.route('/system/menu', menuRoute)
app.route('/system/dept', deptRoute)
app.route('/system/role', roleRoute)
app.route('/system/dict/type', dictTypeRoute)
app.route('/system/dict/data', dictDataRoute)
app.route('/system/post', postRoute)
app.route('/system/config', configRoute)
app.route('/system/notice', noticeRoute)
app.route('/monitor/logininfor', loginInforRoute)
app.route('/monitor/operlog', operLogRoute)

export default app
