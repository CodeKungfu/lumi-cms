import { sys_dict_type } from '@repo/database';
import { ADMIN_PREFIX } from 'src/modules/admin/admin.constants';
export { ADMIN_PREFIX }
export const keyStr = '字典管理';
export const tableName = 'sys_dict_type';
export const controllerName = 'dict/type';
export type tableType = sys_dict_type;

import { generatePageDto, generateDto, InfoDto } from 'src/common/utils/dto-generator';
export const tableQueryDTO = generatePageDto(tableName);
export const tableDTO = generateDto(tableName);
export { InfoDto };
