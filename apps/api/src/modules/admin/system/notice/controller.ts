import { Body, Controller, Get, Post, Query, Param, Put, Delete } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Keep, RequiresPermissions } from 'src/common/decorators';
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

  /**
   * 获取通知公告列表
   */
  @RequiresPermissions('system:notice:list')
  @ApiOperation({ summary: `分页查询${keyStr}` })
  @Keep()
  @Get('list')
  // @ts-ignore ← Ignore type error, Swagger can generate fields normally
  async page(@Query() dto: tableQueryDTO): Promise<any> {
    const rows = await this.service.pageDto(dto);
    rows.result.map((item: any) => {
      item.noticeContent = Buffer.from(item.noticeContent).toString('utf-8');
    });
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
   * 根据通知公告编号获取详细信息
   */
  @RequiresPermissions('system:notice:query')
  @ApiOperation({ summary: `查询${keyStr}` })
  @ApiOkResponse()
  @Get(':id')
  async info(@Param() params: InfoDto): Promise<any> {
    const list = await this.service.info(params.id);
    list.noticeContent = Buffer.from(list.noticeContent).toString('utf-8');
    return list;
  }

  /**
   * 新增通知公告
   */
  @RequiresPermissions('system:notice:add')
  @ApiOperation({ summary: `查询${keyStr}` })
  @ApiOkResponse()
  @Post()
  // @ts-ignore ← Ignore type error, Swagger can generate fields normally
  async create(@Body() body: tableDTO, @AdminUser() user: IAdminUser): Promise<any> {
    body.noticeContent = Buffer.from(body.noticeContent);
    const list = await this.service.create(body, user.userName);
    return list;
  }

  /**
   * 修改通知公告
   */
  @RequiresPermissions('system:notice:edit')
  @ApiOperation({ summary: `查询${keyStr}` })
  @ApiOkResponse()
  @Put()
  // @ts-ignore ← Ignore type error, Swagger can generate fields normally
  async update(@Body() body: tableDTO, @AdminUser() user: IAdminUser): Promise<any> {
    body.noticeContent = Buffer.from(body.noticeContent);
    const list = await this.service.update(body, user.userName);
    return list;
  }

  /**
   * 删除通知公告
   */
  @RequiresPermissions('system:notice:remove')
  @ApiOperation({ summary: `查询${keyStr}` })
  @ApiOkResponse()
  @Delete(':id')
  async delete(@Param() params: DeleteDto): Promise<any> {
    const list = await this.service.delete(params.id);
    return list;
  }
}
