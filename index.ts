import { zipObjectDeep } from 'lodash'

import { PrismaClient as MainPrismaClient, TestUser } from './prisma/clients/main'
import { PrismaClient as reportPrismaClient } from './prisma/clients/report'

const mainClient = new MainPrismaClient({
  log: ['query'],
})
const reportClient = new reportPrismaClient({
  log: ['query'],
})

const fieldsToSelect = (fields: string[]) => zipObjectDeep(
  fields.map(field => {
    if (field.includes('.')) {
      return field.replace('.', '.select.')
    }
    return field
  }),
  new Array(fields.length).fill(true)
)

const fieldsToInclude = (fields: string[]) => zipObjectDeep(
  fields.map(field => {
    if (field.includes('.')) {
      return field.replace('.', '.include.')
    }
    return field
  }),
  new Array(fields.length).fill(true)
)

const main = async () => {
  // Connect the client
  await mainClient.$connect()
  await reportClient.$connect()

  console.log('include: ', fieldsToInclude(['posts']))

  const allUsers = await mainClient.testUser.findMany({
    select: fieldsToSelect(['id', 'email', 'posts.id', 'posts.title'])
  })
  console.log('allUsers: ', allUsers)

  // query
  const testUsers = await mainClient.$queryRaw<TestUser[]>`SELECT * FROM test_user WHERE id = 1`
  console.log('testUsers: ', testUsers)

  const users = await mainClient.user.findMany({
    include: {
      userRoles: {
        include: {
          role: {
            select: {
              name: true,
              code: true
            }
          }
        }
      }
    },
  })

  console.log('users: ', JSON.stringify(users, null, 2))

  if (!testUsers.length) {
    await mainClient.testUser.create({
      data: {
        email: 'helloworld@prisma.com',
      },
    })

    await mainClient.userRole.create({
      data: {
        user: {
          create: {
            email: 'helloworld@prisma.com'
          }
        },
        role: {
          create: {
            name: '管理员',
            code: 'admin'
          }
        }
      },
    })
  }

  await reportClient.log.create({
    data: {
      description: 'hello@prisma.com',
    },
  })

  const logs = await reportClient.log.findMany({})
  console.log('logs: ', logs)
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await mainClient.$disconnect()
    await reportClient.$disconnect()
  })
