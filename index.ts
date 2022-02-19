import { PrismaClient as MainPrismaClient } from './prisma/clients/main'
import { PrismaClient as reportPrismaClient } from './prisma/clients/report'

const mainClient = new MainPrismaClient()
const reportClient = new reportPrismaClient()

const main = async () => {
  // Connect the client
  await mainClient.$connect()
  await reportClient.$connect()

  await mainClient.testUser.create({
    data: {
      email: 'hello@prisma.com',
    },
  })

  const allUsers = await mainClient.testUser.findMany({})

  console.log(allUsers)

  await reportClient.log.create({
    data: {
      description: 'hello@prisma.com',
    },
  })

  const logs = await reportClient.log.findMany({})

  console.log(logs)
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await mainClient.$disconnect()
    await reportClient.$disconnect()
  })
