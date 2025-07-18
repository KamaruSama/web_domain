import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // ลบข้อมูลเก่าทั้งหมด
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

  // สร้าง User accounts
  const user01 = await prisma.user.create({
    data: {
      username: 'user01',
      password: 'passuser01',
      role: 'USER'
    }
  })

  const user02 = await prisma.user.create({
    data: {
      username: 'user02',
      password: 'passuser02',
      role: 'USER'
    }
  })

  // สร้าง Domain Requests
  const request1 = await prisma.domainRequest.create({
    data: {
      domain: 'library.nstru.ac.th',
      purpose: 'ระบบห้องสมุดดิจิทัล',
      ipAddress: '192.168.1.100',
      requesterName: 'นายสมชาย ใจดี',
      responsibleName: 'นายสมศักดิ์ รักษาดี',
      department: 'ห้องสมุดกลาง',
      contact: 'somchai@nstru.ac.th',
      durationType: 'PERMANENT',
      status: 'APPROVED',
      userId: user01.id,
    }
  })

  const request2 = await prisma.domainRequest.create({
    data: {
      domain: 'event.nstru.ac.th',
      purpose: 'ระบบจัดการกิจกรรม',
      ipAddress: '192.168.1.200',
      requesterName: 'นางสาวมาลี สวยงาม',
      responsibleName: 'นายประสิทธิ์ ทำงานดี',
      department: 'งานกิจการนักศึกษา',
      contact: 'malee@nstru.ac.th',
      durationType: 'TEMPORARY',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 วันจากตอนนี้
      status: 'PENDING',
      userId: user02.id,
    }
  })

  const request3 = await prisma.domainRequest.create({
    data: {
      domain: 'old.nstru.ac.th',
      purpose: 'เว็บไซต์เก่า',
      ipAddress: '192.168.1.50',
      requesterName: 'นายเก่า หมดสมัย',
      responsibleName: 'นายเก่า หมดสมัย',
      department: 'ฝ่ายเทคโนโลยี',
      contact: 'old@nstru.ac.th',
      durationType: 'TEMPORARY',
      expiresAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // หมดอายุแล้ว 7 วัน
      status: 'APPROVED',
      userId: user01.id,
    }
  })

  const request4 = await prisma.domainRequest.create({
    data: {
      domain: 'rejected.nstru.ac.th',
      purpose: 'ระบบที่ถูกปฏิเสธ',
      ipAddress: '192.168.1.999',
      requesterName: 'นายไม่ผ่าน อนุมัติ',
      responsibleName: 'นายไม่ผ่าน อนุมัติ',
      department: 'ฝ่ายทดสอบ',
      contact: 'reject@nstru.ac.th',
      durationType: 'PERMANENT',
      status: 'REJECTED',
      userId: user02.id,
    }
  })

  // สร้าง Domain records สำหรับ request ที่ approved
  await prisma.domain.create({
    data: {
      domainRequestId: request1.id,
      status: 'ACTIVE',
      lastUsedAt: new Date()
    }
  })

  // สร้าง Domain ที่หมดอายุ (ในถังขยะ)
  await prisma.domain.create({
    data: {
      domainRequestId: request3.id,
      status: 'TRASHED',
      deletedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 วันที่แล้ว
      trashExpiresAt: new Date(Date.now() + 85 * 24 * 60 * 60 * 1000), // อีก 85 วัน
      lastUsedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
    }
  })

  console.log('✅ Database seeded successfully!')
  console.log('📝 Created users:')
  console.log('   - Admin: username=admin, password=admin123')
  console.log('   - User01: username=user01, password=passuser01')
  console.log('   - User02: username=user02, password=passuser02')
  console.log('📋 Created sample domain requests with different statuses')
  console.log('🗑️ Created sample trashed domain')
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
