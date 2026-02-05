import { Hono } from 'hono'
import { DeptService } from './service'

const app = new Hono()

app.get('/list', DeptService.list)
app.get('/list/exclude/:id', DeptService.exclude)
app.get('/:id', DeptService.get)
app.post('/', DeptService.add)
app.put('/', DeptService.update)
app.delete('/:ids', DeptService.remove)

export default app
