import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import CardImage from '@/components/ui/card-image'
import Reveal from '@/components/ui/reveal'
import ShareButtons from './share-buttons'
import { newsImage } from '@/lib/images'

interface ArticleDetail {
  title: string
  slug: string
  subtitle: string | null
  excerpt: string
  content: string
  categoryName: string
  authorName: string
  readTimeMins: number
  publishedAt: string
}

const categoryColors: Record<string, string> = {
  'Nuclear Innovation': 'bg-cyan-500/10 text-cyan-700',
  Innovation: 'bg-blue-500/10 text-blue-700',
  Corporate: 'bg-navy-500/10 text-navy-700',
  Safety: 'bg-emerald-500/10 text-emerald-700',
  Careers: 'bg-amber-500/10 text-amber-700',
}

const fallbackArticles: ArticleDetail[] = [
  {
    title: 'Advancing Next-Generation Reactor Technology',
    slug: 'advancing-next-generation-reactor-technology',
    subtitle:
      'A closer look at how advanced reactor designs are reshaping the economics and geography of clean baseload power.',
    excerpt:
      'Our latest breakthrough in advanced reactor design promises to expand where and how clean nuclear power can be deployed.',
    content: `For decades, the economics of nuclear power were defined by very large plants — massive single-unit builds that delivered gigawatt-scale power but demanded equally massive capital outlay and decade-long construction horizons.\n\nThat paradigm is changing. Advanced reactor technologies, and small modular reactors in particular, are shifting the industry toward smaller, factory-fabricated units that can be installed incrementally, financed in phases, and located closer to demand centres.\n\n"Standardisation is the key," explains our Chief Technology Officer, Dr. Elena Voss. "When a reactor is built in a controlled factory environment and shipped to site, we take the variability — and the risk — out of construction."\n\nBeyond construction economics, advanced designs expand the possible. Integrated energy hubs pairing nuclear with district heating, desalination and hydrogen production unlock value streams beyond the power market alone.\n\nAs part of our roadmap, ENEC is investing substantially in advanced reactor development, forging partnerships with universities, national laboratories and international utilities to accelerate deployment worldwide.\n\nThe result is a cleaner, more resilient energy system — and a technology pipeline that will power economies for the next century.`,
    categoryName: 'Nuclear Innovation',
    authorName: 'Dr. Elena Voss',
    readTimeMins: 6,
    publishedAt: '2025-11-15T09:00:00Z',
  },
  {
    title: 'Global Partnership for Clean Energy Expansion',
    slug: 'global-partnership-for-clean-energy-expansion',
    subtitle:
      'ENEC joins international partners to accelerate new nuclear capacity across emerging markets.',
    excerpt:
      'A landmark framework agreement will unlock new nuclear capacity in emerging economies.',
    content: `ENEC has signed a landmark framework agreement with international partners to develop new nuclear capacity across a portfolio of emerging markets, where reliable electricity is the single fastest route to economic development and improved quality of life.\n\nThe agreement combines our project-delivery expertise, advanced reactor designs and operations know-how with development finance, technology transfers and a multi-year skills programme to build local operating capability.\n\n"Our partners don't just need power — they need the capability to operate and regulate it," said our Chief Commercial Officer, Matthew Okafor. "This partnership is as much about people and institutions as it is about reactors."\n\nInitial assessments are underway for several candidate sites, with feasibility studies and environmental baseline work expected to complete within the next eighteen months.\n\nClean, reliable and locally-operated nuclear capacity can transform education, healthcare and industry in the regions we serve — and accelerate the global energy transition at the scale the climate challenge demands.`,
    categoryName: 'Corporate',
    authorName: 'Matthew Okafor',
    readTimeMins: 4,
    publishedAt: '2025-10-28T10:30:00Z',
  },
  {
    title: 'New Safety Standards Set Industry Benchmark',
    slug: 'new-safety-standards-set-industry-benchmark',
    subtitle:
      'Our updated safety protocols exceed international regulatory requirements and set a new standard for operations.',
    excerpt:
      'Updated safety protocols establish a new gold standard for nuclear operations worldwide.',
    content: `ENEC has published a comprehensive update to its enterprise safety standards, establishing a benchmark that exceeds current international regulatory requirements across every dimension of nuclear operations.\n\nThe updated standards cover severe-accident management, probabilistic risk assessment, cyber-physical security integration and human-factors engineering — moving from prescriptive compliance to a safety culture that continuously questions and improves.\n\nCentral to the revision is a new objective: sustained excellence measured not by absence of incidents, but by the strength of the barriers an organisation maintains between hazard and harm, every day, at every plant.\n\n"Our people are our most important safety system," said Susan Park, Chief Nuclear Officer. "These standards empower every employee — from the control room to the boardroom — to stop work and raise concerns without hesitation."\n\nIndependent peer reviews will verify implementation across the fleet, with results published annually in our safety performance report.`,
    categoryName: 'Safety',
    authorName: 'Susan Park',
    readTimeMins: 5,
    publishedAt: '2025-10-10T08:15:00Z',
  },
  {
    title: "Investing in Tomorrow's Energy Workforce",
    slug: 'investing-in-tomorrows-energy-workforce',
    subtitle:
      'New graduate programmes and apprenticeships are building the next generation of nuclear professionals.',
    excerpt:
      'Graduate programmes, apprenticeships and university partnerships are building the workforce of the future.',
    content: `As the clean-energy sector grows, the demand for highly skilled nuclear professionals is accelerating — and ENEC is meeting it head-on.\n\nThis year we expanded our early-careers platform with new graduate programmes in reactor engineering, nuclear science and project delivery, alongside apprenticeships spanning electrical, mechanical and instrumentation trades.\n\nEvery programme combines structured classroom learning with hands-on work at operating stations, mentoring from some of the industry's most experienced professionals, and a real project to call your own.\n\nWe're also deepening partnerships with universities to fund research chairs, sponsor capstone projects and offer year-round internships that give students meaningful work — not coffee runs.\n\n"Building nuclear talent is a long game," said HR Director, Priya Raghavan. "The engineers who lead us through the next fifty years are studying in lecture halls today. Our job is to make sure their skills are ready before they need them."`,
    categoryName: 'Careers',
    authorName: 'Priya Raghavan',
    readTimeMins: 3,
    publishedAt: '2025-09-22T14:00:00Z',
  },
  {
    title: 'Milestone: 25 GW of Clean Energy Capacity',
    slug: 'milestone-25-gw-of-clean-energy-capacity',
    subtitle:
      'Across our global fleet, clean nuclear capacity has reached 25 gigawatts.',
    excerpt:
      'ENEC reaches 25 gigawatts of operating clean-energy capacity across its global portfolio.',
    content: `ENEC has reached a significant corporate milestone: 25 gigawatts of operating clean-energy capacity across its global portfolio of plants.\n\nThat volume of carbon-free generation is enough to power more than 20 million homes while avoiding roughly 120 million tonnes of CO₂ equivalent each year compared with fossil-fuelled generation.\n\nReaching 25 GW reflects disciplined delivery, relentless operational excellence and the hard work of tens of thousands of people who design, build, operate and regulate our stations.\n\nThis milestone is not an endpoint but a marker on a longer road. With another significant volume of capacity under construction and an even larger pipeline in development, our trajectory toward 50 GW of operating capacity is well established.\n\n"We measure success in the lights that stay on, the factories that run and the homes that stay warm — with clean power," said our President and CEO, Daniel Whitfield. "Twenty-five gigawatts is a promise kept. The next twenty-five is the promise ahead."`,
    categoryName: 'Corporate',
    authorName: 'Daniel Whitfield',
    readTimeMins: 4,
    publishedAt: '2025-09-05T09:45:00Z',
  },
  {
    title: 'Pioneering AI-Driven Predictive Maintenance',
    slug: 'pioneering-ai-driven-predictive-maintenance',
    subtitle:
      'Machine learning is reducing downtime and strengthening safety across our stations.',
    excerpt:
      'AI-driven predictive maintenance improves availability and strengthens safety across the fleet.',
    content: `Across a fleet of plants, every day of unexpected downtime matters — in lost output, in increased wear and, most importantly, in the added workload placed on people.\n\nENEC is tackling this with AI-driven predictive maintenance: a continuous stream of sensor data from pumps, valves, generators and thousands of plant components is analysed by machine-learning models trained on decades of operational history.\n\nThe models detect the subtle early signatures of component degradation long before failure is likely, allowing our engineers to schedule intervention at the safest and most convenient time.\n\n"In the past we maintained on a fixed schedule or repaired after failure," said Innovation Director, Dr. Yuki Tanaka. "Now we maintain on evidence. The safety dividend is enormous — and so is the availability dividend."\n\nEven with a strong early reliability record, early results are encouraging: a measurable reduction in unplanned maintenance events across our pilot stations in the last two years.\n\nThis is what the energy transition's quiet revolution looks like in practice — grinding out incremental gains in reliability, safety and efficiency, one model at a time.`,
    categoryName: 'Innovation',
    authorName: 'Dr. Yuki Tanaka',
    readTimeMins: 5,
    publishedAt: '2025-08-18T11:20:00Z',
  },
  {
    title: 'ENEC Reports Record Generation in 2025',
    slug: 'enec-reports-record-generation-in-2025',
    subtitle:
      'Annual clean power output reached a new all-time high across the fleet.',
    excerpt:
      'A full year of reliable operation delivered record low-carbon generation — enough clean electricity to power millions of homes region-wide.',
    content: `ENEC has closed out 2025 with a record year of clean power generation, delivering more low-carbon electricity than in any previous year of operations.\n\nSustained high-capacity factors, disciplined planning and investment in digital operations tools allowed the fleet to operate at peak performance throughout the year, even through the hottest summer months when demand on the grid was highest.\n\n"This is what reliability looks like when you measure it in outcomes people can feel," said our President and CEO, Daniel Whitfield. "Homes stayed powered, industry stayed running, and every megawatt-hour avoided carbon emissions that would otherwise have warmed the planet."\n\nThe record generation reinforces the strategic case for nuclear as the backbone of a clean, secure and affordable energy system — and provides a strong foundation for the planned expansion of the fleet across the coming decade.\n\nFull-year performance figures will be published in our annual report, alongside detailed safety and sustainability metrics.`,
    categoryName: 'Corporate',
    authorName: 'Daniel Whitfield',
    readTimeMins: 4,
    publishedAt: '2025-12-12T09:00:00Z',
  },
  {
    title: 'SMR Technology Roadmap Unveiled',
    slug: 'smr-technology-roadmap-unveiled',
    subtitle:
      'A step-by-step plan brings small modular reactor deployment closer to reality.',
    excerpt:
      'ENEC has released a detailed roadmap for small modular reactor deployment, including siting assessments, licensing groundwork and partnerships with reactor vendors.',
    content: `ENEC has published a comprehensive technology roadmap for small modular reactors (SMRs), setting out the engineering, licensing and commercial steps needed to bring the first units into operation.\n\nSMRs offer factory-built, scalable nuclear capacity that complements the baseload, gigawatt-scale plants already operating. They can be deployed closer to demand centres and support emerging applications such as district heating, desalination and clean hydrogen production.\n\n"We're deliberately methodical," explains our Chief Technology Officer, Dr. Elena Voss. "The roadmap phase-gates every decision — technology selection, safety case, supply chain readiness and grid integration — so that we only move forward when the evidence supports it."\n\nSiting assessments for candidate locations are already underway, and vendor engagement is focused on designs with mature licensing histories and clear deployment paths.\n\nThe roadmap anticipates the first demonstration unit online within the next decade, with subsequent units scaling as confidence and experience build.`,
    categoryName: 'Nuclear Innovation',
    authorName: 'Dr. Elena Voss',
    readTimeMins: 5,
    publishedAt: '2025-11-30T10:00:00Z',
  },
  {
    title: 'Nuclear Skills Academy Launched',
    slug: 'nuclear-skills-academy-launched',
    subtitle:
      'A new academy with leading universities builds the skilled workforce of tomorrow.',
    excerpt:
      'ENEC and partner universities have launched a dedicated Nuclear Skills Academy offering specialised degrees, apprenticeships and continuous professional development.',
    content: `ENEC has launched the Nuclear Skills Academy — a dedicated institution built with leading universities to secure the talent pipeline that the expanding clean-energy fleet will need.\n\nThe academy offers accredited degrees in nuclear engineering and science, technician apprenticeships in mechanical, electrical and instrument trades, and continuous professional development for mid-career professionals moving into the sector.\n\nEvery programme is co-designed with industry, which means students learn on the simulators and processes they will actually use at the plants, and every graduate leaves with a placement pathway.\n\n"The engineers who will run the fleet for the next fifty years are being trained today," said HR Director, Priya Raghavan. "The academy makes sure they are ready before the plants need them."\n\nScholarships and paid internship routes ensure the academy is accessible to talented students from every background, supporting national and regional workforce objectives.`,
    categoryName: 'Careers',
    authorName: 'Priya Raghavan',
    readTimeMins: 3,
    publishedAt: '2025-11-05T09:30:00Z',
  },
  {
    title: 'Advanced Fuel: A More Efficient Nuclear Cycle',
    slug: 'advanced-fuel-more-efficient-nuclear-cycle',
    subtitle:
      'New fuel technologies could extend cycle length and improve plant economics.',
    excerpt:
      'Pilot programmes are evaluating advanced fuel assemblies that promise longer cycles, higher burnup and reduced waste for operating reactors.',
    content: `ENEC has begun pilot programmes to evaluate advanced nuclear fuel assemblies that could extend operating cycles, increase energy extracted per assembly and reduce the volume of used fuel.\n\nAdvanced fuel designs combine higher-density cladding materials with revised fuel geometries, allowing reactors to run longer between refuelling outages while sustaining the same safety margins.\n\n"Weather it's a cleaner energy transition or a more competitive plant, the economics all point the same direction — get more from every assembly," said Innovation Director, Dr. Yuki Tanaka.\n\nThe pilot programme uses a staged licensing approach: laboratory testing, followed by irradiation in research reactors, and finally lead test assemblies in commercial units under enhanced monitoring.\n\nIf successful, the new fuels could be a key enabler for the next generation of the fleet, lowering operating cost while further strengthening the already exceptional safety and reliability record of the plants.`,
    categoryName: 'Innovation',
    authorName: 'Dr. Yuki Tanaka',
    readTimeMins: 6,
    publishedAt: '2025-10-18T08:00:00Z',
  },
]

