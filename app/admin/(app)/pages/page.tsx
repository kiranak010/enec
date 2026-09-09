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
import { PAGE_STATUSES } from '@/lib/admin'
import { deletePage } from '@/app/admin/actions'

export const metadata: Metadata = { title: 'Pages' }

export default async function AdminPagesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const session = await verifyAdmin()
  if (!session) redirect('/admin/login')

  const { status } = await searchParams
  const filter = status && PAGE_STATUSES.includes(status as (typeof PAGE_STATUSES)[number]) ? status : undefined

  const pages = await prisma.page.findMany({
    where: filter ? { status: filter as never } : {},
    orderBy: { updatedAt: 'desc' },
    include: { author: { select: { name: true } } },
  })

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'Pages' }]} />
      <PageHeader
        title="Pages"
        description="Manage static CMS pages across the site."
        action={
          <Link
            href="/admin/pages/new"
            className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-cyan-500/25 transition-colors hover:bg-cyan-600"
          >
            <Plus className="h-4 w-4" />
            New Page
          </Link>
        }
      />

      <Card>
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 px-4 py-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Status filter
          </span>
          <form method="get" className="flex items-center gap-2">
            <select
              name="status"
              defaultValue={filter ?? 'ALL'}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
            >
              <option value="ALL">All statuses</option>
              {PAGE_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {pretty(s)}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="rounded-lg bg-slate-800 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
            >
              Apply
            </button>
          </form>
        </div>

        {pages.length === 0 ? (
          <EmptyState
            title="No pages found"
            description={
              filter
                ? 'No pages match the selected status filter.'
                : 'Create your first page to start building the site.'
            }
            action={
              <Link
                href="/admin/pages/new"
                className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-cyan-600"
              >
                <Plus className="h-4 w-4" />
                New Page
              </Link>
            }
          />
        ) : (
          <Table headers={['Title', 'Slug', 'Status', 'Updated', 'Updated by', 'Actions']}>
            {pages.map((page) => (
              <tr key={page.id} className="transition-colors hover:bg-slate-50">
                <td className="px-4 py-3 font-semibold text-navy-900">{page.title}</td>
                <td className="px-4 py-3 text-slate-500">/{page.slug}</td>
                <td className="px-4 py-3">
                  <StatusBadge label={pretty(page.status)} tone={badgeTone(page.status)} />
                </td>
                <td className="px-4 py-3 text-slate-500">{formatDate(page.updatedAt)}</td>
                <td className="px-4 py-3 text-slate-500">{page.author?.name ?? '—'}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/admin/pages/new?id=${page.id}`}
                      className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-navy-900"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </Link>
                    <DeleteButton
                      action={deletePage}
                      id={page.id}
                      confirmText={`Delete the page "${page.title}"? This cannot be undone.`}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      {pages.length > 0 ? (
        <p className="mt-4 flex items-center gap-2 text-xs text-slate-400">
          <Calendar className="h-3.5 w-3.5" />
          {pages.length} page{pages.length === 1 ? '' : 's'} · sorted by most recently updated
        </p>
      ) : null}
    </div>
  )
}