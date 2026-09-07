import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const newsletterSchema = z.object({
  email: z.string().trim().email(),
})

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
  }

  const parsed = newsletterSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'A valid email address is required.' }, { status: 400 })
  }

  try {
    await prisma.newsletterSubscription.upsert({
      where: { email: parsed.data.email },
      update: {},
      create: { email: parsed.data.email },
    })
  } catch {
    return NextResponse.json({ ok: false, error: 'Could not subscribe. Please try again.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}