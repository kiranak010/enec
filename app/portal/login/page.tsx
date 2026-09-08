import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { verifyEmployeeSession } from '@/lib/auth/employee-dal'
import EmployeeLoginForm from './login-form'

export const metadata: Metadata = {
  title: 'Employee Sign In',
  robots: { index: false, follow: false },
}

export default async function EmployeeLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  const session = await verifyEmployeeSession()
  if (session) redirect('/portal/dashboard')
  return <EmployeeLoginForm error={error} />
}