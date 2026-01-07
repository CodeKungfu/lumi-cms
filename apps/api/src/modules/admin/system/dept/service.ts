import { Injectable } from '@nestjs/common';
import { tableName } from './config';
import { prisma } from '@repo/database';
import { BaseService } from 'src/common/base/base.service';
import { buildTreeData } from 'src/shared/services/util.service';

@Injectable()
export class Service extends BaseService {
  constructor() {
    super(tableName, 'deptId');
  }

  async exclude(id: any): Promise<any> {
    return await prisma[tableName].findMany({
      orderBy: {
        orderNum: 'desc',
      },
      where: {
        deptId: {
          not: id,
        },
      },
    });
  }

  async deptTree(): Promise<any> {
    const deptTable = await await prisma[tableName].findMany();
    // 需要返回数据字段
    const readArr = deptTable.map((item) => ({
      parentId: Number(item.parentId),
      id: Number(item.deptId),
      label: item.deptName,
    }));
    const data = buildTreeData(readArr, 'id', 'parentId', 'children');
    return {
      msg: '操作成功',
      code: 200,
      data: data,
    };
  }
}
