import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  try {
    console.log('=== TEST API: Starting simple renewal requests fetch ===')
    
    // Simple query without authentication
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
    
    return NextResponse.json({
      success: true,
      count: renewalRequests.length,
      data: renewalRequests
    })
    
  } catch (error) {
    console.error('=== ERROR in test-renewal-requests ===')
    if (error instanceof Error) {
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
      
      return NextResponse.json({ 
        error: 'Internal server error',
        details: error.message,
        type: error.name,
        stack: error.stack
      }, { status: 500 })
    } else {
      console.error('An unknown error occurred:', error)
      return NextResponse.json({ 
        error: 'Internal server error',
        details: 'An unknown error occurred'
      }, { status: 500 })
    }
  }
}
