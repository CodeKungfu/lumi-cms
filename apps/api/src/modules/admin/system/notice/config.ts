import { generatePageDto, generateDto } from 'src/common/utils/dto-generator';
export { InfoDto } from 'src/common/utils/dto-generator';
export { ADMIN_PREFIX } from 'src/modules/admin/admin.constants';
export const keyStr = '通知公告';
export const controllerName = 'notice';
export const tableName = 'sys_notice';
export { sys_notice as tableType } from '@repo/database';
export const tableQueryDTO = generatePageDto(tableName);
export const tableDTO = generateDto(tableName);
