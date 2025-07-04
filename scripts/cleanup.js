#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function runCleanup() {
  try {
    console.log('🧹 Starting cleanup job...')
    
    const now = new Date()
    
    // Find domains that are expired but not yet trashed
    const expiredDomains = await prisma.domain.findMany({
      where: {
        status: 'ACTIVE',
        domainRequest: {
          expiresAt: {
            lt: now
          },
          durationType: 'TEMPORARY'
        }
      },
      include: {
        domainRequest: true
      }
    })

    // Move expired domains to trash
    const trashedPromises = expiredDomains.map(async (domain) => {
      const trashExpiry = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000) // 90 days from now
      
      return await prisma.domain.update({
        where: { id: domain.id },
        data: {
          status: 'TRASHED',
          deletedAt: now,
          trashExpiresAt: trashExpiry
        }
      })
    })

    const trashedResults = await Promise.all(trashedPromises)
    
    // Find domains that have been in trash for 90+ days
    const oldTrashedDomains = await prisma.domain.findMany({
      where: {
        status: 'TRASHED',
        trashExpiresAt: {
          lt: now
        }
      },
      include: {
        domainRequest: true
      }
    })

    // Log domains before permanent deletion
    const logPromises = oldTrashedDomains.map(async (domain) => {
      return await prisma.deletedDomainLog.create({
        data: {
          domainName: domain.domainRequest.domain,
          reason: 'Expired and cleaned up after 90 days in trash'
        }
      })
    })

    await Promise.all(logPromises)

    // Permanently delete old trashed domains
    const deleteResult = await prisma.domain.deleteMany({
      where: {
        status: 'TRASHED',
        trashExpiresAt: {
          lt: now
        }
      }
    })

    // Also delete the associated domain requests for permanently deleted domains
    await prisma.domainRequest.deleteMany({
      where: {
        id: {
          in: oldTrashedDomains.map(d => d.domainRequestId)
        }
      }
    })

    console.log('✅ Cleanup completed successfully!')
    console.log(`📦 Domains moved to trash: ${trashedResults.length}`)
    console.log(`🗑️  Domains deleted permanently: ${deleteResult.count}`)
    console.log(`📅 Cleanup timestamp: ${now.toISOString()}`)

  } catch (error) {
    console.error('❌ Error in cleanup job:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

runCleanup()
