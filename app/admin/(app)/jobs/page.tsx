import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus, Pencil, Calendar } from 'lucide-react'
import { redirect } from 'next/navigation'
import { verifyAdmin } from '@/lib/auth/dal'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { Breadcrumbs, Card, StatusBadge, PageHeader, EmptyState, Table } from '@/components/admin/ui'
import { DeleteButton } from '@/components/admin/client'
import { pretty, badgeTone } from '@/lib/admin'
import { deleteJob } from '@/app/admin/actions'

export const metadata: Metadata = { title: 'Jobs' }

export default async function AdminJobsPage() {
  const session = await verifyAdmin()
  if (!session) redirect('/admin/login')

  const jobs = await prisma.job.findMany({
    orderBy: { updatedAt: 'desc' },
    include: { _count: { select: { applications: true } } },
  })

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'Jobs' }]} />
      <PageHeader
        title="Jobs"
        description="Manage career openings published to the careers page."
        action={
          <Link
            href="/admin/jobs/new"
            className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-cyan-500/25 transition-colors hover:bg-cyan-600"
          >
            <Plus className="h-4 w-4" />
            New Job
          </Link>
        }
      />

      <Card>
        {jobs.length === 0 ? (
          <EmptyState
            title="No jobs published"
            description="Create an opening to start collecting applications."
            action={
              <Link
                href="/admin/jobs/new"
                className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-cyan-600"
              >
                <Plus className="h-4 w-4" />
                New Job
              </Link>
            }
          />
        ) : (
          <Table headers={['Title', 'Department', 'Location', 'Type', 'Status', 'Applications', 'Posted', 'Actions']}>
            {jobs.map((job) => (
              <tr key={job.id} className="transition-colors hover:bg-slate-50">
                <td className="max-w-[230px] px-4 py-3">
                  <p className="truncate font-semibold text-navy-900">{job.title}</p>
                  <p className="truncate text-xs text-slate-400">/{job.slug}</p>
                </td>
                <td className="px-4 py-3 text-slate-500">{job.department}</td>
                <td className="px-4 py-3 text-slate-500">{job.location}</td>
                <td className="px-4 py-3 text-slate-500">{pretty(job.employmentType)}</td>
                <td className="px-4 py-3">
                  <StatusBadge label={pretty(job.status)} tone={badgeTone(job.status)} />
                </td>
                <td className="px-4 py-3 text-slate-500">{job._count.applications}</td>
                <td className="px-4 py-3 text-slate-500">
                  {job.publishedAt ? formatDate(job.publishedAt) : '—'}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/admin/jobs/new?id=${job.id}`}
                      className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-navy-900"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </Link>
                    <DeleteButton
                      action={deleteJob}
                      id={job.id}
                      confirmText={`Delete the job "${job.title}" and its applications? This cannot be undone.`}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      {jobs.length > 0 ? (
        <p className="mt-4 flex items-center gap-2 text-xs text-slate-400">
          <Calendar className="h-3.5 w-3.5" />
          {jobs.length} opening{jobs.length === 1 ? '' : 's'}
        </p>
      ) : null}
    </div>
  )
}