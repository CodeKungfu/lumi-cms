import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { isEmpty, upperFirst } from 'lodash';
import * as svgCaptcha from 'svg-captcha';
import { UtilService } from 'src/shared/services/util.service';
import { ApiException } from 'src/common/exceptions/api.exception';
import { RedisService } from 'src/shared/services/redis.service';
import { buildTreeData } from 'src/shared/services/util.service';
import { ImageCaptchaDto, ImageCaptcha, PermMenuInfo } from 'src/common/dto';
import { Service as SysUserService } from '../system/user/service';
import * as SysMenuService from '../system/menu/service';
import { prisma } from 'src/prisma';
import { UAParser } from 'ua-parser-js';

function mapToRouteFormat(node: any): any {
  const isRoot = node.parentId === 0;
  const component = node.component || (isRoot ? 'Layout' : undefined);
  const path = isRoot ? '/' + node.path : node.path;
  return {
    id: node.id,
    parentId: node.parentId,
    name: upperFirst(node.path),
    path,
    hidden: node.visible === '1',
    component,
    alwaysShow: node.menu_type === 'M',
    redirect: node.menu_type === 'M' ? 'noRedirect' : undefined,
    meta: {
      title: node.menu_name,
      icon: node.icon,
      noCache: node.is_cache === '1',
      link: node.is_frame === '0' ? node.path : null,
    },
    children: node.children?.map(mapToRouteFormat) || []
  };
}

@Injectable()
export class Service {
  constructor(
    private redisService: RedisService,
    private menuService: SysMenuService.Service,
    private userService: SysUserService,
    private util: UtilService,
    private jwtService: JwtService,
  ) {}

  async createImageCaptcha(captcha: ImageCaptchaDto): Promise<ImageCaptcha> {
    const svg = svgCaptcha.create({
      size: 4,
      color: true,
      noise: 4,
      width: isEmpty(captcha.width) ? 100 : captcha.width,
      height: isEmpty(captcha.height) ? 50 : captcha.height,
      charPreset: '1234567890',
    });
    const result = {
      img: `data:image/svg+xml;base64,${Buffer.from(svg.data).toString('base64')}`,
      id: this.util.generateUUID(),
    };
    await this.redisService.getRedis().set(`admin:captcha:img:${result.id}`, svg.text, 'EX', 300);
    return result;
  }

  async checkImgCaptcha(id: string, code: string): Promise<void> {
    const result = await this.redisService.getRedis().get(`admin:captcha:img:${id}`);
    if (isEmpty(result) || code.toLowerCase() !== result.toLowerCase()) throw new ApiException(10002);
    await this.redisService.getRedis().del(`admin:captcha:img:${id}`);
  }

  async getLoginSign(username: string, password: string, ip: string, ua: string): Promise<string> {
    const user = await this.userService.findUserByUserName(username);
    if (isEmpty(user)) throw new ApiException(10003);
    if (user.password !== this.util.md5(`${password}`)) throw new ApiException(10003);
    const userId = Number(user.userId);
    const perms = await this.menuService.getPerms(userId);
    if (userId === 1) {
      const oldToken = await this.getRedisTokenById(userId);
      if (oldToken) {
        await this.createLoginRecord(ip, ua, user);
        return oldToken;
      }
    }
    const jwtSign = this.jwtService.sign({
      uid: parseInt(user.userId.toString()),
      pv: 1,
      userName: user.userName,
    });
    // 设置Redis缓存
    const redis = this.redisService.getRedis();
    await Promise.all([
      redis.set(`admin:passwordVersion:${userId}`, 1),
      redis.set(`admin:token:${userId}`, jwtSign, 'EX', 86400),
      redis.set(`admin:perms:${userId}`, JSON.stringify(perms))
    ]);
    await this.createLoginRecord(ip, ua, user);
    return jwtSign;
  }

  // 提取登录记录创建逻辑
  private async createLoginRecord(ip: string, ua: string, user: any): Promise<void> {
    const parser = new UAParser(ua);
    await prisma.sys_logininfor.create({
      data: {
        ipaddr: ip,
        userName: user.userName,
        status: '0',
        msg: '登录成功',
        loginTime: new Date(),
        browser: parser.getBrowser().name || '',
        os: parser.getOS().name || '',
        loginLocation: '',
      },
    });
  }

  async clearLoginStatus(uid: number): Promise<void> {
    await this.userService.forbidden(uid);
  }

  async getRouters(uid: number): Promise<any> {
    return buildTreeData(
      (await this.menuService.getMenus(uid)).map((item: any) => ({
        ...item,
        id: Number(item.menu_id),
        parentId: Number(item.parent_id),
      })),
      'id',
      'parentId',
      'children'
    ).map(mapToRouteFormat);
  }

  async getPermMenu(uid: number): Promise<PermMenuInfo> {
    const [menus, perms] = await Promise.all([
      this.menuService.getMenus(uid),
      this.menuService.getPerms(uid)
    ]);
    return { menus, perms };
  }

  private async getRedisValueById(key: string, id: number): Promise<string> {
    return this.redisService.getRedis().get(`admin:${key}:${id}`);
  }

  async getRedisPasswordVersionById(id: number): Promise<string> {
    return this.getRedisValueById('passwordVersion', id);
  }
  async getRedisTokenById(id: number): Promise<string> {
    return this.getRedisValueById('token', id);
  }
  async getRedisPermsById(id: number): Promise<string> {
    return this.getRedisValueById('perms', id);
  }
}
