import 'server-only'
import { cache } from 'react'
import { getEmployeeSession } from './employee-session'
import { prisma } from '../prisma'

export interface SessionEmployee {
  employeeId: string
  role: string
}

export const verifyEmployeeSession = cache(async (): Promise<SessionEmployee | null> => {
  try {
    const session = await getEmployeeSession()
    if (!session?.employeeId || !session?.role) return null
    return {
      employeeId: session.employeeId,
      role: session.role,
    }
  } catch {
    return null
  }
})

export const getEmployee = cache(async () => {
  const session = await verifyEmployeeSession()
  if (!session) return null

  const employee = await prisma.employee.findUnique({
    where: { id: session.employeeId },
    select: {
      id: true,
      name: true,
      employeeId: true,
      email: true,
      department: true,
      role: true,
      phone: true,
      avatarUrl: true,
      isActive: true,
      lastLoginAt: true,
      createdAt: true,
    },
  })

  if (!employee || !employee.isActive) return null
  return employee
})