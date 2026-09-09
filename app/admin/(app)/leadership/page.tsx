import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { verifyAdmin } from '@/lib/auth/dal'
import { prisma } from '@/lib/prisma'
import { Breadcrumbs, Card, PageHeader } from '@/components/admin/ui'
import LeaderManager from './leader-manager'

export const metadata: Metadata = { title: 'Leadership' }

export default async function AdminLeadershipPage() {
  const session = await verifyAdmin()
  if (!session) redirect('/admin/login')

  const leaders = await prisma.leadershipProfile.findMany({
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
  })

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'Leadership' }]} />
      <PageHeader
        title="Leadership"
        description="Manage the executive profiles shown on the leadership page."
      />
      <Card>
        <div className="p-4">
          <LeaderManager
            leaders={leaders.map((l) => ({
              id: l.id,
              name: l.name,
              slug: l.slug,
              title: l.title,
              photoUrl: l.photoUrl,
              biography: l.biography,
              responsibilities: l.responsibilities,
              linkedinUrl: l.linkedinUrl,
              twitterUrl: l.twitterUrl,
              published: l.published,
            }))}
          />
        </div>
      </Card>
    </div>
  )
}