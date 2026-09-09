'use client'

import { useActionState } from 'react'
import { createJob, updateJob, type ActionState } from '@/app/admin/actions'
import { Breadcrumbs, Card, PageHeader, Field, inputClass } from '@/components/admin/ui'
import { ActionNotice, CancelButton, SubmitButton } from '@/components/admin/client'
import { TitleSlugInputs } from '@/components/admin/title-slug'
import { pretty } from '@/lib/admin'
import { JOB_STATUSES, EMPLOYMENT_TYPES } from '@/lib/admin'

const initialState: ActionState = { status: 'idle' }

export interface JobFormRecord {
  id: string
  title: string
  slug: string
  department: string
  location: string
  employmentType: string
  summary: string
  description: string
  requirements: string | null
  status: string
  expiresAt: Date | null
}

interface JobFormProps {
  mode: 'create' | 'edit'
  job: JobFormRecord | null
}

function isoDate(value: Date | null | undefined): string {
  if (!value) return ''
  return new Date(value).toISOString().slice(0, 10)
}

export default function JobForm({ mode, job }: JobFormProps) {
  const action = mode === 'edit' ? updateJob : createJob
  const [state, formAction] = useActionState(action, initialState)

  return (
    <div className="mx-auto max-w-3xl">
      <Breadcrumbs
        items={[
          { label: 'Admin', href: '/admin' },
          { label: 'Jobs', href: '/admin/jobs' },
          { label: mode === 'edit' ? 'Edit Job' : 'New Job' },
        ]}
      />
      <PageHeader
        title={mode === 'edit' ? 'Edit Job' : 'Create Job'}
        description="Publish a career opening."
      />

      {state.status !== 'idle' ? (
        <div className="mb-6">
          <ActionNotice state={state} />
        </div>
      ) : null}

      <form action={formAction} className="space-y-6">
        {mode === 'edit' ? <input type="hidden" name="id" value={job?.id ?? ''} /> : null}

        <Card className="p-6">
          <div className="grid gap-5">
            <TitleSlugInputs initialTitle={job?.title ?? ''} initialSlug={job?.slug ?? ''} />
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Department" htmlFor="job-department" required>
                <input id="job-department" name="department" type="text" required defaultValue={job?.department ?? ''} className={inputClass} placeholder="Engineering" />
              </Field>
              <Field label="Location" htmlFor="job-location" required>
                <input id="job-location" name="location" type="text" required defaultValue={job?.location ?? ''} className={inputClass} placeholder="Washington, DC" />
              </Field>
              <div>
                <label htmlFor="job-employmentType" className="mb-1.5 block text-sm font-semibold text-navy-900">
                  Employment type <span className="text-red-600">*</span>
                </label>
                <select id="job-employmentType" name="employmentType" defaultValue={job?.employmentType ?? 'FULL_TIME'} className={inputClass}>
                  {EMPLOYMENT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {pretty(t)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="job-status" className="mb-1.5 block text-sm font-semibold text-navy-900">
                  Status <span className="text-red-600">*</span>
                </label>
                <select id="job-status" name="status" defaultValue={job?.status ?? 'DRAFT'} className={inputClass}>
                  {JOB_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {pretty(s)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-5 text-lg font-bold text-navy-900">Details</h2>
          <div className="grid gap-5">
            <Field label="Summary" htmlFor="job-summary" required hint="One or two sentence sell of the role.">
              <textarea id="job-summary" name="summary" rows={3} required defaultValue={job?.summary ?? ''} className={`${inputClass} resize-y`} maxLength={500} />
            </Field>
            <Field label="Description" htmlFor="job-description" required>
              <textarea id="job-description" name="description" rows={10} required defaultValue={job?.description ?? ''} className={`${inputClass} resize-y`} />
            </Field>
            <Field label="Requirements" htmlFor="job-requirements" hint="Separate requirements with a blank line.">
              <textarea id="job-requirements" name="requirements" rows={6} defaultValue={job?.requirements ?? ''} className={`${inputClass} resize-y`} />
            </Field>
            <Field label="Application deadline" htmlFor="job-expiresAt">
              <input id="job-expiresAt" name="expiresAt" type="date" defaultValue={isoDate(job?.expiresAt)} className={inputClass} />
            </Field>
          </div>
        </Card>

        <div className="flex items-center justify-end gap-3">
          <CancelButton href="/admin/jobs" />
          <SubmitButton>{mode === 'edit' ? 'Save Changes' : 'Create Job'}</SubmitButton>
        </div>
      </form>
    </div>
  )
}