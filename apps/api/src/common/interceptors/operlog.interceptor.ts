import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { Reflector } from '@nestjs/core';
import { LOG_DISABLED_KEY_METADATA } from 'src/modules/admin/admin.constants';
import { prisma } from 'src/prisma';

@Injectable()
export class OperlogInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // 检查是否禁用日志
    const isLogDisabled = this.reflector.get<boolean>(LOG_DISABLED_KEY_METADATA, context.getHandler());

    if (isLogDisabled) {
      return next.handle();
    }

    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const startTime = Date.now();
    const { method, url, body } = request;
    // 从请求中获取用户信息，使用类型断言
    const user = (request as any).user;

    return next.handle().pipe(
      tap({
        next: (data) => {
          this.saveOperLog({
            request,
            response,
            data,
            startTime,
            status: 0, // 正常
            errorMsg: '',
          });
        },
        error: (error) => {
          this.saveOperLog({
            request,
            response,
            data: null,
            startTime,
            status: 1, // 异常
            errorMsg: error.message || '未知错误',
          });
        },
      }),
    );
  }

  private async saveOperLog({
    request,
    response,
    data,
    startTime,
    status,
    errorMsg,
  }: {
    request: Request;
    response: Response;
    data: any;
    startTime: number;
    status: number;
    errorMsg: string;
  }) {
    const { method, url, body } = request;
    // 使用类型断言获取用户信息
    const user = (request as any).user || (request as any).adminUser;
    const costTime = Date.now() - startTime;

    try {
      // 获取操作人信息
      const operName = user ? (user['userName'] || '') : '';
      const deptName = user && user['dept'] ? user['dept']['deptName'] || '' : '';

      // 获取客户端IP
      const ip = this.getClientIp(request);

      // 确定业务类型
      const businessType = this.getBusinessType(method, url);
      if (body) { // 只针对POST/PUT请求
        // 保存操作日志 - 使用驼峰命名法匹配Prisma模型
        await prisma.sys_oper_log.create({
          data: {
            title: url.split('?')[0] || '',
            businessType: businessType,
            method: request.route ? request.route.path : url,
            requestMethod: method,
            operatorType: 1,
            operName: operName,
            deptName: deptName,
            operUrl: url,
            operIp: ip,
            operLocation: '',
            operParam: JSON.stringify(body).length > 1900 ? JSON.stringify(body).substring(0, 1900) : JSON.stringify(body),
            jsonResult: data ? (JSON.stringify(data).length > 1900 ? JSON.stringify(data).substring(0, 1900) : JSON.stringify(data)) : '',
            status,
            errorMsg: errorMsg,
            operTime: new Date(),
            costTime: costTime,
          },
        });
      } else {
        if (method.toLocaleLowerCase()!== 'get') {
          // 保存操作日志 - 使用驼峰命名法匹配Prisma模型
          await prisma.sys_oper_log.create({
            data: {
              title: url.split('?')[0] || '',
              businessType: businessType,
              method: request.route ? request.route.path : url,
              requestMethod: method,
              operatorType: 1,
              operName: operName,
              deptName: deptName,
              operUrl: url,
              operIp: ip,
              operLocation: '',
              operParam: '',
              jsonResult: data ? (JSON.stringify(data).length > 1900 ? JSON.stringify(data).substring(0, 1900) : JSON.stringify(data)) : '',
              status,
              errorMsg: errorMsg,
              operTime: new Date(),
              costTime: costTime,
            },
          });
        }
      }
      
    } catch (error) {
      console.error('保存操作日志失败:', error);
    }
  }

  private getBusinessType(method: string, url: string): number {
    // 1：新增 2：修改 3：删除 4：授权 5：导出 6：导入 7：强退 8：生成代码 9: 清空数据
    switch (method.toUpperCase()) {
      case 'POST':
        if (url.includes('/export')) {
          return 5; // 导出
        }
        return 1; // 新增
      case 'PUT':
      case 'PATCH':
        return 2; // 修改
      case 'DELETE':
        return 3; // 删除
      default:
        return 0; // 其它
    }
  }

  private getClientIp(request: Request): string {
    let ip = request.headers['x-forwarded-for'] as string;
    if (ip) {
      const ipList = ip.split(',');
      ip = ipList[0];
    } else {
      ip = request.ip || '';
    }
    return ip;
  }
}