import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { verifyAdmin, getUser } from '@/lib/auth/dal'
import AdminShell from '@/components/admin/admin-shell'

export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s | Admin' },
  robots: { index: false, follow: false },
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await verifyAdmin()
  if (!session) redirect('/admin/login')

  const user = await getUser()

  return (
    <AdminShell
      user={{
        name: user?.name ?? 'Administrator',
        email: user?.email ?? '',
        avatarUrl: user?.avatarUrl ?? null,
      }}
      role={session.role}
    >
      {children}
    </AdminShell>
  )
}