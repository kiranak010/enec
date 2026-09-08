import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const EMPLOYEE_SESSION_NAME = 'enec_employee_session'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export interface EmployeeSessionPayload {
  employeeId: string
  role: string
  expiresAt: string
}

function getEncodedKey() {
  const secret = process.env.SESSION_SECRET
  if (!secret) throw new Error('SESSION_SECRET env var is required')
  return new TextEncoder().encode(secret)
}

export async function encryptEmployeeSession(payload: EmployeeSessionPayload) {
  return new SignJWT({
    employeeId: payload.employeeId,
    role: payload.role,
    expiresAt: payload.expiresAt,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getEncodedKey())
}

export async function decryptEmployeeSession(
  session: string | undefined = ''
): Promise<EmployeeSessionPayload | null> {
  try {
    if (!session) return null
    const { payload } = await jwtVerify(session, getEncodedKey(), {
      algorithms: ['HS256'],
    })
    return payload as unknown as EmployeeSessionPayload
  } catch {
    return null
  }
}

export async function createEmployeeSession(employeeId: string, role: string) {
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000)
  const token = await encryptEmployeeSession({
    employeeId,
    role,
    expiresAt: expiresAt.toISOString(),
  })
  const cookieStore = await cookies()
  cookieStore.set(EMPLOYEE_SESSION_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

export async function getEmployeeSession(): Promise<EmployeeSessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(EMPLOYEE_SESSION_NAME)?.value
  if (!token) return null
  const session = await decryptEmployeeSession(token)
  if (!session) return null
  if (new Date(session.expiresAt) < new Date()) return null
  return session
}

export async function deleteEmployeeSession() {
  const cookieStore = await cookies()
  cookieStore.delete(EMPLOYEE_SESSION_NAME)
}

export { EMPLOYEE_SESSION_NAME }