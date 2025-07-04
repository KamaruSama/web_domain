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

    const requests = await prisma.domainRequest.findMany({
      include: {
        user: {
          select: {
            username: true
          }
        }
      },
      orderBy: {
        requestedAt: 'desc'
      }
    })

    return NextResponse.json(requests)
  } catch (error) {
    console.error('Error fetching requests:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      domain,
      purpose,
      ipAddress,
      requesterName,
      responsibleName,
      department,
      contact,
      durationType,
      expiresAt
    } = body

    // Validate required fields
    if (!domain || !purpose || !ipAddress || !requesterName || !responsibleName || !department || !contact) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if domain already exists
    const existingDomain = await prisma.domainRequest.findFirst({
      where: {
        domain: domain.toLowerCase()
      }
    })

    if (existingDomain) {
      return NextResponse.json({ error: 'Domain already requested' }, { status: 400 })
    }

    const requestData: any = {
      domain: domain.toLowerCase(),
      purpose,
      ipAddress,
      requesterName,
      responsibleName,
      department,
      contact,
      durationType,
      userId: session.user.id
    }

    // Handle expiry date for temporary domains
    if (durationType === 'TEMPORARY') {
      if (!expiresAt) {
        return NextResponse.json({ error: 'Expiry date required for temporary domains' }, { status: 400 })
      }
      requestData.expiresAt = new Date(expiresAt)
    }

    const newRequest = await prisma.domainRequest.create({
      data: requestData,
      include: {
        user: {
          select: {
            username: true
          }
        }
      }
    })

    return NextResponse.json(newRequest, { status: 201 })
  } catch (error) {
    console.error('Error creating request:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
