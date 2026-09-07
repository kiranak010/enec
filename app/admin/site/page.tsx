import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { verifyAdmin } from '@/lib/auth/dal'
import { prisma } from '@/lib/prisma'
import { Breadcrumbs, PageHeader } from '@/components/admin/ui'
import {
  DEFAULT_SITE_CONTENT,
  SITE_CONTENT_KEYS,
  CONTENT_SETTING_GROUP,
  NAV_OVERRIDES_KEY,
  type SiteContent,
} from '@/lib/site-content'
import type { NavOverrides } from '@/lib/nav'
import SiteForm from './site-form'

export const metadata: Metadata = { title: 'Website Editor' }

export default async function AdminSiteEditorPage() {
  const session = await verifyAdmin()
  if (!session) redirect('/admin/login')

  const rows = await prisma.siteSetting.findMany({
    where: { group: CONTENT_SETTING_GROUP },
    select: { key: true, value: true },
  })

  const values: Partial<Record<keyof SiteContent, string>> = {}
  for (const row of rows) {
    if (SITE_CONTENT_KEYS.includes(row.key)) values[row.key as keyof SiteContent] = row.value
  }

  const content: SiteContent = {
    heroEyebrow: values.heroEyebrow?.trim() || DEFAULT_SITE_CONTENT.heroEyebrow,
    heroTitle: values.heroTitle?.trim() || DEFAULT_SITE_CONTENT.heroTitle,
    heroSubtitle: values.heroSubtitle?.trim() || DEFAULT_SITE_CONTENT.heroSubtitle,
    heroPrimaryCta: values.heroPrimaryCta?.trim() || '',
    heroSecondaryCta: values.heroSecondaryCta?.trim() || '',
    footerIntro: values.footerIntro?.trim() || DEFAULT_SITE_CONTENT.footerIntro,
  }

  const navRow = await prisma.siteSetting.findUnique({
    where: { key: NAV_OVERRIDES_KEY },
    select: { value: true },
  })
  let navOverrides: NavOverrides = {}
  if (navRow?.value) {
    try {
      navOverrides = JSON.parse(navRow.value) as NavOverrides
    } catch {
      navOverrides = {}
    }
  }

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'Website Editor' }]} />
      <PageHeader
        title="Website Editor"
        description="Edit public site content and the top navigation. Saved changes appear on the website immediately."
      />
      <SiteForm content={content} navOverrides={navOverrides} />
    </div>
  )
}