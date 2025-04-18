import { Injectable } from '@nestjs/common';
import { tableName } from './config';
import { prisma } from 'src/prisma';
import { BaseService } from 'src/common/base/base.service';

@Injectable()
export class Service extends BaseService {
  constructor() {
    super(tableName, 'deptId');
  }

  // exclude
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
}
