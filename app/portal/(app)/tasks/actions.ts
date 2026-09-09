'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { verifyEmployeeSession } from '@/lib/auth/employee-dal'

const schema = z.object({
  taskId: z.string().min(1),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE', 'CANCELLED']),
})

export type UpdateTaskState = {
  status: 'idle' | 'error'
  message?: string
}

export async function updateTaskStatus(
  _prevState: UpdateTaskState,
  formData: FormData
): Promise<UpdateTaskState> {
  const session = await verifyEmployeeSession()
  if (!session) return { status: 'error', message: 'Not authorized.' }

  const parsed = schema.safeParse({
    taskId: String(formData.get('taskId') ?? ''),
    status: String(formData.get('status') ?? ''),
  })
  if (!parsed.success) {
    return { status: 'error', message: 'Invalid task or status.' }
  }

  const task = await prisma.employeeTask.findUnique({
    where: { id: parsed.data.taskId },
    select: { employeeId: true },
  })
  if (!task || task.employeeId !== session.employeeId) {
    return { status: 'error', message: 'Task not found.' }
  }

  await prisma.employeeTask.update({
    where: { id: parsed.data.taskId },
    data: { status: parsed.data.status },
  })

  revalidatePath('/portal/tasks')
  return { status: 'idle' }
}