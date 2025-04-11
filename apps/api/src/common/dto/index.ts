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