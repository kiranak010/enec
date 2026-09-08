import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { verifyEmployeeSession, getEmployee } from '@/lib/auth/employee-dal'
import PortalShell from '@/components/portal/portal-shell'

export const metadata: Metadata = {
  title: { default: 'Portal', template: '%s | ENEC Portal' },
  robots: { index: false, follow: false },
}

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await verifyEmployeeSession()
  if (!session) redirect('/portal/login')

  const employee = await getEmployee()
  if (!employee) redirect('/portal/login')

  return (
    <PortalShell
      user={{
        name: employee.name,
        email: employee.email,
        employeeId: employee.employeeId,
        department: employee.department,
        role: employee.role,
        avatarUrl: employee.avatarUrl,
      }}
    >
      {children}
    </PortalShell>
  )
}