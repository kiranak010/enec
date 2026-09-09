'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { dbQuery } from '@/lib/db-retry'
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

  let user
  try {
    user = await dbQuery(() =>
      prisma.user.findUnique({
        where: { email: parsed.data.email },
      })
    )
  } catch {
    return {
      status: 'error',
      message:
        'Unable to connect to the database. It may be waking up — please try again in a few seconds.',
    }
  }

  const passwordOk =
    user && user.isActive && (await bcrypt.compare(parsed.data.password, user.passwordHash))
  if (!user || !passwordOk) {
    return {
      status: 'error',
      message: 'Invalid email or password.',
    }
  }

  try {
    await createSession(user.id, user.role)
    await dbQuery(() =>
      prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      })
    )
    await logAudit({ userId: user.id, actor: user.name, action: 'LOGIN', resource: 'Session' })
  } catch {
    return {
      status: 'error',
      message: 'Unable to start a session. Please try again.',
    }
  }

  redirect('/admin/dashboard')
}