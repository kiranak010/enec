import { describe, it, expect, beforeAll } from 'vitest'
import { encrypt, decrypt } from '@/lib/auth/session'

beforeAll(() => {
  process.env.SESSION_SECRET = 'test-secret-long-enough-for-hs256-0000000000'
})

describe('session encrypt/decrypt', () => {
  it('round-trips a session payload', async () => {
    const expiresAt = new Date(Date.now() + 3600_000).toISOString()
    const token = await encrypt({
      userId: 'user-123',
      role: 'SUPER_ADMIN',
      expiresAt,
    })

    expect(token).toBeTruthy()
    expect(typeof token).toBe('string')

    const payload = await decrypt(token)
    expect(payload?.userId).toBe('user-123')
    expect(payload?.role).toBe('SUPER_ADMIN')
    expect(payload?.expiresAt).toBe(expiresAt)
  })

  it('returns null for a malformed token', async () => {
    const payload = await decrypt('not-a-real-token')
    expect(payload).toBeNull()
  })

  it('returns null for an empty/undefined token', async () => {
    expect(await decrypt('')).toBeNull()
    expect(await decrypt(undefined)).toBeNull()
  })

  it('rejects tokens signed with a different secret', async () => {
    const { SignJWT } = await import('jose')
    const otherSecret = new TextEncoder().encode('a-completely-different-key')
    const token = await new SignJWT({ userId: 'user-123', role: 'ADMIN' })
      .setProtectedHeader({ alg: 'HS256' })
      .sign(otherSecret)

    expect(await decrypt(token)).toBeNull()
  })

  it('rejects expired tokens', async () => {
    const expired = new Date(Date.now() - 3600_000).toISOString()
    const token = await encrypt({
      userId: 'user-123',
      role: 'ADMIN',
      expiresAt: expired,
    })
    const payload = await decrypt(token)
    expect(payload?.userId).toBe('user-123')
    expect(new Date(payload!.expiresAt).getTime()).toBeLessThan(Date.now())
  })
})