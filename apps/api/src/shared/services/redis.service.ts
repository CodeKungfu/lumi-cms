import { Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

class MockRedis {
  private static store = new Map<string, any>();
  private static timers = new Map<string, NodeJS.Timeout>();

  constructor() {
    Logger.log('Using In-Memory Mock Redis', 'RedisService');
  }

  async get(key: string) {
    const value = MockRedis.store.get(key);
    Logger.log(`MockRedis GET key: ${key}, value: ${value ? 'FOUND' : 'NOT FOUND'}`, 'RedisService');
    return value;
  }

  async set(key: string, value: any, mode?: string, duration?: number) {
    Logger.log(`MockRedis SET key: ${key}, mode: ${mode}, duration: ${duration}`, 'RedisService');
    MockRedis.store.set(key, value);
    if (mode === 'EX' && duration) {
      if (MockRedis.timers.has(key)) {
        clearTimeout(MockRedis.timers.get(key));
      }
      const timer = setTimeout(() => {
        Logger.log(`MockRedis EXPIRED key: ${key}`, 'RedisService');
        MockRedis.store.delete(key);
        MockRedis.timers.delete(key);
      }, duration * 1000);
      MockRedis.timers.set(key, timer);
    }
    return 'OK';
  }

  async del(key: string) {
    if (MockRedis.timers.has(key)) {
      clearTimeout(MockRedis.timers.get(key));
      MockRedis.timers.delete(key);
    }
    MockRedis.store.delete(key);
    return 1;
  }

  async keys(pattern: string) {
    // Simple implementation, supports * at the end
    if (pattern === '*') return Array.from(MockRedis.store.keys());
    if (pattern.endsWith('*')) {
      const prefix = pattern.slice(0, -1);
      return Array.from(MockRedis.store.keys()).filter(k => k.startsWith(prefix));
    }
    return Array.from(MockRedis.store.keys()).filter(k => k === pattern);
  }
}

@Injectable()
export class RedisService {
  private redisClient: Redis | any;
  private redisPool: Map<string, Redis | any> = new Map();

  constructor(private configService: ConfigService) {
    if (this.configService.get('USE_REAL_REDIS') !== 'true') {
      this.redisClient = new MockRedis();
    } else {
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
  }

  getRedis(name = 'default'): Redis {
    if (!this.redisPool.has(name)) {
      this.redisPool.set(name, this.redisClient);
    }
    return this.redisPool.get(name);
  }
}
