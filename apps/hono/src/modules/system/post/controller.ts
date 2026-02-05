import { Hono } from 'hono'
import { PostService } from './service'

const app = new Hono()

app.get('/list', PostService.list)
app.get('/:id', PostService.get)
app.post('/', PostService.add)
app.put('/', PostService.update)
app.delete('/:ids', PostService.remove)

export default app
