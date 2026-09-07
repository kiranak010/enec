import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const SESSION_NAME = 'enec_session'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export interface SessionPayload {
  userId: string
  role: string
  expiresAt: string
}

function getEncodedKey() {
  const secret = process.env.SESSION_SECRET
  if (!secret) throw new Error('SESSION_SECRET env var is required')
  return new TextEncoder().encode(secret)
}

export async function encrypt(payload: SessionPayload) {
  return new SignJWT({ userId: payload.userId, role: payload.role, expiresAt: payload.expiresAt })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getEncodedKey())
}

export async function decrypt(session: string | undefined = '') {
  try {
    if (!session) return null
    const { payload } = await jwtVerify(session, getEncodedKey(), {
      algorithms: ['HS256'],
    })
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}

export async function createSession(userId: string, role: string) {
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000)
  const token = await encrypt({ userId, role, expiresAt: expiresAt.toISOString() })
  const cookieStore = await cookies()
  cookieStore.set(SESSION_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_NAME)?.value
  if (!token) return null
  const session = await decrypt(token)
  if (!session) return null
  if (new Date(session.expiresAt) < new Date()) return null
  return session
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_NAME)
}

export { SESSION_NAME }