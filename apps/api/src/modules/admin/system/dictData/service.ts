import { Injectable } from '@nestjs/common';
import { prisma } from 'src/prisma';
import { tableName } from './config';
import { isEmpty } from 'lodash';
import { ApiException } from 'src/common/exceptions/api.exception';
import { BaseService } from 'src/common/base/base.service';

@Injectable()
export class Service extends BaseService {
  constructor() {
    super(tableName, 'dictCode');
  }
  /**
   * 根据获取信息
   */
  async info2(type: string): Promise<any> {
    const resultInfo: any = await prisma[tableName].findMany({
      where: {
        dictType: type,
      },
    });
    if (isEmpty(resultInfo)) {
      throw new ApiException(10017);
    }
    return resultInfo;
  }
}
