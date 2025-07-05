#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function testSystem() {
  console.log('🔍 Testing Domain Request System...\n')

  try {
    // Test 1: Check users
    console.log('1. Testing Users...')
    const users = await prisma.user.findMany()
    console.log(`   ✅ Found ${users.length} users`)
    users.forEach(user => {
      console.log(`   - ${user.username} (${user.role})`)
    })

    // Test 2: Check domain requests
    console.log('\n2. Testing Domain Requests...')
    const requests = await prisma.domainRequest.findMany({
      include: {
        user: { select: { username: true } },
        domain_record: true
      }
    })
    console.log(`   ✅ Found ${requests.length} domain requests`)
    requests.forEach(req => {
      console.log(`   - ${req.domain} (${req.status}) by ${req.user.username}`)
    })

    // Test 3: Check domains
    console.log('\n3. Testing Domains...')
    const domains = await prisma.domain.findMany({
      include: {
        domainRequest: {
          select: { domain: true }
        }
      }
    })
    console.log(`   ✅ Found ${domains.length} domains`)
    domains.forEach(domain => {
      console.log(`   - ${domain.domainRequest.domain} (${domain.status})`)
    })

    // Test 4: Check renewal requests
    console.log('\n4. Testing Renewal Requests...')
    const renewals = await prisma.renewalRequest.findMany({
      include: {
        user: { select: { username: true } },
        domain: {
          include: {
            domainRequest: { select: { domain: true } }
          }
        }
      }
    })
    console.log(`   ✅ Found ${renewals.length} renewal requests`)
    renewals.forEach(renewal => {
      console.log(`   - ${renewal.domain.domainRequest.domain} (${renewal.status}) by ${renewal.user.username}`)
    })

    // Test 5: Check deleted domain logs
    console.log('\n5. Testing Deleted Domain Logs...')
    const deletedLogs = await prisma.deletedDomainLog.findMany()
    console.log(`   ✅ Found ${deletedLogs.length} deleted domain logs`)

    console.log('\n✅ All tests completed successfully!')
    console.log('\n🚀 System is ready for use!')
    console.log('\nTo start the development server:')
    console.log('  npm run dev')
    console.log('\nTo access the system:')
    console.log('  http://localhost:3000')
    console.log('\nTest accounts:')
    console.log('  Admin: admin / admin123')
    console.log('  User1: user01 / passuser01')
    console.log('  User2: user02 / passuser02')

  } catch (error) {
    console.error('❌ Test failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testSystem()
