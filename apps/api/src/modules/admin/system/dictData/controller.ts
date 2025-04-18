import { Body, Controller, Get, Post, Query, Param, Put, Delete, UseInterceptors, Res, StreamableFile } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Keep, RequiresPermissions } from 'src/common/decorators';
import { ExcelFileCleanupInterceptor } from 'src/common/interceptors/excel.interceptor';
import { IAdminUser } from '../../admin.interface';
import { AdminUser } from '../../core/decorators/admin-user.decorator';
import { Service } from './service';
import { keyStr, controllerName, ADMIN_PREFIX } from './config';
import { tableQueryDTO, tableDTO, InfoDto, DeleteDto } from './config';

@ApiSecurity(ADMIN_PREFIX)
@ApiTags(`${keyStr}模块`)
@Controller(`${controllerName}`)
export class MyController {
  constructor(private service: Service) {}

  @RequiresPermissions('system:dict:list')
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

  /**
   * 导出
   */
  @RequiresPermissions('system:dict:export')
  @ApiOperation({ summary: `导出` })
  @UseInterceptors(ExcelFileCleanupInterceptor)
  @Post('export')
  async export(@Body() dto: any, @Res() res: any): Promise<StreamableFile> {
    const { filename, filePath, file } =  await this.service.pageDtoExport(dto);
    res.filePathToDelete = filePath;
    res.header('Content-disposition', `attachment; filename=${filename}.xlsx`);
    res.type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    return res.send(file);
  }

  /**
   * 查询字典数据详细
   */
  @RequiresPermissions('system:dict:query')
  @ApiOperation({ summary: `查询${keyStr}` })
  @ApiOkResponse()
  @Get(':id')
  async info(@Param() params: InfoDto): Promise<any> {
    const list = await this.service.info(params.id);
    return list;
  }

  /**
   * 根据字典类型查询字典数据信息
   */
  @ApiOperation({ summary: `查询${keyStr}` })
  @ApiOkResponse()
  @Get('type/:name')
  async info2(@Param() params: any): Promise<any> {
    const list = await this.service.info2(params.name);
    return list;
  }

  /**
   * 新增字典类型
   */
  @RequiresPermissions('system:dict:add')
  @ApiOperation({ summary: `查询${keyStr}` })
  @ApiOkResponse()
  @Post()
  // @ts-ignore ← Ignore type error, Swagger can generate fields normally
  async create(@Body() body: tableDTO, @AdminUser() user: IAdminUser): Promise<any> {
    const list = await this.service.create(body, user.userName);
    return list;
  }

  /**
   * 修改保存字典类型
   */
  @RequiresPermissions('system:dict:edit')
  @ApiOperation({ summary: `查询${keyStr}` })
  @ApiOkResponse()
  @Put()
  // @ts-ignore ← Ignore type error, Swagger can generate fields normally
  async update(@Body() body: tableDTO, @AdminUser() user: IAdminUser): Promise<any> {
    const list = await this.service.update(body, user.userName);
    return list;
  }

  /**
   * 删除字典类型
   */
  @RequiresPermissions('system:dict:remove')
  @ApiOperation({ summary: `查询${keyStr}` })
  @ApiOkResponse()
  @Delete(':id')
  async delete(@Param() params: DeleteDto): Promise<any> {
    const list = await this.service.delete(params.id);
    return list;
  }
}
