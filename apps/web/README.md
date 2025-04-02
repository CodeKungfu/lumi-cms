<h1 align="center" style="margin: 30px 0 30px; font-weight: bold;">LumiCMS v0.1.0</h1>
<h4 align="center">基于Nestjs+Vue3前后端分离的Nodejs快速开发框架</h4>
<p align="center">
	<a href="https://github.com/CodeKungfu/ruoyi-vue3/blob/master/LICENSE"><img src="https://img.shields.io/github/license/mashape/apistatus.svg"></a>
</p>

## 平台简介

* 本仓库为前端技术栈 [Vue3](https://v3.cn.vuejs.org) + [Element Plus](https://element-plus.org/zh-CN) + [Vite](https://cn.vitejs.dev) 版本。
* 特别鸣谢Ruoyi 原版开发者。


## 前端运行

```bash
# 克隆项目
git clone https://github.com/CodeKungfu/lumi-cms.git

# 进入项目目录
cd lumi-cms/apps/web

# 安装依赖
yarn --registry=https://registry.npmmirror.com

# 启动服务
pnpm run dev

# 构建测试环境 yarn build:stage
# 构建生产环境 yarn build:prod
# 前端访问地址 http://localhost:4080
```

## 内置功能（复刻若依功能，当前版本相应支持情况）

1.  用户管理：用户是系统操作者，该功能主要完成系统用户配置。（已支持）
2.  部门管理：配置系统组织机构（公司、部门、小组），树结构展现支持数据权限。（已支持）
3.  岗位管理：配置系统用户所属担任职务。（已支持）
4.  菜单管理：配置系统菜单，操作权限，按钮权限标识等。（已支持）
5.  角色管理：角色菜单权限分配、设置角色按机构进行数据范围权限划分。（已支持）
6.  字典管理：对系统中经常使用的一些较为固定的数据进行维护。（已支持）
7.  参数管理：对系统动态配置常用参数。（已支持）
8.  通知公告：系统通知公告信息发布维护。（已支持）
9.  操作日志：系统正常操作日志记录和查询；系统异常信息日志记录和查询。
10. 登录日志：系统登录日志记录查询包含登录异常。
11. 在线用户：当前系统中活跃用户状态监控。
12. 定时任务：在线（添加、修改、删除)任务调度包含执行结果日志。
13. 代码生成：前后端代码的生成（java、html、xml、sql）支持CRUD下载 。
14. 系统接口：根据业务代码自动生成相关的api接口文档。
15. 服务监控：监视当前系统CPU、内存、磁盘、堆栈等相关信息。
16. 缓存监控：对系统的缓存信息查询，命令统计等。
17. 在线构建器：拖动表单元素生成相应的HTML代码。
18. 连接池监视：监视当前系统数据库连接池状态，可进行分析SQL找出系统性能瓶颈。