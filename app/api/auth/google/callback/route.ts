import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { createSession } from '@/lib/auth/session'
import { logAudit } from '@/lib/audit'
import { canAccessAdmin } from '@/lib/auth/dal'

export const dynamic = 'force-dynamic'

const TOKEN_URL = 'https://oauth2.googleapis.com/token'
const USERINFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo'

async function exchangeCode(code: string): Promise<{ access_token: string }> {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

  const body = new URLSearchParams({
    code,
    client_id: clientId ?? '',
    client_secret: clientSecret ?? '',
    redirect_uri: `${siteUrl ?? ''}/api/auth/google/callback`,
    grant_type: 'authorization_code',
  })

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })

  if (!res.ok) throw new Error('Token exchange failed')
  return (await res.json()) as { access_token: string }
}

async function getUserInfo(accessToken: string): Promise<{ email: string; name: string; picture?: string }> {
  const res = await fetch(USERINFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!res.ok) throw new Error('Userinfo failed')
  return (await res.json()) as { email: string; name: string; picture?: string }
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const error = url.searchParams.get('error')

  const cookieStore = await cookies()
  const storedState = cookieStore.get('enec_oauth_state')?.value
  cookieStore.delete('enec_oauth_state')

  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const loginUrl = new URL('/admin/login', base)

  if (error || !code || !state || state !== storedState) {
    loginUrl.searchParams.set('error', 'Google sign in was cancelled or failed. Please try again.')
    return NextResponse.redirect(loginUrl)
  }

  try {
    const { access_token } = await exchangeCode(code)
    const googleUser = await getUserInfo(access_token)
    const email = googleUser.email?.toLowerCase()

    if (!email) {
      loginUrl.searchParams.set('error', 'Google did not return an email address.')
      return NextResponse.redirect(loginUrl)
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.isActive || !canAccessAdmin(user.role)) {
      loginUrl.searchParams.set('error', 'Your Google account is not authorized to access this portal.')
      return NextResponse.redirect(loginUrl)
    }

    await createSession(user.id, user.role)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        avatarUrl: user.avatarUrl ?? googleUser.picture ?? null,
      },
    })
    await logAudit({
      userId: user.id,
      actor: user.name,
      action: 'LOGIN',
      resource: 'Session',
      metadata: { method: 'google-sso' },
    })

    return NextResponse.redirect(new URL('/admin/dashboard', base))
  } catch {
    loginUrl.searchParams.set('error', 'Could not complete Google sign in. Please try again.')
    return NextResponse.redirect(loginUrl)
  }
}