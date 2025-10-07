import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Check if UserRole enum exists
    const enumCheck = await prisma.$queryRaw<any[]>`
      SELECT enumlabel 
      FROM pg_enum 
      WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'UserRole')
      ORDER BY enumsortorder
    `

    return NextResponse.json({
      success: true,
      enumExists: enumCheck.length > 0,
      enumValues: enumCheck.map(e => e.enumlabel)
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

