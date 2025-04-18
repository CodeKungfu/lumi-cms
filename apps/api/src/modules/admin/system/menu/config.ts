import { generatePageDto, generateDto } from 'src/common/utils/dto-generator';
export { InfoDto } from 'src/common/utils/dto-generator';
export { ADMIN_PREFIX } from 'src/modules/admin/admin.constants';
export const keyStr = '菜单管理';
export const controllerName = 'menu';
export const tableName = 'sys_menu';
export { sys_menu as tableType } from '@repo/database';
export const tableQueryDTO = generatePageDto(tableName);
export const tableDTO = generateDto(tableName);

export const permissionsPrefix = 'system:menu';
export { IAdminUser } from '../../admin.interface';
export { AdminUser } from '../../core/decorators/admin-user.decorator';
