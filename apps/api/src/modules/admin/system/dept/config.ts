import { generatePageDto, generateDto } from 'src/common/utils/dto-generator';
export { InfoDto } from 'src/common/utils/dto-generator';
export { ADMIN_PREFIX } from 'src/modules/admin/admin.constants';
export const keyStr = '部门管理';
export const controllerName = 'dept';
export const tableName = 'sys_dept';
export { sys_dept as tableType } from '@repo/database';
export const tableQueryDTO = generatePageDto(tableName);
export const tableDTO = generateDto(tableName);
