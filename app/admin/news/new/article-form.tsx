'use client'

import { useActionState } from 'react'
import { createArticle, updateArticle, type ActionState } from '@/app/admin/actions'
import { Breadcrumbs, Card, PageHeader, Field, inputClass } from '@/components/admin/ui'
import { ActionNotice, CancelButton, SubmitButton } from '@/components/admin/client'
import { TitleSlugInputs } from '@/components/admin/title-slug'
import { pretty } from '@/lib/admin'
import { NEWS_STATUSES } from '@/lib/admin'

const initialState: ActionState = { status: 'idle' }

export interface ArticleFormRecord {
  id: string
  title: string
  slug: string
  subtitle: string | null
  excerpt: string
  content: string
  categoryId: string
  heroImage: string | null
  authorName: string | null
  readTimeMins: number | null
  seoTitle: string | null
  seoDescription: string | null
  isFeatured: boolean
  status: string
  publishedAt: Date | null
  tags: string
}

interface ArticleFormProps {
  mode: 'create' | 'edit'
  article: ArticleFormRecord | null
  categories: { id: string; name: string }[]
}

export default function ArticleForm({ mode, article, categories }: ArticleFormProps) {
  const action = mode === 'edit' ? updateArticle : createArticle
  const [state, formAction] = useActionState(action, initialState)

  return (
    <div className="mx-auto max-w-3xl">
      <Breadcrumbs
        items={[
          { label: 'Admin', href: '/admin' },
          { label: 'News', href: '/admin/news' },
          { label: mode === 'edit' ? 'Edit Article' : 'New Article' },
        ]}
      />
      <PageHeader
        title={mode === 'edit' ? 'Edit Article' : 'Create Article'}
        description="Write and publish a news article."
      />

      {state.status !== 'idle' ? (
        <div className="mb-6">
          <ActionNotice state={state} />
        </div>
      ) : null}

      <form action={formAction} className="space-y-6">
        {mode === 'edit' ? <input type="hidden" name="id" value={article?.id ?? ''} /> : null}

        <Card className="p-6">
          <div className="grid gap-5">
            <TitleSlugInputs initialTitle={article?.title ?? ''} initialSlug={article?.slug ?? ''} />
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="article-status" className="mb-1.5 block text-sm font-semibold text-navy-900">
                  Status <span className="text-red-600">*</span>
                </label>
                <select id="article-status" name="status" defaultValue={article?.status ?? 'DRAFT'} className={inputClass}>
                  {NEWS_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {pretty(s)}
                    </option>
                  ))}
                </select>
              </div>
              <Field label="Category" htmlFor="article-categoryId" required>
                <select id="article-categoryId" name="categoryId" required defaultValue={article?.categoryId ?? ''} className={inputClass}>
                  <option value="" disabled>
                    Select a category…
                  </option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-5 text-lg font-bold text-navy-900">Article details</h2>
          <div className="grid gap-5">
            <Field label="Subtitle" htmlFor="article-subtitle">
              <input id="article-subtitle" name="subtitle" type="text" defaultValue={article?.subtitle ?? ''} className={inputClass} maxLength={300} placeholder="Short kicker under the headline" />
            </Field>
            <Field label="Excerpt" htmlFor="article-excerpt" required hint="Short summary shown on cards and in search results.">
              <textarea id="article-excerpt" name="excerpt" rows={2} required defaultValue={article?.excerpt ?? ''} className={`${inputClass} resize-y`} maxLength={500} />
            </Field>
            <Field label="Content" htmlFor="article-content" required hint="Separate paragraphs with a blank line.">
              <textarea id="article-content" name="content" rows={14} required defaultValue={article?.content ?? ''} className={`${inputClass} resize-y`} />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Author name" htmlFor="article-authorName">
                <input id="article-authorName" name="authorName" type="text" defaultValue={article?.authorName ?? ''} className={inputClass} placeholder="Jane Doe" />
              </Field>
              <Field label="Read time (minutes)" htmlFor="article-readTimeMins" hint="Leave blank to auto-calculate.">
                <input id="article-readTimeMins" name="readTimeMins" type="number" min={1} defaultValue={article?.readTimeMins ?? ''} className={inputClass} />
              </Field>
            </div>
            <Field label="Tags" htmlFor="article-tags" hint="Comma separated, e.g. innovation, reactors, policy.">
              <input id="article-tags" name="tags" type="text" defaultValue={article?.tags ?? ''} className={inputClass} />
            </Field>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-5 text-lg font-bold text-navy-900">Media & SEO</h2>
          <div className="grid gap-5">
            <Field label="Hero image URL" htmlFor="article-heroImage">
              <input id="article-heroImage" name="heroImage" type="url" defaultValue={article?.heroImage ?? ''} className={inputClass} placeholder="https://…" />
            </Field>
            <Field label="SEO title" htmlFor="article-seoTitle">
              <input id="article-seoTitle" name="seoTitle" type="text" defaultValue={article?.seoTitle ?? ''} className={inputClass} maxLength={200} />
            </Field>
            <Field label="SEO description" htmlFor="article-seoDescription">
              <textarea id="article-seoDescription" name="seoDescription" rows={2} defaultValue={article?.seoDescription ?? ''} className={`${inputClass} resize-y`} maxLength={320} />
            </Field>
            <label className="inline-flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                name="isFeatured"
                defaultChecked={article?.isFeatured ?? false}
                className="h-4 w-4 rounded border-slate-300 text-cyan-500 focus:ring-cyan-500"
              />
              <span className="text-sm font-medium text-slate-700">
                Feature this article on the news landing page
              </span>
            </label>
          </div>
        </Card>

        <div className="flex items-center justify-end gap-3">
          <CancelButton href="/admin/news" />
          <SubmitButton>{mode === 'edit' ? 'Save Changes' : 'Create Article'}</SubmitButton>
        </div>
      </form>
    </div>
  )
}