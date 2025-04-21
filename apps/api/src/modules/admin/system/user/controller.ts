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

  /**
   * 获取用户列表
   */
  @ApiList('list', permissionsPrefix, `分页查询${keyStr}`)
   // @ts-ignore ← Ignore type error, Swagger can generate fields normally
  async list(@Query() dto: tableQueryDTO): Promise<any> {
    const rows = await this.userService.pageDto(dto);
    return {
      rows: rows.result,
      total: rows.countNum,
      pagination: {
        size: dto.pageSize,
        page: dto.pageNum,
        total: rows.countNum,
      },
    };
  }

  /**
   * 导出用户列表
   */
  @ApiExport('export', permissionsPrefix, `导出${keyStr}`)
  async export(@Body() dto: any, @Res() res: any): Promise<StreamableFile> {
    const { filename, filePath, file } =  await this.userService.pageDtoExport(dto);
    res.filePathToDelete = filePath;
    res.header('Content-disposition', `attachment; filename=${filename}.xlsx`);
    res.type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    return res.send(file);
  }

  /**
   * 重置密码
   */
  @RequiresPermissions('system:user:edit')
  @ApiOperation({ summary: '更改密码' })
  @Put('resetPwd')
  async resetPwd(@Body() dto: PasswordUserDto): Promise<void> {
    await this.userService.forceUpdatePassword(dto.userId, dto.password);
  }

  /**
   * 根据用户编号获取授权角色
   */
  @RequiresPermissions('system:user:query')
  @ApiOperation({ summary: `查询` })
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

  /**
   * 用户授权角色
   */
  @RequiresPermissions('system:user:edit')
  @ApiOperation({ summary: `查询` })
  @Keep()
  @Put('authRole')
  async insertAuthRole(@Query() params: any): Promise<any> {
    const role = await this.userService.insertAuthRole(params.userId, params.roleIds);
    return {
      roles: role,
    };
  }

  /**
   * 获取部门树列表
   */
  @RequiresPermissions('system:user:list')
  @ApiOperation({ summary: '分页获取管理员列表' })
  @Keep()
  @Get('deptTree')
  async deptTree(@AdminUser() user: IAdminUser): Promise<any> {
    const res: any = await this.userService.deptTree();
    return res;
  }

  /**
   * 根据用户编号获取详细信息
   */
  @ApiInfo(':id', permissionsPrefix, `查询${keyStr}详情`)
  async infoUser(@Param() params: InfoDto, @AdminUser() user: IAdminUser): Promise<any> {
    if (params.id) {
      let id = params.id;
      if (id.toString() === 'profile') {
        id = user.uid;
      }
      const list = await this.userService.infoUser(id);
      return list;
    } else {
      const list = await this.userService.infoUserV1();
      return list;
    }
  }

  /**
   * 新增用户
   */
  @ApiCreate('', permissionsPrefix, `新增${keyStr}`)
  // @ts-ignore ← Ignore type error, Swagger can generate fields normally
  async create(@Body() body: tableDTO, @AdminUser() user: IAdminUser): Promise<void> {
    await this.userService.create(body, user.userName);
  }

  /**
   * 修改用户
   */
  @ApiUpdate('',permissionsPrefix, `修改${keyStr}`)
  // @ts-ignore ← Ignore type error, Swagger can generate fields normally
  async update(@Body() dto: tableDTO, @AdminUser() user: IAdminUser): Promise<void> {
    await this.userService.update(dto, user.userName);
    await this.menuService.refreshPerms(dto.id);
  }

  /**
   * 修改用户
   */
  @RequiresPermissions('system:user:profile')
  @ApiOperation({
    summary: '更新管理员信息',
  })
  @Put('profile')
  async profile(@Body() dto: any, @AdminUser() user: IAdminUser): Promise<void> {
    return await this.userService.updatePersonInfo( user.uid, dto);
  }

  /**
   * 修改用户
   */
  @RequiresPermissions('system:user:changeStatus')
  @ApiOperation({
    summary: '更新管理员信息',
  })
  @Put('changeStatus')
  async changeStatus(@Body() dto: any): Promise<void> {
    await this.userService.changeStatus(dto);
  }

  /**
   * 删除用户
   */
  @ApiDelete(':id',permissionsPrefix, `删除${keyStr}`)
  async remove(@Param() params: DeleteDto): Promise<any> {
    return await this.userService.delete(params.id);
  }

  // @ApiOperation({
  //   summary: '根据ID列表删除管理员',
  // })
  // @Post('delete')
  // async delete(@Body() dto: DeleteUserDto): Promise<void> {
  //   await this.userService.delete(dto.userIds);
  //   await this.userService.multiForbidden(dto.userIds);
  // }

  @ApiOperation({
    summary: '分页获取管理员列表',
  })
  @ApiOkResponse({ type: [PageSearchUserInfo] })
  @Post('page')
  async page(@Body() dto: PageSearchUserDto, @AdminUser() user: IAdminUser): Promise<any> {
    const res: any = await this.userService.page(user.uid, dto);
    // const total = await this.userService.count(user.uid, dto.departmentIds);
    return {
      list: res,
      pagination: {
        total: res.length,
        page: dto.page,
        size: dto.limit,
      },
    };
  }

  @ApiOperation({
    summary: '更改指定管理员密码',
  })
  @Post('password')
  async password(@Body() dto: PasswordUserDto): Promise<void> {
    await this.userService.forceUpdatePassword(dto.userId, dto.password);
  }
}
