import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
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
    const trashedCount = await Promise.all(
      expiredDomains.map(async (domain: any) => {
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
    )

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
    await Promise.all(
      oldTrashedDomains.map(async (domain: any) => {
        await prisma.deletedDomainLog.create({
          data: {
            domainName: domain.domainRequest.domain,
            reason: 'Expired and cleaned up after 90 days in trash'
          }
        })
      })
    )

    // Permanently delete old trashed domains
    const deletedCount = await prisma.domain.deleteMany({
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
          in: oldTrashedDomains.map((d: any) => d.domainRequestId)
        }
      }
    })

    return NextResponse.json({
      message: 'Cleanup completed successfully',
      expiredDomainsMovedToTrash: trashedCount.length,
      domainsDeletedPermanently: deletedCount.count,
      timestamp: now.toISOString()
    })

  } catch (error) {
    console.error('Error in cleanup job:', error)
    return NextResponse.json(
      { error: 'Cleanup job failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// For security, you might want to add authentication or API key check here
// This is a simple implementation - in production, use proper authentication
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Cleanup endpoint ready',
    description: 'POST to this endpoint to run cleanup job',
    timestamp: new Date().toISOString()
  })
}
