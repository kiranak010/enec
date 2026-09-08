import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { randomBytes } from 'crypto'

export const dynamic = 'force-dynamic'

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth'

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

  if (!clientId || !siteUrl) {
    const loginUrl = new URL('/admin/login', siteUrl ?? 'http://localhost:3000')
    loginUrl.searchParams.set('error', 'Google SSO is not configured. Please set GOOGLE_CLIENT_ID.')
    return NextResponse.redirect(loginUrl)
  }

  const state = randomBytes(24).toString('hex')
  const cookieStore = await cookies()
  cookieStore.set('enec_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 10,
    sameSite: 'lax',
    path: '/',
  })

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${siteUrl}/api/auth/google/callback`,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'online',
    prompt: 'select_account',
    state,
    include_granted_scopes: 'true',
  })

  return NextResponse.redirect(`${GOOGLE_AUTH_URL}?${params.toString()}`)
}