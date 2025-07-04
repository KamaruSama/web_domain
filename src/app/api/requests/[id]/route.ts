import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action } = body

    if (action === 'approve' || action === 'reject') {
      // Only admin can approve/reject
      if (session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }

      const domainRequest = await prisma.domainRequest.findUnique({
        where: { id: params.id }
      })

      if (!domainRequest) {
        return NextResponse.json({ error: 'Request not found' }, { status: 404 })
      }

      const status = action === 'approve' ? 'APPROVED' : 'REJECTED'
      
      // Set cooldown time (60 minutes from now)
      const cooldownTime = new Date(Date.now() + 60 * 60 * 1000)

      const updatedRequest = await prisma.domainRequest.update({
        where: { id: params.id },
        data: {
          status,
          approvalCooldownAt: cooldownTime
        }
      })

      // If approved, create domain record
      if (action === 'approve') {
        await prisma.domain.create({
          data: {
            domainRequestId: params.id,
            status: 'ACTIVE',
            lastUsedAt: new Date()
          }
        })
      }

      return NextResponse.json(updatedRequest)
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error updating request:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const domainRequest = await prisma.domainRequest.findUnique({
      where: { id: params.id }
    })

    if (!domainRequest) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 })
    }

    // Check if user owns this request or is admin
    if (domainRequest.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Delete domain record if exists
    await prisma.domain.deleteMany({
      where: { domainRequestId: params.id }
    })

    // Delete request
    await prisma.domainRequest.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Request deleted successfully' })
  } catch (error) {
    console.error('Error deleting request:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
