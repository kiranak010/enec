import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { verifyAdmin } from '@/lib/auth/dal'
import { prisma } from '@/lib/prisma'
import PageForm from './page-form'

export const metadata: Metadata = {
  title: { absolute: 'New Page' },
}

export default async function AdminNewPagePage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>
}) {
  const session = await verifyAdmin()
  if (!session) redirect('/admin/login')

  const { id } = await searchParams
  let editing = null
  if (id) {
    editing = await prisma.page.findUnique({ where: { id } })
  }

  return <PageForm mode={editing ? 'edit' : 'create'} page={editing} />
}