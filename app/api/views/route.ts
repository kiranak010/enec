import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const VISITOR_COOKIE = 'enec_visitor'

// The public counter begins at 8,700,000 (87 lakh) and continues upward with
// real visits recorded in the database.
const VISITOR_BASE = 8_700_000

async function getVisitorCount() {
  try {
    return VISITOR_BASE + (await prisma.pageView.count())
  } catch {
    return VISITOR_BASE
  }
}

export async function GET() {
  const total = await getVisitorCount()
  return NextResponse.json({ total })
}

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const existing = cookieStore.get(VISITOR_COOKIE)?.value

  let path = '/'
  try {
    const body = (await request.json()) as { path?: string }
    if (body.path && typeof body.path === 'string') {
      path = body.path.slice(0, 500)
    }
  } catch {
    // ignore malformed body
  }

  try {
    // Only count a new visit when the visitor cookie is absent, so a single
    // unique browser session increments the counter once.
    if (!existing) {
      cookieStore.set(VISITOR_COOKIE, Date.now().toString(36), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        sameSite: 'lax',
        path: '/',
      })

      await prisma.pageView.create({
        data: {
          path,
          userAgent: request.headers.get('user-agent')?.slice(0, 500) ?? null,
        },
      })
    }
  } catch {
    // tracking must never break a page load
  }

  const total = await getVisitorCount()
  return NextResponse.json({ total })
}