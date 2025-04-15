import { Module } from '@nestjs/common';
// import { ConfigModule, ConfigService } from '@nestjs/config';
import { ROOT_ROLE_ID } from 'src/modules/admin/admin.constants';
import { rootRoleIdProvider } from '../core/provider/root-role-id.provider';

import * as userController from './user/controller';
import * as userService from './user/service';

import  * as roleController from './role/controller';
import * as roleService from './role/service';

import * as dictController from './dictType/controller';
import * as dictService from './dictType/service';

import * as dictDataController from './dictData/controller';
import * as dictDataService from './dictData/service';

import * as configController from './config/controller';
import * as configService from './config/service';

import * as noticeController from './notice/controller';
import * as noticeService from './notice/service';

import * as postController from './post/controller';
import * as postService from './post/service';

import * as deptController from './dept/controller';
import * as deptService from './dept/service';

import * as menuController from './menu/controller';
import * as menuService from './menu/service';

@Module({
  imports: [],
  controllers: [
    userController.MyController,
    roleController.MyController,
    menuController.MyController,
    deptController.MyController,
    dictController.MyController,
    dictDataController.MyController,
    configController.MyController,
    noticeController.MyController,
    postController.MyController,
  ],
  providers: [
    rootRoleIdProvider(),
    userService.Service,
    roleService.Service,
    menuService.Service,
    deptService.Service,
    dictService.Service,
    dictDataService.Service,
    configService.Service,
    noticeService.Service,
    postService.Service,
  ],
  exports: [ROOT_ROLE_ID, userService.Service, menuService.Service],
})
export class SystemModule {}
