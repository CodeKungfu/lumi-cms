import { Hono } from 'hono'
import { OperLogService } from './service'

const app = new Hono()

app.get('/list', OperLogService.list)
app.delete('/clean', OperLogService.clean)
app.delete('/:ids', OperLogService.remove)

export default app
