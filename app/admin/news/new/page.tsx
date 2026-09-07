import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { verifyAdmin } from '@/lib/auth/dal'
import { prisma } from '@/lib/prisma'
import ArticleForm, { type ArticleFormRecord } from './article-form'

export const metadata: Metadata = {
  title: { absolute: 'New Article' },
}

export default async function AdminNewArticlePage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>
}) {
  const session = await verifyAdmin()
  if (!session) redirect('/admin/login')

  const [categories, { id }] = await Promise.all([
    prisma.newsCategory.findMany({ orderBy: { name: 'asc' } }),
    searchParams,
  ])

  let editing: ArticleFormRecord | null = null
  if (id) {
    const article = await prisma.newsArticle.findUnique({
      where: { id },
      include: { tags: { include: { tag: true } } },
    })
    if (article) {
      editing = {
        id: article.id,
        title: article.title,
        slug: article.slug,
        subtitle: article.subtitle,
        excerpt: article.excerpt,
        content: article.content,
        categoryId: article.categoryId,
        heroImage: article.heroImage,
        authorName: article.authorName,
        readTimeMins: article.readTimeMins,
        seoTitle: article.seoTitle,
        seoDescription: article.seoDescription,
        isFeatured: article.isFeatured,
        status: article.status,
        publishedAt: article.publishedAt,
        tags: article.tags.map((t) => t.tag.name).join(', '),
      }
    }
  }

  return (
    <ArticleForm
      mode={editing ? 'edit' : 'create'}
      article={editing}
      categories={categories.map((c) => ({ id: c.id, name: c.name }))}
    />
  )
}