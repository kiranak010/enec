'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { createSession } from '@/lib/auth/session'
import { logAudit } from '@/lib/audit'

const loginSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address.'),
  password: z.string().min(1, 'Please enter your password.'),
})

export type LoginState = {
  status: 'idle' | 'error'
  message?: string
}

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: String(formData.get('email') ?? ''),
    password: String(formData.get('password') ?? ''),
  })

  if (!parsed.success) {
    return {
      status: 'error',
      message: parsed.error.errors[0]?.message ?? 'Please review the form and try again.',
    }
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  })

  const passwordOk =
    user && user.isActive && (await bcrypt.compare(parsed.data.password, user.passwordHash))
  if (!user || !passwordOk) {
    return {
      status: 'error',
      message: 'Invalid email or password.',
    }
  }

  await createSession(user.id, user.role)
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  })
  await logAudit({ userId: user.id, actor: user.name, action: 'LOGIN', resource: 'Session' })

  redirect('/admin/dashboard')
}