import { sys_job } from '@repo/database';
export const keyStr = '操作任务日志';
export const tableName = 'sys_job';
export const controllerName = 'job';
export type tableType = sys_job;

import { generatePageDto, generateDto, InfoDto, DeleteDto } from 'src/common/utils/dto-generator';
export const tableQueryDTO = generatePageDto(tableName);
export const tableDTO = generateDto(tableName);
export { InfoDto, DeleteDto };
