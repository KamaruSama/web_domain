import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    console.log('=== DEBUG: Database check endpoint ===')
    
    // Check if tables exist using raw SQL
    const tables = await prisma.$queryRaw`
      SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;
    `
    
    console.log('Available tables:', tables)
    
    // Try to get table schema for renewal_requests
    const renewalSchema = await prisma.$queryRaw`
      PRAGMA table_info(renewal_requests);
    `
    
    console.log('renewal_requests schema:', renewalSchema)
    
    // Try direct SQL query
    const directCount = await prisma.$queryRaw`
      SELECT COUNT(*) as count FROM renewal_requests;
    `
    
    console.log('Direct count result:', directCount)
    
    return NextResponse.json({
      success: true,
      tables,
      renewalSchema,
      directCount
    })
    
  } catch (error) {
    console.error('Database check error:', error)
    return NextResponse.json({
      error: (error as Error).message,
      type: (error as Error).name,
      stack: (error as Error).stack
    }, { status: 500 })
  }
}
