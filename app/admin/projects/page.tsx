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
import { deleteProject } from '@/app/admin/actions'

export const metadata: Metadata = { title: 'Projects' }

export default async function AdminProjectsPage() {
  const session = await verifyAdmin()
  if (!session) redirect('/admin/login')

  const projects = await prisma.project.findMany({
    orderBy: { updatedAt: 'desc' },
  })

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'Projects' }]} />
      <PageHeader
        title="Projects"
        description="Manage the fleet of projects and stations presented to the public."
        action={
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-cyan-500/25 transition-colors hover:bg-cyan-600"
          >
            <Plus className="h-4 w-4" />
            New Project
          </Link>
        }
      />

      <Card>
        {projects.length === 0 ? (
          <EmptyState
            title="No projects yet"
            description="Add your first project to populate the project portfolio."
            action={
              <Link
                href="/admin/projects/new"
                className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-cyan-600"
              >
                <Plus className="h-4 w-4" />
                New Project
              </Link>
            }
          />
        ) : (
          <Table headers={['Name', 'Status', 'Location', 'Technology', 'Capacity', 'Updated', 'Actions']}>
            {projects.map((project) => (
              <tr key={project.id} className="transition-colors hover:bg-slate-50">
                <td className="max-w-[220px] px-4 py-3">
                  <p className="truncate font-semibold text-navy-900">{project.name}</p>
                  <p className="truncate text-xs text-slate-400">/{project.slug}</p>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge label={pretty(project.status)} tone={badgeTone(project.status)} />
                </td>
                <td className="px-4 py-3">
                  <p className="text-slate-500">{project.location}</p>
                  <p className="text-xs text-slate-400">{project.country}</p>
                </td>
                <td className="px-4 py-3 text-slate-500">{project.technology}</td>
                <td className="px-4 py-3 text-slate-500">
                  {project.capacityMw != null ? `${project.capacityMw} MW` : '—'}
                </td>
                <td className="px-4 py-3 text-slate-500">{formatDate(project.updatedAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/admin/projects/new?id=${project.id}`}
                      className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-navy-900"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </Link>
                    <DeleteButton
                      action={deleteProject}
                      id={project.id}
                      confirmText={`Delete the project "${project.name}"? This cannot be undone.`}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      {projects.length > 0 ? (
        <p className="mt-4 flex items-center gap-2 text-xs text-slate-400">
          <Calendar className="h-3.5 w-3.5" />
          {projects.length} project{projects.length === 1 ? '' : 's'} in the portfolio
        </p>
      ) : null}
    </div>
  )
}