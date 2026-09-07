'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, Globe } from 'lucide-react'
import { useSite } from '@/lib/i18n/provider'
import { cn } from '@/lib/utils'

export function LanguageSwitcherDropdown() {
  const { locale, locales, switchLocale, t } = useSite()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const current = locales.find((l) => l.code === locale) ?? locales[0]

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-label={t('common.language')}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 rounded-lg px-2 py-2 text-white/85 transition-colors hover:bg-white/10 hover:text-white"
      >
        <Globe className="h-5 w-5" />
        <span className="hidden text-xs font-semibold uppercase tracking-wider md:inline">
          {current.code}
        </span>
        <ChevronDown
          className={cn('hidden h-3 w-3 transition-transform md:block', open && 'rotate-180')}
        />
      </button>

      {open ? (
        <div
          role="listbox"
          aria-label={t('common.language')}
          className="absolute right-0 top-full z-50 mt-2 max-h-80 w-56 origin-top-right overflow-y-auto rounded-xl border border-navy-700/60 bg-navy-900/95 p-1.5 shadow-2xl shadow-black/40 backdrop-blur-lg"
        >
          {locales.map((l) => {
            const active = l.code === locale
            return (
              <button
                key={l.code}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => {
                  switchLocale(l.code)
                  setOpen(false)
                }}
                className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm text-white/85 transition-colors hover:bg-cyan-500/10 hover:text-white"
                dir="auto"
              >
                <span className="truncate">{l.nativeName}</span>
                <span className="shrink-0 text-xs text-navy-200">{l.code}</span>
                {active ? <Check className="h-3.5 w-3.5 shrink-0 text-cyan-400" /> : null}
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

export function LanguageSwitcherList() {
  const { locales, locale, switchLocale, t } = useSite()

  return (
    <div className="border-t border-navy-700/50 px-3 pt-4">
      <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-navy-200">
        {t('common.language')}
      </p>
      <div className="grid grid-cols-3 gap-1.5">
        {locales.map((l) => (
          <button
            key={l.code}
            type="button"
            onClick={() => switchLocale(l.code)}
            className={cn(
              'rounded-lg border px-2 py-2 text-xs font-medium transition-colors',
              l.code === locale
                ? 'border-cyan-500 bg-cyan-500/15 text-cyan-300'
                : 'border-navy-700/60 text-white/80 hover:bg-white/5 hover:text-white'
            )}
            dir="auto"
          >
            <span className="block truncate">{l.nativeName}</span>
          </button>
        ))}
      </div>
    </div>
  )
}