import { Context } from 'hono'
import { getPrisma } from '../../../lib/prisma'
import { Result } from '../../../common/result'
import { Utils } from '../../../common/utils'

// 路由格式转换
function mapToRouteFormat(node: any): any {
  const isRoot = node.parentId === 0
  const component = node.component || (isRoot ? 'Layout' : undefined)
  const path = isRoot ? '/' + node.path : node.path
  
  return {
    name: node.path ? node.path.charAt(0).toUpperCase() + node.path.slice(1) : '',
    path,
    hidden: node.visible === '1',
    redirect: node.menuType === 'M' ? 'noRedirect' : undefined,
    component,
    alwaysShow: node.menuType === 'M' ? true : undefined,
    meta: {
      title: node.menuName,
      icon: node.icon,
      noCache: node.isCache === 1,
      link: node.isFrame === 0 ? node.path : null,
    },
    children: node.children?.map(mapToRouteFormat) || []
  }
}

export class MenuService {
  static async list(c: Context) {
    const env = c.env as any
    const db = getPrisma(env.DB)
    
    const { menuName, status } = c.req.query()
    
    const where: any = {}
    if (menuName) where.menuName = { contains: menuName }
    if (status) where.status = status

    const list = await db.sys_menu.findMany({
      where,
      orderBy: { orderNum: 'asc' }
    })

    const safeList = list.map((item: any) => ({
      menuId: Number(item.menuId),
      parentId: Number(item.parentId ?? 0),
      menuName: item.menuName,
      path: item.path,
      component: item.component,
      query: item.query,
      isFrame: Number(item.isFrame ?? 1),
      isCache: Number(item.isCache ?? 0),
      menuType: item.menuType,
      visible: item.visible,
      status: item.status,
      perms: item.perms,
      icon: item.icon,
      createBy: item.createBy,
      createTime: item.createTime,
      orderNum: item.orderNum
    }))

    return Result.ok(c, safeList)
  }

  static async get(c: Context) {
    const id = Number(c.req.param('id'))
    const env = c.env as any
    const db = getPrisma(env.DB)

    const menu = await db.sys_menu.findUnique({
      where: { menuId: id }
    })

    if (!menu) return Result.fail(c, '菜单不存在')

    const safeMenu = JSON.parse(JSON.stringify(menu, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ))

    return Result.ok(c, { data: safeMenu })
  }

  static async add(c: Context) {
    const body = await c.req.json()
    const env = c.env as any
    const db = getPrisma(env.DB)

    try {
      await db.sys_menu.create({
        data: {
          parentId: body.parentId,
          menuType: body.menuType,
          icon: body.icon,
          menuName: body.menuName,
          orderNum: body.orderNum,
          isFrame: body.isFrame,
          isCache: body.isCache,
          visible: body.visible,
          status: body.status,
          path: body.path,
          component: body.component,
          query: body.query,
          perms: body.perms,
          createTime: new Date(),
          createBy: body.createBy || ''
        }
      })
      return Result.ok(c, null, '新增成功')
    } catch (e) {
      return Result.fail(c, '新增失败: ' + (e as Error).message)
    }
  }

  static async update(c: Context) {
    const body = await c.req.json()
    const env = c.env as any
    const db = getPrisma(env.DB)

    if (!body.menuId) return Result.fail(c, 'ID不能为空')

    try {
      await db.sys_menu.update({
        where: { menuId: body.menuId },
        data: {
          parentId: body.parentId,
          menuType: body.menuType,
          icon: body.icon,
          menuName: body.menuName,
          orderNum: body.orderNum,
          isFrame: body.isFrame,
          isCache: body.isCache,
          visible: body.visible,
          status: body.status,
          path: body.path,
          component: body.component,
          query: body.query,
          perms: body.perms,
          updateTime: new Date(),
          updateBy: body.updateBy || ''
        }
      })
      return Result.ok(c, null, '修改成功')
    } catch (e) {
      return Result.fail(c, '修改失败')
    }
  }

  static async remove(c: Context) {
    const ids = c.req.param('ids').split(',').map(Number)
    const env = c.env as any
    const db = getPrisma(env.DB)

    try {
      await db.sys_menu.deleteMany({
        where: { menuId: { in: ids } }
      })
      return Result.ok(c, null, '删除成功')
    } catch (e) {
      return Result.fail(c, '删除失败')
    }
  }

