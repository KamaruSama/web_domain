import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkData() {
  try {
    console.log('🔍 Checking database data...')
    
    // Check users
    const users = await prisma.user.findMany()
    console.log('👥 Users:', users.length)
    users.forEach(user => console.log(`  - ${user.username} (${user.role})`))
    
    // Check domain requests
    const requests = await prisma.domainRequest.findMany({
      include: {
        user: {
          select: { username: true }
        }
      }
    })
    console.log('\n📋 Domain Requests:', requests.length)
    requests.forEach(req => console.log(`  - ${req.domain} (${req.status}) by ${req.user.username}`))
    
    // Check domains
    const domains = await prisma.domain.findMany({
      include: {
        domainRequest: {
          include: {
            user: {
              select: { username: true }
            }
          }
        }
      }
    })
    console.log('\n🌐 Domains:', domains.length)
    domains.forEach(domain => console.log(`  - ${domain.domainRequest.domain} (${domain.status})`))
    
    // Check specifically ACTIVE domains
    const activeDomains = domains.filter(d => d.status === 'ACTIVE')
    console.log('\n✅ Active Domains:', activeDomains.length)
    
    // Check TRASHED domains
    const trashedDomains = domains.filter(d => d.status === 'TRASHED')
    console.log('🗑️ Trashed Domains:', trashedDomains.length)
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkData()
