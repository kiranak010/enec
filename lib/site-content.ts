import { prisma } from '@/lib/prisma'
import type { NavOverrides } from '@/lib/nav'

export interface SiteContent {
  heroEyebrow: string
  heroTitle: string
  heroSubtitle: string
  heroPrimaryCta: string
  heroSecondaryCta: string
  footerIntro: string
}

export const DEFAULT_SITE_CONTENT: SiteContent = {
  heroEyebrow: 'Emirates Nuclear Energy Corporation',
  heroTitle: 'Powering a Cleaner Energy Future',
  heroSubtitle:
    'A global leader in nuclear energy and advanced clean power technologies, delivering reliable baseload electricity for generations.',
  heroPrimaryCta: '',
  heroSecondaryCta: '',
  footerIntro: 'Powering a Cleaner Energy Future. Abu Dhabi, United Arab Emirates.',
}

export const SITE_CONTENT_KEYS = Object.keys(DEFAULT_SITE_CONTENT)

export const NAV_OVERRIDES_KEY = 'nav.overrides'

export const CONTENT_SETTING_GROUP = 'content'

export type SiteContentValue = Partial<Record<keyof SiteContent, string>>

function pick(values: SiteContentValue): SiteContent {
  return {
    heroEyebrow: values.heroEyebrow?.trim() || DEFAULT_SITE_CONTENT.heroEyebrow,
    heroTitle: values.heroTitle?.trim() || DEFAULT_SITE_CONTENT.heroTitle,
    heroSubtitle: values.heroSubtitle?.trim() || DEFAULT_SITE_CONTENT.heroSubtitle,
    heroPrimaryCta: values.heroPrimaryCta?.trim() || '',
    heroSecondaryCta: values.heroSecondaryCta?.trim() || '',
    footerIntro: values.footerIntro?.trim() || DEFAULT_SITE_CONTENT.footerIntro,
  }
}

function parseJsonObject<T>(value: string | undefined | null, fallback: T): T {
  if (!value) return fallback
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

export async function getSiteContent(): Promise<SiteContent> {
  const rows = await prisma.siteSetting.findMany({
    where: { group: CONTENT_SETTING_GROUP },
    select: { key: true, value: true },
  })
  const values: SiteContentValue = {}
  for (const row of rows) {
    if (SITE_CONTENT_KEYS.includes(row.key)) values[row.key as keyof SiteContent] = row.value
  }
  return pick(values)
}

export async function getNavOverrides(): Promise<NavOverrides> {
  const row = await prisma.siteSetting.findUnique({
    where: { key: NAV_OVERRIDES_KEY },
    select: { value: true },
  })
  return parseJsonObject<NavOverrides>(row?.value, {})
}

export async function getSiteSettings() {
  const [content, navOverrides] = await Promise.all([getSiteContent(), getNavOverrides()])
  return { content, navOverrides }
}