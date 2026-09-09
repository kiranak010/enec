'use client'

import { useActionState } from 'react'
import { KeyRound, Save } from 'lucide-react'
import { updateSiteSetting, type ActionState } from '@/app/admin/actions'
import { inputClass, labelClass } from '@/components/admin/ui'
import { ActionNotice } from '@/components/admin/client'

const initialState: ActionState = { status: 'idle' }

export interface SettingRow {
  id: string
  key: string
  value: string
  group: string
}

const LABEL_HINTS: Record<string, string> = {
  site_name: 'The site name used in the header and metadata.',
  site_tagline: 'Short brand statement shown in the header.',
  contact_email: 'Primary contact inbox for the contact page.',
  headquarters: 'Street address of headquarters.',
}

function indexToLabel(key: string): string {
  return key
    .split(/[_-]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function SettingRow({ setting }: { setting: SettingRow }) {
  const [state, formAction, pending] = useActionState(updateSiteSetting, initialState)

  return (
    <div className="grid gap-4 border-b border-slate-100 py-5 last:border-0 sm:grid-cols-[1fr_auto]">
      <div className="min-w-0">
        <label htmlFor={`setting-${setting.key}`} className={labelClass}>
          {indexToLabel(setting.key)}
        </label>
        {LABEL_HINTS[setting.key] ? (
          <p className="mt-1 text-xs text-slate-400">{LABEL_HINTS[setting.key]}</p>
        ) : null}
        <form action={formAction} className="mt-2 flex max-w-xl items-start gap-2">
          <input type="hidden" name="id" value={setting.id} />
          <input type="hidden" name="key" value={setting.key} />
          <input
            id={`setting-${setting.key}`}
            name="value"
            type="text"
            required
            defaultValue={setting.value}
            className={inputClass}
          />
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700 disabled:pointer-events-none disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            Save
          </button>
        </form>
      </div>
      <div className="flex items-start sm:justify-end">
        {state.status !== 'idle' ? <ActionNotice state={state} /> : null}
      </div>
    </div>
  )
}

export default function SettingsForm({ groups }: { groups: { name: string; settings: SettingRow[] }[] }) {
  return (
    <div className="grid gap-6">
      {groups.map((group) => (
        <section key={group.name} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <header className="flex items-center gap-2 border-b border-slate-200 bg-gradient-to-r from-navy-900 to-navy-800 px-5 py-3.5">
            <KeyRound className="h-4 w-4 text-cyan-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              {group.name.charAt(0).toUpperCase() + group.name.slice(1)}
            </h2>
          </header>
          <div className="px-5">
            {group.settings.map((setting) => (
              <SettingRow key={setting.id} setting={setting} />
            ))}
            {group.settings.length === 0 ? (
              <p className="py-5 text-sm text-slate-400">No settings in this group.</p>
            ) : null}
          </div>
        </section>
      ))}
    </div>
  )
}