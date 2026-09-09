import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Search, ScrollText } from 'lucide-react'
import { verifyAdmin } from '@/lib/auth/dal'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { pretty } from '@/lib/admin'
import { Breadcrumbs, Card, PageHeader, EmptyState, StatusBadge } from '@/components/admin/ui'

export const metadata: Metadata = { title: 'Audit Logs' }

export const PAGE_SIZE = 50

function actionTone(action: string): 'green' | 'amber' | 'red' | 'cyan' {
  const normalized = action.toLowerCase()
  if (normalized.includes('delete') || normalized.includes('remove')) return 'red'
  if (normalized.includes('create') || normalized.includes('upload')) return 'green'
  if (normalized.includes('update') || normalized.includes('change')) return 'amber'
  return 'cyan'
}

export default async function AdminAuditLogsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; action?: string; resource?: string; page?: string }>
}) {
  const session = await verifyAdmin()
  if (!session) redirect('/admin/login')

  const { q, action, resource, page } = await searchParams

  const where = {
    AND: [
      action ? { action: { contains: action } } : {},
      resource ? { resource: { contains: resource } } : {},
      q
        ? {
            OR: [
              { actor: { contains: q } },
              { resourceId: { contains: q } },
              { metadata: { contains: q } },
              { ip: { contains: q } },
            ],
          }
        : {},
    ],
  }

  const currentPage = Math.max(1, Number(page) || 1)
  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.auditLog.count({ where }),
  ])

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const resources = await prisma.auditLog.findMany({
    distinct: ['resource'],
    select: { resource: true },
    orderBy: { resource: 'asc' },
  })

  const rangeStart = total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1
  const rangeEnd = Math.min(total, currentPage * PAGE_SIZE)

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'Audit Logs' }]} />
      <PageHeader
        title="Audit Logs"
        description={`${total.toLocaleString()} recorded ${total === 1 ? 'action' : 'actions'} across the dashboard.`}
      />

      <Card className="mb-6 p-4">
        <form method="get" className="flex flex-wrap items-end gap-3">
          <div className="min-w-[200px] flex-1">
            <label htmlFor="audit-q" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Search
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="audit-q"
                name="q"
                type="search"
                defaultValue={q ?? ''}
                placeholder="Actor, resource ID, IP…"
                className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
              />
            </div>
          </div>
          <div>
            <label htmlFor="audit-action" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Action
            </label>
            <input
              id="audit-action"
              name="action"
              type="text"
              defaultValue={action ?? ''}
              placeholder="create, update, delete…"
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
            />
          </div>
          <div>
            <label htmlFor="audit-resource" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Resource
            </label>
            <select
              id="audit-resource"
              name="resource"
              defaultValue={resource ?? ''}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
            >
              <option value="">All resources</option>
              {resources.map((r) => (
                <option key={r.resource} value={r.resource}>
                  {pretty(r.resource)}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="rounded-lg bg-slate-800 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
          >
            Filter
          </button>
        </form>
      </Card>

      {logs.length === 0 ? (
        <Card>
          <EmptyState
            title="No audit log entries found"
            description="Every admin action will be recorded here for accountability."
          />
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <th className="px-5 py-3">When</th>
                  <th className="px-5 py-3">Actor</th>
                  <th className="px-5 py-3">Action</th>
                  <th className="px-5 py-3">Resource</th>
                  <th className="px-5 py-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log.id} className="align-top transition-colors hover:bg-slate-50">
                    <td className="whitespace-nowrap px-5 py-3 text-xs text-slate-500">
                      {formatDate(log.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-sm font-semibold text-navy-900">
                      {log.actor ?? 'System'}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge label={pretty(log.action)} tone={actionTone(log.action)} />
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-600">
                      {pretty(log.resource)}
                      {log.resourceId ? (
                        <span className="ml-1.5 font-mono text-xs text-slate-400">#{log.resourceId}</span>
                      ) : null}
                    </td>
                    <td className="max-w-[280px] px-5 py-3">
                      {log.metadata && log.metadata !== '{}' ? (
                        <details className="group">
                          <summary className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-cyan-600 hover:underline">
                            <ScrollText className="h-3.5 w-3.5" />
                            View details
                          </summary>
                          <pre className="mt-2 max-h-40 overflow-auto rounded-lg bg-slate-50 p-3 font-mono text-[11px] leading-relaxed text-slate-700">
                            {JSON.stringify(JSON.parse(log.metadata), null, 2)}
                          </pre>
                        </details>
                      ) : (
                        <span className="text-xs text-slate-300">—</span>
                      )}
                      {log.ip ? <span className="mt-0.5 block text-xs text-slate-400">IP {log.ip}</span> : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3">
            <p className="text-xs text-slate-500">
              Showing {rangeStart}–{rangeEnd} of {total.toLocaleString()}
            </p>
            {totalPages > 1 ? (
              <div className="flex items-center gap-2">
                <a
                  href={`/admin/audit-logs?${new URLSearchParams({
                    ...(q ? { q } : {}),
                    ...(action ? { action } : {}),
                    ...(resource ? { resource } : {}),
                    ...(currentPage > 1 ? { page: String(currentPage - 1) } : {}),
                  }).toString()}`}
                  className={`rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 ${
                    currentPage <= 1 ? 'pointer-events-none opacity-40' : ''
                  }`}
                >
                  Previous
                </a>
                <span className="text-xs font-semibold text-slate-600">
                  Page {currentPage} of {totalPages}
                </span>
                <a
                  href={`/admin/audit-logs?${new URLSearchParams({
                    ...(q ? { q } : {}),
                    ...(action ? { action } : {}),
                    ...(resource ? { resource } : {}),
                    ...(currentPage < totalPages ? { page: String(currentPage + 1) } : {}),
                  }).toString()}`}
                  className={`rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 ${
                    currentPage >= totalPages ? 'pointer-events-none opacity-40' : ''
                  }`}
                >
                  Next
                </a>
              </div>
            ) : null}
          </div>
        </Card>
      )}
    </div>
  )
}