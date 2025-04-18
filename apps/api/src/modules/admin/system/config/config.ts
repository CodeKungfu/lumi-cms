import { generatePageDto, generateDto } from 'src/common/utils/dto-generator';
export { InfoDto, DeleteDto } from 'src/common/utils/dto-generator';
export { ADMIN_PREFIX } from 'src/modules/admin/admin.constants';
export const keyStr = '配置管理';
export const controllerName = 'config';
export const tableName = 'sys_config';
export { sys_config as tableType} from '@repo/database';
export const tableQueryDTO = generatePageDto(tableName);
export const tableDTO = generateDto(tableName);