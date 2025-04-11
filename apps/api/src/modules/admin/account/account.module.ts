import { Module } from '@nestjs/common';
import { LoginModule } from '../login/login.module';
import { SystemModule } from '../system/system.module';
import * as accountController from './controller';

@Module({
  imports: [SystemModule, LoginModule],
  controllers: [accountController.MyController],
})
export class AccountModule {}
