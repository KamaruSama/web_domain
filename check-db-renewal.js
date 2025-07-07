import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkDatabase() {
  try {
    console.log('Checking database tables...')
    
    // Check if RenewalRequest table exists by trying to count records
    const renewalRequestCount = await prisma.renewalRequest.count()
    console.log(`✅ RenewalRequest table exists. Records: ${renewalRequestCount}`)
    
    // Check Users
    const userCount = await prisma.user.count()
    console.log(`✅ User table exists. Records: ${userCount}`)
    
    // Check Domains
    const domainCount = await prisma.domain.count()
    console.log(`✅ Domain table exists. Records: ${domainCount}`)
    
    // Check DomainRequests
    const domainRequestCount = await prisma.domainRequest.count()
    console.log(`✅ DomainRequest table exists. Records: ${domainRequestCount}`)
    
    console.log('\n🎉 All tables exist and are accessible!')
    
    // Try to fetch renewal requests with relations
    console.log('\nTesting renewal requests query...')
    const renewalRequests = await prisma.renewalRequest.findMany({
      include: {
        user: {
          select: {
            username: true
          }
        },
        domain: {
          include: {
            domainRequest: {
              select: {
                domain: true,
                durationType: true,
                expiresAt: true,
                requesterName: true,
                department: true
              }
            }
          }
        }
      },
      take: 5
    })
    
    console.log(`✅ Successfully fetched ${renewalRequests.length} renewal requests`)
    if (renewalRequests.length > 0) {
      console.log('Sample renewal request:', JSON.stringify(renewalRequests[0], null, 2))
    }
    
  } catch (error) {
    console.error('❌ Database check failed:')
    console.error(error)
  } finally {
    await prisma.$disconnect()
  }
}

checkDatabase()
