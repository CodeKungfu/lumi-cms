import { Body, Param, Query } from '@nestjs/common';
import { ControllerCreate, ApiList, ApiInfo, ApiCreate, ApiUpdate, ApiDelete } from 'src/common/decorators/controller.decorators';
import { Service } from './service';
import { keyStr, controllerName, ADMIN_PREFIX, permissionsPrefix, tableQueryDTO, tableDTO, InfoDto, DeleteDto, IAdminUser, AdminUser } from './config';

@ControllerCreate(`${keyStr}模块`, controllerName, ADMIN_PREFIX)
export class MyController {
  constructor(private service: Service) {}

  @ApiList('list', permissionsPrefix, `分页查询${keyStr}`)
  // @ts-ignore ← Ignore type error, Swagger can generate fields normally
  async list(@Query() dto: tableQueryDTO): Promise<any> {
    return await this.service.pageDto(dto);
  }

  @ApiList('list/exclude/:id', permissionsPrefix, `查询${keyStr}（排除节点）`)
  async exclude(@Param() params: InfoDto): Promise<any> {
    return await this.service.exclude(params.id);
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
