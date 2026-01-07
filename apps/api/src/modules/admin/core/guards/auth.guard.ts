import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FastifyRequest } from 'fastify';
import { isEmpty } from 'lodash';
import { ApiException } from 'src/common/exceptions/api.exception';
import { AUTHORIZE_KEY_METADATA, ADMIN_USER, PERMISSION_OPTIONAL_KEY_METADATA } from 'src/modules/admin/admin.constants';
import { Service as LoginService } from 'src/modules/admin/login/service';
import { JwtService } from '@nestjs/jwt';
import { REQUIRES_PERMISSIONS_METADATA } from 'src/common/contants/decorator.contants';

/**
 * admin perm check guard
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService, private loginService: LoginService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 检测是否是开放类型的，例如获取验证码类型的接口不需要校验，可以加入@Authorize可自动放过
    const authorize = this.reflector.get<boolean>(AUTHORIZE_KEY_METADATA, context.getHandler());
    if (authorize) {
      return true;
    }
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const url = request.url;
    const path = url.split('?')[0];
    let token = request.headers['authorization'] as string;
    if (isEmpty(token)) {
      throw new ApiException(11001);
    }
    try {
      token = token.split(' ').pop();
      // 挂载对象到当前请求上
      const decoded = this.jwtService.verify(token);
      request[ADMIN_USER] = decoded;
      Logger.log(`AuthGuard: User verified. UID: ${decoded.uid}, PV: ${decoded.pv}`, 'AuthGuard');
    } catch (e) {
      // 无法通过token校验
      Logger.error(`AuthGuard: Token verification failed. Error: ${e.message}`, 'AuthGuard');
      throw new ApiException(11001);
    }
    if (isEmpty(request[ADMIN_USER])) {
      throw new ApiException(11001);
    }
    const pv = await this.loginService.getRedisPasswordVersionById(request[ADMIN_USER].uid);
    Logger.log(`AuthGuard: Redis PV: ${pv} (type: ${typeof pv}), Token PV: ${request[ADMIN_USER].pv}`, 'AuthGuard');
    if (`${pv}` !== `${request[ADMIN_USER].pv}`) {
      // 密码版本不一致，登录期间已更改过密码
      Logger.warn(`AuthGuard: Password version mismatch.`, 'AuthGuard');
      throw new ApiException(11002);
    }
    const redisToken = await this.loginService.getRedisTokenById(request[ADMIN_USER].uid);
    Logger.log(`AuthGuard: Redis Token found: ${!isEmpty(redisToken)}`, 'AuthGuard');
    if (token !== redisToken) {
      // 与redis保存不一致
      Logger.warn(`AuthGuard: Token mismatch with Redis.`, 'AuthGuard');
      throw new ApiException(11002);
    }
    // 注册该注解，Api则放行检测
    const notNeedPerm = this.reflector.get<boolean>(PERMISSION_OPTIONAL_KEY_METADATA, context.getHandler());
    // Token校验身份通过，判断是否需要权限的url，不需要权限则pass
    if (notNeedPerm) {
      return true;
    }
    // 注册该注解，Api需要满足相关权限字符串
    const needPerms = this.reflector.get<string>(REQUIRES_PERMISSIONS_METADATA, context.getHandler());
    const perms: string = await this.loginService.getRedisPermsById(request[ADMIN_USER].uid);
    // 安全判空
    if (isEmpty(perms)) {
      throw new ApiException(11001);
    }
    // 遍历权限是否包含该url，不包含则无访问权限
    if (needPerms) {
      // 有token 没有@RequiresPermissions 与 @PermissionOptional 逻辑一致
      if (perms === '["*:*:*"]') {
        // 管理员有所有权限
        return true;
      } else {
        if (!perms.includes(needPerms)) {
          throw new ApiException(11003);
        }
      }
    }
    // pass
    return true;
  }
}
