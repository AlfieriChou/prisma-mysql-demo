# prisma-mysql-demo

## 笔记

* 表名和字段名snakeCase [链接](https://github.com/prisma/prisma/discussions/2530)
* multi datasource prisma [链接](https://github.com/prisma/prisma/issues/2443)
* 多文件prisma schema [链接1](https://github.com/prisma/prisma/issues/2377) [链接2](https://github.com/prisma/prisma/issues/1291)
* debug打印SQL调试

  ```javascript
  // env
  export DEBUG="engine"

  // client
  const prisma = new PrismaClient({
    log: ['query'],
  })
  ```

## 问题

* 令人费解的多对多关联拉取，官方讨论[入口](https://github.com/prisma/prisma/issues/2186)
  * 先通过关联表拉到对应关系，然后，再用ID去搜索，例如：本案例中，不能在user.prisma添加roles关联关系
