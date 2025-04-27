import { Body, Get, Post, Query, Param, Put, Res, StreamableFile } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Keep, RequiresPermissions } from 'src/common/decorators';
import { PageSearchUserInfo } from 'src/common/dto';

import { ControllerCreate, ApiList, ApiInfo, ApiCreate, ApiUpdate, ApiDelete, ApiExport } from 'src/common/decorators/controller.decorators';
import { PageSearchUserDto, PasswordUserDto } from 'src/common/dto';

import * as SysMenuService from '../menu/service';
import { Service as SysUserService } from './service';

import { keyStr, controllerName, ADMIN_PREFIX, permissionsPrefix, tableQueryDTO, tableDTO, InfoDto, DeleteDto, IAdminUser, AdminUser } from './config';


@ControllerCreate(`${keyStr}模块`, controllerName, ADMIN_PREFIX)
export class MyController {
  constructor(private userService: SysUserService, private menuService: SysMenuService.Service) {}

  @ApiList('list', permissionsPrefix, `分页查询${keyStr}`)
   // @ts-ignore ← Ignore type error, Swagger can generate fields normally
  async list(@Query() dto: tableQueryDTO): Promise<any> {
    return await this.userService.pageDto(dto);
  }

  @ApiExport('export', permissionsPrefix, `导出${keyStr}`)
  async export(@Body() dto: any, @Res() res: any): Promise<StreamableFile> {
    const { filename, filePath, file } =  await this.userService.pageDtoExport(dto);
    res.filePathToDelete = filePath;
    res.header('Content-disposition', `attachment; filename=${filename}.xlsx`);
    res.type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    return res.send(file);
  }

  @RequiresPermissions('system:user:edit')
  @ApiOperation({ summary: '重置密码' })
  @Put('resetPwd')
  async resetPwd(@Body() dto: PasswordUserDto): Promise<void> {
    await this.userService.forceUpdatePassword(dto.userId, dto.password);
  }

  @RequiresPermissions('system:user:query')
  @ApiOperation({ summary: `根据用户编号获取授权角色` })
  @Keep()
  @Get('authRole/:id')
  async authRoleById(@AdminUser() user: IAdminUser, @Param() params: any): Promise<any> {
    const list: any = await this.userService.infoUser0(params.id);
    const role = await this.userService.infoUserRole(params.id);
    list.roles = role;
    return {
      user: list,
      roles: role,
    };
  }

  @RequiresPermissions('system:user:edit')
  @ApiOperation({ summary: `用户授权角色` })
  @Keep()
  @Put('authRole')
  async insertAuthRole(@Query() params: any): Promise<any> {
    const role = await this.userService.insertAuthRole(params.userId, params.roleIds);
    return {
      roles: role,
    };
  }

  @RequiresPermissions('system:user:list')
  @ApiOperation({ summary: '获取部门树列表' })
  @Keep()
  @Get('deptTree')
  async deptTree(@AdminUser() user: IAdminUser): Promise<any> {
    const res: any = await this.userService.deptTree();
    return res;
  }

  @ApiInfo(':id', permissionsPrefix, `查询${keyStr}详情`)
  async infoUser(@Param() params: InfoDto, @AdminUser() user: IAdminUser): Promise<any> {
    if (params.id) {
      return await this.userService.infoUser(params.id.toString() === 'profile' ? user.uid : params.id);
    } else {
      return await this.userService.infoUserV1();
    }
  }

  @ApiCreate('', permissionsPrefix, `新增${keyStr}`)
  // @ts-ignore ← Ignore type error, Swagger can generate fields normally
  async create(@Body() body: tableDTO, @AdminUser() user: IAdminUser): Promise<void> {
    await this.userService.create(body, user.userName);
  }

  @ApiUpdate('',permissionsPrefix, `修改${keyStr}`)
  // @ts-ignore ← Ignore type error, Swagger can generate fields normally
  async update(@Body() dto: tableDTO, @AdminUser() user: IAdminUser): Promise<void> {
    await this.userService.update(dto, user.userName);
    await this.menuService.refreshPerms(dto.id);
  }

  @RequiresPermissions('system:user:profile')
  @ApiOperation({ summary: '修改用户' })
  @Put('profile')
  async profile(@Body() dto: any, @AdminUser() user: IAdminUser): Promise<void> {
    return await this.userService.updatePersonInfo( user.uid, dto);
  }

  @RequiresPermissions('system:user:changeStatus')
  @ApiOperation({ summary: '修改用户' })
  @Put('changeStatus')
  async changeStatus(@Body() dto: any): Promise<void> {
    await this.userService.changeStatus(dto);
  }

  @ApiDelete(':id',permissionsPrefix, `删除${keyStr}`)
  async remove(@Param() params: DeleteDto): Promise<any> {
    return await this.userService.delete(params.id);
  }

  @ApiOperation({ summary: '分页获取管理员列表' })
  @ApiOkResponse({ type: [PageSearchUserInfo] })
  @Post('page')
  async page(@Body() dto: PageSearchUserDto, @AdminUser() user: IAdminUser): Promise<any> {
    return await this.userService.page(user.uid, dto);
  }

  @ApiOperation({ summary: '更改指定管理员密码' })
  @Post('password')
  async password(@Body() dto: PasswordUserDto): Promise<void> {
    await this.userService.forceUpdatePassword(dto.userId, dto.password);
  }
}
