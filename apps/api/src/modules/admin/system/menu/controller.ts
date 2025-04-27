import { Body, Param, Query } from '@nestjs/common';
import { ApiGet, ControllerCreate, ApiList, ApiInfo, ApiCreate, ApiUpdate, ApiDelete } from 'src/common/decorators/controller.decorators';
import { Service } from './service';
import { keyStr, controllerName, ADMIN_PREFIX, permissionsPrefix, tableQueryDTO, tableDTO, InfoDto, DeleteDto, IAdminUser, AdminUser } from './config';

@ControllerCreate(`${keyStr}模块`, controllerName, ADMIN_PREFIX)
export class MyController {
  constructor(private service: Service) {}

  @ApiGet('treeselect', '', '获取菜单下拉树列表')
  async treeselect(@AdminUser() user: any,@Param() params: any): Promise<any> {
    const list = await this.service.treeselect(user.uid, params.id);
    return {data: list};
  }

  @ApiGet('roleMenuTreeselect/:id', '', '加载对应角色菜单列表树')
  async roleMenuTreeselect(@Param() params: InfoDto): Promise<any> {
    return await this.service.roleMenuTreeselect(params.id);
  }

  @ApiList('list', permissionsPrefix, `分页查询${keyStr}`)
  // @ts-ignore ← Ignore type error, Swagger can generate fields normally
  async list(@Query() dto: tableQueryDTO): Promise<any> {
    return await this.service.pageDto(dto);
  }

  @ApiInfo(':id', permissionsPrefix, `查询${keyStr}详情`)
  async info(@Param() params: InfoDto): Promise<any> {
    return await this.service.info(params.id);
  }

  @ApiCreate('', permissionsPrefix, `新增${keyStr}`)
  // @ts-ignore ← Ignore type error, Swagger can generate fields normally
  async create(@Body() body: tableDTO, @AdminUser() user: IAdminUser): Promise<any> {
    return await this.service.create(body, user.userName);
  }

  @ApiUpdate('',permissionsPrefix, `修改${keyStr}`)
  // @ts-ignore ← Ignore type error, Swagger can generate fields normally
  async update(@Body() body: tableDTO, @AdminUser() user: IAdminUser): Promise<any> {
    return await this.service.update(body, user.userName);
  }

  @ApiDelete(':id',permissionsPrefix, `删除${keyStr}`)
  async delete(@Param() params: DeleteDto): Promise<any> {
    return await this.service.delete(params.id);
  }
}