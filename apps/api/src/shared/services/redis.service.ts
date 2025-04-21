import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService {
  private redisClient: Redis;
  private redisPool: Map<string, Redis> = new Map();

  constructor(private configService: ConfigService) {
    this.redisClient = new Redis({
      host: this.configService.get('REDIS_HOST', 'localhost'),
      port: this.configService.get('REDIS_PORT', 6379),
      password: this.configService.get('REDIS_PASSWORD', ''),
      db: this.configService.get('REDIS_DB', 0),
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      connectTimeout: 10000,
    });
  }

  getRedis(name = 'default'): Redis {
    if (!this.redisPool.has(name)) {
      this.redisPool.set(name, this.redisClient);
    }
    return this.redisPool.get(name);
  }
}
