'use client'

import { useState, useActionState, useTransition } from 'react'
import { Plus, Pencil, X, ChevronUp, ChevronDown, Loader2, Gauge } from 'lucide-react'
import {
  createMetric,
  updateMetric,
  deleteMetric,
  reorderMetric,
  type ActionState,
} from '@/app/admin/actions'
import { inputClass, labelClass, EmptyState, Table, StatusBadge } from '@/components/admin/ui'
import { SubmitButton, DeleteButton, ActionNotice } from '@/components/admin/client'

const initialState: ActionState = { status: 'idle' }

export interface MetricRow {
  id: string
  label: string
  value: number
  unit: string
  suffix: string | null
  sortOrder: number
  published: boolean
}

interface MetricFormProps {
  mode: 'create' | 'edit'
  record: MetricRow | null
  onClose: () => void
}

function MetricForm({ mode, record, onClose }: MetricFormProps) {
  const action = mode === 'edit' ? updateMetric : createMetric
  const [state, formAction] = useActionState(action, initialState)

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-navy-950/60 p-4 backdrop-blur-sm sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={mode === 'edit' ? 'Edit metric' : 'Add metric'}
    >
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-navy-900">
            <Gauge className="h-5 w-5 text-cyan-500" />
            {mode === 'edit' ? 'Edit Metric' : 'Add Metric'}
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
              <label htmlFor="metric-label" className={labelClass}>
                Label <span className="text-red-600">*</span>
              </label>
              <input id="metric-label" name="label" type="text" required defaultValue={record?.label ?? ''} className={inputClass} placeholder="CO₂ avoided" />
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <label htmlFor="metric-value" className={labelClass}>
                  Value <span className="text-red-600">*</span>
                </label>
                <input id="metric-value" name="value" type="number" step="any" required defaultValue={record?.value ?? ''} className={inputClass} />
              </div>
              <div>
                <label htmlFor="metric-unit" className={labelClass}>
                  Unit <span className="text-red-600">*</span>
                </label>
                <input id="metric-unit" name="unit" type="text" required defaultValue={record?.unit ?? ''} className={inputClass} placeholder="MWh" />
              </div>
              <div>
                <label htmlFor="metric-suffix" className={labelClass}>
                  Suffix
                </label>
                <input id="metric-suffix" name="suffix" type="text" defaultValue={record?.suffix ?? ''} className={inputClass} placeholder="per year" />
              </div>
            </div>
            <label className="inline-flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                name="published"
                defaultChecked={record?.published ?? true}
                className="h-4 w-4 rounded border-slate-300 text-cyan-500 focus:ring-cyan-500"
              />
              <span className="text-sm font-medium text-slate-700">Published (visible on the site)</span>
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
                  Add Metric
                </>
              )}
            </SubmitButton>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function MetricManager({ metrics }: { metrics: MetricRow[] }) {
  const [modal, setModal] = useState<{ mode: 'create' | 'edit'; record: MetricRow | null } | null>(
    null
  )
  const [pendingReorder, startReorder] = useTransition()

  const move = (id: string, direction: 'up' | 'down') => {
    startReorder(() => {
      void reorderMetric(id, direction)
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
          <Plus className="h-4 w-4" />
          Add Metric
        </button>
      </div>

      {metrics.length === 0 ? (
        <EmptyState
          title="No metrics yet"
          description="Add sustainability statistics to display on the sustainability pages."
          action={
            <button
              type="button"
              onClick={() => setModal({ mode: 'create', record: null })}
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-cyan-600"
            >
              <Plus className="h-4 w-4" />
              Add Metric
            </button>
          }
        />
      ) : (
        <Table headers={['Order', 'Label', 'Value', 'Unit', 'Suffix', 'Status', 'Actions']}>
          {metrics.map((metric, index) => (
            <tr key={metric.id} className="transition-colors hover:bg-slate-50">
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={index === 0 || pendingReorder}
                    onClick={() => move(metric.id, 'up')}
                    aria-label="Move up"
                    className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-navy-900 disabled:opacity-30"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    disabled={index === metrics.length - 1 || pendingReorder}
                    onClick={() => move(metric.id, 'down')}
                    aria-label="Move down"
                    className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-navy-900 disabled:opacity-30"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  {pendingReorder ? <Loader2 className="h-3.5 w-3.5 animate-spin text-cyan-500" /> : null}
                </div>
              </td>
              <td className="px-4 py-3 font-semibold text-navy-900">{metric.label}</td>
              <td className="px-4 py-3 font-mono text-slate-700">{metric.value.toLocaleString()}</td>
              <td className="px-4 py-3 text-slate-500">{metric.unit}</td>
              <td className="px-4 py-3 text-slate-500">{metric.suffix ?? '—'}</td>
              <td className="px-4 py-3">
                <StatusBadge label={metric.published ? 'Published' : 'Hidden'} tone={metric.published ? 'green' : 'slate'} />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setModal({ mode: 'edit', record: metric })}
                    className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-navy-900"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </button>
                  <DeleteButton
                    action={deleteMetric}
                    id={metric.id}
                    confirmText={`Delete the metric "${metric.label}"? This cannot be undone.`}
                  />
                </div>
              </td>
            </tr>
          ))}
        </Table>
      )}

      {modal ? <MetricForm mode={modal.mode} record={modal.record} onClose={() => setModal(null)} /> : null}
    </>
  )
}