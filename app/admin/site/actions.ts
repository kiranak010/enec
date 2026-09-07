'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { verifyAdmin } from '@/lib/auth/dal'
import { logAudit } from '@/lib/audit'
import {
  SITE_CONTENT_KEYS,
  CONTENT_SETTING_GROUP,
  NAV_OVERRIDES_KEY,
  type SiteContentValue,
} from '@/lib/site-content'
import { DEFAULT_NAV } from '@/lib/nav'
import type { NavOverrides } from '@/lib/nav'

export type ActionState = {
  status: 'idle' | 'success' | 'error'
  message?: string
}

const initialState: ActionState = { status: 'idle' }

function err(message: string): ActionState {
  return { status: 'error', message }
}

function ok(message: string): ActionState {
  return { status: 'success', message }
}

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? '').trim()
}

function isChecked(formData: FormData, key: string): boolean {
  return formData.get(key) === 'on'
}

export { initialState }

export async function saveSiteContent(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await verifyAdmin()
  if (!session) redirect('/admin/login')

  const values: SiteContentValue = {}
  for (const key of SITE_CONTENT_KEYS) {
    values[key as keyof SiteContentValue] = str(formData, key)
  }

  const overrides: NavOverrides = {}
  for (const item of DEFAULT_NAV) {
    const entry: NavOverrides[keyof NavOverrides] = {}
    const label = str(formData, `nav-label-${item.key}`)
    if (label) entry.label = label
    if (isChecked(formData, `nav-hidden-${item.key}`)) entry.hidden = true

    if (item.children && item.children.length > 0) {
      const children: Record<string, { label?: string; hidden?: boolean }> = {}
      for (const child of item.children) {
        const childLabel = str(formData, `nav-label-${item.key}__${child.key}`)
        const childHidden = isChecked(formData, `nav-hidden-${item.key}__${child.key}`)
        const childEntry: { label?: string; hidden?: boolean } = {}
        if (childLabel) childEntry.label = childLabel
        if (childHidden) childEntry.hidden = childHidden
        if (childLabel || childHidden) children[child.key] = childEntry
      }
      if (Object.keys(children).length > 0) entry.children = children
    }

    if (Object.keys(entry).length > 0) overrides[item.key] = entry
  }

  try {
    for (const key of SITE_CONTENT_KEYS) {
      const value = values[key as keyof SiteContentValue] ?? ''
      await prisma.siteSetting.upsert({
        where: { key },
        update: { value, group: CONTENT_SETTING_GROUP },
        create: { key, value, group: CONTENT_SETTING_GROUP },
      })
    }

    await prisma.siteSetting.upsert({
      where: { key: NAV_OVERRIDES_KEY },
      update: { value: JSON.stringify(overrides), group: 'navigation' },
      create: { key: NAV_OVERRIDES_KEY, value: JSON.stringify(overrides), group: 'navigation' },
    })

    await logAudit({
      userId: session.userId,
      action: 'UPDATE',
      resource: 'SiteSetting',
      resourceId: 'content',
      metadata: { keys: SITE_CONTENT_KEYS, nav: Object.keys(overrides) },
    })

    revalidatePath('/admin/site')
    return ok('Website content saved. Changes are now live on the public site.')
  } catch {
    return err('Could not save the website content. Please try again.')
  }
}

export async function resetSiteContent(): Promise<ActionState> {
  const session = await verifyAdmin()
  if (!session) redirect('/admin/login')

  try {
    await prisma.siteSetting.deleteMany({ where: { group: CONTENT_SETTING_GROUP } })
    await prisma.siteSetting.delete({ where: { key: NAV_OVERRIDES_KEY } })

    await logAudit({
      userId: session.userId,
      action: 'RESET',
      resource: 'SiteSetting',
      resourceId: 'content',
    })

    revalidatePath('/admin/site')
    return ok('Website content reset to defaults.')
  } catch {
    return err('Could not reset the website content. Please try again.')
  }
}