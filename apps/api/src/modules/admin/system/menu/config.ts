import { sys_menu } from '@repo/database';
import { ADMIN_PREFIX } from 'src/modules/admin/admin.constants';
export { ADMIN_PREFIX }
export const keyStr = '菜单管理';
export const tableName = 'sys_menu';
export const controllerName = 'menu';
export type tableType = sys_menu;

import { generatePageDto, generateDto, InfoDto } from 'src/common/utils/dto-generator';
export const tableQueryDTO = generatePageDto(tableName);
export const tableDTO = generateDto(tableName);
export { InfoDto };
