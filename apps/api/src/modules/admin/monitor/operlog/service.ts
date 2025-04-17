import { Injectable } from '@nestjs/common';
import { tableName } from './config';
import { BaseService } from 'src/common/base/base.service';

@Injectable()
export class Service extends BaseService {
  constructor() {
    super(tableName, 'operId');
  }
}
