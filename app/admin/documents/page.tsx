import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { verifyAdmin } from '@/lib/auth/dal'
import { prisma } from '@/lib/prisma'
import { Breadcrumbs, Card, PageHeader } from '@/components/admin/ui'
import DocumentManager from './document-manager'

export const metadata: Metadata = { title: 'Documents' }

export default async function AdminDocumentsPage() {
  const session = await verifyAdmin()
  if (!session) redirect('/admin/login')

  const documents = await prisma.document.findMany({
    orderBy: { updatedAt: 'desc' },
  })

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'Documents' }]} />
      <PageHeader
        title="Documents"
        description="Publish reports, policies and publications to the document library."
      />
      <Card>
        <div className="p-4">
          <DocumentManager
            documents={documents.map((d) => ({
              id: d.id,
              title: d.title,
              slug: d.slug,
              category: d.category,
              description: d.description,
              year: d.year,
              fileUrl: d.fileUrl,
              fileSizeKb: d.fileSizeKb,
              published: d.published,
              downloadCount: d.downloadCount,
              createdAt: d.createdAt.toISOString(),
            }))}
          />
        </div>
      </Card>
    </div>
  )
}