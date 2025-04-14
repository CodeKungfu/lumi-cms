import { Module } from '@nestjs/common';
import { ROOT_ROLE_ID } from 'src/modules/admin/admin.constants';
import { rootRoleIdProvider } from '../core/provider/root-role-id.provider';

import * as operlogController from './operlog/controller';
import * as operlogService from './operlog/service';

import * as logininforController from './logininfor/controller';
import * as logininforService from './logininfor/service';

@Module({
  imports: [],
  controllers: [
    logininforController.MyController,
    operlogController.MyController,
  ],
  providers: [
    rootRoleIdProvider(),
    logininforService.Service,
    operlogService.Service,
  ],
  exports: [ROOT_ROLE_ID],
})
export class MonitorModule {}
