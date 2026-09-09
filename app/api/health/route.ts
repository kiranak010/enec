import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

function stripSecrets(value: string): string {
  return value.replace(/\/\/[^:@/]+:[^@/]+@/, '//***:***@')
}

export async function GET() {
  const started = Date.now()
  const hostInUse = stripSecrets(String(process.env.DATABASE_URL ?? '(unset)'))
  try {
    const users = await prisma.user.count()
    return NextResponse.json({
      db: 'ok',
      users,
      ms: Date.now() - started,
    })
  } catch (error) {
    const detail: Record<string, unknown> = {}
    for (const key of [
      'code',
      'name',
      'meta',
      'clientVersion',
      'target',
    ] as const) {
      const value = (error as Record<string, unknown>)[key]
      if (value !== undefined) detail[key] = value
    }
    const cause =
      error && typeof error === 'object' && 'cause' in error
        ? (error as { cause?: unknown }).cause
        : undefined
    detail.cause =
      typeof cause === 'string'
        ? stripSecrets(cause)
        : cause && typeof cause === 'object'
          ? JSON.stringify(cause).slice(0, 500)
          : null
    detail.message =
      error instanceof Error ? error.message.split('\n')[0] : 'unknown'
    return NextResponse.json(
      {
        db: 'error',
        ms: Date.now() - started,
        hostInUse,
        detail,
      },
      { status: 500 }
    )
  }
}