import { redirect } from 'next/navigation'
import { verifyAdmin } from '@/lib/auth/dal'

export const runtime = 'nodejs'

export default async function AdminIndexPage() {
  const session = await verifyAdmin()
  if (session) redirect('/admin/dashboard')
  redirect('/admin/login')
}