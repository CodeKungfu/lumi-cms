import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Optional } from '@nestjs/common';
import { Type } from 'class-transformer';
import * as parser from 'cron-parser';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Min,
  MinLength,
  ArrayMaxSize,
  ArrayMinSize,
  IsEmail,
  IsIn,
  MaxLength,
  ValidateIf,
  IsDateString,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { isEmpty } from 'lodash';

import { sys_role_dept, sys_role_menu, sys_role, sys_menu } from '@repo/database';

export class UpdatePersonInfoDto {
  @ApiProperty({ description: '管理员昵称', required: false })
  @IsString()
  @Optional()
  nickName: string;

  @ApiProperty({ description: '邮箱', required: false })
  @IsString()
  @Optional()
  email: string;

  @ApiProperty({ description: '手机', required: false })
  @IsString()
  @Optional()
  phone: string;

  @ApiProperty({ description: '备注', required: false })
  @IsString()
  @Optional()
  remark: string;
}

export class ImageCaptchaDto {
  @ApiProperty({
    required: false,
    default: 100,
    description: '验证码宽度',
  })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  readonly width: number = 100;

  @ApiProperty({
    required: false,
    default: 50,
    description: '验证码高度',
  })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  readonly height: number = 50;
}

export class LoginInfoDto {
  @ApiProperty({ description: '管理员用户名' })
  @IsString()
  @MinLength(1)
  username: string;

  @ApiProperty({ description: '管理员密码' })
  @IsString()
  @MinLength(4)
  password: string;

  @ApiProperty({ description: '验证码标识' })
  @IsString()
  captchaId: string;

  @ApiProperty({ description: '用户输入的验证码' })
  @IsString()
  @MinLength(4)
  @MaxLength(4)
  verifyCode: string;
}

export class ImageCaptcha {
  @ApiProperty({
    description: 'base64格式的svg图片',
  })
  img: string;

  @ApiProperty({
    description: '验证码对应的唯一ID',
  })
  id: string;
}

export class LoginToken {
  @ApiProperty({ description: 'JWT身份Token' })
  token: string;
}

export class PermMenuInfo {
  @ApiProperty({ description: '菜单列表', type: [] })
  menus: sys_menu[];

  @ApiProperty({ description: '权限列表', type: [String] })
  perms: string[];
}

