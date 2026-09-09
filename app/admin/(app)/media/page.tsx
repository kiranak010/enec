import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Search, FileImage, FileText, Film, File as FileIcon, Download } from 'lucide-react'
import { verifyAdmin } from '@/lib/auth/dal'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { Breadcrumbs, Card, PageHeader, EmptyState, StatusBadge } from '@/components/admin/ui'
import { DeleteButton } from '@/components/admin/client'
import { pretty } from '@/lib/admin'
import { MEDIA_TYPES } from '@/lib/admin'
import { deleteMediaAsset } from '@/app/admin/actions'
import MediaUpload from './upload'

export const metadata: Metadata = { title: 'Media Library' }

const TypeIcon: Record<string, React.ComponentType<{ className?: string }>> = {
  image: FileImage,
  pdf: FileText,
  video: Film,
  document: FileIcon,
}

export default async function AdminMediaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string }>
}) {
  const session = await verifyAdmin()
  if (!session) redirect('/admin/login')

  const { q, type } = await searchParams
  const query = q?.trim() || null
  const typeFilter =
    type && MEDIA_TYPES.includes(type as (typeof MEDIA_TYPES)[number]) ? type : null

  const assets = await prisma.mediaAsset.findMany({
    where: {
      AND: [
        typeFilter ? { type: typeFilter } : {},
        query ? { OR: [{ name: { contains: query } }, { altText: { contains: query } }] } : {},
      ],
    },
    orderBy: { createdAt: 'desc' },
    take: 60,
  })

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'Media' }]} />
      <PageHeader
        title="Media Library"
        description="Images and files used across the site."
        action={<MediaUpload />}
      />

      <Card className="mb-6 p-4">
        <form method="get" className="flex flex-wrap items-end gap-3">
          <div className="min-w-[220px] flex-1">
            <label htmlFor="media-q" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Search
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="media-q"
                name="q"
                type="search"
                defaultValue={query ?? ''}
                placeholder="Search by name or alt text…"
                className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
              />
            </div>
          </div>
          <div>
            <label htmlFor="media-type" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Type
            </label>
            <select
              id="media-type"
              name="type"
              defaultValue={typeFilter ?? 'ALL'}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
            >
              <option value="ALL">All types</option>
              {MEDIA_TYPES.map((t) => (
                <option key={t} value={t}>
                  {pretty(t)}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="rounded-lg bg-slate-800 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
          >
            Filter
          </button>
        </form>
      </Card>

      {assets.length === 0 ? (
        <Card>
          <EmptyState
            title="No media assets found"
            description={
              query || typeFilter
                ? 'Try adjusting your search or filter.'
                : 'Upload your first asset to populate the library.'
            }
            action={<MediaUpload />}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {assets.map((asset) => {
            const Icon = TypeIcon[asset.type] ?? FileIcon
            return (
              <Card key={asset.id} className="flex flex-col">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  {asset.type === 'image' ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={asset.url}
                      alt={asset.altText ?? asset.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-400 to-navy-900">
                      <Icon className="h-12 w-12 text-white/70" />
                    </div>
                  )}
                  <span className="absolute left-3 top-3">
                    <StatusBadge label={pretty(asset.type)} tone="slate" />
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <div>
                    <p className="truncate text-sm font-semibold text-navy-900">{asset.name}</p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {formatDate(asset.createdAt)}
                      {asset.sizeKb != null ? ` · ${asset.sizeKb.toLocaleString()} KB` : ''}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-3">
                    <a
                      href={asset.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold text-cyan-600 transition-colors hover:bg-cyan-50"
                    >
                      <Download className="h-3.5 w-3.5" />
                      View
                    </a>
                    <DeleteButton action={deleteMediaAsset} id={asset.id} label="Delete" />
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}