import { beforeAll, afterAll, vi } from 'vitest'

// Tests must not create real sessions with the HTTP cookie jar.
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
  })),
  headers: vi.fn(() => new Headers()),
}))

// Server-only modules resolve to empty exports in the test (node) runtime.
vi.mock('server-only', () => ({}))

beforeAll(() => {
  process.env.SESSION_SECRET =
    'test-secret-that-is-long-enough-for-hs256-signing-1234567890'
  process.env.DATABASE_URL = process.env.DATABASE_URL ?? 'file:./dev.db'
})

afterAll(() => {})