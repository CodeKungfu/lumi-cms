import { Hono } from 'hono'
import { DictDataService } from './service'

const app = new Hono()

app.get('/list', DictDataService.list)
app.get('/type/:type', DictDataService.getByType)
app.get('/:id', DictDataService.get)
app.post('/', DictDataService.add)
app.put('/', DictDataService.update)
app.delete('/:ids', DictDataService.remove)

export default app
