import type { Metadata } from 'next'
import { CheckCircle2, CalendarDays } from 'lucide-react'
import { redirect } from 'next/navigation'
import { verifyEmployeeSession, getEmployee } from '@/lib/auth/employee-dal'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { Card, PageHeader, StatusBadge, Breadcrumbs, Table } from '@/components/admin/ui'
import { pretty, badgeTone } from '@/lib/admin'
import TaskStatusForm from './task-status-form'

export const metadata: Metadata = { title: 'My Tasks' }

export default async function EmployeeTasksPage() {
  const session = await verifyEmployeeSession()
  if (!session) redirect('/portal/login')
  const employee = await getEmployee()
  if (!employee) redirect('/portal/login')

  const tasks = await prisma.employeeTask.findMany({
    where: { employeeId: employee.id },
    orderBy: [{ status: 'asc' }, { priority: 'asc' }, { dueDate: 'asc' }],
  })

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Portal', href: '/portal' }, { label: 'My Tasks' }]} />
      <PageHeader
        title="My Tasks"
        description="Work items assigned to you. Update their status as you make progress."
      />

      <Card>
        {tasks.length === 0 ? (
          <p className="px-6 py-16 text-center text-sm text-slate-400">
            No tasks assigned to you yet.
          </p>
        ) : (
          <Table headers={['Task', 'Priority', 'Due Date', 'Status', 'Actions']}>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td className="px-4 py-3.5 align-top">
                  <p className="font-semibold text-navy-900">{task.title}</p>
                  {task.description ? (
                    <p className="mt-0.5 max-w-md text-xs leading-relaxed text-slate-500">
                      {task.description}
                    </p>
                  ) : null}
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge label={pretty(task.priority)} tone={badgeTone(task.priority)} />
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap">
                  {task.dueDate ? (
                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {formatDate(task.dueDate)}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge label={pretty(task.status)} tone={badgeTone(task.status)} />
                </td>
                <td className="px-4 py-3.5">
                  <TaskStatusForm taskId={task.id} status={task.status} />
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      <p className="mt-4 flex items-center gap-1.5 text-xs text-slate-400">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Mark a task Complete when it&apos;s ready for review by your supervisor.
      </p>
    </div>
  )
}