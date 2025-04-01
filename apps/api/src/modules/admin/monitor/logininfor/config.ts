import { sys_logininfor } from '@repo/database';
import { ADMIN_PREFIX } from 'src/modules/admin/admin.constants';
export { ADMIN_PREFIX };
export const keyStr = '登录日志';
export const tableName = 'sys_logininfor';
export const controllerName = 'logininfor';
export type tableType = sys_logininfor;
export type tableQueryType = sys_logininfor & {
    pageSize?: number;
    pageNum?: number;
    orderByColumn?: string;
    isAsc?: string;
  };
