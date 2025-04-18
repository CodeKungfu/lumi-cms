import { generatePageDto, generateDto } from 'src/common/utils/dto-generator';
export { InfoDto, DeleteDto } from 'src/common/utils/dto-generator';
export { ADMIN_PREFIX } from 'src/modules/admin/admin.constants';
export const keyStr = '操作日志';
export const controllerName = 'operlog';
export const tableName = 'sys_oper_log';
export { sys_oper_log as tableType } from '@repo/database';
export const tableQueryDTO = generatePageDto(tableName);
export const tableDTO = generateDto(tableName);

export const permissionsPrefix = 'system:operlog';
export { IAdminUser } from '../../admin.interface';
export { AdminUser } from '../../core/decorators/admin-user.decorator';
