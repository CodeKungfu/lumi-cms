import { generatePageDto, generateDto } from 'src/common/utils/dto-generator';
export { InfoDto, DeleteDto } from 'src/common/utils/dto-generator';
export { ADMIN_PREFIX } from 'src/modules/admin/admin.constants';
export const keyStr = '岗位管理';
export const controllerName = 'post';
export const tableName = 'sys_post';
export { sys_post as tableType } from '@repo/database';
export const tableQueryDTO = generatePageDto(tableName);
export const tableDTO = generateDto(tableName);

export const permissionsPrefix = 'system:post';
export { IAdminUser } from '../../admin.interface';
export { AdminUser } from '../../core/decorators/admin-user.decorator';
