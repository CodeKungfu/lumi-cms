import { Context } from 'hono'

export class Result {
  static ok(c: Context, data: any = null, msg: string = '操作成功') {
    return c.json({
      code: 200,
      msg,
      data,
    })
  }

  static fail(c: Context, msg: string = '操作失败', code: number = 500) {
    return c.json({
      code,
      msg,
      data: null,
    })
  }
}
