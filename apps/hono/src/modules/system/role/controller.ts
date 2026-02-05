import { Hono } from 'hono'
import { RoleService } from './service'

const app = new Hono()

app.get('/list', RoleService.list)
app.get('/deptTree/:id', RoleService.deptTree)
app.get('/:id', RoleService.get)
app.post('/', RoleService.add)
app.put('/', RoleService.update)
app.delete('/:ids', RoleService.remove)

export default app
