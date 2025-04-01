import { sys_oper_log } from '@repo/database';
import { ADMIN_PREFIX } from 'src/modules/admin/admin.constants';
export { ADMIN_PREFIX };
export const keyStr = '操作日志';
export const tableName = 'sys_oper_log';
export const controllerName = 'operlog';
export type tableType = sys_oper_log;
export type tableQueryType = sys_oper_log & {
  pageSize?: number;
  pageNum?: number;
  orderByColumn?: string;
  isAsc?: string;
};
