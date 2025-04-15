import { Module } from '@nestjs/common';
import { ROOT_ROLE_ID } from 'src/modules/admin/admin.constants';
import { rootRoleIdProvider } from '../core/provider/root-role-id.provider';
import { SystemModule } from '../system/system.module';

import * as operlogController from './operlog/controller';
import * as operlogService from './operlog/service';

import * as logininforController from './logininfor/controller';
import * as logininforService from './logininfor/service';

import * as onlineController from './online/controller';
import * as onlineService from './online/service';

@Module({
  imports: [SystemModule],
  controllers: [
    logininforController.MyController,
    operlogController.MyController,
    onlineController.MyController,
  ],
  providers: [
    rootRoleIdProvider(),
    logininforService.Service,
    operlogService.Service,
    onlineService.Service,
  ],
  exports: [ROOT_ROLE_ID, onlineService.Service],
})
export class MonitorModule {}
