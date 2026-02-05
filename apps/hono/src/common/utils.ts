import CryptoJS from 'crypto-js'

export class Utils {
  static md5(str: string): string {
    return CryptoJS.MD5(str).toString()
  }

  static generateUUID(): string {
    return crypto.randomUUID()
  }

  static buildTreeData(data: any[], idField: string = 'id', parentField: string = 'parentId', childrenField: string = 'children') {
    const tree: any[] = []
    const idMap = new Map()

    // 创建节点映射
    data.forEach((item) => {
      idMap.set(item[idField], { ...item, [childrenField]: [] })
    })

    // 构建树结构
    data.forEach((item) => {
      const parentId = item[parentField]
      const node = idMap.get(item[idField])

      if (parentId === 0 || !idMap.has(parentId)) {
        tree.push(node)
      } else {
        const parent = idMap.get(parentId)
        parent[childrenField].push(node)
      }
    })

    return tree
  }
}
