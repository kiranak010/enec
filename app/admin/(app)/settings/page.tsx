import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { verifyAdmin } from '@/lib/auth/dal'
import { prisma } from '@/lib/prisma'
import { Breadcrumbs, PageHeader } from '@/components/admin/ui'
import SettingsForm from './settings-form'

export const metadata: Metadata = { title: 'Site Settings' }

const GROUP_ORDER = ['general', 'contact', 'social', 'footer']

export default async function AdminSettingsPage() {
  const session = await verifyAdmin()
  if (!session) redirect('/admin/login')

  const settings = await prisma.siteSetting.findMany({ orderBy: { key: 'asc' } })

  const byGroup = new Map<string, typeof settings>()
  for (const setting of settings) {
    const list = byGroup.get(setting.group) ?? []
    list.push(setting)
    byGroup.set(setting.group, list)
  }

  const orderedGroups = [...GROUP_ORDER, ...[...byGroup.keys()].filter((g) => !GROUP_ORDER.includes(g))]
  const groups = orderedGroups.map((name) => ({
    name,
    settings: (byGroup.get(name) ?? []).map((s) => ({
      id: s.id,
      key: s.key,
      value: s.value,
      group: s.group,
    })),
  }))

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'Settings' }]} />
      <PageHeader
        title="Site Settings"
        description="Brand and contact details used across the public site."
      />
      <SettingsForm groups={groups} />
    </div>
  )
}