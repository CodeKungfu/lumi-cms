import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class KickDto {
  @ApiProperty({ description: '需要下线的角色ID' })
  @IsInt()
  id: number;
}

export class OnlineUserInfo {
  @ApiProperty({ description: '最近的一条登录日志ID' })
  id: number;

  @ApiProperty({ description: '登录IP' })
  ip: string;

  @ApiProperty({ description: '用户名' })
  username: string;

  @ApiProperty({ description: '是否当前' })
  isCurrent: boolean;

  @ApiProperty({ description: '登陆时间' })
  time: string;

  @ApiProperty({ description: '系统' })
  os: string;

  @ApiProperty({ description: '浏览器' })
  browser: string;

  @ApiProperty({ description: '是否禁用' })
  disable: boolean;
}