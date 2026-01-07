import { DynamicModule, Module, OnModuleDestroy, Provider, Logger } from '@nestjs/common';
import IORedis, { Redis, Cluster } from 'ioredis';
import { isEmpty } from 'lodash';
import { REDIS_CLIENT, REDIS_DEFAULT_CLIENT_KEY, REDIS_MODULE_OPTIONS } from './redis.constants';
import { RedisModuleAsyncOptions, RedisModuleOptions } from './redis.interface';

class MockRedis {
  private static store = new Map<string, any>();
  private static timers = new Map<string, NodeJS.Timeout>();

  constructor() {
    Logger.log('Using In-Memory Mock Redis (RedisModule)', 'RedisModule');
  }

  async get(key: string) {
    return MockRedis.store.get(key);
  }

  async set(key: string, value: any, mode?: string, duration?: number) {
    MockRedis.store.set(key, value);
    if (mode === 'EX' && duration) {
      if (MockRedis.timers.has(key)) {
        clearTimeout(MockRedis.timers.get(key));
      }
      const timer = setTimeout(() => {
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
    if (pattern === '*') return Array.from(MockRedis.store.keys());
    if (pattern.endsWith('*')) {
      const prefix = pattern.slice(0, -1);
      return Array.from(MockRedis.store.keys()).filter(k => k.startsWith(prefix));
    }
    return Array.from(MockRedis.store.keys()).filter(k => k === pattern);
  }
}

@Module({})
export class RedisModule implements OnModuleDestroy {
  static register(
    options: RedisModuleOptions | RedisModuleOptions[],
  ): DynamicModule {
    const clientProvider = this.createAysncProvider();
    return {
      module: RedisModule,
      providers: [
        clientProvider,
        {
          provide: REDIS_MODULE_OPTIONS,
          useValue: options,
        },
      ],
      exports: [clientProvider],
    };
  }

  static registerAsync(options: RedisModuleAsyncOptions): DynamicModule {
    const clientProvider = this.createAysncProvider();
    return {
      module: RedisModule,
      imports: options.imports ?? [],
      providers: [clientProvider, this.createAsyncClientOptions(options)],
      exports: [clientProvider],
    };
  }

  /**
   * create provider
   */
  private static createAysncProvider(): Provider {
    // create client
    return {
      provide: REDIS_CLIENT,
      useFactory: (
        options: RedisModuleOptions | RedisModuleOptions[],
      ): Map<string, Redis | Cluster | any> => {
        const clients = new Map<string, Redis | Cluster | any>();
        if (Array.isArray(options)) {
          options.forEach((op) => {
            const name = op.name ?? REDIS_DEFAULT_CLIENT_KEY;
            if (clients.has(name)) {
              throw new Error('Redis Init Error: name must unique');
            }
            clients.set(name, this.createClient(op));
          });
        } else {
          // not array
          clients.set(REDIS_DEFAULT_CLIENT_KEY, this.createClient(options));
        }
        return clients;
      },
      inject: [REDIS_MODULE_OPTIONS],
    };
  }

  /**
   * 创建IORedis实例
   */
  private static createClient(options: RedisModuleOptions): Redis | Cluster | any {
    // 默认使用 MockRedis，除非显式设置 USE_REAL_REDIS=true
    if (process.env.USE_REAL_REDIS !== 'true') {
      return new MockRedis();
    }

    const { onClientReady, url, cluster, clusterOptions, nodes, ...opts } =
      options;
    let client = null;
    // check url
    if (!isEmpty(url)) {
      client = new IORedis(url);
    } else if (cluster) {
      // check cluster
      client = new IORedis.Cluster(nodes, clusterOptions);
    } else {
      client = new IORedis(opts);
    }
    if (onClientReady) {
      onClientReady(client);
    }
    return client;
  }

  private static createAsyncClientOptions(options: RedisModuleAsyncOptions) {
    return {
      provide: REDIS_MODULE_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject,
    };
  }

  onModuleDestroy() {
    // on destroy
  }
}
