import { generatePageDto, generateDto } from 'src/common/utils/dto-generator';
export { InfoDto, DeleteDto } from 'src/common/utils/dto-generator';
export { ADMIN_PREFIX } from 'src/modules/admin/admin.constants';
export const keyStr = '角色管理';
export const controllerName = 'role';
export const tableName = 'sys_role';
export { sys_role as tableType } from '@repo/database';
export const tableQueryDTO = generatePageDto(tableName);
export const tableDTO = generateDto(tableName);

export const permissionsPrefix = 'system:role';
export { IAdminUser } from '../../admin.interface';
export { AdminUser } from '../../core/decorators/admin-user.decorator';
