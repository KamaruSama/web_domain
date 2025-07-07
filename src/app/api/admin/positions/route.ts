import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const positions = await prisma.position.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(positions)
  } catch (error) {
    console.error('Error fetching positions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description } = body

    // Validate required fields
    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'ชื่อตำแหน่งจำเป็นต้องระบุ' }, { status: 400 })
    }

    // Check if position name already exists
    const existingPosition = await prisma.position.findUnique({
      where: { name: name.trim() }
    })

    if (existingPosition) {
      return NextResponse.json({ error: 'ชื่อตำแหน่งนี้มีอยู่แล้วในระบบ' }, { status: 400 })
    }

    // Create new position
    const newPosition = await prisma.position.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null
      }
    })

    return NextResponse.json(newPosition, { status: 201 })
  } catch (error) {
    console.error('Error creating position:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}