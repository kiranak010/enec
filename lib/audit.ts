import 'server-only'
import { prisma } from '@/lib/prisma'

export interface AuditInput {
  userId?: string | null
  actor?: string | null
  action: string
  resource: string
  resourceId?: string | null
  metadata?: Record<string, unknown> | null
  ip?: string | null
}

/**
 * Writes an entry to the audit log. Failures are swallowed so that
 * audit logging never breaks the primary operation it accompanies.
 */
export async function logAudit(input: AuditInput) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: input.userId ?? null,
        actor: input.actor ?? null,
        action: input.action,
        resource: input.resource,
        resourceId: input.resourceId ?? null,
        metadata: input.metadata ? JSON.stringify(input.metadata) : null,
        ip: input.ip ?? null,
      },
    })
  } catch {
    // no-op
  }
}