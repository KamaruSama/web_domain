import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { action } = await request.json()
    const requestId = params.id

    // Validate action
    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'การดำเนินการไม่ถูกต้อง' }, { status: 400 })
    }

    // Find the renewal request
    const renewalRequest = await prisma.renewalRequest.findUnique({
      where: { id: requestId },
      include: {
        domain: {
          include: {
            domainRequest: true
          }
        }
      }
    })

    if (!renewalRequest) {
      return NextResponse.json({ error: 'ไม่พบคำขอต่ออายุ' }, { status: 404 })
    }

    // Check if user has permission
    if (session.user.role !== 'ADMIN' && renewalRequest.userId !== session.user.id) {
      return NextResponse.json({ error: 'คุณไม่มีสิทธิ์ในการดำเนินการนี้' }, { status: 403 })
    }

    // Only admin can approve/reject
    if (action === 'approve' || action === 'reject') {
      if (session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'เฉพาะผู้ดูแลระบบเท่านั้นที่สามารถอนุมัติหรือไม่อนุมัติคำขอได้' }, { status: 403 })
      }
    }

    // Check if request is still pending
    if (renewalRequest.status !== 'PENDING') {
      return NextResponse.json({ error: 'คำขอนี้ได้รับการดำเนินการแล้ว' }, { status: 400 })
    }

    if (action === 'approve') {
      // Update renewal request status
      await prisma.renewalRequest.update({
        where: { id: requestId },
        data: { 
          status: 'APPROVED',
          approvalCooldownAt: new Date(Date.now() + 60 * 60 * 1000) // 1 hour cooldown
        }
      })

      // Update domain request expiry date
      await prisma.domainRequest.update({
        where: { id: renewalRequest.domain.domainRequest.id },
        data: { expiresAt: renewalRequest.newExpiryDate }
      })

      // Update domain status if it was expired
      if (renewalRequest.domain.status === 'EXPIRED') {
        await prisma.domain.update({
          where: { id: renewalRequest.domainId },
          data: { status: 'ACTIVE' }
        })
      }

      return NextResponse.json({ 
        message: 'อนุมัติคำขอต่ออายุสำเร็จ',
        action: 'approved'
      })
    } else if (action === 'reject') {
      // Update renewal request status
      await prisma.renewalRequest.update({
        where: { id: requestId },
        data: { 
          status: 'REJECTED',
          approvalCooldownAt: new Date(Date.now() + 60 * 60 * 1000) // 1 hour cooldown
        }
      })

      return NextResponse.json({ 
        message: 'ไม่อนุมัติคำขอต่ออายุสำเร็จ',
        action: 'rejected'
      })
    }

  } catch (error) {
    console.error('Error updating renewal request:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const requestId = params.id

    // Find the renewal request
    const renewalRequest = await prisma.renewalRequest.findUnique({
      where: { id: requestId }
    })

    if (!renewalRequest) {
      return NextResponse.json({ error: 'ไม่พบคำขอต่ออายุ' }, { status: 404 })
    }

    // Check if user has permission
    if (session.user.role !== 'ADMIN' && renewalRequest.userId !== session.user.id) {
      return NextResponse.json({ error: 'คุณไม่มีสิทธิ์ในการลบคำขอนี้' }, { status: 403 })
    }

    // Only allow deletion of pending requests
    if (renewalRequest.status !== 'PENDING') {
      return NextResponse.json({ error: 'สามารถลบได้เฉพาะคำขอที่รอการพิจารณาเท่านั้น' }, { status: 400 })
    }

    // Delete the renewal request
    await prisma.renewalRequest.delete({
      where: { id: requestId }
    })

    return NextResponse.json({ 
      message: 'ลบคำขอต่ออายุสำเร็จ',
      action: 'deleted'
    })
  } catch (error) {
    console.error('Error deleting renewal request:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}