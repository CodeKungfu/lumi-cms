import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { isEmpty } from 'lodash';
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

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function mapToRouteFormat(node: any): any {
  const routeNode = {
    id: node.id, // 保留原始 id，虽然前端路由不直接用
    parentId: node.parentId, // 保留原始 parentId
    name: capitalizeFirstLetter(node.path),
    path: node.path, // 子路由路径不带 /
    hidden: node.visible === '1', // '1' 表示隐藏
    component: node.component || 'Layout', // 顶层或目录使用 Layout
    alwaysShow: node.menu_type === 'M', // 目录类型通常需要 alwaysShow
    redirect: node.menu_type === 'M' ? 'noRedirect' : undefined, // 目录类型设置 redirect
    meta: {
      title: node.menu_name,
      icon: node.icon,
      noCache: node.is_cache === '1', // '1' 表示不缓存
      link: node.is_frame === '0' ? node.path : null, // '0' 表示外链
    },
    children: [] // 初始化 children
  };
  // 处理顶层路由路径和组件
  if (routeNode.parentId === 0) {
    routeNode.path = '/' + node.path;
    if (!routeNode.component) {
      routeNode.component = 'Layout';
    }
  } else {
      // 子菜单 component 可能为空，需要处理
      if (!routeNode.component && node.menu_type === 'C') {
          console.warn(`Menu item component is missing for path: ${node.path}`);
          // 可以根据需要设置默认组件或保持为空
          // routeNode.component = 'DefaultView';
      }
  }
  // 递归处理子节点
  if (node.children && node.children.length > 0) {
    routeNode.children = node.children.map(mapToRouteFormat);
  }
  return routeNode;
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

  /**
   * 创建验证码并缓存加入redis缓存
   * @param captcha 验证码长宽
   * @returns svg & id obj
   */
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
      img: `data:image/svg+xml;base64,${Buffer.from(svg.data).toString(
        'base64',
      )}`,
      id: this.util.generateUUID(),
    };
    // 5分钟过期时间
    await this.redisService.getRedis().set(`admin:captcha:img:${result.id}`, svg.text, 'EX', 60 * 5);
    return result;
  }

  /**
   * 校验验证码
   */
  async checkImgCaptcha(id: string, code: string): Promise<void> {
    const result = await this.redisService.getRedis().get(`admin:captcha:img:${id}`);
    if (isEmpty(result) || code.toLowerCase() !== result.toLowerCase()) {
      throw new ApiException(10002);
    }
    // 校验成功后移除验证码
    await this.redisService.getRedis().del(`admin:captcha:img:${id}`);
  }

  /**
   * 获取登录JWT
   * 返回null则账号密码有误，不存在该用户
   */
  async getLoginSign(
    username: string,
    password: string,
    ip: string,
    ua: string,
  ): Promise<string> {
    const user = await this.userService.findUserByUserName(username);
    if (isEmpty(user)) {
      throw new ApiException(10003);
    }
    const comparePassword = this.util.md5(`${password}`);
    if (user.password !== comparePassword) {
      throw new ApiException(10003);
    }
    const perms = await this.menuService.getPerms(Number(user.userId));
    // TODO 系统管理员开放多点登录
    // 修改管理员登录部分的日志记录
    if (Number(user.userId) === 1) {
      const oldToken = await this.getRedisTokenById(Number(user.userId));
      if (oldToken) {
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
        return oldToken;
      }
    }
    const jwtSign = this.jwtService.sign(
      {
        uid: parseInt(user.userId.toString()),
        pv: 1,
        userName: user.userName,
      },
      // {
      //   expiresIn: '24h',
      // },
    );
    await this.redisService.getRedis().set(`admin:passwordVersion:${user.userId}`, 1);
    // Token设置过期时间 24小时
    await this.redisService.getRedis().set(`admin:token:${user.userId}`, jwtSign, 'EX', 60 * 60 * 24);
    await this.redisService.getRedis().set(`admin:perms:${user.userId}`, JSON.stringify(perms));
    // 修改这两处 create 调用
    await prisma.sys_logininfor.create({
      data: {
        ipaddr: ip,
        userName: user.userName,
        status: '0',
        msg: '登录成功',
        loginTime: new Date(),
        browser: new UAParser(ua).getBrowser().name || '',
        os: new UAParser(ua).getOS().name || '',
        loginLocation: '',  // 如果需要获取地理位置，可以通过 IP 查询服务获取
      },
    });
    return jwtSign;
  }

  /**
   * 清除登录状态信息
   */
  async clearLoginStatus(uid: number): Promise<void> {
    await this.userService.forbidden(uid);
  }

  async getRouters(uid: number): Promise<any> {
    const menuList = await this.menuService.getMenus(uid);
    // 2. 准备 buildTreeData 需要的数据格式
    const dataForTree = menuList.map((item: any) => ({
      ...item, // 保留原始字段，因为 mapToRouteFormat 需要它们
      id: Number(item.menu_id),
      parentId: Number(item.parent_id),
    }));
    const genericTree = buildTreeData(dataForTree, 'id', 'parentId', 'children');
    // 4. 将通用树映射为前端路由格式
    const routerTree = genericTree.map(mapToRouteFormat);
    return routerTree;
  }
  /**
   * 获取权限菜单
   */
  async getPermMenu(uid: number): Promise<PermMenuInfo> {
    const menus = await this.menuService.getMenus(uid);
    const perms = await this.menuService.getPerms(uid);
    return { menus, perms };
  }

  async getRedisPasswordVersionById(id: number): Promise<string> {
    return this.redisService.getRedis().get(`admin:passwordVersion:${id}`);
  }

  async getRedisTokenById(id: number): Promise<string> {
    return this.redisService.getRedis().get(`admin:token:${id}`);
  }

  async getRedisPermsById(id: number): Promise<string> {
    return this.redisService.getRedis().get(`admin:perms:${id}`);
  }
}
