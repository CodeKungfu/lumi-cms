import { Inject, Injectable } from '@nestjs/common';
import { ApiException } from 'src/common/exceptions/api.exception';
import { difference, filter, includes, isEmpty, map, findIndex, omit } from 'lodash';
import { prisma } from 'src/prisma';
import { tableType, tableName, tableQueryDTO } from './config';
import { processPageQuery } from 'src/common/utils/query-helper';

@Injectable()
export class Service {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  /**
   * 根据获取信息
   */
  async info(id: number): Promise<tableType> {
    const resultInfo: tableType = await prisma[tableName].findFirst({
      where: {
        infoId: Number(id),
      },
    });
    if (isEmpty(resultInfo)) {
      throw new ApiException(10017);
    }

    return resultInfo;
  }

  /**
   * 根据获取信息
   */
  async delete(id: any): Promise<any> {
    if (id === 'clean') {
      await prisma[tableName].deleteMany({});
      return { count: 0 };
    }
    const result: any = await prisma[tableName].deleteMany({
      where: {
        infoId: {
          in: map(id.toString().split(','), Number),
        },
      },
    });
    return { count: result.count };
  }

  /**
   * 更新信息
   */
  async update(body: any): Promise<tableType> {
    const updateObj = omit(body, ['infoId', 'createTime']);
    const resultInfo: tableType = await prisma[tableName].update({
      data: updateObj,
      where: {
        infoId: body.infoId,
      },
    });
    return resultInfo;
  }

  /**
   * 新增信息
   */
  async create(body: any): Promise<any> {
    const resultInfo: tableType = await prisma[tableName].create({
      data: body,
    });
    return resultInfo;
  }

  /**
   * 分页查询信息
   */
  async pageDto(dto: InstanceType<typeof tableQueryDTO>): Promise<any> {
    const { processedQuery, orderBy } = processPageQuery(tableName, dto);
    const result: any = await prisma[tableName].findMany({
      skip: (Number(dto.pageNum) - 1) * Number(dto.pageSize),
      take: Number(dto.pageSize),
      where: processedQuery,
      orderBy,
    });
    const countNum: any = await prisma[tableName].count({
      where: processedQuery,
    });
    return {
      result,
      countNum,
    };
  }
}
