import { zipObjectDeep } from 'lodash'

import { PrismaClient as MainPrismaClient, TestUser } from './prisma/clients/main'
import { PrismaClient as reportPrismaClient } from './prisma/clients/report'

const mainClient = new MainPrismaClient()
const reportClient = new reportPrismaClient()

const fieldsToSelect = (fields: string[]) => zipObjectDeep(
  fields.map(field => {
    if (field.includes('.')) {
      return field.replace('.', '.select.')
    }
    return field
  }),
  new Array(fields.length).fill(true)
)

const main = async () => {
  // Connect the client
  await mainClient.$connect()
  await reportClient.$connect()

  const allUsers = await mainClient.testUser.findMany({
    select: fieldsToSelect(['id', 'email', 'posts.id', 'posts.title'])
  })
  console.log('allUsers: ', allUsers)

  // query
  const users = await mainClient.$queryRaw<TestUser[]>`SELECT * FROM test_user WHERE id = 1`
  console.log('users: ', users)

  if (!users.length) {
    await mainClient.testUser.create({
      data: {
        email: 'helloworld@prisma.com',
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
