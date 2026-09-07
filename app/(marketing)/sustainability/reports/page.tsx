import { prisma } from '@/lib/prisma'
import { DocumentCategory } from '@prisma/client'
import Button from '@/components/ui/button'
import PageHeader from '@/components/ui/page-header'
import Reveal from '@/components/ui/reveal'
import CardImage from '@/components/ui/card-image'
import { images } from '@/lib/images'
import { ArrowLeft, Download, FileText, Calendar } from 'lucide-react'

interface ReportItem {
  id: string
  title: string
  description: string
  year: number
  category: DocumentCategory
  fileSizeKb: number
  fileUrl: string
}

const fallbackReports: ReportItem[] = [
  {
    id: '1',
    title: '2024 Sustainability Report',
    description: 'Comprehensive overview of our environmental, social, and governance performance for the fiscal year 2024.',
    year: 2024,
    category: 'SUSTAINABILITY_REPORT' as const,
    fileSizeKb: 4500,
    fileUrl: '#',
  },
  {
    id: '2',
    title: '2023 Sustainability Report',
    description: 'Annual sustainability report covering emissions reductions, community investment, and safety performance.',
    year: 2023,
    category: 'SUSTAINABILITY_REPORT' as const,
    fileSizeKb: 4200,
    fileUrl: '#',
  },
  {
    id: '3',
    title: '2022 Sustainability Report',
    description: 'Our commitment to sustainability: progress, challenges, and goals for the year ahead.',
    year: 2022,
    category: 'SUSTAINABILITY_REPORT' as const,
    fileSizeKb: 3800,
    fileUrl: '#',
  },
  {
    id: '4',
    title: '2024 Annual Report',
    description: 'Annual financial and operational review, including fleet performance, financial results, and strategic outlook.',
    year: 2024,
    category: 'ANNUAL_REPORT' as const,
    fileSizeKb: 6200,
    fileUrl: '#',
  },
  {
    id: '5',
    title: '2023 Annual Report',
    description: 'Full-year financial results, fleet performance metrics, and capital investment summary.',
    year: 2023,
    category: 'ANNUAL_REPORT' as const,
    fileSizeKb: 5800,
    fileUrl: '#',
  },
  {
    id: '6',
    title: 'Environmental Impact Assessment 2024',
    description: 'Detailed assessment of our environmental footprint, including emissions, water use, and biodiversity impacts.',
    year: 2024,
    category: 'SUSTAINABILITY_REPORT' as const,
    fileSizeKb: 3200,
    fileUrl: '#',
  },
]

export default async function ReportsPage() {
  let reports = fallbackReports
  try {
    const dbReports = await prisma.document.findMany({
      where: {
        category: { in: ['SUSTAINABILITY_REPORT', 'ANNUAL_REPORT'] },
        published: true,
      },
      orderBy: { year: 'desc' },
    })
    if (dbReports.length > 0) {
      reports = dbReports.map((r) => ({
        id: r.id,
        title: r.title,
        description: r.description ?? '',
        year: r.year ?? new Date().getFullYear(),
        category: r.category,
        fileSizeKb: r.fileSizeKb ?? 0,
        fileUrl: r.fileUrl,
      }))
    }
  } catch {
    // Use static fallback
  }

  const years = [...new Set(reports.map((r) => r.year))].sort((a, b) => b - a)

  function formatSize(kb: number) {
    if (kb >= 1000) return `${(kb / 1000).toFixed(1)} MB`
    return `${kb} KB`
  }

  return (
    <>
      <PageHeader
        eyebrow="Sustainability"
        title="Reports & Publications"
        description={
          <>
            Transparency is central to our sustainability commitment. Download our annual reports,
            sustainability disclosures, and environmental impact assessments.
          </>
        }
        image={images.documentArchive}
      >
        <Button href="/sustainability" variant="ghost" className="mt-8">
          <ArrowLeft className="h-4 w-4" /> Back to Sustainability
        </Button>
      </PageHeader>

      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {years.map((year) => (
            <div key={year} className="mb-16 last:mb-0">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="h-5 w-5 text-cyan-500" />
                <h2 className="text-2xl font-bold text-navy-900">{year}</h2>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {reports
                  .filter((r) => r.year === year)
                  .map((report, ri) => (
                    <Reveal key={report.id} delay={ri * 0.08}>
                      <div
                        className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md hover:border-cyan-200"
                      >
                        <CardImage
                          src={report.category === 'ANNUAL_REPORT' ? images.city : images.documentArchive}
                          alt={report.title}
                          className="aspect-[16/9]"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        <div className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10">
                              <FileText className="h-6 w-6 text-cyan-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-bold text-navy-900 group-hover:text-cyan-500 transition-colors">
                                {report.title}
                              </h3>
                              <p className="mt-2 text-sm text-slate-600 leading-relaxed line-clamp-3">
                                {report.description}
                              </p>
                            </div>
                          </div>
                          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                            <span className="text-xs text-slate-500">
                              {report.fileSizeKb ? formatSize(report.fileSizeKb) : 'PDF'}
                            </span>
                            <a
                              href={report.fileUrl}
                              className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-500 hover:text-cyan-600"
                            >
                              <Download className="h-4 w-4" /> Download
                            </a>
                          </div>
                        </div>
                      </div>
                    </Reveal>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
