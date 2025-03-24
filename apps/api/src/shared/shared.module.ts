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
        secret: configService.get<string>('jwt.secret'),
      }),
      inject: [ConfigService],
    }),
    RedisModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        // 优先使用环境变量，其次使用配置服务
        const host = process.env.REDIS_HOST || configService.get<string>('redis.host');
        // console.log('使用的Redis主机:', host);
        return {
          host,
          port: parseInt(process.env.REDIS_PORT || configService.get<string>('redis.port')),
          password: process.env.REDIS_PASSWORD || configService.get<string>('redis.password'),
          db: parseInt(process.env.REDIS_DB || configService.get<string>('redis.db')),
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [...providers],
  exports: [HttpModule, CacheModule, JwtModule, ...providers],
})
export class SharedModule {}
