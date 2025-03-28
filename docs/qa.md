# 当程序启动不了，如何排查程序是否正常安装所需要的文件

··· bash
# 运行容器并保持后台运行（即使应用启动失败）
docker run -d --name temp-debug nest-ruoyi-prisma-api tail -f /dev/null

# 进入容器shell
docker exec -it temp-debug /bin/sh

# 在容器内执行（安装tree后查看）
/ # apk add tree
/ # tree /prod/api
# 或者使用 ls
/ # ls -lah /prod/api

# 退出后删除临时容器
docker rm -f temp-debug

```