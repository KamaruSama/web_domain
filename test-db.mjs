import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testDatabase() {
  try {
    console.log('🔍 Testing Prisma Database Connection...')
    
    // Test basic connection
    await prisma.$connect()
    console.log('✅ Connected to database')
    
    // Test basic query
    const userCount = await prisma.user.count()
    console.log(`✅ User count: ${userCount}`)
    
    // Test renewal request model
    try {
      const renewalCount = await prisma.renewalRequest.count()
      console.log(`✅ RenewalRequest count: ${renewalCount}`)
      
      // Test with include
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
                  domain: true
                }
              }
            }
          }
        },
        take: 1
      })
      
      console.log(`✅ RenewalRequest with includes: ${renewalRequests.length}`)
      if (renewalRequests.length > 0) {
        console.log('Sample:', JSON.stringify(renewalRequests[0], null, 2))
      }
      
    } catch (renewalError) {
      console.error('❌ RenewalRequest error:', renewalError.message)
      console.error('Error details:', renewalError)
    }
    
  } catch (error) {
    console.error('❌ Database test failed:')
    console.error('Error:', error.message)
    console.error('Full error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testDatabase()
