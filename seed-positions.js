const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Starting position seeding...')
  
  const positions = [
    { name: 'นักเรียน', description: 'นักเรียนระดับประถม มัธยม' },
    { name: 'นิสิต/นักศึกษา', description: 'นิสิต นักศึกษาระดับอุดมศึกษา' },
    { name: 'ครู/อาจารย์', description: 'ครู อาจารย์ผู้สอน' },
    { name: 'เจ้าหน้าที่', description: 'เจ้าหน้าที่ทั่วไป' },
    { name: 'หัวหน้างาน', description: 'หัวหน้างาน หัวหน้าฝ่าย' },
    { name: 'ผู้อำนวยการ', description: 'ผู้อำนวยการ ผู้บริหาร' },
    { name: 'คณบดี', description: 'คณบดี หัวหน้าคณะ' },
    { name: 'อธิการบดี', description: 'อธิการบดี รองอธิการบดี' },
    { name: 'นักวิจัย', description: 'นักวิจัย นักวิทยาศาสตร์' },
    { name: 'เทคนิค', description: 'เจ้าหน้าที่เทคนิค ช่าง' },
    { name: 'แพทย์', description: 'แพทย์ พยาบาล บุคลากรทางการแพทย์' },
    { name: 'อื่นๆ', description: 'ตำแหน่งอื่นๆ ที่ไม่ระบุไว้' }
  ]

  for (const position of positions) {
    try {
      await prisma.position.upsert({
        where: { name: position.name },
        update: {},
        create: {
          name: position.name,
          description: position.description
        }
      })
      console.log(`✓ Seeded position: ${position.name}`)
    } catch (error) {
      console.error(`✗ Error seeding position ${position.name}:`, error.message)
    }
  }
  
  console.log('Position seeding completed!')
}

main()
  .catch((e) => {
    console.error('Error in main:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
