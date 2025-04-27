import { applyDecorators, Controller, Get, Post, Put, Delete, UseInterceptors } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { ExcelFileCleanupInterceptor } from 'src/common/interceptors/excel.interceptor';
import { Keep } from 'src/common/decorators/keep.decorator';
import { RequiresPermissions } from 'src/common/decorators/requiresPermissions.decorator';

export function ControllerCreate(keyStr: string, controllerName: string, adminPrefix: string) {
  return applyDecorators(
    ApiSecurity(adminPrefix),
    ApiTags(`${keyStr}模块`),
    Controller(`${controllerName}`)
  );
}

export function ApiGet(url: string, permission: string = '', summary: string = '', keep: boolean = true) {
  const decorators = [
    Get(url),
    ApiOperation({ summary })
  ];
  
  if (permission) {
    decorators.push(RequiresPermissions(`${permission}`));
  }

  if (keep) {
    decorators.push(Keep());
  } else {
    decorators.push(ApiOkResponse());
  }
  
  return applyDecorators(...decorators);
}

export function ApiList(url: string, permission: string = '', summary: string = '', keep: boolean = true) {
  const decorators = [
    Get(url),
    ApiOperation({ summary })
  ];
  if (permission) {
    decorators.push(RequiresPermissions(`${permission}:list`));
  }
  if (keep) {
    decorators.push(Keep());
  }
  return applyDecorators(...decorators);
}

export function ApiInfo(url: string, permission: string = '', summary: string = '') {
  const decorators = [
    Get(url),
    ApiOperation({ summary }),
    ApiOkResponse()
  ];
  
  if (permission) {
    decorators.push(RequiresPermissions(`${permission}:query`));
  }
  
  return applyDecorators(...decorators);
}

export function ApiCreate(url: string, permission: string = '', summary: string = '') {
  const decorators = [
    ApiOperation({ summary }),
    ApiOkResponse()
  ];
  if (url) {
    decorators.push(Post(url));
  } else {
    decorators.push(Post());
  }
  
  if (permission) {
    decorators.push(RequiresPermissions(`${permission}:add`));
  }
  
  return applyDecorators(...decorators);
}

export function ApiUpdate(url: string, permission: string = '', summary: string = '') {
  const decorators = [
    ApiOperation({ summary }),
    ApiOkResponse()
  ];
  if (url) {
    decorators.push(Put(url));
  } else {
    decorators.push(Put());
  }
  
  if (permission) {
    decorators.push(RequiresPermissions(`${permission}:edit`));
  }
  
  return applyDecorators(...decorators);
}

export function ApiDelete(url: string, permission: string = '', summary: string = '') {
  const decorators = [
    Delete(url),
    ApiOperation({ summary }),
    ApiOkResponse()
  ];
  
  if (permission) {
    decorators.push(RequiresPermissions(`${permission}:remove`));
  }
  
  return applyDecorators(...decorators);
}

export function ApiExport(url: string, permission: string = '', summary: string = '') {
  const decorators = [
    Post(url),
    UseInterceptors(ExcelFileCleanupInterceptor),
    ApiOperation({ summary })
  ];
  
  if (permission) {
    decorators.push(RequiresPermissions(`${permission}:export`));
  }
  
  return applyDecorators(...decorators);
}