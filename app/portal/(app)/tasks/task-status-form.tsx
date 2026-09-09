'use client'

import { useActionState } from 'react'
import { Check } from 'lucide-react'
import { updateTaskStatus, type UpdateTaskState } from './actions'

const STATUSES = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE', 'CANCELLED']

const initialState: UpdateTaskState = { status: 'idle' }

export default function TaskStatusForm({
  taskId,
  status,
}: {
  taskId: string
  status: string
}) {
  const [state, formAction, pending] = useActionState(updateTaskStatus, initialState)

  return (
    <form action={formAction} className="flex items-center gap-2">
      <input type="hidden" name="taskId" value={taskId} />
      <select
        name="status"
        defaultValue={status}
        disabled={pending}
        aria-label="Update task status"
        className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition-colors focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 disabled:opacity-60"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s.replace('_', ' ')}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={pending}
        aria-label="Save status"
        title="Save status"
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500 text-white transition-colors hover:bg-cyan-600 disabled:pointer-events-none disabled:opacity-50"
      >
        <Check className="h-4 w-4" />
      </button>
      {state.status === 'error' && state.message ? (
        <span className="text-xs font-medium text-red-600">{state.message}</span>
      ) : null}
    </form>
  )
}