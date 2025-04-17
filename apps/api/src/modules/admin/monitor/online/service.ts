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
    if (uid === Number(rootUserId)) {
      throw new ApiException(10013);
    }

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
    const result: any = await prisma.$queryRaw`
      SELECT 
        sys_logininfor.info_id as sessionId,
        sys_logininfor.login_time as loginTime, 
        sys_logininfor.ipaddr as ip, 
        sys_logininfor.browser,
        sys_logininfor.os,
        sys_logininfor.login_location as loginLocation,
        sys_user.user_id as id,
        sys_user.user_name as userName,
        sys_user.nick_name as name,
        sys_dept.dept_name as deptName
      FROM sys_logininfor 
      INNER JOIN sys_user ON sys_logininfor.user_name = sys_user.user_name 
      LEFT JOIN sys_dept ON sys_user.dept_id = sys_dept.dept_id
      WHERE sys_logininfor.login_time IN (
        SELECT MAX(login_time) FROM sys_logininfor GROUP BY user_name
      )
      AND sys_user.user_id IN (${ids.join(',')})
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