// cron 表达式验证，bull lib下引用了cron-parser
@ValidatorConstraint({ name: 'isCronExpression', async: false })
export class IsCronExpression implements ValidatorConstraintInterface {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate(value: string, args: ValidationArguments) {
    try {
      if (isEmpty(value)) {
        throw new Error('cron expression is empty');
      }

      // 然后使用
      // parser.parseExpression(value);
      parser.CronExpressionParser.parse(value);
      return true;
    } catch (e) {
      return false;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(_args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return 'this cron expression ($value) invalid';
  }
}

export class CreateTaskDto {
  @ApiProperty({ description: '任务名称' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @ApiProperty({ description: '调用的服务' })
  @IsString()
  @MinLength(1)
  service: string;

  @ApiProperty({ description: '任务类别：cron | interval' })
  @IsIn([0, 1])
  type: number;

  @ApiProperty({ description: '任务状态' })
  @IsIn([0, 1])
  status: number;

  @ApiPropertyOptional({ description: '开始时间', type: Date })
  @IsDateString()
  @ValidateIf((o) => !isEmpty(o.startTime))
  startTime: string;

  @ApiPropertyOptional({ description: '结束时间', type: Date })
  @IsDateString()
  @ValidateIf((o) => !isEmpty(o.endTime))
  endTime: string;

  @ApiPropertyOptional({ description: '限制执行次数，负数则无限制' })
  @IsInt()
  @IsOptional()
  readonly limit: number = -1;

  @ApiProperty({ description: 'cron表达式' })
  @Validate(IsCronExpression)
  @ValidateIf((o) => o.type === 0)
  cron: string;

  @ApiProperty({ description: '执行间隔，毫秒单位' })
  @IsInt()
  @Min(100)
  @ValidateIf((o) => o.type === 1)
  every: number;

  @ApiPropertyOptional({ description: '执行参数' })
  @IsString()
  @IsOptional()
  data: string;

  @ApiPropertyOptional({ description: '任务备注' })
  @IsOptional()
  @IsString()
  remark: string;
}

export class UpdateTaskDto extends CreateTaskDto {
  @ApiProperty({ description: '需要更新的任务ID' })
  @IsInt()
  @Min(0)
  id: number;
}

export class CheckIdTaskDto {
  @ApiProperty({ description: '任务ID' })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  id: number;
}

export class AccountInfo {
  @ApiProperty()
  name: string;

  @ApiProperty()
  nickName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  remark: string;

  @ApiProperty()
  headImg: string;

  @ApiProperty()
  loginIp: string;
}

export class PageSearchUserInfo {
  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  departmentId: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  headImg: string;

  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  nickName: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  remark: string;

  @ApiProperty()
  status: number;

  @ApiProperty()
  updatedAt: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  departmentName: string;

  @ApiProperty({
    type: [String],
  })
  roleNames: string[];
}

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

export class UpdateUserInfoDto {
  @ApiProperty({
    required: false,
    description: '用户呢称',
  })
  @IsString()
  @IsOptional()
  nickName: string;

  @ApiProperty({
    required: false,
    description: '用户邮箱',
  })
  @IsEmail()
  @ValidateIf((o) => !isEmpty(o.email))
  email: string;

  @ApiProperty({
    required: false,
    description: '用户手机号',
  })
  @IsString()
  @IsOptional()
  phone: string;

  @ApiProperty({
    required: false,
    description: '用户备注',
  })
  @IsString()
  @IsOptional()
  remark: string;
}

export class UpdatePasswordDto {
  @ApiProperty({
    description: '更改前的密码',
  })
  @IsString()
  @MinLength(6)
  @Matches(/^[a-z0-9A-Z`~!#%^&*=+\\|{};:'\\",<>/?]+$/)
  originPassword: string;

  @ApiProperty({
    description: '更改后的密码',
  })
  @MinLength(6)
  @Matches(/^[a-z0-9A-Z`~!#%^&*=+\\|{};:'\\",<>/?]+$/)
  newPassword: string;
}

export class CreateUserDto {
  @ApiProperty({
    description: '所属部门编号',
  })
  @IsInt()
  @Min(0)
  departmentId: number;

  @ApiProperty({
    description: '用户姓名',
  })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({
    description: '登录账号',
  })
  @IsString()
  @Matches(/^[a-z0-9A-Z]+$/)
  @MinLength(6)
  @MaxLength(20)
  username: string;

  @ApiProperty({
    description: '归属角色',
    type: [Number],
  })
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  roles: number[];

  @ApiProperty({
    required: false,
    description: '呢称',
  })
  @IsString()
  @IsOptional()
  nickName: string;

  @ApiProperty({
    required: false,
    description: '邮箱',
  })
  @IsEmail()
  @ValidateIf((o) => !isEmpty(o.email))
  email: string;

  @ApiProperty({
    required: false,
    description: '手机号',
  })
  @IsString()
  @IsOptional()
  phone: string;

  @ApiProperty({
    required: false,
    description: '备注',
  })
  @IsString()
  @IsOptional()
  remark: string;

  @ApiProperty({
    description: '状态',
  })
  @IsIn([0, 1])
  status: number;
}

export class UpdateUserDto extends CreateUserDto {
  @ApiProperty({
    description: '用户ID',
  })
  @IsInt()
  @Min(0)
  id: number;
}

export class InfoUserDto {
  @ApiProperty({
    description: '用户ID',
  })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  userId: number;
}

export class DeleteUserDto {
  @ApiProperty({
    description: '需要删除的用户ID列表',
    type: [Number],
  })
  @IsArray()
  @ArrayNotEmpty()
  userIds: number[];
}

export class PageSearchUserDto extends PageOptionsDto {
  @ApiProperty({
    required: false,
    description: '部门列表',
    type: [Number],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsOptional()
  departmentIds: number[];

  @ApiProperty({
    required: false,
    description: '用户姓名',
  })
  @IsString()
  @IsOptional()
  name = '';

  @ApiProperty({
    required: false,
    description: '用户名',
  })
  @IsString()
  @IsOptional()
  username = '';

  @ApiProperty({
    required: false,
    description: '用户手机号',
  })
  @IsString()
  @IsOptional()
  phone = '';

  @ApiProperty({
    required: false,
    description: '用户备注',
  })
  @IsString()
  @IsOptional()
  remark = '';
}

export class PasswordUserDto {
  @ApiProperty({
    description: '管理员ID',
  })
  @IsInt()
  @Min(0)
  userId: number;

  @ApiProperty({
    description: '更改后的密码',
  })
  @Matches(/^[a-z0-9A-Z`~!#%^&*=+\\|{};:'\\",<>/?]+$/)
  password: string;
}