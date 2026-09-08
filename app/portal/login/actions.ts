'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { createEmployeeSession } from '@/lib/auth/employee-session'

const employeeLoginSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address.'),
  password: z.string().min(1, 'Please enter your password.'),
})

export type EmployeeLoginState = {
  status: 'idle' | 'error'
  message?: string
}

export async function employeeLogin(
  _prevState: EmployeeLoginState,
  formData: FormData
): Promise<EmployeeLoginState> {
  const parsed = employeeLoginSchema.safeParse({
    email: String(formData.get('email') ?? ''),
    password: String(formData.get('password') ?? ''),
  })

  if (!parsed.success) {
    return {
      status: 'error',
      message: parsed.error.errors[0]?.message ?? 'Please review the form and try again.',
    }
  }

  const employee = await prisma.employee.findUnique({
    where: { email: parsed.data.email },
  })

  const passwordOk =
    employee && employee.isActive && (await bcrypt.compare(parsed.data.password, employee.passwordHash))
  if (!employee || !passwordOk) {
    return {
      status: 'error',
      message: 'Invalid email or password.',
    }
  }

  await createEmployeeSession(employee.id, employee.role)
  await prisma.employee.update({
    where: { id: employee.id },
    data: { lastLoginAt: new Date() },
  })

  redirect('/portal/dashboard')
}