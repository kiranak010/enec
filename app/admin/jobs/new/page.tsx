import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { verifyAdmin } from '@/lib/auth/dal'
import { prisma } from '@/lib/prisma'
import JobForm, { type JobFormRecord } from './job-form'

export const metadata: Metadata = {
  title: { absolute: 'New Job' },
}

export default async function AdminNewJobPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>
}) {
  const session = await verifyAdmin()
  if (!session) redirect('/admin/login')

  const { id } = await searchParams
  let editing: JobFormRecord | null = null
  if (id) {
    const job = await prisma.job.findUnique({ where: { id } })
    if (job) {
      editing = {
        id: job.id,
        title: job.title,
        slug: job.slug,
        department: job.department,
        location: job.location,
        employmentType: job.employmentType,
        summary: job.summary,
        description: job.description,
        requirements: job.requirements,
        status: job.status,
        expiresAt: job.expiresAt,
      }
    }
  }

  return <JobForm mode={editing ? 'edit' : 'create'} job={editing} />
}