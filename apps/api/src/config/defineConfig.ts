/**
 * 用于智能提示
 */
export function defineConfig(config: IConfig): IConfig {
  return config;
}

export interface IConfig {
  rootRoleId?: number;
  jwt?: JwtConfigOptions;
  database?: DataBaseConfigOptions;
  redis?: RedisConfigOptions;
  swagger?: SwaggerConfigOptions;
}

export interface JwtConfigOptions {
  secret: string;
}

export interface RedisConfigOptions {
  host?: string;
  port?: number | string;
  password?: string;
  db?: number;
}

export interface DataBaseConfigOptions {
  type?: string;
  host?: string;
  port?: number | string;
  username?: string;
  password?: string;
  database?: string;
  synchronize?: boolean;
  logging?: boolean;
}

export interface SwaggerConfigOptions {
  enable?: boolean;
  path?: string;
  title?: string;
  desc?: string;
  version?: string;
}
