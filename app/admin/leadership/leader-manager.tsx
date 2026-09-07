'use client'

import { useState, useActionState } from 'react'
import { Plus, Pencil, X, UsersRound } from 'lucide-react'
import {
  createLeader,
  updateLeader,
  deleteLeader,
  type ActionState,
} from '@/app/admin/actions'
import { inputClass, labelClass, EmptyState, StatusBadge } from '@/components/admin/ui'
import { SubmitButton, DeleteButton, ActionNotice } from '@/components/admin/client'

const initialState: ActionState = { status: 'idle' }

export interface LeaderRow {
  id: string
  name: string
  slug: string
  title: string
  photoUrl: string | null
  biography: string
  responsibilities: string | null
  linkedinUrl: string | null
  twitterUrl: string | null
  published: boolean
}

interface LeaderFormProps {
  mode: 'create' | 'edit'
  record: LeaderRow | null
  onClose: () => void
}

function LeaderForm({ mode, record, onClose }: LeaderFormProps) {
  const action = mode === 'edit' ? updateLeader : createLeader
  const [state, formAction] = useActionState(action, initialState)

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-navy-950/60 p-4 backdrop-blur-sm sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={mode === 'edit' ? 'Edit leader' : 'Add leader'}
    >
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-navy-900">
            <UsersRound className="h-5 w-5 text-cyan-500" />
            {mode === 'edit' ? 'Edit Leader' : 'Add Leader'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-navy-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form action={formAction} className="p-6">
          {mode === 'edit' ? <input type="hidden" name="id" value={record?.id ?? ''} /> : null}

          {state.status !== 'idle' ? (
            <div className="mb-5">
              <ActionNotice state={state} />
            </div>
          ) : null}

          <div className="grid gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="leader-name" className={labelClass}>
                  Full name <span className="text-red-600">*</span>
                </label>
                <input id="leader-name" name="name" type="text" required defaultValue={record?.name ?? ''} className={inputClass} />
              </div>
              <div>
                <label htmlFor="leader-slug" className={labelClass}>
                  Slug <span className="text-red-600">*</span>
                </label>
                <input id="leader-slug" name="slug" type="text" required defaultValue={record?.slug ?? ''} className={inputClass} />
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="leader-title" className={labelClass}>
                  Title <span className="text-red-600">*</span>
                </label>
                <input id="leader-title" name="title" type="text" required defaultValue={record?.title ?? ''} className={inputClass} placeholder="Chief Executive Officer" />
              </div>
              <div>
                <label htmlFor="leader-photoUrl" className={labelClass}>
                  Photo URL
                </label>
                <input id="leader-photoUrl" name="photoUrl" type="url" defaultValue={record?.photoUrl ?? ''} className={inputClass} placeholder="https://…" />
              </div>
            </div>
            <div>
              <label htmlFor="leader-biography" className={labelClass}>
                Biography <span className="text-red-600">*</span>
              </label>
              <textarea id="leader-biography" name="biography" rows={6} required defaultValue={record?.biography ?? ''} className={`${inputClass} resize-y`} />
            </div>
            <div>
              <label htmlFor="leader-responsibilities" className={labelClass}>
                Responsibilities
              </label>
              <textarea id="leader-responsibilities" name="responsibilities" rows={3} defaultValue={record?.responsibilities ?? ''} className={`${inputClass} resize-y`} maxLength={1000} />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="leader-linkedinUrl" className={labelClass}>
                  LinkedIn URL
                </label>
                <input id="leader-linkedinUrl" name="linkedinUrl" type="url" defaultValue={record?.linkedinUrl ?? ''} className={inputClass} placeholder="https://linkedin.com/in/…" />
              </div>
              <div>
                <label htmlFor="leader-twitterUrl" className={labelClass}>
                  X / Twitter URL
                </label>
                <input id="leader-twitterUrl" name="twitterUrl" type="url" defaultValue={record?.twitterUrl ?? ''} className={inputClass} placeholder="https://twitter.com/…" />
              </div>
            </div>
            <label className="inline-flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                name="published"
                defaultChecked={record?.published ?? true}
                className="h-4 w-4 rounded border-slate-300 text-cyan-500 focus:ring-cyan-500"
              />
              <span className="text-sm font-medium text-slate-700">Published (visible on the leadership page)</span>
            </label>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
            >
              Cancel
            </button>
            <SubmitButton>
              {mode === 'edit' ? (
                <>
                  <Pencil className="h-4 w-4" />
                  Save Changes
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add Leader
                </>
              )}
            </SubmitButton>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function LeaderManager({ leaders }: { leaders: LeaderRow[] }) {
  const [modal, setModal] = useState<{ mode: 'create' | 'edit'; record: LeaderRow | null } | null>(
    null
  )

  return (
    <>
      <div className="mb-6 flex justify-end">
        <button
          type="button"
          onClick={() => setModal({ mode: 'create', record: null })}
          className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-cyan-500/25 transition-colors hover:bg-cyan-600"
        >
          <Plus className="h-4 w-4" />
          Add Leader
        </button>
      </div>

      {leaders.length === 0 ? (
        <EmptyState
          title="No leadership profiles yet"
          description="Add the executive team profiles shown on the leadership page."
          action={
            <button
              type="button"
              onClick={() => setModal({ mode: 'create', record: null })}
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-cyan-600"
            >
              <Plus className="h-4 w-4" />
              Add Leader
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {leaders.map((leader) => (
            <div
              key={leader.id}
              className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative flex items-center justify-center bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950 py-8">
                {leader.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={leader.photoUrl}
                    alt={leader.name}
                    className="h-20 w-20 rounded-full object-cover ring-4 ring-white/10"
                  />
                ) : (
                  <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-navy-700 text-3xl font-bold text-white">
                    {leader.name.charAt(0)}
                  </span>
                )}
                <span className="absolute right-3 top-3">
                  <StatusBadge
                    label={leader.published ? 'Published' : 'Hidden'}
                    tone={leader.published ? 'green' : 'slate'}
                  />
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-base font-bold text-navy-900">{leader.name}</h3>
                <p className="mt-0.5 text-sm font-medium text-cyan-600">{leader.title}</p>
                <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-slate-500">
                  {leader.biography}
                </p>
                <div className="mt-4 flex items-center gap-1 border-t border-slate-100 pt-3">
                  <button
                    type="button"
                    onClick={() => setModal({ mode: 'edit', record: leader })}
                    className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-navy-900"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </button>
                  <DeleteButton
                    action={deleteLeader}
                    id={leader.id}
                    confirmText={`Remove the profile for "${leader.name}"? This cannot be undone.`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal ? <LeaderForm mode={modal.mode} record={modal.record} onClose={() => setModal(null)} /> : null}
    </>
  )
}