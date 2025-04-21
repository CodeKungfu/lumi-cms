import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/shared/services/redis.service';
import { OnlineUserInfo } from 'src/common/dto';
import { prisma } from 'src/prisma';
import { ApiException } from 'src/common/exceptions/api.exception';
import { Service as SysUserService } from '../../system/user/service';

@Injectable()
export class Service {
  constructor(
    private redisService: RedisService,
    private userService: SysUserService,
  ) {}

  /**
   * 获取在线用户列表
   */
  async listOnlineUser(currentUid: number): Promise<OnlineUserInfo[]> {
    // 从Redis获取所有在线token
    const tokens = await this.redisService.getRedis().keys('admin:token:*');
    if (!tokens || tokens.length === 0) {
      return [];
    }

    // 获取用户ID列表
    const userIds = tokens.map(key => parseInt(key.split(':')[2]));
    
    // 获取最近登录信息
    return this.findLastLoginInfoList(userIds, currentUid);
  }

  /**
   * 强制下线用户
   */
  async kickUser(uid: number, currentUid: number): Promise<void> {
    const rootUserId = await this.userService.findRootUserId();
    
    // 检查是否为超级管理员
    if (uid === Number(rootUserId)) {
      throw new ApiException(10013); // 不能踢出超级管理员
    }
    
    // 检查是否为自己
    if (uid === currentUid) {
      throw new ApiException(10012); // 不能踢出自己
    }
    
    // 记录踢出日志
    await prisma.sys_logininfor.create({
      data: {
        ipaddr: '',
        userName: (await this.userService.infoUser0(uid)).userName,
        status: '1',
        msg: '用户被管理员强制下线',
        loginTime: new Date(),
        browser: '',
        os: '',
        loginLocation: '',
      },
    });
    
    // 清除用户Token
    await this.redisService.getRedis().del(`admin:token:${uid}`);
    // 清除用户权限缓存
    await this.redisService.getRedis().del(`admin:perms:${uid}`);
    // 更新密码版本，使之前的token失效
    await this.userService.upgradePasswordV(uid);
  }

  /**
   * 获取用户最近登录信息
   */
  private async findLastLoginInfoList(
    ids: number[],
    currentUid: number,
  ): Promise<OnlineUserInfo[]> {
    const rootUserId = await this.userService.findRootUserId();
    
    // 使用子查询优化
    const result: any = await prisma.$queryRaw`
      SELECT 
        l.info_id as sessionId,
        l.login_time as loginTime, 
        l.ipaddr as ip, 
        l.browser,
        l.os,
        l.login_location as loginLocation,
        u.user_id as id,
        u.user_name as userName,
        u.nick_name as name,
        d.dept_name as deptName
      FROM sys_logininfor l
      INNER JOIN (
        SELECT user_name, MAX(login_time) as max_time 
        FROM sys_logininfor 
        GROUP BY user_name
      ) lm ON l.user_name = lm.user_name AND l.login_time = lm.max_time
      INNER JOIN sys_user u ON l.user_name = u.user_name 
      LEFT JOIN sys_dept d ON u.dept_id = d.dept_id
      WHERE u.user_id IN (${ids.join(',')})
    `;

    if (result) {
      return result.map((e) => {
        return {
          tokenId: e.sessionId,  // 添加会话编号
          id: e.id,
          ipaddr: e.ip,
          userName: `${e.name}（${e.userName}）`,
          deptName: e.deptName || '-',
          loginLocation: e.loginLocation || '-',
          isCurrent: currentUid === e.id,
          loginTime: e.loginTime,
          os: e.os || '-',
          browser: e.browser || '-',
          disable: currentUid === e.id || e.id === rootUserId,
        };
      });
    }
    return [];
  }
}