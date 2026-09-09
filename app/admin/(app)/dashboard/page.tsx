import type { Metadata } from 'next'
import Link from 'next/link'
import {
  FileText,
  Newspaper,
  Factory,
  Briefcase,
  FileDown,
  MessageSquare,
  Inbox,
  ArrowRight,
  ScrollText,
  Plus,
} from 'lucide-react'
import { redirect } from 'next/navigation'
import { verifyAdmin } from '@/lib/auth/dal'
import { prisma } from '@/lib/prisma'
import { formatDate, cn } from '@/lib/utils'
import { Breadcrumbs, Card, StatusBadge, PageHeader } from '@/components/admin/ui'
import { pretty, badgeTone } from '@/lib/admin'

export const metadata: Metadata = { title: 'Dashboard' }

interface StatCard {
  label: string
  value: number
  href: string
  icon: React.ComponentType<{ className?: string }>
  accent: string
}

export default async function AdminDashboardPage() {
  const session = await verifyAdmin()
  if (!session) redirect('/admin/login')

  const [
    pageCount,
    publishedArticles,
    projectCount,
    activeJobs,
    documentCount,
    messageCount,
    applicationCount,
    auditLogs,
  ] = await Promise.all([
    prisma.page.count(),
    prisma.newsArticle.count({ where: { status: 'PUBLISHED' } }),
    prisma.project.count(),
    prisma.job.count({ where: { status: 'PUBLISHED' } }),
    prisma.document.count(),
    prisma.contactMessage.count(),
    prisma.jobApplication.count(),
    prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { user: { select: { name: true } } },
    }),
  ])

  const stats: StatCard[] = [
    {
      label: 'Total Pages',
      value: pageCount,
      href: '/admin/pages',
      icon: FileText,
      accent: 'from-cyan-500 to-cyan-700',
    },
    {
      label: 'Published Articles',
      value: publishedArticles,
      href: '/admin/news',
      icon: Newspaper,
      accent: 'from-blue-500 to-blue-700',
    },
    {
      label: 'Projects',
      value: projectCount,
      href: '/admin/projects',
      icon: Factory,
      accent: 'from-navy-500 to-navy-800',
    },
    {
      label: 'Active Jobs',
      value: activeJobs,
      href: '/admin/jobs',
      icon: Briefcase,
      accent: 'from-amber-400 to-amber-600',
    },
    {
      label: 'Documents',
      value: documentCount,
      href: '/admin/documents',
      icon: FileDown,
      accent: 'from-emerald-500 to-emerald-700',
    },
    {
      label: 'Messages',
      value: messageCount,
      href: '/admin/messages',
      icon: MessageSquare,
      accent: 'from-violet-500 to-violet-700',
    },
    {
      label: 'Applications',
      value: applicationCount,
      href: '/admin/applications',
      icon: Inbox,
      accent: 'from-rose-500 to-rose-700',
    },
  ]

  const quickActions = [
    { label: 'New Article', href: '/admin/news/new', icon: Plus },
    { label: 'New Project', href: '/admin/projects/new', icon: Plus },
    { label: 'New Job', href: '/admin/jobs/new', icon: Plus },
    { label: 'View Messages', href: '/admin/messages', icon: MessageSquare },
  ]

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'Dashboard' }]} />
      <PageHeader
        title="Dashboard"
        description="An overview of content and activity across the ENEC CMS."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="group">
            <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md">
              <span
                className={cn(
                  'flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white shadow-sm',
                  stat.accent
                )}
              >
                <stat.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-2xl font-bold leading-none text-navy-900">{stat.value}</p>
                <p className="mt-1.5 text-xs font-medium text-slate-500">{stat.label}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <h2 className="flex items-center gap-2 text-base font-bold text-navy-900">
              <ScrollText className="h-4 w-4 text-cyan-500" />
              Recent Activity
            </h2>
            <Link
              href="/admin/audit-logs"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-600 transition-colors hover:text-cyan-700"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {auditLogs.length === 0 ? (
            <p className="px-6 py-12 text-center text-sm text-slate-400">
              No activity recorded yet.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {auditLogs.map((log) => (
                <li key={log.id} className="flex items-center gap-4 px-6 py-3.5">
                  <StatusBadge label={pretty(log.action)} tone={badgeTone(log.action)} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-slate-700">
                      <span className="font-semibold text-navy-900">
                        {log.user?.name ?? log.actor ?? 'System'}
                      </span>{' '}
                      {pretty(log.action).toLowerCase() === 'login' ? 'signed in' : `${pretty(log.action).toLowerCase()}d`}{' '}
                      <span className="font-medium">{pretty(log.resource)}</span>
                      {log.resourceId ? <span className="text-slate-400"> · {log.resourceId.slice(0, 8)}</span> : null}
                    </p>
                  </div>
                  <time className="shrink-0 text-xs text-slate-400">
                    {formatDate(log.createdAt)}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <div>
          <Card>
            <div className="border-b border-slate-200 px-6 py-4">
              <h2 className="text-base font-bold text-navy-900">Quick Actions</h2>
            </div>
            <ul className="p-3">
              {quickActions.map((action) => (
                <li key={action.label}>
                  <Link
                    href={action.href}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-navy-900"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-cyan-50 text-cyan-600">
                      <action.icon className="h-4 w-4" />
                    </span>
                    {action.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}