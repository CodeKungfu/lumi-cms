import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ROOT_ROLE_ID, SYS_TASK_QUEUE_NAME, SYS_TASK_QUEUE_PREFIX } from 'src/modules/admin/admin.constants';
import { rootRoleIdProvider } from '../core/provider/root-role-id.provider';

import { SysTaskController } from './task/task.controller';
import { SysTaskService } from './task/task.service';
import { SysTaskConsumer } from './task/task.processor';

import * as userController from './user/controller';
import * as userService from './user/service';

import * as logController from './log/controller';
import * as logService from './log/service';

import * as serveController from './serve/controller';
import * as serveService from './serve/service';

import  * as roleController from './role/controller';
import * as roleService from './role/service';

import * as onlineController from './online/controller';
import * as onlineService from './online/service';

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
  imports: [
    BullModule.registerQueueAsync({
      name: SYS_TASK_QUEUE_NAME,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('redis.host'),
          port: configService.get<number>('redis.port'),
          password: configService.get<string>('redis.password'),
          db: configService.get<number>('redis.db'),
        },
        prefix: SYS_TASK_QUEUE_PREFIX,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [
    userController.MyController,
    roleController.MyController,
    menuController.MyController,
    deptController.MyController,
    logController.MyController,
    SysTaskController,
    onlineController.MyController,
    serveController.MyController,
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
    logService.Service,
    SysTaskService,
    SysTaskConsumer,
    onlineService.Service,
    serveService.Service,
    dictService.Service,
    dictDataService.Service,
    configService.Service,
    noticeService.Service,
    postService.Service,
  ],
  exports: [ROOT_ROLE_ID, userService.Service, menuService.Service, logService.Service, onlineService.Service],
})
export class SystemModule {}
