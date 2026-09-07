import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { verifyAdmin } from '@/lib/auth/dal'
import LoginForm from './login-form'

export const metadata: Metadata = {
  title: 'Sign In',
  robots: { index: false, follow: false },
}

export default async function AdminLoginPage() {
  const session = await verifyAdmin()
  if (session) redirect('/admin/dashboard')
  return <LoginForm />
}