function readingTime(content: string): number {
  const words = content.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

async function fetchArticle(
  slug: string
): Promise<ArticleDetail | null> {
  try {
    const row = await prisma.newsArticle.findUnique({
      where: { slug },
      include: { category: true },
    })

    if (row) {
      return {
        title: row.title,
        slug: row.slug,
        subtitle: row.subtitle,
        excerpt: row.excerpt,
        content: row.content,
        categoryName: row.category.name,
        authorName: row.authorName ?? 'ENEC Newsroom',
        readTimeMins: row.readTimeMins ?? readingTime(row.content),
        publishedAt: (row.publishedAt ?? row.createdAt).toISOString(),
      }
    }
  } catch {
    // Database not available — fall back to static
  }

  return fallbackArticles.find((a) => a.slug === slug) ?? null
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  try {
    const rows = await prisma.newsArticle.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true },
    })
    const all = Array.from(
      new Set([
        ...fallbackArticles.map((a) => a.slug),
        ...rows.map((r) => r.slug),
      ])
    )
    return all.map((slug) => ({ slug }))
  } catch {
    return fallbackArticles.map((a) => ({ slug: a.slug }))
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = await fetchArticle(slug)

  if (!article) {
    return { title: 'Article Not Found' }
  }

  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/news/${slug}` },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      url: `/news/${slug}`,
      publishedTime: article.publishedAt,
      authors: [article.authorName],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
    },
  }
}

interface ArticleParams {
  slug: string
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<ArticleParams>
}) {
  const { slug } = await params
  const article = await fetchArticle(slug)

  if (!article) {
    return (
      <section className="gradient-navy">
        <div className="container-narrow px-4 py-24 sm:px-6 md:py-32">
          <div className="mx-auto max-w-lg text-center">
            <h1 className="text-3xl font-bold text-white">
              Article not found
            </h1>
            <p className="mt-4 text-navy-100/80">
              The article you are looking for could not be located.
            </p>
            <Link
              href="/news"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-cyan-600"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to News
            </Link>
          </div>
        </div>
      </section>
    )
  }

  const related = fallbackArticles
    .filter((a) => a.slug !== article.slug)
    .slice(0, 3)

  const body = article.content.split('\n\n')

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={newsImage(article.slug, article.categoryName)}
            alt={article.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-navy-hero" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-navy-950/90 to-transparent" />
        </div>

        <div className="container-narrow relative z-10 px-4 py-24 sm:px-6 md:py-28">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-sm font-semibold text-navy-100/80 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            All News
          </Link>

          <div className="mt-10 max-w-3xl">
            <span
              className={`rounded-full px-4 py-1.5 text-xs font-semibold ${categoryColors[article.categoryName] ?? 'bg-slate-100 text-slate-600'}`}
            >
              {article.categoryName}
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              {article.title}
            </h1>
            {article.subtitle ? (
              <p className="mt-6 max-w-2xl text-xl leading-relaxed text-navy-100/80">
                {article.subtitle}
              </p>
            ) : null}
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-navy-100/80">
              <span className="inline-flex items-center gap-2">
                <User className="h-4 w-4 text-cyan-400" />
                {article.authorName}
              </span>
              <span className="inline-flex items-center gap-2">
                <Calendar className="h-4 w-4 text-cyan-400" />
                {formatDate(article.publishedAt)}
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock className="h-4 w-4 text-cyan-400" />
                {article.readTimeMins} min read
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-narrow">
          <div className="grid gap-14 lg:grid-cols-12">
            <article className="lg:col-span-8">
              <CardImage
                src={newsImage(article.slug, article.categoryName)}
                alt={article.title}
                className="aspect-[21/9] rounded-2xl"
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
              <Reveal className="prose-custom mt-10 space-y-6 text-lg leading-relaxed text-slate-700">
                {body.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </Reveal>

              <div className="mt-12 border-t border-slate-200 pt-8">
                <ShareButtons title={article.title} />
              </div>
            </article>

            <aside className="lg:col-span-4">
              <div className="sticky top-24 space-y-8">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                  <h3 className="text-lg font-bold text-navy-900">
                    About the Author
                  </h3>
                  <div className="mt-4 flex items-center gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-navy-700 text-lg font-bold text-white">
                      {article.authorName.charAt(0)}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-navy-900">
                        {article.authorName}
                      </p>
                      <p className="text-xs text-slate-500">
                        {article.categoryName} · ENEC
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl gradient-navy p-6">
                  <h3 className="text-lg font-bold text-white">
                    Never miss an update
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-navy-100/80">
                    Subscribe to our newsroom for the latest announcements on
                    projects, innovation and sustainability.
                  </p>
                  <Link
                    href="/contact"
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-cyan-600"
                  >
                    Contact the Newsroom
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50">
        <div className="section-padding">
          <div className="container-narrow">
            <h2 className="text-3xl font-bold text-navy-900">
              Related Articles
            </h2>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {related.map((item, i) => (
                <Reveal key={item.slug} delay={i * 0.1}>
                  <Link
                    href={`/news/${item.slug}`}
                    className="group block h-full overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
                  >
                    <CardImage
                      src={newsImage(item.slug, item.categoryName)}
                      alt={item.title}
                      className="aspect-[16/9]"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="p-7">
                      <time className="text-xs text-slate-400">
                        {formatDate(item.publishedAt)}
                      </time>
                      <h3 className="mt-3 text-lg font-bold text-navy-900 transition-colors group-hover:text-cyan-600">
                        {item.title}
                      </h3>
                      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-500">
                        {item.excerpt}
                      </p>
                      <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-600">
                        Read More
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}