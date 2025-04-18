import { Body, Controller, Get, Post, Param, Put, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Keep, RequiresPermissions } from 'src/common/decorators';
import { Service } from './service';
import { keyStr, controllerName, ADMIN_PREFIX } from './config';
import { tableQueryDTO, tableDTO, InfoDto, DeleteDto } from './config';

@ApiSecurity(ADMIN_PREFIX)
@ApiTags(`${keyStr}模块`)
@Controller(`${controllerName}`)
export class MyController {
  constructor(private service: Service) {}

  /**
   * 获取部门列表
   */
  @RequiresPermissions('system:dept:list')
  @ApiOperation({ summary: `分页查询${keyStr}` })
  @Keep()
  @Get('list')
  async list(@Query() dto: any): Promise<any> {
    const rows = await this.service.pageDto(dto);
    return {
      data: rows,
    };
  }

  /**
   * 查询部门列表（排除节点）
   */
  @RequiresPermissions('system:dept:list')
  @ApiOperation({ summary: `查询${keyStr}（排除节点）` })
  @Keep()
  @Get('list/exclude/:id')
  async exclude(@Param() params: InfoDto): Promise<any> {
    const rows = await this.service.exclude(params.id);
    return {
      data: rows,
    };
  }

  /**
   * 根据部门编号获取详细信息
   */
  @RequiresPermissions('system:dept:query')
  @ApiOperation({ summary: `查询${keyStr}` })
  @ApiOkResponse()
  @Get(':id')
  async info(@Param() params: InfoDto): Promise<any> {
    const list = await this.service.info(params.id);
    return list;
  }

  /**
   * 新增部门
   */
  @RequiresPermissions('system:dept:add')
  @ApiOperation({ summary: `查询${keyStr}` })
  @ApiOkResponse()
  @Post()
  // @ts-ignore ← Ignore type error, Swagger can generate fields normally
  async create(@Body() body: tableDTO): Promise<any> {
    const list = await this.service.create(body);
    return list;
  }

  /**
   * 修改部门
   */
  @RequiresPermissions('system:dept:edit')
  @ApiOperation({ summary: `查询${keyStr}` })
  @ApiOkResponse()
  @Put()
  // @ts-ignore ← Ignore type error, Swagger can generate fields normally
  async update(@Body() body: tableDTO): Promise<any> {
    const list = await this.service.update(body);
    return list;
  }

  /**
   * 删除部门
   */
  @RequiresPermissions('system:dept:remove')
  @ApiOperation({ summary: `查询${keyStr}` })
  @ApiOkResponse()
  @Delete(':id')
  async delete(@Param() params: DeleteDto): Promise<any> {
    const list = await this.service.delete(params.id);
    return list;
  }
}
