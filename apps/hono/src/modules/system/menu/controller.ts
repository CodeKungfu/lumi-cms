import { Hono } from 'hono'
import { MenuService } from './service'

const app = new Hono()

app.get('/treeselect', MenuService.treeselect)
app.get('/roleMenuTreeselect/:roleId', MenuService.roleMenuTreeselect)
app.get('/list', MenuService.list)
app.get('/:id', MenuService.get)
app.post('/', MenuService.add)
app.put('/', MenuService.update)
app.delete('/:ids', MenuService.remove)

export default app
