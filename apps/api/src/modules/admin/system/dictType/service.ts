import { Injectable } from '@nestjs/common';
import { prisma } from 'src/prisma';
import { tableName } from './config';
import { BaseService } from 'src/common/base/base.service';

@Injectable()
export class Service extends BaseService {
  constructor() {
    super(tableName, 'dictId');
  }
  async optionselect(): Promise<any> {
    const resultInfo: any = await prisma[tableName].findMany();
    return resultInfo;
  }
}