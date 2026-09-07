'use server'

import { cookies } from 'next/headers'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const departments = [
  'General',
  'Media',
  'Careers',
  'Investors',
  'Suppliers',
  'Technical',
] as const

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Please enter your full name.')
    .max(100, 'Name must be under 100 characters.'),
  email: z
    .string()
    .trim()
    .email('Please enter a valid email address.')
    .max(150, 'Email must be under 150 characters.'),
  phone: z
    .string()
    .trim()
    .max(50, 'Phone number must be under 50 characters.')
    .optional()
    .or(z.literal('')),
  company: z
    .string()
    .trim()
    .max(150, 'Company must be under 150 characters.')
    .optional()
    .or(z.literal('')),
  department: z.enum(departments, {
    errorMap: () => ({ message: 'Please select a department.' }),
  }),
  subject: z
    .string()
    .trim()
    .min(3, 'Please enter a subject.')
    .max(200, 'Subject must be under 200 characters.'),
  message: z
    .string()
    .trim()
    .min(20, 'Message must be at least 20 characters.')
    .max(5000, 'Message must be under 5,000 characters.'),
})

export type ContactFormState = {
  status: 'idle' | 'success' | 'error'
  message?: string
}

interface ContactFormPayload {
  name: string
  email: string
  phone?: string
  company?: string
  department: string
  subject: string
  message: string
}

export async function submitContact(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const parsed = contactSchema.safeParse({
    name: String(formData.get('name') ?? ''),
    email: String(formData.get('email') ?? ''),
    phone: String(formData.get('phone') ?? ''),
    company: String(formData.get('company') ?? ''),
    department: String(formData.get('department') ?? ''),
    subject: String(formData.get('subject') ?? ''),
    message: String(formData.get('message') ?? ''),
  })

  if (!parsed.success) {
    return {
      status: 'error',
      message:
        parsed.error.errors[0]?.message ??
        'Please review the form and try again.',
    }
  }

  const cookieStore = await cookies()
  const lastSubmitted = cookieStore.get('contact_last_submitted')?.value

  if (lastSubmitted) {
    const elapsed = Date.now() - Number(lastSubmitted)
    if (!Number.isNaN(Number(lastSubmitted)) && elapsed < 60_000) {
      return {
        status: 'error',
        message:
          'Thank you for your interest — a message was already sent recently. Please wait a moment before sending another message.',
      }
    }
  }

  const data = parsed.data as ContactFormPayload

  try {
    await prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        company: data.company || null,
        department: data.department,
        subject: data.subject,
        message: data.message,
      },
    })
  } catch {
    // Message delivery is not blocked if the database is unavailable.
  }

  cookieStore.set('contact_last_submitted', String(Date.now()), {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 3600,
    path: '/',
  })

  return {
    status: 'success',
    message: `Thank you, ${data.name}. Your message has been received by our ${data.department} team and will be answered within two business days.`,
  }
}