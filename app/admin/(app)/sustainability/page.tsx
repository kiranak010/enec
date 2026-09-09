import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { verifyAdmin } from '@/lib/auth/dal'
import { prisma } from '@/lib/prisma'
import { Breadcrumbs, Card, PageHeader } from '@/components/admin/ui'
import MetricManager from './metric-manager'

export const metadata: Metadata = { title: 'Sustainability' }

export default async function AdminSustainabilityPage() {
  const session = await verifyAdmin()
  if (!session) redirect('/admin/login')

  const metrics = await prisma.sustainabilityMetric.findMany({
    orderBy: { sortOrder: 'asc' },
  })

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'Sustainability' }]} />
      <PageHeader
        title="Sustainability Metrics"
        description="Manage the statistics displayed across sustainability pages."
      />
      <Card>
        <div className="p-4">
          <MetricManager
            metrics={metrics.map((m) => ({
              id: m.id,
              label: m.label,
              value: m.value,
              unit: m.unit,
              suffix: m.suffix,
              sortOrder: m.sortOrder,
              published: m.published,
            }))}
          />
        </div>
      </Card>
    </div>
  )
}