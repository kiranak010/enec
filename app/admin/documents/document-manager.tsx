'use client'

import { useState, useActionState } from 'react'
import { Plus, Pencil, X, Upload, FileText, Link2 } from 'lucide-react'
import {
  createDocument,
  updateDocument,
  deleteDocument,
  type ActionState,
} from '@/app/admin/actions'
import { pretty } from '@/lib/admin'
import { DOCUMENT_CATEGORIES } from '@/lib/admin'
import { inputClass, labelClass, EmptyState, Table, StatusBadge } from '@/components/admin/ui'
import { SubmitButton, DeleteButton, ActionNotice } from '@/components/admin/client'

const initialState: ActionState = { status: 'idle' }

export interface DocumentRow {
  id: string
  title: string
  slug: string
  category: string
  description: string | null
  year: number | null
  fileUrl: string
  fileSizeKb: number | null
  published: boolean
  downloadCount: number
  createdAt: string
}

interface DocumentFormProps {
  mode: 'create' | 'edit'
  record: DocumentRow | null
  onClose: () => void
}

function DocumentForm({ mode, record, onClose }: DocumentFormProps) {
  const action = mode === 'edit' ? updateDocument : createDocument
  const [state, formAction] = useActionState(action, initialState)

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-navy-950/60 p-4 backdrop-blur-sm sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={mode === 'edit' ? 'Edit document' : 'Upload document'}
    >
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-navy-900">
            <FileText className="h-5 w-5 text-cyan-500" />
            {mode === 'edit' ? 'Edit Document' : 'Upload Document'}
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
              <label htmlFor="doc-title" className={labelClass}>
                Title <span className="text-red-600">*</span>
              </label>
              <input id="doc-title" name="title" type="text" required defaultValue={record?.title ?? ''} className={inputClass} />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="doc-slug" className={labelClass}>
                  Slug <span className="text-red-600">*</span>
                </label>
                <input id="doc-slug" name="slug" type="text" required defaultValue={record?.slug ?? ''} className={inputClass} />
              </div>
              <div>
                <label htmlFor="doc-category" className={labelClass}>
                  Category <span className="text-red-600">*</span>
                </label>
                <select id="doc-category" name="category" required defaultValue={record?.category ?? 'PUBLICATION'} className={inputClass}>
                  {DOCUMENT_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {pretty(c)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="doc-year" className={labelClass}>
                  Year
                </label>
                <input id="doc-year" name="year" type="number" min={1900} max={2100} defaultValue={record?.year ?? ''} className={inputClass} />
              </div>
              <div>
                <label htmlFor="doc-fileUrl" className={labelClass}>
                  File URL
                </label>
                <div className="relative">
                  <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input id="doc-fileUrl" name="fileUrl" type="url" defaultValue={record?.fileUrl ?? ''} className={`${inputClass} pl-9`} placeholder="https://… or leave empty to upload" />
                </div>
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="doc-file" className={labelClass}>
                  Upload file {mode === 'create' ? '(optional if URL provided)' : ''}
                </label>
                <input id="doc-file" name="file" type="file" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Visibility</label>
                <div className="pt-2">
                  <label className="inline-flex cursor-pointer items-center gap-2.5">
                    <input
                      type="checkbox"
                      name="published"
                      defaultChecked={record?.published ?? true}
                      className="h-4 w-4 rounded border-slate-300 text-cyan-500 focus:ring-cyan-500"
                    />
                    <span className="text-sm font-medium text-slate-700">Published (visible to the public)</span>
                  </label>
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="doc-description" className={labelClass}>
                Description
              </label>
              <textarea id="doc-description" name="description" rows={3} defaultValue={record?.description ?? ''} className={`${inputClass} resize-y`} maxLength={500} />
            </div>
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
                  <Upload className="h-4 w-4" />
                  Save Document
                </>
              )}
            </SubmitButton>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function DocumentManager({ documents }: { documents: DocumentRow[] }) {
  const [modal, setModal] = useState<{ mode: 'create' | 'edit'; record: DocumentRow | null } | null>(
    null
  )

  return (
    <>
      <div className="mb-5 flex justify-end">
        <button
          type="button"
          onClick={() => setModal({ mode: 'create', record: null })}
          className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-cyan-500/25 transition-colors hover:bg-cyan-600"
        >
          <Plus className="h-4 w-4" />
          Upload Document
        </button>
      </div>

      {documents.length === 0 ? (
        <EmptyState
          title="No documents yet"
          description="Upload reports, policies and publications for the public library."
          action={
            <button
              type="button"
              onClick={() => setModal({ mode: 'create', record: null })}
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-cyan-600"
            >
              <Plus className="h-4 w-4" />
              Upload Document
            </button>
          }
        />
      ) : (
        <Table headers={['Title', 'Category', 'Year', 'Size', 'Downloads', 'Status', 'Actions']}>
          {documents.map((doc) => (
            <tr key={doc.id} className="transition-colors hover:bg-slate-50">
              <td className="max-w-[260px] px-4 py-3">
                <p className="truncate font-semibold text-navy-900">{doc.title}</p>
                <p className="truncate text-xs text-slate-400">/{doc.slug}</p>
              </td>
              <td className="px-4 py-3 text-slate-500">{pretty(doc.category)}</td>
              <td className="px-4 py-3 text-slate-500">{doc.year ?? '—'}</td>
              <td className="px-4 py-3 text-slate-500">
                {doc.fileSizeKb != null ? `${doc.fileSizeKb.toLocaleString()} KB` : '—'}
              </td>
              <td className="px-4 py-3 text-slate-500">{doc.downloadCount}</td>
              <td className="px-4 py-3">
                <StatusBadge label={doc.published ? 'Published' : 'Hidden'} tone={doc.published ? 'green' : 'slate'} />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setModal({ mode: 'edit', record: doc })}
                    className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-navy-900"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </button>
                  <DeleteButton
                    action={deleteDocument}
                    id={doc.id}
                    confirmText={`Delete the document "${doc.title}"? This cannot be undone.`}
                  />
                </div>
              </td>
            </tr>
          ))}
        </Table>
      )}

      {modal ? <DocumentForm mode={modal.mode} record={modal.record} onClose={() => setModal(null)} /> : null}
    </>
  )
}