import { Body, Controller, Get, Post, Query, Param, Put, Delete } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Keep, RequiresPermissions } from 'src/common/decorators';
import { IAdminUser } from '../../admin.interface';
import { AdminUser } from '../../core/decorators/admin-user.decorator';
import { Service } from './service';
import { keyStr, controllerName, ADMIN_PREFIX, tableQueryDTO, tableDTO, InfoDto, DeleteDto } from './config';

@ApiSecurity(ADMIN_PREFIX)
@ApiTags(`${keyStr}模块`)
@Controller(`${controllerName}`)
export class MyController {
  constructor(private service: Service) {}

  @RequiresPermissions("system:logininfor:list")
  @ApiOperation({ summary: `分页查询${keyStr}` })
  @Keep()
  @Get('list')
  // @ts-ignore ← Ignore type error, Swagger can generate fields normally
  async page(@Query() dto: tableQueryDTO): Promise<any> {
    return await this.service.pageDto(dto);
  }

  @ApiOperation({ summary: `查询${keyStr}` })
  @ApiOkResponse()
  @Get(':id')
  async info1(@Param() params: InfoDto): Promise<any> {
    return await this.service.info(params.id);
  }

  @ApiOperation({ summary: `清空${keyStr}` })
  @ApiOkResponse()
  @Delete('clean')
  async clean(): Promise<any> {
    await this.service.delete('clean');
    return true;
  }

  @ApiOperation({ summary: `查询${keyStr}` })
  @ApiOkResponse()
  @Delete(':id')
  async delete(@Param() params: DeleteDto): Promise<any> {
    return await this.service.delete(params.id);
  }

  @ApiOperation({ summary: `查询${keyStr}` })
  @ApiOkResponse()
  @Put()
  // @ts-ignore ← Ignore type error, Swagger can generate fields normally
  async update(@Body() body: tableDTO, @AdminUser() user: IAdminUser): Promise<any> {
    return await this.service.update(body, user.userName);
  }

  @ApiOperation({ summary: `查询${keyStr}` })
  @ApiOkResponse()
  @Post()
  // @ts-ignore ← Ignore type error, Swagger can generate fields normally
  async create(@Body() body: tableDTO, @AdminUser() user: IAdminUser): Promise<any> {
    return await this.service.create(body, user.userName);
  }
}
