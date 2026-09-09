import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Lock } from 'lucide-react'
import { verifyAdmin } from '@/lib/auth/dal'
import { prisma } from '@/lib/prisma'
import { Breadcrumbs, Card, PageHeader } from '@/components/admin/ui'
import { ALL_ROLES } from '@/lib/admin'
import UserManager from './user-manager'

export const metadata: Metadata = { title: 'Users' }

export default async function AdminUsersPage() {
  const session = await verifyAdmin()
  if (!session) redirect('/admin/login')

  const isAdmin = session.role === 'SUPER_ADMIN'
  const roles = isAdmin ? (['SUPER_ADMIN', ...ALL_ROLES] as const) : ALL_ROLES

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'asc' },
    select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
  })

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'Users' }]} />
      <PageHeader
        title="User Management"
        description="Manage who can access the admin dashboard."
      />
      <Card>
        <div className="p-4">
          {isAdmin ? (
            <UserManager
              users={users.map((u) => ({
                id: u.id,
                name: u.name,
                email: u.email,
                role: u.role,
                active: u.isActive,
                createdAt: u.createdAt.toISOString(),
              }))}
              roles={[...roles]}
              isAdmin
            />
          ) : (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <Lock className="h-6 w-6 text-slate-400" />
              </span>
              <div>
                <p className="font-semibold text-navy-900">Restricted</p>
                <p className="mt-1 text-sm text-slate-500">
                  Only administrators can manage user accounts.
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}