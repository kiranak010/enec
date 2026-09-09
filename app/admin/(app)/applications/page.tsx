import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { verifyAdmin } from '@/lib/auth/dal'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { Breadcrumbs, Card, StatusBadge, PageHeader, EmptyState, Table } from '@/components/admin/ui'
import { pretty, badgeTone } from '@/lib/admin'
import { APPLICATION_STATUSES } from '@/lib/admin'
import ApplicationStatusSelect from './status-select'

export const metadata: Metadata = { title: 'Applications' }

export default async function AdminApplicationsPage() {
  const session = await verifyAdmin()
  if (!session) redirect('/admin/login')

  const applications = await prisma.jobApplication.findMany({
    orderBy: { createdAt: 'desc' },
    include: { job: { select: { title: true } } },
  })

  const counts = Object.fromEntries(
    APPLICATION_STATUSES.map((status) => [
      status,
      applications.filter((a) => a.status === status).length,
    ])
  )

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'Applications' }]} />
      <PageHeader
        title="Applications"
        description="Candidates who have applied to career openings."
      />

      <div className="mb-6 flex flex-wrap items-center gap-2">
        {APPLICATION_STATUSES.map((status) => (
          <span
            key={status}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-3 text-xs font-medium shadow-sm"
          >
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-navy-900">
              {counts[status] ?? 0}
            </span>
            {pretty(status)}
          </span>
        ))}
      </div>

      <Card>
        {applications.length === 0 ? (
          <EmptyState
            title="No applications yet"
            description="Applications from the careers site will appear here."
          />
        ) : (
          <Table headers={['Applicant', 'Email', 'Job Title', 'Status', 'Phone', 'Date']}>
            {applications.map((app) => (
              <tr key={app.id} className="transition-colors hover:bg-slate-50">
                <td className="px-4 py-3 font-semibold text-navy-900">{app.applicantName}</td>
                <td className="px-4 py-3 text-slate-500">{app.email}</td>
                <td className="px-4 py-3 text-slate-500">{app.job.title}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <StatusBadge label={pretty(app.status)} tone={badgeTone(app.status)} />
                    <ApplicationStatusSelect id={app.id} status={app.status} />
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-500">{app.phone ?? '—'}</td>
                <td className="px-4 py-3 text-slate-500">{formatDate(app.createdAt)}</td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
    </div>
  )
}