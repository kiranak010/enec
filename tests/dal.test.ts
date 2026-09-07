import { describe, it, expect } from 'vitest'
import { hasPermission, canAccessAdmin, canManageContent } from '@/lib/auth/dal'

describe('hasPermission', () => {
  it('grants everything to SUPER_ADMIN', () => {
    expect(hasPermission('SUPER_ADMIN', 'anything:whatever')).toBe(true)
    expect(hasPermission('SUPER_ADMIN', 'users:delete')).toBe(true)
  })

  it('grants namespace wildcards', () => {
    expect(hasPermission('ADMIN', 'news:create')).toBe(true)
    expect(hasPermission('ADMIN', 'news:delete')).toBe(true)
    expect(hasPermission('HR_MANAGER', 'jobs:create')).toBe(true)
    expect(hasPermission('HR_MANAGER', 'applications:read')).toBe(true)
  })

  it('denies outside the granted namespace', () => {
    expect(hasPermission('HR_MANAGER', 'pages:edit')).toBe(false)
    expect(hasPermission('EDITOR', 'users:read')).toBe(false)
  })

  it('respects per-feature grants', () => {
    expect(hasPermission('EDITOR', 'news:edit')).toBe(true)
    expect(hasPermission('EDITOR', 'news:delete')).toBe(false)
    expect(hasPermission('MEDIA_MANAGER', 'media:delete')).toBe(true)
    expect(hasPermission('ANALYST', 'analytics:read')).toBe(true)
    expect(hasPermission('ANALYST', 'media:read')).toBe(false)
  })

  it('allows exact feature permissions', () => {
    expect(hasPermission('ADMIN', 'users:read')).toBe(true)
    expect(hasPermission('ADMIN', 'users:write')).toBe(false)
  })

  it('denies everything for VIEWER', () => {
    expect(hasPermission('VIEWER', 'pages:read')).toBe(false)
    expect(hasPermission('VIEWER', '*')).toBe(false)
  })

  it('is safe for unknown roles', () => {
    expect(hasPermission('GUEST' as never, 'pages:read')).toBe(false)
  })
})

describe('canAccessAdmin', () => {
  it('allows admin-capable roles', () => {
    for (const role of ['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'HR_MANAGER', 'MEDIA_MANAGER', 'ANALYST', 'VIEWER']) {
      expect(canAccessAdmin(role as never)).toBe(true)
    }
  })
})

describe('canManageContent', () => {
  it('only SUPER_ADMIN, ADMIN, EDITOR manage content', () => {
    expect(canManageContent('SUPER_ADMIN')).toBe(true)
    expect(canManageContent('ADMIN')).toBe(true)
    expect(canManageContent('EDITOR')).toBe(true)
    expect(canManageContent('HR_MANAGER')).toBe(false)
    expect(canManageContent('VIEWER')).toBe(false)
  })
})