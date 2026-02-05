import { Hono } from 'hono'
import { DictTypeService } from './service'

const app = new Hono()

app.get('/list', DictTypeService.list)
app.get('/optionselect', DictTypeService.optionselect)
app.get('/:id', DictTypeService.get)
app.post('/', DictTypeService.add)
app.put('/', DictTypeService.update)
app.delete('/:ids', DictTypeService.remove)

export default app
