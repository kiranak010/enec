import { redirect } from 'next/navigation'
import { verifyEmployeeSession } from '@/lib/auth/employee-dal'

export default async function PortalIndexPage() {
  const session = await verifyEmployeeSession()
  if (session) redirect('/portal/dashboard')
  redirect('/portal/login')
}