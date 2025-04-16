import { Module } from '@nestjs/common';
import { ROOT_ROLE_ID } from 'src/modules/admin/admin.constants';
import { rootRoleIdProvider } from '../core/provider/root-role-id.provider';
import { SystemModule } from '../system/system.module';

// 模块列表
const modules = ['operlog','logininfor','online'];

// 动态导入所有模块
const components = modules.reduce((acc, name) => {
  acc[name] = {
    controller: require(`./${name}/controller`),
    service: require(`./${name}/service`)
  };
  return acc;
}, {} as any);

@Module({
  imports: [SystemModule],
  controllers: modules.map(name => components[name].controller.MyController),
  providers: [
    rootRoleIdProvider(),
    ...modules.map(name => components[name].service.Service)
  ],
  exports: [ROOT_ROLE_ID, components.online.service.Service],
})

export class MonitorModule {}
