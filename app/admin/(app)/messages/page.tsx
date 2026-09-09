import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { verifyAdmin } from '@/lib/auth/dal'
import { prisma } from '@/lib/prisma'
import { Breadcrumbs, Card, PageHeader, EmptyState } from '@/components/admin/ui'
import MessageItem from './message-item'

export const metadata: Metadata = { title: 'Contact Messages' }

export default async function AdminMessagesPage() {
  const session = await verifyAdmin()
  if (!session) redirect('/admin/login')

  const messages = await prisma.contactMessage.findMany({
    orderBy: [{ isRead: 'asc' }, { createdAt: 'desc' }],
  })

  const newCount = messages.filter((m) => !m.isRead).length

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'Messages' }]} />
      <PageHeader
        title="Contact Messages"
        description={`Messages submitted through the contact form${newCount > 0 ? ` — ${newCount} unread` : ''}.`}
      />
      <Card>
        {messages.length === 0 ? (
          <EmptyState
            title="No messages yet"
            description="Messages submitted through the site's contact form will appear here."
          />
        ) : (
          <div className="divide-y divide-slate-100">
            {messages.map((message) => (
              <MessageItem
                key={message.id}
                message={{
                  id: message.id,
                  name: message.name,
                  email: message.email,
                  phone: message.phone,
                  company: message.company,
                  department: message.department,
                  subject: message.subject,
                  message: message.message,
                  isRead: message.isRead,
                  createdAt: message.createdAt.toISOString(),
                }}
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}