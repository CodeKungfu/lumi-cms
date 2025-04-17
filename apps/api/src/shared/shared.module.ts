import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from './redis/redis.module';
import { RedisService } from './services/redis.service';
import { UtilService } from './services/util.service';
import { ExcelService } from './services/excel.service';

// common provider list
const providers = [UtilService, RedisService, ExcelService];

/**
 * 全局共享模块
 */
@Global()
@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    // redis cache
    CacheModule.register(),
    // jwt
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    RedisModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          host: configService.get('REDIS_HOST'),
          port: parseInt(configService.get('REDIS_PORT')),
          password: configService.get('REDIS_PASSWORD'),
          db: parseInt(configService.get('REDIS_DB')),
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [...providers],
  exports: [HttpModule, CacheModule, JwtModule, ...providers],
})
export class SharedModule {}
