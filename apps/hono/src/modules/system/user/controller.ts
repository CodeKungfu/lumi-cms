import { Hono } from 'hono'
import { UserService } from './service'
import { DeptService } from '../dept/service'

const app = new Hono()

app.get('/deptTree', DeptService.deptTree)
app.get('/authRole/:userId', UserService.getAuthRole)
app.put('/authRole', UserService.updateAuthRole)
app.put('/profile', UserService.updateProfile)
app.put('/changeStatus', UserService.changeStatus)
app.put('/resetPwd', UserService.resetPwd)
app.get('/list', UserService.list)
app.get('/:id', UserService.get)
app.post('/', UserService.add)
app.put('/', UserService.update)
app.delete('/:ids', UserService.remove)

export default app
