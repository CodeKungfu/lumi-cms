import { Hono } from 'hono'
import { ConfigService } from './service'

const app = new Hono()

app.get('/list', ConfigService.list)
app.get('/:id', ConfigService.get)
app.post('/', ConfigService.add)
app.put('/', ConfigService.update)
app.delete('/:ids', ConfigService.remove)

export default app
