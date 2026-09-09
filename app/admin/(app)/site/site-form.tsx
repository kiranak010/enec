'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { Globe, RotateCcw, Save } from 'lucide-react'
import { en as enDict } from '@/lib/i18n/translations'
import type { TKey } from '@/lib/i18n/translations'
import { DEFAULT_NAV, type NavItemDef, type NavOverrides } from '@/lib/nav'
import type { SiteContent } from '@/lib/site-content'
import { Field, inputClass } from '@/components/admin/ui'
import { ActionNotice } from '@/components/admin/client'
import { saveSiteContent, resetSiteContent, initialState } from './actions'

function navKeyLabel(key: string): string {
  return enDict[`nav.${key}` as TKey] ?? key
}

function NavItemEditor({ item, overrides }: { item: NavItemDef; overrides: NavOverrides }) {
  const override = overrides[item.key]

  return (
    <div className="border-b border-slate-200 py-5 last:border-0">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-navy-900">{navKeyLabel(item.key)}</p>
          <p className="mt-0.5 text-xs text-slate-400">/admin{item.href}</p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <input
              type="checkbox"
              name={`nav-hidden-${item.key}`}
              value="on"
              defaultChecked={Boolean(override?.hidden)}
              className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
            />
            Hide
          </label>
          <input
            type="text"
            name={`nav-label-${item.key}`}
            placeholder={navKeyLabel(item.key)}
            defaultValue={override?.label ?? ''}
            className={`${inputClass} w-48 shrink-0 sm:w-56`}
          />
        </div>
      </div>

      {item.children && item.children.length > 0 ? (
        <div className="mt-3 space-y-2 rounded-lg bg-slate-50 p-3">
          {item.children.map((child) => {
            const childOverride = override?.children?.[child.key]
            return (
              <div key={child.key} className="flex items-center justify-between gap-3">
                <p className="min-w-0 text-sm text-slate-700">{navKeyLabel(child.key)}</p>
                <div className="flex shrink-0 items-center gap-3">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                    <input
                      type="checkbox"
                      name={`nav-hidden-${item.key}__${child.key}`}
                      value="on"
                      defaultChecked={Boolean(childOverride?.hidden)}
                      className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                    />
                    Hide
                  </label>
                  <input
                    type="text"
                    name={`nav-label-${item.key}__${child.key}`}
                    placeholder={navKeyLabel(child.key)}
                    defaultValue={childOverride?.label ?? ''}
                    className={`${inputClass} w-48 shrink-0 sm:w-56`}
                  />
                </div>
              </div>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

export default function SiteForm({
  content,
  navOverrides,
}: {
  content: SiteContent
  navOverrides: NavOverrides
}) {
  const [state, formAction, pending] = useActionState(saveSiteContent, initialState)

  return (
    <form action={formAction} className="grid gap-6">
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <header className="flex items-center gap-2 border-b border-slate-200 bg-gradient-to-r from-navy-900 to-navy-800 px-5 py-3.5">
          <Globe className="h-4 w-4 text-cyan-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            Homepage Hero
          </h2>
        </header>
        <div className="grid gap-5 px-5 py-5 sm:grid-cols-2">
          <Field label="Eyebrow text" htmlFor="content-heroEyebrow">
            <input
              id="content-heroEyebrow"
              name="heroEyebrow"
              type="text"
              defaultValue={content.heroEyebrow}
              className={inputClass}
            />
          </Field>
          <Field label="CTA button (primary)" htmlFor="content-heroPrimaryCta">
            <input
              id="content-heroPrimaryCta"
              name="heroPrimaryCta"
              type="text"
              defaultValue={content.heroPrimaryCta}
              placeholder="Leave empty to use the language translation"
              className={inputClass}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Headline" htmlFor="content-heroTitle">
              <input
                id="content-heroTitle"
                name="heroTitle"
                type="text"
                defaultValue={content.heroTitle}
                className={inputClass}
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Subheadline" htmlFor="content-heroSubtitle">
              <textarea
                id="content-heroSubtitle"
                name="heroSubtitle"
                rows={3}
                defaultValue={content.heroSubtitle}
                className={inputClass}
              />
            </Field>
          </div>
          <Field label="CTA button (secondary)" htmlFor="content-heroSecondaryCta">
            <input
              id="content-heroSecondaryCta"
              name="heroSecondaryCta"
              type="text"
              defaultValue={content.heroSecondaryCta}
              placeholder="Leave empty to use the language translation"
              className={inputClass}
            />
          </Field>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <header className="flex items-center gap-2 border-b border-slate-200 bg-gradient-to-r from-navy-900 to-navy-800 px-5 py-3.5">
          <Globe className="h-4 w-4 text-cyan-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            Footer Introduction
          </h2>
        </header>
        <div className="px-5 py-5">
          <Field label="Footer intro paragraph" htmlFor="content-footerIntro">
            <textarea
              id="content-footerIntro"
              name="footerIntro"
              rows={3}
              defaultValue={content.footerIntro}
              className={inputClass}
            />
          </Field>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <header className="flex items-center gap-2 border-b border-slate-200 bg-gradient-to-r from-navy-900 to-navy-800 px-5 py-3.5">
          <Globe className="h-4 w-4 text-cyan-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            Top Navigation
          </h2>
        </header>
        <div className="px-5">
          <p className="border-b border-slate-100 py-4 text-xs leading-relaxed text-slate-500">
            Rename or hide any top menu item. Leave a custom label empty to keep the default
            name (which is translated per selected language). Hidden items are removed from the
            public menu. Child items belong to their parent&apos;s dropdown.
          </p>
          {DEFAULT_NAV.map((item) => (
            <NavItemEditor key={item.key} item={item} overrides={navOverrides} />
          ))}
        </div>
      </section>

      <section className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0 max-w-xl">
          {state.status !== 'idle' ? (
            <ActionNotice state={state} />
          ) : (
            <p className="text-sm text-slate-400">
              Saving applies changes to the live website immediately.
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <form
            action={async () => {
              await resetSiteContent()
            }}
            onSubmit={(e) => {
              if (!window.confirm('Reset all website content to its default values?')) {
                e.preventDefault()
              }
            }}
          >
            <button
              type="submit"
              disabled={pending}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
            >
              <RotateCcw className="h-4 w-4" />
              Reset defaults
            </button>
          </form>
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-cyan-500 disabled:pointer-events-none disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {pending ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </section>

      <p className="text-xs text-slate-400">
        Editing access: SUPER_ADMIN and ADMIN. View the public site{' '}
        <Link href="/" className="font-medium text-cyan-600 hover:underline" target="_blank">
          new tab
        </Link>
        .
      </p>
    </form>
  )
}