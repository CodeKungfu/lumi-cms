import { ModuleMetadata } from '@nestjs/common';
import { Redis, RedisOptions, ClusterNode, ClusterOptions } from 'ioredis';

export interface RedisModuleOptions extends RedisOptions {
  name?: string;
  url?: string;
  cluster?: boolean;
  nodes?: ClusterNode[];
  clusterOptions?: ClusterOptions;
  onClientReady?(client: Redis): void;
}

export interface RedisModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (
    ...args: any[]
  ) =>
    | RedisModuleOptions
    | RedisModuleOptions[]
    | Promise<RedisModuleOptions>
    | Promise<RedisModuleOptions[]>;
  inject?: any[];
}
