import type { Metadata } from 'next'
import { Megaphone, Pin } from 'lucide-react'
import { redirect } from 'next/navigation'
import { verifyEmployeeSession } from '@/lib/auth/employee-dal'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { Card, PageHeader, Breadcrumbs } from '@/components/admin/ui'

export const metadata: Metadata = { title: 'Announcements' }

export default async function EmployeeAnnouncementsPage() {
  const session = await verifyEmployeeSession()
  if (!session) redirect('/portal/login')

  const announcements = await prisma.announcement.findMany({
    where: { isActive: true, audience: { in: ['ALL', 'EMPLOYEE'] } },
    orderBy: [{ pinned: 'desc' }, { createdAt: 'desc' }],
  })

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Portal', href: '/portal' }, { label: 'Announcements' }]} />
      <PageHeader
        title="Announcements"
        description="The latest news and updates from across the organization."
      />

      <div className="space-y-4">
        {announcements.length === 0 ? (
          <Card>
            <p className="px-6 py-16 text-center text-sm text-slate-400">
              No announcements right now.
            </p>
          </Card>
        ) : (
          announcements.map((item) => (
            <Card key={item.id}>
              <div className="p-6">
                <div className="flex items-center gap-2">
                  {item.pinned ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 ring-1 ring-inset ring-amber-600/30">
                      <Pin className="h-3 w-3" />
                      Pinned
                    </span>
                  ) : (
                    <Megaphone className="h-4 w-4 text-cyan-500" />
                  )}
                  <time className="text-xs text-slate-400">{formatDate(item.createdAt)}</time>
                </div>
                <h2 className="mt-3 text-lg font-bold text-navy-900">{item.title}</h2>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-600">
                  {item.body}
                </p>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}