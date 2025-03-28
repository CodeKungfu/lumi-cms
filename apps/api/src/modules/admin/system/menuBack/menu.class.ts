import { ApiProperty } from '@nestjs/swagger';
import { sys_menu } from '@repo/database';

export class MenuItemAndParentInfoResult {
  @ApiProperty({ description: '菜单' })
  menu?: sys_menu;

  @ApiProperty({ description: '父级菜单' })
  parentMenu?: sys_menu;
}
