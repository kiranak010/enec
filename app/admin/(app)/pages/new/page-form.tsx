'use client'

import { useActionState } from 'react'
import type { Page } from '@prisma/client'
import { createPage, updatePage, type ActionState } from '@/app/admin/actions'
import { Breadcrumbs, Card, PageHeader, Field, inputClass } from '@/components/admin/ui'
import { ActionNotice, CancelButton, SubmitButton } from '@/components/admin/client'
import { TitleSlugInputs } from '@/components/admin/title-slug'
import { pretty } from '@/lib/admin'
import { PAGE_STATUSES } from '@/lib/admin'

const initialState: ActionState = { status: 'idle' }

interface PageFormProps {
  mode: 'create' | 'edit'
  page: (Pick<Page, 'id' | 'title' | 'slug' | 'seoTitle' | 'seoDescription' | 'heroTitle' | 'heroSubtitle' | 'content' | 'status' | 'publishDate'>) | null
}

function isoDate(value: Date | string | null | undefined): string {
  if (!value) return ''
  return new Date(value).toISOString().slice(0, 10)
}

export default function PageForm({ mode, page }: PageFormProps) {
  const action = mode === 'edit' ? updatePage : createPage
  const [state, formAction] = useActionState(action, initialState)

  return (
    <div className="mx-auto max-w-3xl">
      <Breadcrumbs
        items={[
          { label: 'Admin', href: '/admin' },
          { label: 'Pages', href: '/admin/pages' },
          { label: mode === 'edit' ? 'Edit Page' : 'New Page' },
        ]}
      />
      <PageHeader
        title={mode === 'edit' ? 'Edit Page' : 'Create Page'}
        description="Build and publish a static CMS page."
      />

      {state.status !== 'idle' ? (
        <div className="mb-6">
          <ActionNotice state={state} />
        </div>
      ) : null}

      <form action={formAction} className="space-y-6">
        {mode === 'edit' ? <input type="hidden" name="id" value={page?.id ?? ''} /> : null}

        <Card className="p-6">
          <div className="grid gap-5">
            <TitleSlugInputs initialTitle={page?.title ?? ''} initialSlug={page?.slug ?? ''} />
            <div>
              <label htmlFor="page-status" className="mb-1.5 block text-sm font-semibold text-navy-900">
                Status <span className="text-red-600">*</span>
              </label>
              <select
                id="page-status"
                name="status"
                defaultValue={page?.status ?? 'DRAFT'}
                className={inputClass}
              >
                {PAGE_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {pretty(s)}
                  </option>
                ))}
              </select>
            </div>
            {page?.publishDate ? (
              <p className="text-xs text-slate-400">
                Published on {isoDate(page.publishDate)} — republishing keeps the original date.
              </p>
            ) : null}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-5 text-lg font-bold text-navy-900">Hero section</h2>
          <div className="grid gap-5">
            <Field label="Hero title" htmlFor="page-heroTitle">
              <input id="page-heroTitle" name="heroTitle" type="text" defaultValue={page?.heroTitle ?? ''} className={inputClass} placeholder="A bold statement" />
            </Field>
            <Field label="Hero subtitle" htmlFor="page-heroSubtitle">
              <input id="page-heroSubtitle" name="heroSubtitle" type="text" defaultValue={page?.heroSubtitle ?? ''} className={inputClass} placeholder="Supporting line under the hero title" />
            </Field>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-5 text-lg font-bold text-navy-900">Search engine optimisation</h2>
          <div className="grid gap-5">
            <Field label="SEO title" htmlFor="page-seoTitle">
              <input id="page-seoTitle" name="seoTitle" type="text" defaultValue={page?.seoTitle ?? ''} className={inputClass} maxLength={200} placeholder="Title shown in search results" />
            </Field>
            <Field label="SEO description" htmlFor="page-seoDescription">
              <textarea id="page-seoDescription" name="seoDescription" rows={2} defaultValue={page?.seoDescription ?? ''} className={`${inputClass} resize-y`} maxLength={320} placeholder="Meta description for search engines" />
            </Field>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-5 text-lg font-bold text-navy-900">Content</h2>
          <Field label="Body content" htmlFor="page-content" hint="Plain text or lightweight HTML blocks.">
            <textarea
              id="page-content"
              name="content"
              rows={14}
              defaultValue={page?.content ?? ''}
              className={`${inputClass} resize-y font-mono text-xs leading-relaxed`}
              placeholder={'<h2>Page heading</h2>\n\n<p>Write your page content here…</p>'}
            />
          </Field>
        </Card>

        <div className="flex items-center justify-end gap-3">
          <CancelButton href="/admin/pages" />
          <SubmitButton>{mode === 'edit' ? 'Save Changes' : 'Create Page'}</SubmitButton>
        </div>
      </form>
    </div>
  )
}