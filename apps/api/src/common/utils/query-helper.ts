import { prisma } from 'src/prisma';

/**
 * 处理查询对象，转换数字类型字段
 * @param tableName 表名
 * @param queryObj 查询对象
 * @returns 处理后的查询对象
 */
export function processQueryObject(tableName: string, queryObj: Record<string, any>): Record<string, any> {
  // 获取数字类型字段
  const numericFields = Object.keys(prisma[tableName].fields).filter(field => 
    ['Int', 'BigInt', 'Float', 'Decimal'].includes(prisma[tableName].fields[field].typeName)
  );

  // 获取数字类型字段
  const dataTimeFields = Object.keys(prisma[tableName].fields).filter(field => 
    ['DateTime'].includes(prisma[tableName].fields[field].typeName)
  );
  
  // 转换数字类型字段
  const processedObj = { ...queryObj };
  for (const field of numericFields) {
    if (field in processedObj && processedObj[field] !== undefined && processedObj[field] !== null) {
      processedObj[field] = Number(processedObj[field]);
    }
  }
  // 转换 DateTime 类型字段
  for (const field of dataTimeFields) {
    if (field in processedObj && processedObj[field]!== undefined && processedObj[field]!== null) {
      if (Array.isArray(processedObj[field])) {
        processedObj[field] = {
          gte: new Date(processedObj[field][0]),
          lte: new Date(processedObj[field][1])
        }
      } else {
        // 针对swagger ui 没有Type 类型转换的情况
        const arr = JSON.parse(processedObj[field])
        if (Array.isArray(arr)){
          processedObj[field] = {
            gte: new Date(arr[0]),
            lte: new Date(arr[1])
          }
        }
      }
    }
  }
  return processedObj;
}

/**
 * 处理分页查询参数
 * @param tableName 表名
 * @param dto 查询参数
 * @returns 处理后的查询对象和排序对象
 */
export function processPageQuery(tableName: string, dto: any) {
    const { orderByColumn = '', isAsc, pageNum = 1, pageSize = 10, ...rest } = dto;
    
    return {
      processedQuery: processQueryObject(tableName, rest),
      orderBy: orderByColumn ? { [orderByColumn]: isAsc === 'ascending' ? 'asc' : 'desc' } : undefined,
      pageNum: Number(pageNum),
      pageSize: Number(pageSize)
    };
  }