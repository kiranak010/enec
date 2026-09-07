'use client'

import { createContext, useCallback, useContext, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  LOCALES,
  LOCALE_COOKIE,
  DEFAULT_LOCALE,
  isRtlLocale,
  getLocaleMeta,
  resolveLocale,
  type LocaleCode,
} from '@/lib/i18n/locales'
import { translate, type TKey } from '@/lib/i18n/translations'
import type { SiteContent } from '@/lib/site-content'
import type { NavOverrides } from '@/lib/nav'

export interface SiteContextValue {
  locale: LocaleCode
  dir: 'ltr' | 'rtl'
  locales: typeof LOCALES
  content: SiteContent
  navOverrides: NavOverrides
  t: (key: TKey) => string
  switchLocale: (code: string) => void
}

const SiteContext = createContext<SiteContextValue | null>(null)

export function SiteProvider({
  locale,
  content,
  navOverrides,
  children,
}: {
  locale: LocaleCode
  content: SiteContent
  navOverrides: NavOverrides
  children: React.ReactNode
}) {
  const router = useRouter()

  const switchLocale = useCallback(
    (code: string) => {
      const target = resolveLocale(code)
      document.cookie = `${LOCALE_COOKIE}=${target}; path=/; max-age=31536000; samesite=lax`
      document.documentElement.lang = target
      document.documentElement.dir = getLocaleMeta(target).dir
      try {
        router.refresh()
      } catch {
        window.location.reload()
      }
    },
    [router]
  )

  const value = useMemo<SiteContextValue>(() => {
    const safeLocale = resolveLocale(locale)
    return {
      locale: safeLocale,
      dir: isRtlLocale(safeLocale) ? 'rtl' : 'ltr',
      locales: LOCALES,
      content,
      navOverrides,
      t: (key) => translate(safeLocale, key),
      switchLocale,
    }
  }, [locale, content, navOverrides, switchLocale])

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
}

export function useSite(): SiteContextValue {
  const ctx = useContext(SiteContext)
  if (!ctx) {
    const fallbackLocale: LocaleCode = DEFAULT_LOCALE
    return {
      locale: fallbackLocale,
      dir: 'ltr',
      locales: LOCALES,
      content: {
        heroEyebrow: '',
        heroTitle: '',
        heroSubtitle: '',
        heroPrimaryCta: '',
        heroSecondaryCta: '',
        footerIntro: '',
      },
      navOverrides: {},
      t: (key) => translate(fallbackLocale, key),
      switchLocale: () => undefined,
    }
  }
  return ctx
}