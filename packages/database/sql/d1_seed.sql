drop table if exists sys_dept;
create table sys_dept (
  dept_id           INTEGER PRIMARY KEY AUTOINCREMENT    ,
  parent_id         INTEGER      default 0                  ,
  ancestors         TEXT     default ''                 ,
  dept_name         TEXT     default ''                 ,
  order_num         INTEGER          default 0                  ,
  leader            TEXT     default null               ,
  phone             TEXT     default null               ,
  email             TEXT     default null               ,
  status            TEXT         default '0'                ,
  del_flag          TEXT         default '0'                ,
  create_by         TEXT     default ''                 ,
  create_time 	    TEXT                                   ,
  update_by         TEXT     default ''                 ,
  update_time       TEXT                                   
);
insert into sys_dept values(100,  0,   '0',          'Lumi科技',   0, 'Lumi', '15888888888', 'ry@qq.com', '0', '0', 'admin', datetime('now'), '', null);
insert into sys_dept values(101,  100, '0,100',      '深圳总公司', 1, 'Lumi', '15888888888', 'ry@qq.com', '0', '0', 'admin', datetime('now'), '', null);
insert into sys_dept values(102,  100, '0,100',      '长沙分公司', 2, 'Lumi', '15888888888', 'ry@qq.com', '0', '0', 'admin', datetime('now'), '', null);
insert into sys_dept values(103,  101, '0,100,101',  '研发部门',   1, 'Lumi', '15888888888', 'ry@qq.com', '0', '0', 'admin', datetime('now'), '', null);
insert into sys_dept values(104,  101, '0,100,101',  '市场部门',   2, 'Lumi', '15888888888', 'ry@qq.com', '0', '0', 'admin', datetime('now'), '', null);
insert into sys_dept values(105,  101, '0,100,101',  '测试部门',   3, 'Lumi', '15888888888', 'ry@qq.com', '0', '0', 'admin', datetime('now'), '', null);
insert into sys_dept values(106,  101, '0,100,101',  '财务部门',   4, 'Lumi', '15888888888', 'ry@qq.com', '0', '0', 'admin', datetime('now'), '', null);
insert into sys_dept values(107,  101, '0,100,101',  '运维部门',   5, 'Lumi', '15888888888', 'ry@qq.com', '0', '0', 'admin', datetime('now'), '', null);
insert into sys_dept values(108,  102, '0,100,102',  '市场部门',   1, 'Lumi', '15888888888', 'ry@qq.com', '0', '0', 'admin', datetime('now'), '', null);
insert into sys_dept values(109,  102, '0,100,102',  '财务部门',   2, 'Lumi', '15888888888', 'ry@qq.com', '0', '0', 'admin', datetime('now'), '', null);
drop table if exists sys_user;
create table sys_user (
  user_id           INTEGER PRIMARY KEY AUTOINCREMENT    ,
  dept_id           INTEGER      default null               ,
  user_name         TEXT     not null                   ,
  nick_name         TEXT     not null                   ,
  user_type         TEXT      default '00'               ,
  email             TEXT     default ''                 ,
  phonenumber       TEXT     default ''                 ,
  sex               TEXT         default '0'                ,
  avatar            TEXT    default ''                 ,
  password          TEXT    default ''                 ,
  status            TEXT         default '0'                ,
  del_flag          TEXT         default '0'                ,
  login_ip          TEXT    default ''                 ,
  login_date        TEXT                                   ,
  create_by         TEXT     default ''                 ,
  create_time       TEXT                                   ,
  update_by         TEXT     default ''                 ,
  update_time       TEXT                                   ,
  remark            TEXT    default null               
);
insert into sys_user values(1,  103, 'admin', 'lumi', '00', 'ry@163.com', '15888888888', '1', '', 'e10adc3949ba59abbe56e057f20f883e', '0', '0', '127.0.0.1', datetime('now'), 'admin', datetime('now'), '', null, '管理员');
insert into sys_user values(2,  105, 'lumi',    'lumi', '00', 'ry@qq.com',  '15666666666', '1', '', 'e10adc3949ba59abbe56e057f20f883e', '0', '0', '127.0.0.1', datetime('now'), 'admin', datetime('now'), '', null, '测试员');
drop table if exists sys_post;
create table sys_post
(
  post_id       INTEGER PRIMARY KEY AUTOINCREMENT    ,
  post_code     TEXT     not null                   ,
  post_name     TEXT     not null                   ,
  post_sort     INTEGER          not null                   ,
  status        TEXT         not null                   ,
  create_by     TEXT     default ''                 ,
  create_time   TEXT                                   ,
  update_by     TEXT     default ''			       ,
  update_time   TEXT                                   ,
  remark        TEXT    default null               
);
insert into sys_post values(1, 'ceo',  '董事长',    1, '0', 'admin', datetime('now'), '', null, '');
insert into sys_post values(2, 'se',   '项目经理',  2, '0', 'admin', datetime('now'), '', null, '');
insert into sys_post values(3, 'hr',   '人力资源',  3, '0', 'admin', datetime('now'), '', null, '');
insert into sys_post values(4, 'user', '普通员工',  4, '0', 'admin', datetime('now'), '', null, '');
drop table if exists sys_role;
create table sys_role (
  role_id              INTEGER PRIMARY KEY AUTOINCREMENT    ,
  role_name            TEXT     not null                   ,
  role_key             TEXT    not null                   ,
  role_sort            INTEGER          not null                   ,
  data_scope           TEXT         default '1'                ,
  menu_check_strictly  INTEGER      default 1                  ,
  dept_check_strictly  INTEGER      default 1                  ,
  status               TEXT         not null                   ,
  del_flag             TEXT         default '0'                ,
  create_by            TEXT     default ''                 ,
  create_time          TEXT                                   ,
  update_by            TEXT     default ''                 ,
  update_time          TEXT                                   ,
  remark               TEXT    default null               
);
insert into sys_role values('1', '超级管理员',  'admin',  1, 1, 1, 1, '0', '0', 'admin', datetime('now'), '', null, '超级管理员');
insert into sys_role values('2', '普通角色',    'common', 2, 2, 1, 1, '0', '0', 'admin', datetime('now'), '', null, '普通角色');
drop table if exists sys_menu;
create table sys_menu (
  menu_id           INTEGER PRIMARY KEY AUTOINCREMENT    ,
  menu_name         TEXT     not null                   ,
  parent_id         INTEGER      default 0                  ,
  order_num         INTEGER          default 0                  ,
  path              TEXT    default ''                 ,
  component         TEXT    default null               ,
  query             TEXT    default null               ,
  is_frame          INTEGER          default 1                  ,
  is_cache          INTEGER          default 0                  ,
  menu_type         TEXT         default ''                 ,
  visible           TEXT         default 0                  ,
  status            TEXT         default 0                  ,
  perms             TEXT    default null               ,
  icon              TEXT    default '#'                ,
  create_by         TEXT     default ''                 ,
  create_time       TEXT                                   ,
  update_by         TEXT     default ''                 ,
  update_time       TEXT                                   ,
  remark            TEXT    default ''                 
);
insert into sys_menu values('1', '系统管理', '0', '1', 'system',           null, '', 1, 0, 'M', '0', '0', '', 'system',   'admin', datetime('now'), '', null, '系统管理目录');
insert into sys_menu values('2', '系统监控', '0', '2', 'monitor',          null, '', 1, 0, 'M', '0', '0', '', 'monitor',  'admin', datetime('now'), '', null, '系统监控目录');
insert into sys_menu values('3', '系统工具', '0', '3', 'tool',             null, '', 1, 0, 'M', '0', '0', '', 'tool',     'admin', datetime('now'), '', null, '系统工具目录');
insert into sys_menu values('4', 'Lumi官网', '0', '4', 'https://lumi-cms-web.pages.dev', null, '', 0, 0, 'M', '0', '0', '', 'guide',    'admin', datetime('now'), '', null, 'Lumi官网地址');
insert into sys_menu values('100',  '用户管理',       '1',   '1', 'user',       'system/user/index',                 '', 1, 0, 'C', '0', '0', 'system:user:list',        'user',          'admin', datetime('now'), '', null, '用户管理菜单');
insert into sys_menu values('101',  '角色管理',       '1',   '2', 'role',       'system/role/index',                 '', 1, 0, 'C', '0', '0', 'system:role:list',        'peoples',       'admin', datetime('now'), '', null, '角色管理菜单');
insert into sys_menu values('102',  '菜单管理',       '1',   '3', 'menu',       'system/menu/index',                 '', 1, 0, 'C', '0', '0', 'system:menu:list',        'tree-table',    'admin', datetime('now'), '', null, '菜单管理菜单');
insert into sys_menu values('103',  '部门管理',       '1',   '4', 'dept',       'system/dept/index',                 '', 1, 0, 'C', '0', '0', 'system:dept:list',        'tree',          'admin', datetime('now'), '', null, '部门管理菜单');
insert into sys_menu values('104',  '岗位管理',       '1',   '5', 'post',       'system/post/index',                 '', 1, 0, 'C', '0', '0', 'system:post:list',        'post',          'admin', datetime('now'), '', null, '岗位管理菜单');
insert into sys_menu values('105',  '字典管理',       '1',   '6', 'dict',       'system/dict/index',                 '', 1, 0, 'C', '0', '0', 'system:dict:list',        'dict',          'admin', datetime('now'), '', null, '字典管理菜单');
insert into sys_menu values('106',  '参数设置',       '1',   '7', 'config',     'system/config/index',               '', 1, 0, 'C', '0', '0', 'system:config:list',      'edit',          'admin', datetime('now'), '', null, '参数设置菜单');
insert into sys_menu values('107',  '通知公告',       '1',   '8', 'notice',     'system/notice/index',               '', 1, 0, 'C', '0', '0', 'system:notice:list',      'message',       'admin', datetime('now'), '', null, '通知公告菜单');
insert into sys_menu values('108',  '日志管理',       '1',   '9', 'log',        '',                                  '', 1, 0, 'M', '0', '0', '',                        'log',           'admin', datetime('now'), '', null, '日志管理菜单');
insert into sys_menu values('116',  '系统接口',       '3',   '3', 'http://localhost:8080/swagger-ui/index.html', '', '', 0, 0, 'C', '0', '0', 'tool:swagger:list',       'swagger',       'admin', datetime('now'), '', null, '系统接口菜单');
insert into sys_menu values('500',  '操作日志', '108', '1', 'operlog',    'monitor/operlog/index',    '', 1, 0, 'C', '0', '0', 'monitor:operlog:list',    'form',          'admin', datetime('now'), '', null, '操作日志菜单');
insert into sys_menu values('501',  '登录日志', '108', '2', 'logininfor', 'monitor/logininfor/index', '', 1, 0, 'C', '0', '0', 'monitor:logininfor:list', 'logininfor',    'admin', datetime('now'), '', null, '登录日志菜单');
insert into sys_menu values('1000', '用户查询', '100', '1',  '', '', '', 1, 0, 'F', '0', '0', 'system:user:query',          '#', 'admin', datetime('now'), '', null, '');
insert into sys_menu values('1001', '用户新增', '100', '2',  '', '', '', 1, 0, 'F', '0', '0', 'system:user:add',            '#', 'admin', datetime('now'), '', null, '');
insert into sys_menu values('1002', '用户修改', '100', '3',  '', '', '', 1, 0, 'F', '0', '0', 'system:user:edit',           '#', 'admin', datetime('now'), '', null, '');
insert into sys_menu values('1003', '用户删除', '100', '4',  '', '', '', 1, 0, 'F', '0', '0', 'system:user:remove',         '#', 'admin', datetime('now'), '', null, '');
insert into sys_menu values('1004', '用户导出', '100', '5',  '', '', '', 1, 0, 'F', '0', '0', 'system:user:export',         '#', 'admin', datetime('now'), '', null, '');
insert into sys_menu values('1005', '用户导入', '100', '6',  '', '', '', 1, 0, 'F', '0', '0', 'system:user:import',         '#', 'admin', datetime('now'), '', null, '');
insert into sys_menu values('1006', '重置密码', '100', '7',  '', '', '', 1, 0, 'F', '0', '0', 'system:user:resetPwd',       '#', 'admin', datetime('now'), '', null, '');
insert into sys_menu values('1007', '角色查询', '101', '1',  '', '', '', 1, 0, 'F', '0', '0', 'system:role:query',          '#', 'admin', datetime('now'), '', null, '');
insert into sys_menu values('1008', '角色新增', '101', '2',  '', '', '', 1, 0, 'F', '0', '0', 'system:role:add',            '#', 'admin', datetime('now'), '', null, '');
insert into sys_menu values('1009', '角色修改', '101', '3',  '', '', '', 1, 0, 'F', '0', '0', 'system:role:edit',           '#', 'admin', datetime('now'), '', null, '');
insert into sys_menu values('1010', '角色删除', '101', '4',  '', '', '', 1, 0, 'F', '0', '0', 'system:role:remove',         '#', 'admin', datetime('now'), '', null, '');
insert into sys_menu values('1011', '角色导出', '101', '5',  '', '', '', 1, 0, 'F', '0', '0', 'system:role:export',         '#', 'admin', datetime('now'), '', null, '');
insert into sys_menu values('1012', '菜单查询', '102', '1',  '', '', '', 1, 0, 'F', '0', '0', 'system:menu:query',          '#', 'admin', datetime('now'), '', null, '');
insert into sys_menu values('1013', '菜单新增', '102', '2',  '', '', '', 1, 0, 'F', '0', '0', 'system:menu:add',            '#', 'admin', datetime('now'), '', null, '');
insert into sys_menu values('1014', '菜单修改', '102', '3',  '', '', '', 1, 0, 'F', '0', '0', 'system:menu:edit',           '#', 'admin', datetime('now'), '', null, '');
insert into sys_menu values('1015', '菜单删除', '102', '4',  '', '', '', 1, 0, 'F', '0', '0', 'system:menu:remove',         '#', 'admin', datetime('now'), '', null, '');
insert into sys_menu values('1016', '部门查询', '103', '1',  '', '', '', 1, 0, 'F', '0', '0', 'system:dept:query',          '#', 'admin', datetime('now'), '', null, '');
insert into sys_menu values('1017', '部门新增', '103', '2',  '', '', '', 1, 0, 'F', '0', '0', 'system:dept:add',            '#', 'admin', datetime('now'), '', null, '');
insert into sys_menu values('1018', '部门修改', '103', '3',  '', '', '', 1, 0, 'F', '0', '0', 'system:dept:edit',           '#', 'admin', datetime('now'), '', null, '');
insert into sys_menu values('1019', '部门删除', '103', '4',  '', '', '', 1, 0, 'F', '0', '0', 'system:dept:remove',         '#', 'admin', datetime('now'), '', null, '');
insert into sys_menu values('1020', '岗位查询', '104', '1',  '', '', '', 1, 0, 'F', '0', '0', 'system:post:query',          '#', 'admin', datetime('now'), '', null, '');
insert into sys_menu values('1021', '岗位新增', '104', '2',  '', '', '', 1, 0, 'F', '0', '0', 'system:post:add',            '#', 'admin', datetime('now'), '', null, '');
insert into sys_menu values('1022', '岗位修改', '104', '3',  '', '', '', 1, 0, 'F', '0', '0', 'system:post:edit',           '#', 'admin', datetime('now'), '', null, '');
insert into sys_menu values('1023', '岗位删除', '104', '4',  '', '', '', 1, 0, 'F', '0', '0', 'system:post:remove',         '#', 'admin', datetime('now'), '', null, '');
insert into sys_menu values('1024', '岗位导出', '104', '5',  '', '', '', 1, 0, 'F', '0', '0', 'system:post:export',         '#', 'admin', datetime('now'), '', null, '');
insert into sys_menu values('1025', '字典查询', '105', '1', '#', '', '', 1, 0, 'F', '0', '0', 'system:dict:query',          '#', 'admin', datetime('now'), '', null, '');
insert into sys_menu values('1026', '字典新增', '105', '2', '#', '', '', 1, 0, 'F', '0', '0', 'system:dict:add',            '#', 'admin', datetime('now'), '', null, '');
insert into sys_menu values('1027', '字典修改', '105', '3', '#', '', '', 1, 0, 'F', '0', '0', 'system:dict:edit',           '#', 'admin', datetime('now'), '', null, '');
insert into sys_menu values('1028', '字典删除', '105', '4', '#', '', '', 1, 0, 'F', '0', '0', 'system:dict:remove',         '#', 'admin', datetime('now'), '', null, '');
insert into sys_menu values('1029', '字典导出', '105', '5', '#', '', '', 1, 0, 'F', '0', '0', 'system:dict:export',         '#', 'admin', datetime('now'), '', null, '');
insert into sys_menu values('1030', '参数查询', '106', '1', '#', '', '', 1, 0, 'F', '0', '0', 'system:config:query',        '#', 'admin', datetime('now'), '', null, '');
insert into sys_menu values('1031', '参数新增', '106', '2', '#', '', '', 1, 0, 'F', '0', '0', 'system:config:add',          '#', 'admin', datetime('now'), '', null, '');
insert into sys_menu values('1032', '参数修改', '106', '3', '#', '', '', 1, 0, 'F', '0', '0', 'system:config:edit',         '#', 'admin', datetime('now'), '', null, '');
insert into sys_menu values('1033', '参数删除', '106', '4', '#', '', '', 1, 0, 'F', '0', '0', 'system:config:remove',       '#', 'admin', datetime('now'), '', null, '');
insert into sys_menu values('1034', '参数导出', '106', '5', '#', '', '', 1, 0, 'F', '0', '0', 'system:config:export',       '#', 'admin', datetime('now'), '', null, '');
insert into sys_menu values('1035', '公告查询', '107', '1', '#', '', '', 1, 0, 'F', '0', '0', 'system:notice:query',        '#', 'admin', datetime('now'), '', null, '');
insert into sys_menu values('1036', '公告新增', '107', '2', '#', '', '', 1, 0, 'F', '0', '0', 'system:notice:add',          '#', 'admin', datetime('now'), '', null, '');
insert into sys_menu values('1037', '公告修改', '107', '3', '#', '', '', 1, 0, 'F', '0', '0', 'system:notice:edit',         '#', 'admin', datetime('now'), '', null, '');
insert into sys_menu values('1038', '公告删除', '107', '4', '#', '', '', 1, 0, 'F', '0', '0', 'system:notice:remove',       '#', 'admin', datetime('now'), '', null, '');
insert into sys_menu values('1039', '操作查询', '500', '1', '#', '', '', 1, 0, 'F', '0', '0', 'system:operlog:query',       '#', 'admin', datetime('now'), '', null, '');
insert into sys_menu values('1040', '操作删除', '500', '2', '#', '', '', 1, 0, 'F', '0', '0', 'system:operlog:remove',      '#', 'admin', datetime('now'), '', null, '');
insert into sys_menu values('1041', '日志导出', '500', '3', '#', '', '', 1, 0, 'F', '0', '0', 'system:operlog:export',      '#', 'admin', datetime('now'), '', null, '');
insert into sys_menu values('1042', '登录查询', '501', '1', '#', '', '', 1, 0, 'F', '0', '0', 'system:logininfor:query',    '#', 'admin', datetime('now'), '', null, '');
insert into sys_menu values('1043', '登录删除', '501', '2', '#', '', '', 1, 0, 'F', '0', '0', 'system:logininfor:remove',   '#', 'admin', datetime('now'), '', null, '');
insert into sys_menu values('1044', '日志导出', '501', '3', '#', '', '', 1, 0, 'F', '0', '0', 'system:logininfor:export',   '#', 'admin', datetime('now'), '', null, '');
insert into sys_menu values('1045', '账户解锁', '501', '4', '#', '', '', 1, 0, 'F', '0', '0', 'system:logininfor:unlock',   '#', 'admin', datetime('now'), '', null, '');
drop table if exists sys_user_role;
create table sys_user_role (
  user_id   INTEGER not null ,
  role_id   INTEGER not null ,
  primary key(user_id, role_id)
);
insert into sys_user_role values ('1', '1');
insert into sys_user_role values ('2', '2');
drop table if exists sys_role_menu;
create table sys_role_menu (
  role_id   INTEGER not null ,
  menu_id   INTEGER not null ,
  primary key(role_id, menu_id)
);
insert into sys_role_menu values ('2', '1');
insert into sys_role_menu values ('2', '2');
insert into sys_role_menu values ('2', '3');
insert into sys_role_menu values ('2', '4');
insert into sys_role_menu values ('2', '100');
insert into sys_role_menu values ('2', '101');
insert into sys_role_menu values ('2', '102');
insert into sys_role_menu values ('2', '103');
insert into sys_role_menu values ('2', '104');
insert into sys_role_menu values ('2', '105');
insert into sys_role_menu values ('2', '106');
insert into sys_role_menu values ('2', '107');
insert into sys_role_menu values ('2', '108');
insert into sys_role_menu values ('2', '109');
insert into sys_role_menu values ('2', '110');
insert into sys_role_menu values ('2', '111');
insert into sys_role_menu values ('2', '112');
insert into sys_role_menu values ('2', '113');
insert into sys_role_menu values ('2', '114');
insert into sys_role_menu values ('2', '115');
insert into sys_role_menu values ('2', '116');
insert into sys_role_menu values ('2', '500');
insert into sys_role_menu values ('2', '501');
insert into sys_role_menu values ('2', '1000');
insert into sys_role_menu values ('2', '1001');
insert into sys_role_menu values ('2', '1002');
insert into sys_role_menu values ('2', '1003');
insert into sys_role_menu values ('2', '1004');
insert into sys_role_menu values ('2', '1005');
insert into sys_role_menu values ('2', '1006');
insert into sys_role_menu values ('2', '1007');
insert into sys_role_menu values ('2', '1008');
insert into sys_role_menu values ('2', '1009');
insert into sys_role_menu values ('2', '1010');
insert into sys_role_menu values ('2', '1011');
insert into sys_role_menu values ('2', '1012');
insert into sys_role_menu values ('2', '1013');
insert into sys_role_menu values ('2', '1014');
insert into sys_role_menu values ('2', '1015');
insert into sys_role_menu values ('2', '1016');
insert into sys_role_menu values ('2', '1017');
insert into sys_role_menu values ('2', '1018');
insert into sys_role_menu values ('2', '1019');
insert into sys_role_menu values ('2', '1020');
insert into sys_role_menu values ('2', '1021');
insert into sys_role_menu values ('2', '1022');
insert into sys_role_menu values ('2', '1023');
insert into sys_role_menu values ('2', '1024');
insert into sys_role_menu values ('2', '1025');
insert into sys_role_menu values ('2', '1026');
insert into sys_role_menu values ('2', '1027');
insert into sys_role_menu values ('2', '1028');
insert into sys_role_menu values ('2', '1029');
insert into sys_role_menu values ('2', '1030');
insert into sys_role_menu values ('2', '1031');
insert into sys_role_menu values ('2', '1032');
insert into sys_role_menu values ('2', '1033');
insert into sys_role_menu values ('2', '1034');
insert into sys_role_menu values ('2', '1035');
insert into sys_role_menu values ('2', '1036');
insert into sys_role_menu values ('2', '1037');
insert into sys_role_menu values ('2', '1038');
insert into sys_role_menu values ('2', '1039');
insert into sys_role_menu values ('2', '1040');
insert into sys_role_menu values ('2', '1041');
insert into sys_role_menu values ('2', '1042');
insert into sys_role_menu values ('2', '1043');
insert into sys_role_menu values ('2', '1044');
insert into sys_role_menu values ('2', '1045');
insert into sys_role_menu values ('2', '1046');
insert into sys_role_menu values ('2', '1047');
insert into sys_role_menu values ('2', '1048');
insert into sys_role_menu values ('2', '1049');
insert into sys_role_menu values ('2', '1050');
insert into sys_role_menu values ('2', '1051');
insert into sys_role_menu values ('2', '1052');
insert into sys_role_menu values ('2', '1053');
insert into sys_role_menu values ('2', '1054');
insert into sys_role_menu values ('2', '1055');
insert into sys_role_menu values ('2', '1056');
insert into sys_role_menu values ('2', '1057');
insert into sys_role_menu values ('2', '1058');
insert into sys_role_menu values ('2', '1059');
insert into sys_role_menu values ('2', '1060');
drop table if exists sys_role_dept;
create table sys_role_dept (
  role_id   INTEGER not null ,
  dept_id   INTEGER not null ,
  primary key(role_id, dept_id)
);
insert into sys_role_dept values ('2', '100');
insert into sys_role_dept values ('2', '101');
insert into sys_role_dept values ('2', '105');
drop table if exists sys_user_post;
create table sys_user_post
(
  user_id   INTEGER not null ,
  post_id   INTEGER not null ,
  primary key (user_id, post_id)
);
insert into sys_user_post values ('1', '1');
insert into sys_user_post values ('2', '2');
drop table if exists sys_oper_log;
create table sys_oper_log (
  oper_id           INTEGER PRIMARY KEY AUTOINCREMENT    ,
  title             TEXT     default ''                 ,
  business_type     INTEGER          default 0                  ,
  method            TEXT    default ''                 ,
  request_method    TEXT     default ''                 ,
  operator_type     INTEGER          default 0                  ,
  oper_name         TEXT     default ''                 ,
  dept_name         TEXT     default ''                 ,
  oper_url          TEXT    default ''                 ,
  oper_ip           TEXT    default ''                 ,
  oper_location     TEXT    default ''                 ,
  oper_param        TEXT   default ''                 ,
  json_result       TEXT   default ''                 ,
  status            INTEGER          default 0                  ,
  error_msg         TEXT   default ''                 ,
  oper_time         TEXT                                   ,
  cost_time         INTEGER      default 0                  
);
drop table if exists sys_dict_type;
create table sys_dict_type
(
  dict_id          INTEGER PRIMARY KEY AUTOINCREMENT    ,
  dict_name        TEXT    default ''                 ,
  dict_type        TEXT    default ''                 ,
  status           TEXT         default '0'                ,
  create_by        TEXT     default ''                 ,
  create_time      TEXT                                   ,
  update_by        TEXT     default ''                 ,
  update_time      TEXT                                   ,
  remark           TEXT    default null               
);
insert into sys_dict_type values(1,  '用户性别', 'sys_user_sex',        '0', 'admin', datetime('now'), '', null, '用户性别列表');
insert into sys_dict_type values(2,  '菜单状态', 'sys_show_hide',       '0', 'admin', datetime('now'), '', null, '菜单状态列表');
insert into sys_dict_type values(3,  '系统开关', 'sys_normal_disable',  '0', 'admin', datetime('now'), '', null, '系统开关列表');
insert into sys_dict_type values(6,  '系统是否', 'sys_yes_no',          '0', 'admin', datetime('now'), '', null, '系统是否列表');
insert into sys_dict_type values(7,  '通知类型', 'sys_notice_type',     '0', 'admin', datetime('now'), '', null, '通知类型列表');
insert into sys_dict_type values(8,  '通知状态', 'sys_notice_status',   '0', 'admin', datetime('now'), '', null, '通知状态列表');
insert into sys_dict_type values(9,  '操作类型', 'sys_oper_type',       '0', 'admin', datetime('now'), '', null, '操作类型列表');
insert into sys_dict_type values(10, '系统状态', 'sys_common_status',   '0', 'admin', datetime('now'), '', null, '登录状态列表');
drop table if exists sys_dict_data;
create table sys_dict_data
(
  dict_code        INTEGER PRIMARY KEY AUTOINCREMENT    ,
  dict_sort        INTEGER          default 0                  ,
  dict_label       TEXT    default ''                 ,
  dict_value       TEXT    default ''                 ,
  dict_type        TEXT    default ''                 ,
  css_class        TEXT    default null               ,
  list_class       TEXT    default null               ,
  is_default       TEXT         default 'N'                ,
  status           TEXT         default '0'                ,
  create_by        TEXT     default ''                 ,
  create_time      TEXT                                   ,
  update_by        TEXT     default ''                 ,
  update_time      TEXT                                   ,
  remark           TEXT    default null               
);
insert into sys_dict_data values(1,  1,  '男',       '0',       'sys_user_sex',        '',   '',        'Y', '0', 'admin', datetime('now'), '', null, '性别男');
insert into sys_dict_data values(2,  2,  '女',       '1',       'sys_user_sex',        '',   '',        'N', '0', 'admin', datetime('now'), '', null, '性别女');
insert into sys_dict_data values(3,  3,  '未知',     '2',       'sys_user_sex',        '',   '',        'N', '0', 'admin', datetime('now'), '', null, '性别未知');
insert into sys_dict_data values(4,  1,  '显示',     '0',       'sys_show_hide',       '',   'primary', 'Y', '0', 'admin', datetime('now'), '', null, '显示菜单');
insert into sys_dict_data values(5,  2,  '隐藏',     '1',       'sys_show_hide',       '',   'danger',  'N', '0', 'admin', datetime('now'), '', null, '隐藏菜单');
insert into sys_dict_data values(6,  1,  '正常',     '0',       'sys_normal_disable',  '',   'primary', 'Y', '0', 'admin', datetime('now'), '', null, '正常状态');
insert into sys_dict_data values(7,  2,  '停用',     '1',       'sys_normal_disable',  '',   'danger',  'N', '0', 'admin', datetime('now'), '', null, '停用状态');
insert into sys_dict_data values(12, 1,  '是',       'Y',       'sys_yes_no',          '',   'primary', 'Y', '0', 'admin', datetime('now'), '', null, '系统默认是');
insert into sys_dict_data values(13, 2,  '否',       'N',       'sys_yes_no',          '',   'danger',  'N', '0', 'admin', datetime('now'), '', null, '系统默认否');
insert into sys_dict_data values(14, 1,  '通知',     '1',       'sys_notice_type',     '',   'warning', 'Y', '0', 'admin', datetime('now'), '', null, '通知');
insert into sys_dict_data values(15, 2,  '公告',     '2',       'sys_notice_type',     '',   'success', 'N', '0', 'admin', datetime('now'), '', null, '公告');
insert into sys_dict_data values(16, 1,  '正常',     '0',       'sys_notice_status',   '',   'primary', 'Y', '0', 'admin', datetime('now'), '', null, '正常状态');
insert into sys_dict_data values(17, 2,  '关闭',     '1',       'sys_notice_status',   '',   'danger',  'N', '0', 'admin', datetime('now'), '', null, '关闭状态');
insert into sys_dict_data values(18, 99, '其他',     '0',       'sys_oper_type',       '',   'info',    'N', '0', 'admin', datetime('now'), '', null, '其他操作');
insert into sys_dict_data values(19, 1,  '新增',     '1',       'sys_oper_type',       '',   'info',    'N', '0', 'admin', datetime('now'), '', null, '新增操作');
insert into sys_dict_data values(20, 2,  '修改',     '2',       'sys_oper_type',       '',   'info',    'N', '0', 'admin', datetime('now'), '', null, '修改操作');
insert into sys_dict_data values(21, 3,  '删除',     '3',       'sys_oper_type',       '',   'danger',  'N', '0', 'admin', datetime('now'), '', null, '删除操作');
insert into sys_dict_data values(22, 4,  '授权',     '4',       'sys_oper_type',       '',   'primary', 'N', '0', 'admin', datetime('now'), '', null, '授权操作');
insert into sys_dict_data values(23, 5,  '导出',     '5',       'sys_oper_type',       '',   'warning', 'N', '0', 'admin', datetime('now'), '', null, '导出操作');
insert into sys_dict_data values(24, 6,  '导入',     '6',       'sys_oper_type',       '',   'warning', 'N', '0', 'admin', datetime('now'), '', null, '导入操作');
insert into sys_dict_data values(25, 7,  '强退',     '7',       'sys_oper_type',       '',   'danger',  'N', '0', 'admin', datetime('now'), '', null, '强退操作');
insert into sys_dict_data values(26, 8,  '生成代码', '8',       'sys_oper_type',       '',   'warning', 'N', '0', 'admin', datetime('now'), '', null, '生成操作');
insert into sys_dict_data values(27, 9,  '清空数据', '9',       'sys_oper_type',       '',   'danger',  'N', '0', 'admin', datetime('now'), '', null, '清空操作');
insert into sys_dict_data values(28, 1,  '成功',     '0',       'sys_common_status',   '',   'primary', 'N', '0', 'admin', datetime('now'), '', null, '正常状态');
insert into sys_dict_data values(29, 2,  '失败',     '1',       'sys_common_status',   '',   'danger',  'N', '0', 'admin', datetime('now'), '', null, '停用状态');
drop table if exists sys_config;
create table sys_config (
  config_id         INTEGER PRIMARY KEY AUTOINCREMENT    ,
  config_name       TEXT    default ''                 ,
  config_key        TEXT    default ''                 ,
  config_value      TEXT    default ''                 ,
  config_type       TEXT         default 'N'                ,
  create_by         TEXT     default ''                 ,
  create_time       TEXT                                   ,
  update_by         TEXT     default ''                 ,
  update_time       TEXT                                   ,
  remark            TEXT    default null               
);
insert into sys_config values(1, '主框架页-默认皮肤样式名称',     'sys.index.skinName',       'skin-blue',     'Y', 'admin', datetime('now'), '', null, '蓝色 skin-blue、绿色 skin-green、紫色 skin-purple、红色 skin-red、黄色 skin-yellow' );
insert into sys_config values(2, '用户管理-账号初始密码',         'sys.user.initPassword',    '123456',        'Y', 'admin', datetime('now'), '', null, '初始化密码 123456' );
insert into sys_config values(3, '主框架页-侧边栏主题',           'sys.index.sideTheme',      'theme-dark',    'Y', 'admin', datetime('now'), '', null, '深色主题theme-dark，浅色主题theme-light' );
insert into sys_config values(4, '账号自助-是否开启用户注册功能', 'sys.account.registerUser', 'false',         'Y', 'admin', datetime('now'), '', null, '是否开启注册用户功能（true开启，false关闭）');
insert into sys_config values(5, '用户登录-黑名单列表',           'sys.login.blackIPList',    '',              'Y', 'admin', datetime('now'), '', null, '设置登录IP黑名单限制，多个匹配项以;分隔，支持匹配（*通配、网段）');
drop table if exists sys_logininfor;
create table sys_logininfor (
  info_id        INTEGER PRIMARY KEY AUTOINCREMENT   ,
  user_name      TEXT    default ''                ,
  ipaddr         TEXT   default ''                ,
  login_location TEXT   default ''                ,
  browser        TEXT    default ''                ,
  os             TEXT    default ''                ,
  status         TEXT        default '0'               ,
  msg            TEXT   default ''                ,
  login_time     TEXT                                 
);
drop table if exists sys_notice;
create table sys_notice (
  notice_id         INTEGER PRIMARY KEY AUTOINCREMENT    ,
  notice_title      TEXT     not null                   ,
  notice_type       TEXT         not null                   ,
  notice_content    BLOB        default null               ,
  status            TEXT         default '0'                ,
  create_by         TEXT     default ''                 ,
  create_time       TEXT                                   ,
  update_by         TEXT     default ''                 ,
  update_time       TEXT                                   ,
  remark            TEXT    default null               
);
insert into sys_notice values('1', '温馨提醒：2026-01-01 Lumi新版本发布啦', '2', '新版本内容', '0', 'admin', datetime('now'), '', null, '管理员');
insert into sys_notice values('2', '温馨提醒：2026-01-01 Lumi系统凌晨维护', '1', '维护内容',   '0', 'admin', datetime('now'), '', null, '管理员');