  // 获取菜单下拉树列表
  static async treeselect(c: Context) {
    const env = c.env as any
    const db = getPrisma(env.DB)
    const payload = c.get('jwtPayload')
    const userId = payload.uid

    let menuList: any[]

    if (userId === 1) {
      menuList = await db.sys_menu.findMany({
        orderBy: { orderNum: 'asc' }
      })
    } else {
      menuList = await db.$queryRaw`
        select distinct m.*
        from sys_menu m
        left join sys_role_menu rm on m.menu_id = rm.menu_id
        left join sys_user_role ur on rm.role_id = ur.role_id
        left join sys_role ro on ur.role_id = ro.role_id
        where ur.user_id = ${userId}
        and m.status = '0'
        and ro.status = '0'
        order by m.parent_id, m.order_num
      `
    }

    const menuArr = menuList.map((item: any) => ({
      ...item,
      parentId: Number(item.parentId ?? item.parent_id ?? 0),
      id: Number(item.menuId ?? item.menu_id),
      label: item.menuName || item.menu_name
    }))

    const tree = Utils.buildTreeData(menuArr, 'id', 'parentId', 'children')
    return Result.ok(c, tree)
  }

  // 加载对应角色菜单列表树
  static async roleMenuTreeselect(c: Context) {
    const roleId = Number(c.req.param('roleId'))
    const env = c.env as any
    const db = getPrisma(env.DB)

    // 1. 获取所有菜单构建树
    const menuList = await db.sys_menu.findMany({
      orderBy: { orderNum: 'asc' }
    })

    const menuArr = menuList.map((item: any) => ({
      ...item,
      parentId: Number(item.parentId ?? 0),
      id: Number(item.menuId),
      label: item.menuName
    }))

    const menus = Utils.buildTreeData(menuArr, 'id', 'parentId', 'children')

    // 2. 获取角色拥有的菜单ID
    const roleMenus = await db.sys_role_menu.findMany({
      where: { roleId: roleId }
    })

    const checkedKeys = roleMenus.map((item: any) => Number(item.menuId))

    return Result.ok(c, {
      checkedKeys,
      menus
    })
  }

  // 获取路由（前端菜单）
  static async getRouters(c: Context) {
    const env = c.env as any
    const db = getPrisma(env.DB)
    
    // 从 JWT 获取 userId
    const payload = c.get('jwtPayload')
    const userId = payload.uid

    let menuList: any[]

    if (userId === 1) {
      // 超级管理员，查询所有菜单
      menuList = await db.sys_menu.findMany({
        where: {
          status: '0',
          menuType: { in: ['M', 'C'] } // 目录和菜单
        },
        orderBy: { orderNum: 'asc' }
      })
    } else {
      // 普通用户，查询授权菜单
      // 使用 queryRaw 查询关联表
      menuList = await db.$queryRaw`
        select distinct m.*
        from sys_menu m
        left join sys_role_menu rm on m.menu_id = rm.menu_id
        left join sys_user_role ur on rm.role_id = ur.role_id
        left join sys_role ro on ur.role_id = ro.role_id
        where ur.user_id = ${userId}
        and m.menu_type in ('M', 'C')
        and m.status = '0'
        and ro.status = '0'
        order by m.parent_id, m.order_num
      `
    }

    const normalizedList = menuList.map((item: any) => {
      // 如果是 queryRaw 返回的 snake_case，转换为 camelCase
      // 如果是 findMany 返回的 camelCase，保持不变
      return {
        menuId: Number(item.menuId ?? item.menu_id),
        parentId: Number(item.parentId ?? item.parent_id ?? 0),
        path: item.path,
        component: item.component,
        menuName: item.menuName || item.menu_name,
        icon: item.icon,
        menuType: item.menuType || item.menu_type,
        visible: item.visible,
        status: item.status,
        isCache: item.isCache || item.is_cache,
        isFrame: item.isFrame || item.is_frame,
        orderNum: item.orderNum || item.order_num,
        children: []
      }
    })

    const treeData = Utils.buildTreeData(normalizedList, 'menuId', 'parentId', 'children')
    const routes = treeData.map(mapToRouteFormat)

    return Result.ok(c, routes)
  }
}
