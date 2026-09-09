'use client'

import { useTransition } from 'react'
import { Loader2 } from 'lucide-react'
import { pretty } from '@/lib/admin'
import { APPLICATION_STATUSES } from '@/lib/admin'
import { updateApplicationStatus } from '@/app/admin/actions'

export default function ApplicationStatusSelect({
  id,
  status,
}: {
  id: string
  status: string
}) {
  const [pending, startTransition] = useTransition()

  return (
    <div className="inline-flex items-center gap-1.5">
      <select
        defaultValue={status}
        disabled={pending}
        onChange={(e) => {
          const value = e.target.value
          startTransition(() => {
            void updateApplicationStatus(id, value)
          })
        }}
        className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition-colors focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 disabled:opacity-60"
      >
        {APPLICATION_STATUSES.map((s) => (
          <option key={s} value={s}>
            {pretty(s)}
          </option>
        ))}
      </select>
      {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin text-cyan-500" /> : null}
    </div>
  )
}