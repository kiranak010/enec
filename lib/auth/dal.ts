import 'server-only'
import { cache } from 'react'
import { cookies } from 'next/headers'
import { decrypt } from './session'
import { prisma } from '../prisma'
import { type Role } from '@prisma/client'

export interface SessionUser {
  userId: string
  role: Role
}

export const verifySession = cache(async (): Promise<SessionUser | null> => {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('enec_session')?.value
    if (!token) return null

    const payload = await decrypt(token)
    if (!payload?.userId || !payload?.role) return null

    return {
      userId: payload.userId,
      role: payload.role as Role,
    }
  } catch {
    return null
  }
})

export const verifyAdmin = cache(async (): Promise<SessionUser | null> => {
  const session = await verifySession()
  if (!session) return null
  const allowed: Role[] = ['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'HR_MANAGER', 'MEDIA_MANAGER', 'ANALYST', 'VIEWER']
  if (!allowed.includes(session.role)) return null
  return session
})

export const getUser = cache(async () => {
  const session = await verifySession()
  if (!session) return null

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatarUrl: true,
      lastLoginAt: true,
    },
  })

  return user
})

export function hasPermission(role: Role, permission: string): boolean {
  const permissions: Record<Role, string[]> = {
    SUPER_ADMIN: ['*'],
    ADMIN: ['pages:*', 'news:*', 'projects:*', 'leadership:*', 'documents:*', 'media:*', 'sustainability:*', 'messages:*', 'applications:*', 'users:read'],
    EDITOR: ['pages:edit', 'news:edit', 'projects:edit', 'leadership:edit', 'documents:read', 'media:read'],
    HR_MANAGER: ['jobs:*', 'applications:*'],
    MEDIA_MANAGER: ['news:edit', 'media:*', 'documents:*', 'press:*'],
    ANALYST: ['pages:read', 'news:read', 'projects:read', 'analytics:read'],
    VIEWER: [],
  }

  const rolePerms = permissions[role] || []
  if (rolePerms.includes('*')) return true

  return rolePerms.some((p) => {
    if (p.endsWith(':*')) {
      const prefix = p.slice(0, -2)
      return permission.startsWith(prefix + ':') || permission === prefix
    }
    return p === permission
  })
}

export function canAccessAdmin(role: Role): boolean {
  return ['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'HR_MANAGER', 'MEDIA_MANAGER', 'ANALYST', 'VIEWER'].includes(role)
}

export function canManageContent(role: Role): boolean {
  return ['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(role)
}