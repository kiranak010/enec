import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus, Pencil, Calendar } from 'lucide-react'
import { redirect } from 'next/navigation'
import { verifyAdmin } from '@/lib/auth/dal'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { Breadcrumbs, Card, StatusBadge, PageHeader, EmptyState, Table } from '@/components/admin/ui'
import { DeleteButton } from '@/components/admin/client'
import { pretty, badgeTone } from '@/lib/admin'
import { deleteArticle } from '@/app/admin/actions'

export const metadata: Metadata = { title: 'News' }

export default async function AdminNewsPage() {
  const session = await verifyAdmin()
  if (!session) redirect('/admin/login')

  const articles = await prisma.newsArticle.findMany({
    orderBy: { updatedAt: 'desc' },
    include: { category: true },
  })

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'News' }]} />
      <PageHeader
        title="News"
        description="Publish and manage news articles and press content."
        action={
          <Link
            href="/admin/news/new"
            className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-cyan-500/25 transition-colors hover:bg-cyan-600"
          >
            <Plus className="h-4 w-4" />
            New Article
          </Link>
        }
      />

      <Card>
        {articles.length === 0 ? (
          <EmptyState
            title="No articles yet"
            description="Publish your first article to start filling the newsroom."
            action={
              <Link
                href="/admin/news/new"
                className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-cyan-600"
              >
                <Plus className="h-4 w-4" />
                New Article
              </Link>
            }
          />
        ) : (
          <Table headers={['Title', 'Category', 'Status', 'Featured', 'Published', 'Views', 'Actions']}>
            {articles.map((article) => (
              <tr key={article.id} className="transition-colors hover:bg-slate-50">
                <td className="max-w-[260px] px-4 py-3">
                  <p className="truncate font-semibold text-navy-900">{article.title}</p>
                  <p className="truncate text-xs text-slate-400">/{article.slug}</p>
                </td>
                <td className="px-4 py-3 text-slate-500">{article.category.name}</td>
                <td className="px-4 py-3">
                  <StatusBadge label={pretty(article.status)} tone={badgeTone(article.status)} />
                </td>
                <td className="px-4 py-3">
                  {article.isFeatured ? (
                    <StatusBadge label="Featured" tone="cyan" />
                  ) : (
                    <span className="text-xs text-slate-300">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-500">
                  {article.publishedAt ? formatDate(article.publishedAt) : '—'}
                </td>
                <td className="px-4 py-3 text-slate-500">{article.viewCount}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/admin/news/new?id=${article.id}`}
                      className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-navy-900"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </Link>
                    <DeleteButton
                      action={deleteArticle}
                      id={article.id}
                      confirmText={`Delete the article "${article.title}"? This cannot be undone.`}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      {articles.length > 0 ? (
        <p className="mt-4 flex items-center gap-2 text-xs text-slate-400">
          <Calendar className="h-3.5 w-3.5" />
          {articles.length} article{articles.length === 1 ? '' : 's'} in the newsroom
        </p>
      ) : null}
    </div>
  )
}