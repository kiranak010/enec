import type { Metadata } from 'next'
import Link from 'next/link'
import {
  CheckSquare,
  Megaphone,
  Building2,
  CalendarDays,
  ArrowRight,
} from 'lucide-react'
import { redirect } from 'next/navigation'
import { verifyEmployeeSession, getEmployee } from '@/lib/auth/employee-dal'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { Card, PageHeader, StatusBadge, Breadcrumbs } from '@/components/admin/ui'
import { pretty, badgeTone } from '@/lib/admin'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function EmployeeDashboardPage() {
  const session = await verifyEmployeeSession()
  if (!session) redirect('/portal/login')
  const employee = await getEmployee()
  if (!employee) redirect('/portal/login')

  const [tasks, pendingCount, inProgressCount, completedCount, announcements] = await Promise.all([
    prisma.employeeTask.findMany({
      where: { employeeId: employee.id },
      orderBy: { updatedAt: 'desc' },
      take: 5,
    }),
    prisma.employeeTask.count({
      where: { employeeId: employee.id, status: { in: ['PENDING', 'IN_PROGRESS', 'OVERDUE'] } },
    }),
    prisma.employeeTask.count({ where: { employeeId: employee.id, status: 'IN_PROGRESS' } }),
    prisma.employeeTask.count({ where: { employeeId: employee.id, status: 'COMPLETED' } }),
    prisma.announcement.findMany({
      where: { isActive: true, audience: { in: ['ALL', 'EMPLOYEE'] } },
      orderBy: [{ pinned: 'desc' }, { createdAt: 'desc' }],
      take: 4,
    }),
  ])

  const stats = [
    { label: 'Open Tasks', value: pendingCount, href: '/portal/tasks' },
    { label: 'In Progress', value: inProgressCount, href: '/portal/tasks' },
    { label: 'Completed', value: completedCount, href: '/portal/tasks' },
  ]

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Portal', href: '/portal' }, { label: 'Dashboard' }]} />
      <PageHeader
        title={`Welcome back, ${employee.name.split(' ')[0]}`}
        description="Your employee workspace. Stay on top of tasks and announcements."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div>
              <p className="text-2xl font-bold leading-none text-navy-900">{stat.value}</p>
              <p className="mt-1.5 text-xs font-medium text-slate-500">{stat.label}</p>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600">
              <CheckSquare className="h-5 w-5" />
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <h2 className="flex items-center gap-2 text-base font-bold text-navy-900">
              <Building2 className="h-4 w-4 text-cyan-500" />
              My Tasks
            </h2>
            <Link
              href="/portal/tasks"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-600 transition-colors hover:text-cyan-700"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {tasks.length === 0 ? (
            <p className="px-6 py-12 text-center text-sm text-slate-400">
              No tasks assigned to you yet.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {tasks.map((task) => (
                <li key={task.id} className="flex items-center gap-4 px-6 py-3.5">
                  <StatusBadge label={pretty(task.status)} tone={badgeTone(task.status)} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-navy-900">{task.title}</p>
                    {task.description ? (
                      <p className="mt-0.5 truncate text-xs text-slate-500">{task.description}</p>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-xs font-medium text-slate-400">
                      {task.priority} priority
                    </span>
                    {task.dueDate ? (
                      <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {formatDate(task.dueDate)}
                      </span>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <h2 className="flex items-center gap-2 text-base font-bold text-navy-900">
              <Megaphone className="h-4 w-4 text-amber-500" />
              Announcements
            </h2>
            <Link
              href="/portal/announcements"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-600 transition-colors hover:text-cyan-700"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {announcements.length === 0 ? (
            <p className="px-6 py-12 text-center text-sm text-slate-400">
              No announcements right now.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {announcements.map((item) => (
                <li key={item.id} className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {item.pinned ? (
                      <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 ring-1 ring-inset ring-amber-600/30">
                        Pinned
                      </span>
                    ) : null}
                    <time className="text-xs text-slate-400">{formatDate(item.createdAt)}</time>
                  </div>
                  <p className="mt-1.5 text-sm font-semibold text-navy-900">{item.title}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-500">{item.body}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  )
}