import { Hono } from 'hono'
import { LoginInforService } from './service'

const app = new Hono()

app.get('/list', LoginInforService.list)
app.delete('/clean', LoginInforService.clean)
app.delete('/:ids', LoginInforService.remove)

export default app
