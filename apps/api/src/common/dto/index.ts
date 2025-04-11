import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Min,
  MinLength,
} from 'class-validator';
import { sys_role_dept, sys_role_menu, sys_role } from '@repo/database';

export class PageOptionsDto {
  @ApiProperty({
    description: '当前页包含数量',
    required: false,
    default: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  readonly limit: number = 10;

  @ApiProperty({
    description: '当前页包含数量',
    required: false,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  readonly page: number = 1;
}

export class LoginLogInfo {
  @ApiProperty({ description: '日志编号' })
  id: number;

  @ApiProperty({ description: '登录ip' })
  ip: string;

  @ApiProperty({ description: '系统' })
  os: string;

  @ApiProperty({ description: '浏览器' })
  browser: string;

  @ApiProperty({ description: '时间' })
  time: string;

  @ApiProperty({ description: '登录用户名' })
  username: string;
}

export class TaskLogInfo {
  @ApiProperty({ description: '日志编号' })
  id: number;

  @ApiProperty({ description: '任务编号' })
  taskId: number;

  @ApiProperty({ description: '任务名称' })
  name: string;

  @ApiProperty({ description: '创建时间' })
  createdAt: string;

  @ApiProperty({ description: '耗时' })
  consumeTime: number;

  @ApiProperty({ description: '执行信息' })
  detail: string;

  @ApiProperty({ description: '任务执行状态' })
  status: number;
}

export class Runtime {
  @ApiProperty({ description: '系统' })
  os?: string;

  @ApiProperty({ description: '服务器架构' })
  arch?: string;

  @ApiProperty({ description: 'Node版本' })
  nodeVersion?: string;

  @ApiProperty({ description: 'Npm版本' })
  npmVersion?: string;
}

export class CoreLoad {
  @ApiProperty({ description: '当前CPU资源消耗' })
  rawLoad?: number;

  @ApiProperty({ description: '当前空闲CPU资源' })
  rawLoadIdle?: number;
}

// Intel(R) Xeon(R) Platinum 8163 CPU @ 2.50GHz
export class Cpu {
  @ApiProperty({ description: '制造商 e.g. Intel(R)' })
  manufacturer?: string;

  @ApiProperty({ description: '品牌	e.g. Core(TM)2 Duo' })
  brand?: string;

  @ApiProperty({ description: '物理核心数' })
  physicalCores?: number;

  @ApiProperty({ description: '型号' })
  model?: string;

  @ApiProperty({ description: '速度 in GHz e.g. 3.4' })
  speed?: number;

  @ApiProperty({ description: 'CPU资源消耗 原始滴答' })
  rawCurrentLoad?: number;

  @ApiProperty({ description: '空闲CPU资源 原始滴答' })
  rawCurrentLoadIdle?: number;

  @ApiProperty({ description: 'cpu资源消耗', type: [CoreLoad] })
  coresLoad?: CoreLoad[];
}

export class Disk {
  @ApiProperty({ description: '磁盘空间大小 (bytes)' })
  size?: number;

  @ApiProperty({ description: '已使用磁盘空间 (bytes)' })
  used?: number;

  @ApiProperty({ description: '可用磁盘空间 (bytes)' })
  available?: number;
}

export class Memory {
  @ApiProperty({ description: 'total memory in bytes' })
  total?: number;

  @ApiProperty({ description: '可用内存' })
  available?: number;
}

/**
 * 系统信息
 */
export class ServeStatInfo {
  @ApiProperty({ description: '运行环境', type: Runtime })
  runtime?: Runtime;

  @ApiProperty({ description: 'CPU信息', type: Cpu })
  cpu?: Cpu;

  @ApiProperty({ description: '磁盘信息', type: Disk })
  disk?: Disk;

  @ApiProperty({ description: '内存信息', type: Memory })
  memory?: Memory;
}

export class DeleteRoleDto {
  @ApiProperty({
    description: '需要删除的角色ID列表',
    type: [Number],
  })
  @IsArray()
  @ArrayNotEmpty()
  roleIds: number[];
}

export class CreateRoleDto {
  @ApiProperty({
    description: '角色名称',
  })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({
    description: '角色唯一标识',
  })
  @IsString()
  @Matches(/^[a-z0-9A-Z]+$/)
  label: string;

  @ApiProperty({
    description: '角色备注',
    required: false,
  })
  @IsString()
  @IsOptional()
  remark: string;

  @ApiProperty({
    description: '关联菜单、权限编号',
    required: false,
  })
  @IsOptional()
  @IsArray()
  menus: number[];

  @ApiProperty({
    description: '关联部门编号',
    required: false,
  })
  @IsOptional()
  @IsArray()
  depts: number[];
}

export class UpdateRoleDto extends CreateRoleDto {
  @ApiProperty({
    description: '关联部门编号',
  })
  @IsInt()
  @Min(0)
  roleId: number;
}

export class InfoRoleDto {
  @ApiProperty({
    description: '需要查找的角色ID',
  })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  roleId: number;
}

export class RoleInfo {
  @ApiProperty()
  roleInfo: sys_role;

  @ApiProperty()
  menus: sys_role_menu[];

  @ApiProperty()
  depts: sys_role_dept[];
}

export class CreatedRoleId {
  roleId: number;
}

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