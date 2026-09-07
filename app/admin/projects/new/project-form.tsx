'use client'

import { useActionState } from 'react'
import { createProject, updateProject, type ActionState } from '@/app/admin/actions'
import { Breadcrumbs, Card, PageHeader, Field, inputClass } from '@/components/admin/ui'
import { ActionNotice, CancelButton, SubmitButton } from '@/components/admin/client'
import { TitleSlugInputs } from '@/components/admin/title-slug'
import { pretty } from '@/lib/admin'
import { PROJECT_STATUSES } from '@/lib/admin'

const initialState: ActionState = { status: 'idle' }

export interface ProjectFormRecord {
  id: string
  name: string
  slug: string
  location: string
  country: string
  latitude: number | null
  longitude: number | null
  capacityMw: number | null
  technology: string
  status: string
  summary: string
  description: string
  heroImage: string | null
  websiteUrl: string | null
  featured: boolean
  startDate: Date | null
  completionDate: Date | null
}

interface ProjectFormProps {
  mode: 'create' | 'edit'
  project: ProjectFormRecord | null
}

function isoDate(value: Date | null | undefined): string {
  if (!value) return ''
  return new Date(value).toISOString().slice(0, 10)
}

export default function ProjectForm({ mode, project }: ProjectFormProps) {
  const action = mode === 'edit' ? updateProject : createProject
  const [state, formAction] = useActionState(action, initialState)

  return (
    <div className="mx-auto max-w-3xl">
      <Breadcrumbs
        items={[
          { label: 'Admin', href: '/admin' },
          { label: 'Projects', href: '/admin/projects' },
          { label: mode === 'edit' ? 'Edit Project' : 'New Project' },
        ]}
      />
      <PageHeader
        title={mode === 'edit' ? 'Edit Project' : 'Create Project'}
        description="Add or update a project in the global portfolio."
      />

      {state.status !== 'idle' ? (
        <div className="mb-6">
          <ActionNotice state={state} />
        </div>
      ) : null}

      <form action={formAction} className="space-y-6">
        {mode === 'edit' ? <input type="hidden" name="id" value={project?.id ?? ''} /> : null}

        <Card className="p-6">
          <div className="grid gap-5">
            <TitleSlugInputs
              titleLabel="Project name"
              initialTitle={project?.name ?? ''}
              initialSlug={project?.slug ?? ''}
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Location" htmlFor="project-location" required>
                <input id="project-location" name="location" type="text" required defaultValue={project?.location ?? ''} className={inputClass} placeholder="City or region" />
              </Field>
              <Field label="Country" htmlFor="project-country" required>
                <input id="project-country" name="country" type="text" required defaultValue={project?.country ?? ''} className={inputClass} placeholder="Country" />
              </Field>
              <Field label="Latitude" htmlFor="project-latitude" hint="Decimal degrees, e.g. 51.5074">
                <input id="project-latitude" name="latitude" type="number" step="any" min={-90} max={90} defaultValue={project?.latitude ?? ''} className={inputClass} />
              </Field>
              <Field label="Longitude" htmlFor="project-longitude" hint="Decimal degrees, e.g. -0.1278">
                <input id="project-longitude" name="longitude" type="number" step="any" min={-180} max={180} defaultValue={project?.longitude ?? ''} className={inputClass} />
              </Field>
              <Field label="Capacity (MW)" htmlFor="project-capacityMw">
                <input id="project-capacityMw" name="capacityMw" type="number" step="any" min={0} defaultValue={project?.capacityMw ?? ''} className={inputClass} />
              </Field>
              <Field label="Technology" htmlFor="project-technology" required>
                <input id="project-technology" name="technology" type="text" required defaultValue={project?.technology ?? ''} className={inputClass} placeholder="e.g. Pressurized Water Reactor (PWR)" />
              </Field>
            </div>
            <div>
              <label htmlFor="project-status" className="mb-1.5 block text-sm font-semibold text-navy-900">
                Status <span className="text-red-600">*</span>
              </label>
              <select id="project-status" name="status" defaultValue={project?.status ?? 'PLANNED'} className={inputClass}>
                {PROJECT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {pretty(s)}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Start date" htmlFor="project-startDate">
                <input id="project-startDate" name="startDate" type="date" defaultValue={isoDate(project?.startDate)} className={inputClass} />
              </Field>
              <Field label="Completion date" htmlFor="project-completionDate">
                <input id="project-completionDate" name="completionDate" type="date" defaultValue={isoDate(project?.completionDate)} className={inputClass} />
              </Field>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-5 text-lg font-bold text-navy-900">Overview</h2>
          <div className="grid gap-5">
            <Field label="Summary" htmlFor="project-summary" required hint="Short description shown on cards.">
              <textarea id="project-summary" name="summary" rows={3} required defaultValue={project?.summary ?? ''} className={`${inputClass} resize-y`} maxLength={500} />
            </Field>
            <Field label="Description" htmlFor="project-description" required>
              <textarea id="project-description" name="description" rows={10} required defaultValue={project?.description ?? ''} className={`${inputClass} resize-y`} />
            </Field>
            <Field label="Hero image URL" htmlFor="project-heroImage">
              <input id="project-heroImage" name="heroImage" type="url" defaultValue={project?.heroImage ?? ''} className={inputClass} placeholder="https://…" />
            </Field>
            <Field label="Website URL" htmlFor="project-websiteUrl">
              <input id="project-websiteUrl" name="websiteUrl" type="url" defaultValue={project?.websiteUrl ?? ''} className={inputClass} placeholder="https://…" />
            </Field>
            <label className="inline-flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                name="featured"
                defaultChecked={project?.featured ?? false}
                className="h-4 w-4 rounded border-slate-300 text-cyan-500 focus:ring-cyan-500"
              />
              <span className="text-sm font-medium text-slate-700">
                Featured on the home page and projects landing page
              </span>
            </label>
          </div>
        </Card>

        <div className="flex items-center justify-end gap-3">
          <CancelButton href="/admin/projects" />
          <SubmitButton>{mode === 'edit' ? 'Save Changes' : 'Create Project'}</SubmitButton>
        </div>
      </form>
    </div>
  )
}