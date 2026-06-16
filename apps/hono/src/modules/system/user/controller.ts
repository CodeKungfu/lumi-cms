import { Hono } from 'hono'
import { UserService } from './service'
import { DeptService } from '../dept/service'

const app = new Hono()

app.get('/deptTree', DeptService.deptTree)
app.get('/authRole/:userId', UserService.getAuthRole)
app.put('/authRole', UserService.updateAuthRole)
// 个人中心（静态路径需放在 /:id 之前，避免被参数路由匹配）
app.get('/profile', UserService.getProfile)
app.put('/profile', UserService.updateProfile)
app.put('/profile/updatePwd', UserService.updatePwd)
app.post('/profile/avatar', UserService.uploadAvatar)
app.put('/changeStatus', UserService.changeStatus)
app.put('/resetPwd', UserService.resetPwd)
app.post('/importData', UserService.importData)
app.get('/list', UserService.list)
app.get('/:id', UserService.get)
app.post('/', UserService.add)
app.put('/', UserService.update)
app.delete('/:ids', UserService.remove)

export default app
