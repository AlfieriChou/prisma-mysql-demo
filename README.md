# prisma-mysql-demo

## 笔记

* 表名和字段名snakeCase [url](https://github.com/prisma/prisma/discussions/2530)
* multi datasource prisma [url](https://github.com/prisma/prisma/issues/2443)
* 多文件prisma schema [url1](https://github.com/prisma/prisma/issues/2377) [url2](https://github.com/prisma/prisma/issues/1291)

## 问题

* 令人费解的多对多关联拉取，官方讨论[入口](https://github.com/prisma/prisma/issues/2186)
  * 先通过关联表拉到对应关系，然后，再用ID去搜索，例如：本案例中，不能在user.prisma添加roles关联关系
