import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { verifyAdmin } from '@/lib/auth/dal'
import { prisma } from '@/lib/prisma'
import ProjectForm, { type ProjectFormRecord } from './project-form'

export const metadata: Metadata = {
  title: { absolute: 'New Project' },
}

export default async function AdminNewProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>
}) {
  const session = await verifyAdmin()
  if (!session) redirect('/admin/login')

  const { id } = await searchParams
  let editing: ProjectFormRecord | null = null
  if (id) {
    const project = await prisma.project.findUnique({ where: { id } })
    if (project) {
      editing = {
        id: project.id,
        name: project.name,
        slug: project.slug,
        location: project.location,
        country: project.country,
        latitude: project.latitude,
        longitude: project.longitude,
        capacityMw: project.capacityMw,
        technology: project.technology,
        status: project.status,
        summary: project.summary,
        description: project.description,
        heroImage: project.heroImage,
        websiteUrl: project.websiteUrl,
        featured: project.featured,
        startDate: project.startDate,
        completionDate: project.completionDate,
      }
    }
  }

  return <ProjectForm mode={editing ? 'edit' : 'create'} project={editing} />
}