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

    // Delete the domain and its request
    await prisma.domain.delete({
      where: { id: domainId }
    })

    // Log the deletion
    await prisma.deletedDomainLog.create({
      data: {
        domainName: domain.domainRequest.domain,
        reason: 'Deleted by admin'
      }
    })

    return NextResponse.json({ message: 'Domain deleted successfully' })
  } catch (error) {
    console.error('Domain deletion error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}