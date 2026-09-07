export const localeCodes = ['en', 'ar'] as const

export type LocaleCode = (typeof localeCodes)[number]

export type LangDir = 'ltr' | 'rtl'

export interface LocaleMeta {
  code: LocaleCode
  name: string
  nativeName: string
  dir: LangDir
}

export const LOCALES: LocaleMeta[] = [
  { code: 'en', name: 'English', nativeName: 'English', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', dir: 'rtl' },
]

export const DEFAULT_LOCALE: LocaleCode = 'en'

const RTL_SET = new Set<LocaleCode>(['ar'])

export function isRtlLocale(code: LocaleCode): boolean {
  return RTL_SET.has(code)
}

function isLocaleCode(value: string): value is LocaleCode {
  return (localeCodes as readonly string[]).includes(value)
}

export function resolveLocale(value: string | undefined | null): LocaleCode {
  if (value && isLocaleCode(value)) return value
  return DEFAULT_LOCALE
}

export function getLocaleMeta(code: LocaleCode): LocaleMeta {
  return LOCALES.find((l) => l.code === code) ?? LOCALES[0]
}

export const LOCALE_COOKIE = 'site_locale'