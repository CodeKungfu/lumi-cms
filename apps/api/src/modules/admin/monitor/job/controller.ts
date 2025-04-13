import { Body, Controller, Get, Post, Query, Param, Put, Delete } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Keep } from 'src/common/decorators/keep.decorator';
import { ADMIN_PREFIX } from 'src/modules/admin/admin.constants';
import { Service } from './service';
import { keyStr, controllerName } from './config';
import { tableQueryDTO, tableDTO, InfoDto, DeleteDto } from './config';

@ApiSecurity(ADMIN_PREFIX)
@ApiTags(`${keyStr}模块`)
@Controller(`${controllerName}`)
export class MyController {
  constructor(private service: Service) {}

  @ApiOperation({ summary: `分页查询${keyStr}` })
  @Keep()
  @Get('list')
  // @ts-ignore ← Ignore type error, Swagger can generate fields normally
  async page(@Query() dto: tableQueryDTO): Promise<any> {
    const rows = await this.service.pageDto(dto);
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

  @ApiOperation({ summary: `查询${keyStr}` })
  @ApiOkResponse()
  @Get(':id')
  async info1(@Param() params: InfoDto): Promise<any> {
    const list = await this.service.info(params.id);
    return list;
  }

  @ApiOperation({ summary: `查询${keyStr}` })
  @ApiOkResponse()
  @Delete(':id')
  async delete(@Param() params: DeleteDto): Promise<any> {
    const list = await this.service.delete(params.id);
    return list;
  }

  @ApiOperation({ summary: `查询${keyStr}` })
  @ApiOkResponse()
  @Put()
  // @ts-ignore ← Ignore type error, Swagger can generate fields normally
  async update(@Body() body: tableDTO): Promise<any> {
    const list = await this.service.update(body);
    return list;
  }

  @ApiOperation({ summary: `查询${keyStr}` })
  @ApiOkResponse()
  @Post()
  // @ts-ignore ← Ignore type error, Swagger can generate fields normally
  async create(@Body() body: tableDTO): Promise<any> {
    const list = await this.service.create(body);
    return list;
  }
}
