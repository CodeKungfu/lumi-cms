import { sys_notice } from '@repo/database';
import { ADMIN_PREFIX } from 'src/modules/admin/admin.constants';
export { ADMIN_PREFIX }
export const keyStr = '通知公告';
export const tableName = 'sys_notice';
export const controllerName = 'notice';
export type tableType = sys_notice;

import { generatePageDto, generateDto, InfoDto } from 'src/common/utils/dto-generator';
export const tableQueryDTO = generatePageDto(tableName);
export const tableDTO = generateDto(tableName);
export { InfoDto };
