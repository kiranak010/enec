import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  const started = Date.now()
  try {
    const users = await prisma.user.count()
    return NextResponse.json({
      db: 'ok',
      users,
      ms: Date.now() - started,
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown database error'
    const code = (error as { code?: string })?.code ?? 'UNKNOWN'
    return NextResponse.json(
      {
        db: 'error',
        ms: Date.now() - started,
        code,
        message: message.split('\n')[0],
      },
      { status: 500 }
    )
  }
}