import { Module } from '@nestjs/common';
import { LoginModule } from '../login/login.module';
import { SystemModule } from '../system/system.module';
import * as Controller from './controller';

@Module({
  imports: [SystemModule, LoginModule],
  controllers: [Controller.MyController],
})
export class AccountModule {}
