import { Body, Get, Post, Query, Param, Put, Res, StreamableFile } from '@nestjs/common';
import { ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { ApiException } from 'src/common/exceptions/api.exception';
import { Keep, RequiresPermissions } from 'src/common/decorators';
import { RoleInfo } from 'src/common/dto';
import { DeleteRoleDto, InfoRoleDto, UpdateRoleDto } from 'src/common/dto';
import * as SysMenuService from '../menu/service';
import { Service as SysRoleService } from './service';

import { ControllerCreate, ApiList, ApiInfo, ApiCreate, ApiUpdate, ApiDelete, ApiExport } from 'src/common/decorators/controller.decorators';
import { keyStr, controllerName, ADMIN_PREFIX, permissionsPrefix, tableQueryDTO, tableDTO, InfoDto, DeleteDto, IAdminUser, AdminUser } from './config';

@ControllerCreate(`${keyStr}模块`, controllerName, ADMIN_PREFIX)
export class MyController {
  constructor(private roleService: SysRoleService, private menuService: SysMenuService.Service) {}

  @ApiList('list', permissionsPrefix, `分页查询${keyStr}`)
   // @ts-ignore ← Ignore type error, Swagger can generate fields normally
  async list(@Query() dto: tableQueryDTO): Promise<any> {
    return await this.roleService.pageDto2(dto);
  }

  @ApiExport('export', permissionsPrefix, `导出${keyStr}`)
  async export(@Body() dto: any, @Res() res: any): Promise<StreamableFile> {
    const { filename, filePath, file } =  await this.roleService.pageDtoExport(dto);
    res.filePathToDelete = filePath;
    res.header('Content-disposition', `attachment; filename=${filename}.xlsx`);
    res.type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    return res.send(file);
  }

  @ApiInfo(':id', permissionsPrefix, `查询${keyStr}详情`)
  async info1(@Param() params: InfoDto): Promise<any> {
    return await this.roleService.detailInfo(params.id);
  }

  @ApiCreate('', permissionsPrefix, `新增${keyStr}`)
  // @ts-ignore ← Ignore type error, Swagger can generate fields normally
  async add(@Body() dto: tableDTO, @AdminUser() user: IAdminUser): Promise<void> {
    await this.roleService.add(dto, user.uid);
  }

  @ApiUpdate('',permissionsPrefix, `修改${keyStr}`)
  // @ts-ignore ← Ignore type error, Swagger can generate fields normally
  async updateV1(@Body() body: tableDTO): Promise<any> {
    return await this.roleService.updateV1(body);
  }
  
  @RequiresPermissions('system:role:changeStatus')
  @ApiOperation({ summary: `修改角色状态` })
  @ApiOkResponse()
  @Put('changeStatus')
  async changeStatus(@Body() body: any): Promise<any> {
    return await this.roleService.changeStatus(body);
  }
 
  @ApiDelete(':id',permissionsPrefix, `删除${keyStr}`)
  async remove(@Param() params: DeleteDto): Promise<any> {
    return await this.roleService.delete(params);
  }

  @RequiresPermissions('system:role:edit')
  @ApiOperation({ summary: `修改保存数据权限` })
  @ApiOkResponse()
  @Put('dataScope')
  async updateV2(@Body() body: any): Promise<any> {
    return await this.roleService.updateV2(body);
  }

  @RequiresPermissions('system:role:list')
  @ApiOperation({ summary: `查询已分配用户角色列表` })
  @Keep()
  @Get('authUser/allocatedList')
  async allocatedList(@Query() dto: any): Promise<any> {
    return await this.roleService.pageDto(dto);
  }

  @RequiresPermissions('system:role:list')
  @ApiOperation({ summary: `查询未分配用户角色列表` })
  @Keep()
  @Get('authUser/unallocatedList')
  async unallocatedList(@Query() dto: any): Promise<any> {
    return await this.roleService.pageDto1(dto);
  }

  @RequiresPermissions('system:role:edit')
  @ApiOperation({ summary: `取消授权用户` })
  @Keep()
  @Put('authUser/cancel')
  async cancelAuthUser(@Body() body: any): Promise<any> {
    return await this.roleService.cancelAuthUser(body);
  }

  @RequiresPermissions('system:role:edit')
  @ApiOperation({ summary: `批量取消授权用户` })
  @Keep()
  @Put('authUser/cancelAll')
  async cancelAuthUserAll(@Query() body: any): Promise<any> {
    return await this.roleService.cancelAuthUserAll(body);
  }

  @RequiresPermissions('system:role:edit')
  @ApiOperation({ summary: `批量选择用户授权` })
  @Put('authUser/selectAll')
  async selectAll(@Query() dto: any): Promise<any> {
    return await this.roleService.insertAuthUsers(dto);
  }

  @RequiresPermissions('system:role:query')
  @ApiOperation({ summary: `获取对应角色部门树列表` })
  @Keep()
  @Get('deptTree/:id')
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
