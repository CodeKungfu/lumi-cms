import { Body, Post, Query, Param, Res, StreamableFile } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ApiGet, ControllerCreate, ApiList, ApiInfo, ApiCreate, ApiUpdate, ApiDelete, ApiExport } from 'src/common/decorators/controller.decorators';
import { PageSearchUserDto, PasswordUserDto, PageSearchUserInfo } from 'src/common/dto';

import * as SysMenuService from '../menu/service';
import * as SysDeptService from '../dept/service';
import { Service as SysUserService } from './service';

import { keyStr, controllerName, ADMIN_PREFIX, permissionsPrefix, tableQueryDTO, tableDTO, InfoDto, DeleteDto, IAdminUser, AdminUser } from './config';


@ControllerCreate(`${keyStr}模块`, controllerName, ADMIN_PREFIX)
export class MyController {
  constructor(private userService: SysUserService, private menuService: SysMenuService.Service, private deptService: SysDeptService.Service) {}

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

  @ApiGet('deptTree', 'system:user:list', '获取部门树列表')
  async deptTree(@AdminUser() user: IAdminUser): Promise<any> {
    return await this.deptService.deptTree();
  }

  @ApiUpdate('resetPwd',permissionsPrefix, `重置密码`)
  async resetPwd(@Body() dto: PasswordUserDto): Promise<void> {
    await this.userService.forceUpdatePassword(dto.userId, dto.password);
  }

  @ApiGet('authRole/:id', 'system:user:query', '根据用户编号获取授权角色')
  async authRoleById(@AdminUser() user: IAdminUser, @Param() params: any): Promise<any> {
    const list: any = await this.userService.infoUser0(params.id);
    const role = await this.userService.infoUserRole(params.id);
    list.roles = role;
    return {
      user: list,
      roles: role,
    };
  }

  @ApiUpdate('authRole',permissionsPrefix, `用户授权角色`, true)
  async insertAuthRole(@Query() params: any): Promise<any> {
    const role = await this.userService.insertAuthRole(params.userId, params.roleIds);
    return {
      roles: role,
    };
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
  async create(@Body() body: tableDTO & { postIds: number[], roleIds: number[] }, @AdminUser() user: IAdminUser): Promise<void> {
    await this.userService.create(body, user.userName);
  }

  @ApiUpdate('',permissionsPrefix, `修改${keyStr}`)
  // @ts-ignore ← Ignore type error, Swagger can generate fields normally
  async update(@Body() dto: tableDTO, @AdminUser() user: IAdminUser): Promise<void> {
    await this.userService.update(dto, user.userName);
    await this.menuService.refreshPerms(dto.id);
  }

  @ApiUpdate('profile','system:user:profile', `修改用户`)
  async profile(@Body() dto: any, @AdminUser() user: IAdminUser): Promise<void> {
    return await this.userService.updatePersonInfo( user.uid, dto);
  }

  @ApiUpdate('changeStatus','system:user:changeStatus', `修改用户`)
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
