import { Context } from 'hono'

export class Result {
  static ok(c: Context, data: any = null, msg: string = '操作成功') {
    const res: any = {
      code: 200,
      msg,
    }

    if (data !== null) {
      // 如果数据包含 rows 或 result 或 data 字段，说明是封装好的数据对象，直接展开到根对象
      if (typeof data === 'object' && !Array.isArray(data) && ('rows' in data || 'result' in data || 'data' in data)) {
        Object.assign(res, data)
      } else {
        res.data = data
      }
    }

    return c.json(res)
  }

  static fail(c: Context, msg: string = '操作失败', code: number = 500) {
    return c.json({
      code,
      msg,
      data: null,
    })
  }
}
