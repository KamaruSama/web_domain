import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const domainId = params.id

    // Find the domain
    const domain = await prisma.domain.findUnique({
      where: { id: domainId },
      include: {
        domainRequest: true
      }
    })

    if (!domain) {
      return NextResponse.json({ error: 'Domain not found' }, { status: 404 })
    }

    // Check current status
    if (domain.status === 'ACTIVE') {
      // First deletion: Move to trash
      const now = new Date()
      const trashExpiryDate = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000) // 90 days from now
      
      await prisma.domain.update({
        where: { id: domainId },
        data: {
          status: 'TRASHED',
          deletedAt: now,
          trashExpiresAt: trashExpiryDate
        }
      })

      return NextResponse.json({ 
        message: 'Domain moved to trash',
        action: 'moved_to_trash'
      })
    } else if (domain.status === 'TRASHED') {
      // Second deletion: Permanent deletion
      await prisma.domain.delete({
        where: { id: domainId }
      })

      // Log the permanent deletion
      await prisma.deletedDomainLog.create({
        data: {
          domainName: domain.domainRequest.domain,
          reason: 'Permanently deleted by admin from trash'
        }
      })

      return NextResponse.json({ 
        message: 'Domain permanently deleted',
        action: 'permanently_deleted'
      })
    } else {
      return NextResponse.json({ error: 'Invalid domain status' }, { status: 400 })
    }
  } catch (error) {
    console.error('Domain deletion error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const domainId = params.id
    const body = await request.json()
    const { action, durationType, expiresAt } = body

    if (action === 'restore') {
      // Find the domain
      const domain = await prisma.domain.findUnique({
        where: { id: domainId },
        include: {
          domainRequest: true
        }
      })

      if (!domain) {
        return NextResponse.json({ error: 'Domain not found' }, { status: 404 })
      }

      if (domain.status !== 'TRASHED') {
        return NextResponse.json({ error: 'Domain is not in trash' }, { status: 400 })
      }

      // Validate input for temporary domains
      if (durationType === 'TEMPORARY' && !expiresAt) {
        return NextResponse.json({ error: 'Expiry date required for temporary domains' }, { status: 400 })
      }

      // Prepare update data for domain request
      const updateData: {
        durationType: string;
        expiresAt: Date | null;
      } = {
        durationType: durationType || domain.domainRequest.durationType,
        expiresAt: durationType === 'TEMPORARY' ? new Date(expiresAt) : 
                   durationType === 'PERMANENT' ? null : domain.domainRequest.expiresAt
      }

      // Update domain request with new duration type and expiry
      await prisma.domainRequest.update({
        where: { id: domain.domainRequest.id },
        data: updateData
      })

      // Restore domain
      await prisma.domain.update({
        where: { id: domainId },
        data: {
          status: 'ACTIVE',
          deletedAt: null,
          trashExpiresAt: null
        }
      })

      return NextResponse.json({ 
        message: 'Domain restored successfully',
        action: 'restored'
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Domain restore error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
