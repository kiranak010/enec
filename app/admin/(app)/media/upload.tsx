'use client'

import { useState, useActionState } from 'react'
import { Plus, X, Upload, ImagePlus, Loader2 } from 'lucide-react'
import { uploadMedia, type ActionState } from '@/app/admin/actions'
import { inputClass, labelClass } from '@/components/admin/ui'
import { ActionNotice } from '@/components/admin/client'

const initialState: ActionState = { status: 'idle' }

function MediaUploadForm({ onClose }: { onClose: () => void }) {
  const [state, formAction, pending] = useActionState(uploadMedia, initialState)

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-navy-950/60 p-4 backdrop-blur-sm sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label="Upload media"
    >
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-navy-900">
            <ImagePlus className="h-5 w-5 text-cyan-500" />
            Upload Media
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
          {state.status !== 'idle' ? (
            <div className="mb-5">
              <ActionNotice state={state} />
            </div>
          ) : null}

          <div className="grid gap-5">
            <div>
              <label htmlFor="media-file" className={labelClass}>
                File <span className="text-red-600">*</span>
              </label>
              <input
                id="media-file"
                name="file"
                type="file"
                required
                className={`${inputClass} cursor-pointer`}
              />
              <p className="mt-1.5 text-xs text-slate-400">
                Images, PDFs and video. Files are stored in the media library.
              </p>
            </div>
            <div>
              <label htmlFor="media-name" className={labelClass}>
                Name
              </label>
              <input
                id="media-name"
                name="name"
                type="text"
                className={inputClass}
                placeholder="Defaults to the file name"
              />
            </div>
            <div>
              <label htmlFor="media-altText" className={labelClass}>
                Alt text
              </label>
              <input
                id="media-altText"
                name="altText"
                type="text"
                className={inputClass}
                placeholder="Descriptive text for screen readers"
              />
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
            <button
              type="submit"
              disabled={pending}
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-cyan-500/25 transition-colors hover:bg-cyan-600 disabled:pointer-events-none disabled:opacity-60"
            >
              {pending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading…
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Upload
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function MediaUpload() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-cyan-500/25 transition-colors hover:bg-cyan-600"
      >
        <Plus className="h-4 w-4" />
        Upload Media
      </button>
      {open ? <MediaUploadForm onClose={() => setOpen(false)} /> : null}
    </>
  )
}