import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ServeStatInfo } from 'src/common/dto';
import { ADMIN_PREFIX } from '../../admin.constants';
import { PermissionOptional } from '../../core/decorators/permission-optional.decorator';

import { Service as SysServeService } from './service';

@ApiSecurity(ADMIN_PREFIX)
@ApiTags('服务监控')
@Controller('serve')
export class MyController {
  constructor(private serveService: SysServeService) {}

  @ApiOperation({ summary: '获取服务器运行信息' })
  @ApiOkResponse({ type: ServeStatInfo })
  @PermissionOptional()
  @Get('stat')
  async stat(): Promise<ServeStatInfo> {
    return await this.serveService.getServeStat();
  }
}
