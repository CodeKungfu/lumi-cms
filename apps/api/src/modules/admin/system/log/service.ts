import { Injectable } from '@nestjs/common';
import { UAParser } from 'ua-parser-js';
import { LoginLogInfo } from 'src/common/dto';
import { prisma } from 'src/prisma';
import { UtilService } from 'src/shared/services/util.service';

@Injectable()
export class Service {
  constructor(private readonly utilService: UtilService) {}

  /**
   * 记录登录日志
   */
  async saveLoginLog(uid: number, ip: string, ua: string): Promise<void> {
    await prisma.sys_logininfor.create({
      data: {
        ipaddr: ip,
        userName: uid.toString(),
      },
    });
  }

  /**
   * 计算登录日志日志总数
   */
  async countLoginLog(): Promise<number> {
    // const userIds = await this.userRepository
    //   .createQueryBuilder('user')
    //   .select(['user.id'])
    //   .getMany();
    // return await this.loginLogRepository.count({
    //   where: { userId: In(userIds.map((n) => n.id)) },
    // });
    return await prisma.sys_logininfor.count();
  }

  /**
   * 分页加载日志信息
   */
  async pageGetLoginLog(page: number, count: number): Promise<LoginLogInfo[]> {
    const result: any =
      await prisma.$queryRaw`SELECT * FROM sys_logininfor INNER JOIN sys_user ON sys_logininfor.user_id = sys_user.id order by sys_logininfor.created_at DESC LIMIT ${
        page * count
      }, ${count}`;
    const parser = new UAParser();
    return result.map((e) => {
      const u = parser.setUA(e.ua).getResult();
      return {
        id: e.id,
        ip: e.ip,
        os: `${u.os.name} ${u.os.version}`,
        browser: `${u.browser.name} ${u.browser.version}`,
        time: e.created_at,
        username: e.username,
        loginLocation: e.login_location,
      };
    });
  }

  /**
   * 清空表中的所有数据
   */
  async clearLoginLog(): Promise<void> {
    await prisma.sys_logininfor.deleteMany();
  }
}
