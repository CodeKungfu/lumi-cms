import { Inject, Injectable } from '@nestjs/common';
import { prisma } from 'src/prisma';
import { isEmpty, map } from 'lodash';
import { ExcelService } from 'src/shared/services/excel.service';
import { ApiException } from 'src/common/exceptions/api.exception';
import { processPageQuery } from 'src/common/utils/query-helper';

@Injectable()
export class BaseService {
  @Inject(ExcelService)
  protected excelService: ExcelService;
  constructor(
    protected readonly tableName: string,
    protected readonly primaryKey: string = 'id'
  ) {}

  /**
   * 分页查询
   */
  async pageDto(dto: any) {
    const { processedQuery, orderBy } = processPageQuery(this.tableName, dto);
    const [result, countNum] = await Promise.all([
      (prisma as any)[this.tableName].findMany({
        skip: (Number(dto.pageNum) - 1) * Number(dto.pageSize),
        take: Number(dto.pageSize),
        where: processedQuery,
        orderBy,
      }),
      (prisma as any)[this.tableName].count({ where: processedQuery }),
    ]);
    
    return {
      rows: result,
      total: countNum,
      pagination: {
        size: dto.pageSize,
        page: dto.pageNum,
        total: countNum,
      },
    }
  }

  /**
   * 导出
   */
  async pageDtoExport(dto: any) {
    const { processedQuery, orderBy } = processPageQuery(this.tableName, dto);
    const result = await (prisma as any)[this.tableName].findMany({
      where: processedQuery,
      orderBy,
    });
    return this.excelService.createExcelFile('target', result);
  }

  /**
   * 查询详情
   */
  async info(id: any) {
    const where = { [this.primaryKey]: Number(id.toString()) };
    const infoRes = await (prisma as any)[this.tableName].findFirst({ where });
    if (isEmpty(infoRes)) {
        throw new ApiException(10017);
    }
    return infoRes;
  }

  /**
   * 创建记录
   */
  async create(data: any, userName: string) {
    return (prisma as any)[this.tableName].create({ 
      ...data,
      createTime: new Date(), 
      updateTime: new Date(),
      createBy: userName,
    });
  }

  /**
   * 更新记录
   */
  async update(data: any, userName: string) {
    const { [this.primaryKey]: id, createTime, ...rest } = data;
    const where = { [this.primaryKey]: id };
    return (prisma as any)[this.tableName].update({
      where,
      data: {
        ...rest,
        updateTime: new Date(),
        updateBy: userName,
      },
    });
  }

  /**
   * 删除记录
   */
  async delete(id: any) {
    if (id === 'clean') {
      await (prisma as any)[this.tableName].deleteMany({});
      return { count: 0 };
    }
    const result: any = await (prisma as any)[this.tableName].deleteMany({ 
        where: { 
            [this.primaryKey]: {
              in: map(id.toString().split(','), Number), 
            }
        }
    });
    return { count: result.count };
  }
}