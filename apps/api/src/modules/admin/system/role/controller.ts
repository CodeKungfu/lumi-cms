import { Body, Get, Post, Query, Param, Res, StreamableFile } from '@nestjs/common';
import { ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { ApiException } from 'src/common/exceptions/api.exception';
import { RoleInfo } from 'src/common/dto';
import { DeleteRoleDto, InfoRoleDto, UpdateRoleDto } from 'src/common/dto';
import * as SysMenuService from '../menu/service';
import { Service as SysRoleService } from './service';

import { ApiGet, ControllerCreate, ApiList, ApiInfo, ApiCreate, ApiUpdate, ApiDelete, ApiExport } from 'src/common/decorators/controller.decorators';
import { keyStr, controllerName, ADMIN_PREFIX, permissionsPrefix, tableQueryDTO, tableDTO, InfoDto, DeleteDto, IAdminUser, AdminUser } from './config';

@ControllerCreate(`${keyStr}模块`, controllerName, ADMIN_PREFIX)
export class MyController {
  constructor(private roleService: SysRoleService, private menuService: SysMenuService.Service) {}

  @ApiList('list', permissionsPrefix, `分页查询${keyStr}`)
   // @ts-ignore ← Ignore type error, Swagger can generate fields normally
  async list(@Query() dto: tableQueryDTO): Promise<any> {
    return await this.roleService.pageDto2(dto);
  }

  @ApiInfo(':id', permissionsPrefix, `查询${keyStr}详情`)
  async info1(@Param() params: InfoDto): Promise<any> {
    return await this.roleService.detailInfo(params.id);
  }

  @ApiExport('export', permissionsPrefix, `导出${keyStr}`)
  async export(@Body() dto: any, @Res() res: any): Promise<StreamableFile> {
    const { filename, filePath, file } =  await this.roleService.pageDtoExport(dto);
    res.filePathToDelete = filePath;
    res.header('Content-disposition', `attachment; filename=${filename}.xlsx`);
    res.type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    return res.send(file);
  }

  @ApiCreate('', permissionsPrefix, `新增${keyStr}`)
  // @ts-ignore ← Ignore type error, Swagger can generate fields normally
  async add(@Body() dto: tableDTO, @AdminUser() user: IAdminUser): Promise<void> {
    await this.roleService.add(dto, user.uid);
  }

  @ApiUpdate('',permissionsPrefix, `修改${keyStr}`)
  // @ts-ignore ← Ignore type error, Swagger can generate fields normally
  async updateV1(@Body() body: tableDTO & { mmenuIds: number[] }): Promise<any> {
    return await this.roleService.updateV1(body);
  }

  @ApiUpdate('changeStatus',`${permissionsPrefix}:changeStatus`, `修改角色状态`)
  async changeStatus(@Body() body: any): Promise<any> {
    return await this.roleService.changeStatus(body);
  }
 
  @ApiDelete(':id',permissionsPrefix, `删除${keyStr}`)
  async remove(@Param() params: DeleteDto): Promise<any> {
    return await this.roleService.delete(params);
  }

  @ApiUpdate('dataScope',`${permissionsPrefix}`, `修改保存数据权限`)
  async updateV2(@Body() body: any): Promise<any> {
    return await this.roleService.updateV2(body);
  }

  @ApiGet('authUser/allocatedList', 'system:role:list', `查询已分配用户角色列表`)
  async allocatedList(@Query() dto: any): Promise<any> {
    return await this.roleService.pageDto(dto);
  }

  @ApiGet('authUser/unallocatedList', 'system:role:list', `查询未分配用户角色列表`)
  async unallocatedList(@Query() dto: any): Promise<any> {
    return await this.roleService.pageDto1(dto);
  }

  @ApiUpdate('authUser/cancel',`${permissionsPrefix}`, `取消授权用户`)
  async cancelAuthUser(@Body() body: any): Promise<any> {
    return await this.roleService.cancelAuthUser(body);
  }

  @ApiUpdate('authUser/cancelAll',`${permissionsPrefix}`, `批量取消授权用户`)
  async cancelAuthUserAll(@Query() body: any): Promise<any> {
    return await this.roleService.cancelAuthUserAll(body);
  }

  @ApiUpdate('authUser/selectAll',`${permissionsPrefix}`, `批量选择用户授权`)
  async selectAll(@Query() dto: any): Promise<any> {
    return await this.roleService.insertAuthUsers(dto);
  }

  @ApiGet('deptTree/:id', 'system:role:query', `获取对应角色部门树列表`)
  async deptTree(@Param() params: any): Promise<any> {
    return await this.roleService.deptTree(params.id);
  }

  @ApiOperation({ summary: '更新角色' })
  @Post('update')
  async update(@Body() dto: UpdateRoleDto): Promise<void> {
    await this.roleService.update(dto);
    await this.menuService.refreshOnlineUserPerms();
  }

  @ApiOperation({ summary: '分页查询角色信息' })
  @ApiOkResponse()
  @Get('page')
  async page(@Query() dto: any): Promise<any> {
    const list = await this.roleService.page({
      page: dto.page - 1,
      limit: Number(dto.limit),
      name: dto.name,
    });
    const count = await this.roleService.count();
    return {
      list,
      pagination: {
        size: dto.limit,
        page: dto.page,
        total: count,
      },
    };
  }

  @ApiOperation({ summary: '删除角色' })
  @Post('delete')
  async delete(@Body() dto: DeleteRoleDto): Promise<void> {
    const count = await this.roleService.countUserIdByRole(dto.roleIds);
    if (count > 0) {
      throw new ApiException(10008);
    }
    await this.roleService.delete(dto.roleIds);
    await this.menuService.refreshOnlineUserPerms();
  }

  @ApiOperation({ summary: '获取角色信息' })
  @ApiOkResponse({ type: RoleInfo })
  @Get('info')
  async info(@Query() dto: InfoRoleDto): Promise<RoleInfo> {
    return await this.roleService.info(dto.roleId);
  }
}
