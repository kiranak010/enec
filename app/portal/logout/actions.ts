'use server'

import { redirect } from 'next/navigation'
import { deleteEmployeeSession } from '@/lib/auth/employee-session'

export async function employeeLogout() {
  await deleteEmployeeSession()
  redirect('/portal/login')
}