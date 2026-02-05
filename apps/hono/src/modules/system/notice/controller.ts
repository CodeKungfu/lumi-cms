import { Hono } from 'hono'
import { NoticeService } from './service'

const app = new Hono()

app.get('/list', NoticeService.list)
app.get('/:id', NoticeService.get)
app.post('/', NoticeService.add)
app.put('/', NoticeService.update)
app.delete('/:ids', NoticeService.remove)

export default app
