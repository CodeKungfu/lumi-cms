import { applyDecorators, Controller } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

/**
 * 创建控制器装饰器
 * @param keyStr 模块名称
 * @param controllerName 控制器名称
 * @param adminPrefix 管理前缀
 */
export function createControllerDecorator(keyStr: string, controllerName: string, adminPrefix: string) {
  return applyDecorators(
    ApiSecurity(adminPrefix),
    ApiTags(`${keyStr}模块`),
    Controller(`${controllerName}`)
  );
}