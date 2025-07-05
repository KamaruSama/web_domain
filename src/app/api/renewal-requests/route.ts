import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    console.log('=== DEBUG: Starting GET /api/renewal-requests ===')
    
    const session = await getServerSession(authOptions)
    console.log('Session:', session ? 'Found' : 'Not found')
    
    if (!session) {
      console.log('No session, returning 401')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if this is for my-tickets page (get only user's requests)
    const url = new URL(request.url)
    const my = url.searchParams.get('my')
    console.log('MY parameter:', my)
    console.log('User role:', session.user.role)

    // If 'my' parameter is present, filter by user. Otherwise, admin sees all.
    let whereClause = {}
    
    if (my === 'true' || session.user.role !== 'ADMIN') {
      // Regular users or when specifically requested, show only own requests
      whereClause = { userId: session.user.id }
      console.log('Using user filter, userId:', session.user.id)
    } else {
      console.log('Admin view, no user filter')
    }
    // Admin without 'my' parameter sees all requests (for renewal-management page)

    console.log('Where clause:', whereClause)
    console.log('About to query prisma.renewalRequest.findMany...')

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

    console.log('Successfully fetched renewal requests. Count:', renewalRequests.length)
    return NextResponse.json(renewalRequests)
    
  } catch (error) {
    console.error('=== ERROR in GET /api/renewal-requests ===')
    console.error('Error name:', error.name)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    console.error('Full error object:', error)
    
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message,
      type: error.name
    }, { status: 500 })
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