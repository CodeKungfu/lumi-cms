import './polyfill';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './modules/admin/admin.module';
import { SharedModule } from './shared/shared.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { OperlogInterceptor } from './common/interceptors/operlog.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    // custom module
    SharedModule,
    // application modules import
    AdminModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: OperlogInterceptor,
    },
  ],
})
export class AppModule {}
