import { Module } from '@nestjs/common';
import { SystemModule } from '../system/system.module';

import * as loginController from './controller';
import * as loginService from './service';

@Module({
  imports: [SystemModule],
  controllers: [loginController.MyController],
  providers: [loginService.Service],
  exports: [loginService.Service],
})
export class LoginModule {}
