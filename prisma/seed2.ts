import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // ลบข้อมูลเก่าทั้งหมด
  await prisma.renewalRequest.deleteMany()
  await prisma.domain.deleteMany()
  await prisma.domainRequest.deleteMany()
  await prisma.user.deleteMany()
  await prisma.deletedDomainLog.deleteMany()

  // สร้าง Admin user
  const admin = await prisma.user.create({
    data: {
      username: 'admin',
      password: 'admin123',
      role: 'ADMIN'
    }
  })

  // สร้าง User01
  const user01 = await prisma.user.create({
    data: {
      username: 'user01',
      password: 'passuser01',
      role: 'USER'
    }
  })

  console.log('✅ Database seeded successfully!')
  console.log('📝 Created users:')
  console.log('   - Admin: username=admin, password=admin123')
  console.log('   - User01: username=user01, password=passuser01')
  console.log('📋 No domain requests created (clean start)')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })