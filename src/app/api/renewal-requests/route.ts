import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Admin can see all renewal requests, regular users can only see their own
    const whereClause = session.user.role === 'ADMIN' ? {} : { userId: session.user.id }

    const renewalRequests = await prisma.renewalRequest.findMany({
      where: whereClause,
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
      orderBy: {
        requestedAt: 'desc'
      }
    })

    return NextResponse.json(renewalRequests)
  } catch (error) {
    console.error('Error fetching renewal requests:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { domainId, newExpiryDate, reason } = await request.json()

    // Validate input
    if (!domainId || !newExpiryDate) {
      return NextResponse.json({ error: 'กรุณาระบุข้อมูลให้ครบถ้วน' }, { status: 400 })
    }

    // Check if domain exists
    const domain = await prisma.domain.findUnique({
      where: { id: domainId },
      include: {
        domainRequest: true
      }
    })

    if (!domain) {
      return NextResponse.json({ error: 'ไม่พบโดเมนที่ระบุ' }, { status: 404 })
    }

    // Check if user has permission to renew this domain
    if (session.user.role !== 'ADMIN' && domain.domainRequest.userId !== session.user.id) {
      return NextResponse.json({ error: 'คุณไม่มีสิทธิ์ในการต่ออายุโดเมนนี้' }, { status: 403 })
    }

    // Skip permanent domain check - allow renewal for all domains now
    // Previously: Check if domain is temporary
    // if (domain.domainRequest.durationType !== 'TEMPORARY') {
    //   return NextResponse.json({ error: 'สามารถต่ออายุได้เฉพาะโดเมนชั่วคราวเท่านั้น' }, { status: 400 })
    // }

    // Validate expiry date
    const expiryDate = new Date(newExpiryDate)
    if (expiryDate <= new Date()) {
      return NextResponse.json({ error: 'วันหมดอายุใหม่ต้องเป็นวันที่ในอนาคต' }, { status: 400 })
    }

    // Check if there's already a pending renewal request for this domain
    const existingRequest = await prisma.renewalRequest.findFirst({
      where: {
        domainId: domainId,
        status: 'PENDING'
      }
    })

    if (existingRequest) {
      return NextResponse.json({ error: 'มีคำขอต่ออายุสำหรับโดเมนนี้รอการพิจารณาอยู่แล้ว' }, { status: 400 })
    }

    // Create renewal request
    const renewalRequest = await prisma.renewalRequest.create({
      data: {
        domainId: domainId,
        newExpiryDate: expiryDate,
        reason: reason || null,
        userId: session.user.id
      },
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
      }
    })

    return NextResponse.json(renewalRequest, { status: 201 })
  } catch (error) {
    console.error('Error creating renewal request:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}