import { Hono } from 'hono'
import { RoleService } from './service'

const app = new Hono()

// 分配用户列表（静态路径放在 /:id 之前）
app.get('/authUser/allocatedList', RoleService.allocatedList)
app.get('/authUser/unallocatedList', RoleService.unallocatedList)
app.put('/authUser/selectAll', RoleService.selectAll)
app.put('/authUser/cancel', RoleService.cancel)
app.put('/authUser/cancelAll', RoleService.cancelAll)
app.put('/dataScope', RoleService.dataScope)
app.put('/changeStatus', RoleService.changeStatus)
app.get('/list', RoleService.list)
app.get('/deptTree/:id', RoleService.deptTree)
app.get('/:id', RoleService.get)
app.post('/', RoleService.add)
app.put('/', RoleService.update)
app.delete('/:ids', RoleService.remove)

export default app
