import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const main = async () => {
  // Connect the client
  await prisma.$connect()

  await prisma.testUser.create({
    data: {
      email: 'hello@prisma.com',
    },
  })

  const allUsers = await prisma.testUser.findMany({})

  console.log(allUsers)
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
