'use client'

import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { Trash2, Loader2, CheckCircle2, AlertCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ActionState } from '@/app/admin/actions'

interface SubmitButtonProps {
  children: React.ReactNode
  pendingText?: string
  className?: string
}

export function SubmitButton({ children, pendingText = 'Saving…', className }: SubmitButtonProps) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-cyan-500/25 transition-all duration-200 hover:bg-cyan-600 disabled:pointer-events-none disabled:opacity-60',
        className
      )}
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {pendingText}
        </>
      ) : (
        children
      )}
    </button>
  )
}

export function CancelButton({
  href,
  children = 'Cancel',
}: {
  href: string
  children?: React.ReactNode
}) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
    >
      {children}
    </a>
  )
}

export function DeleteButton({
  action,
  id,
  label = 'Delete',
  confirmText = 'Are you sure you want to delete this item? This cannot be undone.',
}: {
  action: (id: string, formData: FormData) => Promise<ActionState>
  id: string
  label?: string
  confirmText?: string
}) {
  const handleDelete = async (formData: FormData) => {
    await action(id, formData)
  }
  return (
    <form
      action={handleDelete}
      onSubmit={(e) => {
        if (!window.confirm(confirmText)) e.preventDefault()
      }}
    >
      <DeleteButtonInner label={label} />
    </form>
  )
}

function DeleteButtonInner({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      aria-label={label}
      title={label}
      className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:pointer-events-none disabled:opacity-50"
    >
      {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
      {label}
    </button>
  )
}

export function ActionNotice({ state }: { state: ActionState }) {
  if (state.status === 'idle' || !state.message) return null

  const isSuccess = state.status === 'success'
  const Icon = isSuccess ? CheckCircle2 : state.status === 'error' ? AlertCircle : Info

  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-3 rounded-lg border px-4 py-3 text-sm font-medium',
        isSuccess
          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-800'
          : 'border-red-500/30 bg-red-500/10 text-red-800'
      )}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <p>{state.message}</p>
    </div>
  )
}

export function FieldToggle({
  checked,
  onChange,
  label,
  name,
}: {
  checked: boolean
  onChange?: () => void
  label: string
  name: string
}) {
  const [internal, setInternal] = useState(checked)
  const isChecked = onChange ? checked : internal
  return (
    <label className="inline-flex cursor-pointer items-center gap-2.5">
      <span className="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors">
        <input
          type="checkbox"
          name={name}
          checked={isChecked}
          onChange={(e) => {
            if (onChange) {
              onChange()
            } else {
              setInternal(e.target.checked)
            }
          }}
          className="peer sr-only"
        />
        <span className="absolute inset-0 rounded-full bg-slate-300 transition-colors peer-checked:bg-cyan-500" />
        <span className="absolute left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
      </span>
      <span className="text-sm font-medium text-slate-700">{label}</span>
    </label>
  )
}