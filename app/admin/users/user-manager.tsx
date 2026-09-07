'use client'

import { useState, useActionState, useTransition } from 'react'
import { UserPlus, Pencil, X, Loader2, Shield } from 'lucide-react'
import {
  createUser,
  updateUser,
  deleteUser,
  setUserRole,
  setUserActive,
  type ActionState,
} from '@/app/admin/actions'
import { pretty } from '@/lib/admin'
import { ALL_ROLES } from '@/lib/admin'
import { inputClass, labelClass, Table, StatusBadge } from '@/components/admin/ui'
import { SubmitButton, DeleteButton, ActionNotice } from '@/components/admin/client'
import { formatDate } from '@/lib/utils'
import type { Role } from '@prisma/client'

const initialState: ActionState = { status: 'idle' }

export interface UserRow {
  id: string
  name: string
  email: string
  role: Role
  active: boolean
  createdAt: string
}

function roleTone(role: string): 'green' | 'cyan' | 'amber' | 'violet' | 'slate' {
  switch (role) {
    case 'SUPER_ADMIN':
    case 'ADMIN':
      return 'violet'
    case 'HR_MANAGER':
    case 'MEDIA_MANAGER':
      return 'cyan'
    case 'EDITOR':
    case 'ANALYST':
      return 'amber'
    default:
      return 'slate'
  }
}

interface UserFormProps {
  mode: 'create' | 'edit'
  record: UserRow | null
  roles: Role[]
  onClose: () => void
}

function UserForm({ mode, record, roles, onClose }: UserFormProps) {
  const action = mode === 'edit' ? updateUser : createUser
  const [state, formAction] = useActionState(action, initialState)

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-navy-950/60 p-4 backdrop-blur-sm sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={mode === 'edit' ? 'Edit user' : 'Add user'}
    >
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-navy-900">
            <Shield className="h-5 w-5 text-cyan-500" />
            {mode === 'edit' ? 'Edit User' : 'Add User'}
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
            <div>
              <label htmlFor="user-name" className={labelClass}>
                Name <span className="text-red-600">*</span>
              </label>
              <input id="user-name" name="name" type="text" required defaultValue={record?.name ?? ''} className={inputClass} />
            </div>
            <div>
              <label htmlFor="user-email" className={labelClass}>
                Email <span className="text-red-600">*</span>
              </label>
              <input id="user-email" name="email" type="email" required defaultValue={record?.email ?? ''} className={inputClass} />
            </div>
            <div>
              <label htmlFor="user-role" className={labelClass}>
                Role
              </label>
              <select id="user-role" name="role" defaultValue={record?.role ?? 'EDITOR'} className={inputClass}>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {pretty(role)}
                  </option>
                ))}
              </select>
            </div>
            <label className="inline-flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                name="active"
                defaultChecked={record?.active ?? true}
                className="h-4 w-4 rounded border-slate-300 text-cyan-500 focus:ring-cyan-500"
              />
              <span className="text-sm font-medium text-slate-700">Active (can sign in)</span>
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
                  <UserPlus className="h-4 w-4" />
                  Add User
                </>
              )}
            </SubmitButton>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function UserManager({
  users,
  roles,
  isAdmin,
}: {
  users: UserRow[]
  roles: Role[]
  isAdmin: boolean
}) {
  const [modal, setModal] = useState<{ mode: 'create' | 'edit'; record: UserRow | null } | null>(
    null
  )
  const [pendingAction, startAction] = useTransition()

  const changeRole = (id: string, role: Role) => {
    startAction(() => {
      void setUserRole(id, role)
    })
  }

  const toggleActive = (id: string, active: boolean) => {
    startAction(() => {
      void setUserActive(id, active)
    })
  }

  return (
    <>
      <div className="mb-5 flex justify-end">
        <button
          type="button"
          onClick={() => setModal({ mode: 'create', record: null })}
          className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-cyan-500/25 transition-colors hover:bg-cyan-600"
        >
          <UserPlus className="h-4 w-4" />
          Add User
        </button>
      </div>

      <Table headers={['User', 'Role', 'Status', 'Joined', 'Actions']}>
        {users.map((user) => (
          <tr key={user.id} className="transition-colors hover:bg-slate-50">
            <td className="px-4 py-3">
              <p className="font-semibold text-navy-900">{user.name}</p>
              <p className="text-xs text-slate-400">{user.email}</p>
            </td>
            <td className="px-4 py-3">
              {isAdmin ? (
                <select
                  value={user.role}
                  disabled={pendingAction}
                  onChange={(e) => changeRole(user.id, e.target.value as Role)}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:border-cyan-500 focus:outline-none"
                >
                  {ALL_ROLES.map((role) => (
                    <option key={role} value={role} className="text-slate-700">
                      {pretty(role)}
                    </option>
                  ))}
                </select>
              ) : (
                <StatusBadge label={pretty(user.role)} tone={roleTone(user.role)} />
              )}
            </td>
            <td className="px-4 py-3">
              <button
                type="button"
                disabled={pendingAction}
                onClick={() => toggleActive(user.id, !user.active)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors disabled:opacity-50 ${
                  user.active ? 'bg-cyan-500' : 'bg-slate-300'
                }`}
                role="switch"
                aria-checked={user.active}
                title={user.active ? 'Click to deactivate' : 'Click to activate'}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                    user.active ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </td>
            <td className="px-4 py-3 text-sm text-slate-500">{formatDate(user.createdAt)}</td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setModal({ mode: 'edit', record: user })}
                  className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-navy-900"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>
                <DeleteButton
                  action={deleteUser}
                  id={user.id}
                  confirmText={`Delete the account for "${user.email}"? This cannot be undone.`}
                />
              </div>
            </td>
          </tr>
        ))}
      </Table>
      {pendingAction ? <Loader2 className="ml-2 mt-2 h-4 w-4 animate-spin text-cyan-500" /> : null}

      {modal ? (
        <UserForm mode={modal.mode} record={modal.record} roles={roles} onClose={() => setModal(null)} />
      ) : null}
    </>
  )
}