import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  Briefcase,
  Clock,
  MapPin,
} from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { jobImage } from '@/lib/images'
import SectionHeading from '@/components/ui/section-heading'
import Reveal from '@/components/ui/reveal'
import ApplyModal from './apply-modal'

interface JobDetail {
  title: string
  slug: string
  department: string
  location: string
  employmentType: string
  summary: string
  description: string
  requirements: string
  publishedAt: string
}

const employmentTypeLabels: Record<string, string> = {  FULL_TIME: 'Full Time',
  PART_TIME: 'Part Time',
  CONTRACT: 'Contract',
  INTERNSHIP: 'Internship',
  GRADUATE: 'Graduate Program',
}

const employmentTypeColors: Record<string, string> = {
  FULL_TIME: 'bg-emerald-500/10 text-emerald-700',
  PART_TIME: 'bg-blue-500/10 text-blue-700',
  CONTRACT: 'bg-amber-500/10 text-amber-700',
  INTERNSHIP: 'bg-cyan-500/10 text-cyan-700',
  GRADUATE: 'bg-purple-500/10 text-purple-700',
}

const fallbackJobs: JobDetail[] = [
  {
    title: 'Senior Nuclear Engineer',
    slug: 'senior-nuclear-engineer',
    department: 'Engineering',
    location: 'Atlanta, GA',
    employmentType: 'FULL_TIME',
    summary:
      'Lead reactor-system design reviews and safety assessments across our new-build and operating plant portfolio.',
    description:
      'As a Senior Nuclear Engineer, you will lead the review and approval of safety-related engineering designs, perform independent safety assessments, and contribute directly to the delivery of our new-build and life-extension programmes.\n\nYou will work closely with design teams, plant operations and regulatory affairs to ensure that every technical decision meets our stringent safety, quality and performance standards — while staying on schedule and on budget.\n\nThe role is ideal for an experienced nuclear engineer looking to broaden their influence across a growing fleet, or for a senior professional from adjacent industries looking to pivot into clean energy at the most exciting point in its trajectory.',
    requirements:
      'B.Sc. or M.Sc. in Nuclear Engineering, Mechanical Engineering or a closely related discipline.\n\nAt least eight years of experience in nuclear power plant design, operations or safety assessment.\n\nDeep understanding of reactor systems, thermodynamics and safety analysis methods.\n\nFamiliarity with NRC regulatory frameworks and international nuclear safety standards.\n\nStrong analytical, written and verbal communication skills.\n\nProfessional Engineer (PE) registration is preferred.',
    publishedAt: '2025-12-01T09:00:00Z',
  },
  {
    title: 'Reactor Systems Analyst',
    slug: 'reactor-systems-analyst',
    department: 'Technology',
    location: 'Remote',
    employmentType: 'FULL_TIME',
    summary:
      'Develop and maintain plant performance models and digital twins at the intersection of nuclear engineering and advanced data science.',
    description:
      'Our Reactor Systems Analysts develop the digital models and simulation frameworks that allow us to optimise plant performance, predict component life and make better operational decisions across the fleet.\n\nWorking remotely with periodic site visits, you will collaborate with plant engineers, data scientists and software developers to build and validate digital twins of reactor and balance-of-plant systems.\n\nThe role demands strong fundamentals in nuclear or mechanical engineering combined with solid data-science skills — the rare person who is equally comfortable discussing thermal-hydraulics and training a machine-learning model.',
    requirements:
      'B.Sc. or M.Sc. in Nuclear, Mechanical or Electrical Engineering, or Applied Physics.\n\nMinimum five years working with nuclear plant data or power-systems modelling.\n\nProficiency with Python, MATLAB or similar modelling environments.\n\nFamiliarity with thermal-hydraulic and neutronic analysis methods is advantageous.\n\nAbility to manage time and priorities autonomously in a remote-work environment.',
    publishedAt: '2025-11-25T09:00:00Z',
  },
  {
    title: 'Safety Culture Specialist',
    slug: 'safety-culture-specialist',
    department: 'Safety',
    location: 'Chicago, IL',
    employmentType: 'FULL_TIME',
    summary:
      'Support fleet-wide safety culture programmes, leading assessments and continuous improvement initiatives across the organisation.',
    description:
      'The Safety Culture Specialist leads the fleet-wide assessment and continuous improvement of our organisational safety culture — the most critical underpinning of safe nuclear operations.\n\nDrawing on psychological research, human-factors science and nuclear operations experience, you will design and conduct safety-culture assessments, analyse trends in safety-significant data, and develop practical improvement programmes that change behaviour and strengthen organisational resilience.\n\nThe role reports to the Chief Nuclear Officer and works closely with station managers, human-factors engineers and the regulatory affairs team, making it an excellent position for someone who wants to influence safety culture at a leadership level.',
    requirements:
      'A degree in Psychology, Organisational Behaviour, Human Factors or a closely related discipline.\n\nAt least five years’ experience in safety culture, organisational development or human performance improvement within a regulated industry — nuclear preferred.\n\nDemonstrated skill in facilitation, qualitative data analysis and report writing.\n\nStrong interpersonal skills and the ability to influence at all levels of an organisation.',
    publishedAt: '2025-11-20T09:00:00Z',
  },
  {
    title: 'Graduate Nuclear Science Program',
    slug: 'graduate-nuclear-science-program',
    department: 'Engineering',
    location: 'Multiple Locations',
    employmentType: 'GRADUATE',
    summary:
      'A structured two-year rotation through reactor physics, safety analysis and design engineering, leading to a permanent technical role.',
    description:
      'Our Graduate Nuclear Science Programme is designed for exceptional recent graduates ready to launch a career at the heart of clean energy.\n\nOver two years, you will rotate across reactor physics, safety analysis, design engineering and plant operations, building a breadth of knowledge that most professionals take a decade to acquire. Each rotation is paired with a senior mentor, a real project with measurable outcomes, and clear progression milestones.\n\nThe programme culminates in a permanent technical role, giving you a direct pathway into one of the most important industries of the coming decades.',
    requirements:
      'A B.Sc. or M.Sc. in Nuclear Engineering, Physics, Mechanical Engineering or a closely related discipline, achieved within the past three years.\n\nStrong academic record and demonstrated interest in nuclear energy or clean technology.\n\nAbility and willingness to relocate across multiple sites during the two-year programme.\n\nExcellent problem-solving, communication and teamwork skills.',
    publishedAt: '2025-11-10T09:00:00Z',
  },
  {
    title: 'Summer Engineering Internship',
    slug: 'summer-engineering-internship',
    department: 'Engineering',
    location: 'Various',
    employmentType: 'INTERNSHIP',
    summary:
      'Paid summer placement pairing classroom learning with hands-on work at operating stations or innovation labs.',
    description:
      'Spend a summer embedded with our engineering teams, working on a genuine project that contributes to our mission.\n\nEach intern is assigned a project and a mentor. Past projects have included plant-performance data analysis, renewable integration studies, safety-case research and advanced reactor design reviews. You will present your findings to senior engineers and, in many cases, see your work make a direct impact on plant operations.\n\nThe programme is competitive and designed for undergraduates in engineering, physics or related disciplines who are serious about a career in clean energy.',
    requirements:
      'Currently enrolled in a B.Sc. programme in Engineering, Physics or a related discipline.\n\nAt least two years of study completed by the start date.\n\nStrong academic performance and genuine interest in nuclear energy or clean power.\n\nEligibility to work in the United States for the duration of the internship.',
    publishedAt: '2025-10-15T09:00:00Z',
  },
]

async function fetchJob(slug: string): Promise<JobDetail | null> {
  try {
    const row = await prisma.job.findUnique({ where: { slug } })
    if (row) {
      return {
        title: row.title,
        slug: row.slug,
        department: row.department,
        location: row.location,
        employmentType: row.employmentType,
        summary: row.summary,
        description: row.description,
        requirements: row.requirements ?? 'Please contact us for specific requirements related to this role.',
        publishedAt: (row.publishedAt ?? row.createdAt).toISOString(),
      }
    }
  } catch {
    // Database not available — fall back to static
  }

  return fallbackJobs.find((j) => j.slug === slug) ?? null
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  try {
    const rows = await prisma.job.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true },
    })
    const all = Array.from(
      new Set([...fallbackJobs.map((j) => j.slug), ...rows.map((r) => r.slug)])
    )
    return all.map((slug) => ({ slug }))
  } catch {
    return fallbackJobs.map((j) => ({ slug: j.slug }))
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const job = await fetchJob(slug)

  if (!job) {
    return { title: 'Position Not Found' }
  }

  return {
    title: `${job.title} — Careers`,
    description: job.summary,
    alternates: { canonical: `/careers/jobs/${slug}` },
    openGraph: {
      title: `${job.title} at ENEC`,
      description: job.summary,
      type: 'article',
    },
  }
}

interface JobParams {
  slug: string
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<JobParams>
}) {
  const { slug } = await params
  const job = await fetchJob(slug)

  if (!job) {
    return (
      <section className="gradient-navy">
        <div className="container-narrow px-4 py-24 sm:px-6 md:py-32">
          <div className="mx-auto max-w-lg text-center">
            <h1 className="text-3xl font-bold text-white">
              Position not found
            </h1>
            <p className="mt-4 text-navy-100/80">
              The position you are looking for could not be located or may
              no longer be available.
            </p>
            <Link
              href="/careers/jobs"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-cyan-600"
            >
              <ArrowLeft className="h-4 w-4" />
              View All Positions
            </Link>
          </div>
        </div>
      </section>
    )
  }

  const relatedJobs = fallbackJobs
    .filter((j) => j.slug !== job.slug)
    .slice(0, 3)

  const requirements = job.requirements.split('\n').filter((l) => l.trim())

  return (
    <>
      <section className="relative overflow-hidden bg-navy-950">
        <div className="container-narrow relative z-10 grid gap-12 px-4 py-24 sm:px-6 md:py-28 lg:grid-cols-2 lg:items-center">
          <div>
            <Link
              href="/careers/jobs"
              className="inline-flex items-center gap-2 text-sm font-semibold text-navy-100/80 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              All Positions
            </Link>

          <div className="mt-10 max-w-3xl">
            <span
              className={`inline-block rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider ${employmentTypeColors[job.employmentType] ?? 'bg-slate-100 text-slate-600'}`}
            >
              {employmentTypeLabels[job.employmentType] ?? job.employmentType}
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              {job.title}
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-navy-100/80">
              <span className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-cyan-400" />
                {job.department}
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-cyan-400" />
                {job.location}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-cyan-400" />
                Posted {formatDate(job.publishedAt)}
              </span>
            </div>
            <p className="mt-8 max-w-2xl text-xl font-medium leading-relaxed text-white">
              {job.summary}
            </p>
            <div className="mt-10">
              <ApplyModal
                jobTitle={job.title}
                department={job.department}
                location={job.location}
              />
            </div>
          </div>
          </div>

          <div className="relative hidden min-h-[26rem] overflow-hidden rounded-2xl shadow-2xl lg:block">
            <Image
              src={jobImage(slug)}
              alt={job.title}
              fill
              priority
              sizes="(max-width: 1280px) 50vw, 480px"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-narrow">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <SectionHeading title="About the Role" />
              <Reveal>
                <div className="space-y-5 text-base leading-relaxed text-slate-600">
                  {job.description.split('\n\n').map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </Reveal>

              <div className="mt-12">
                <SectionHeading title="Requirements" />
                <Reveal>
                  <ul className="space-y-4">
                    {requirements.map((req, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-base leading-relaxed text-slate-600"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </div>
            </div>

            <aside className="h-fit lg:sticky lg:top-24">
              <Reveal>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                  <h3 className="text-lg font-bold text-navy-900">
                    Position Summary
                  </h3>
                  <dl className="mt-5 space-y-4 text-sm">
                  <div>
                    <dt className="font-medium text-slate-500">Department</dt>
                    <dd className="mt-1 font-semibold text-navy-900">
                      {job.department}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium text-slate-500">Location</dt>
                    <dd className="mt-1 font-semibold text-navy-900">
                      {job.location}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium text-slate-500">Type</dt>
                    <dd className="mt-1 font-semibold text-navy-900">
                      {employmentTypeLabels[job.employmentType]}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium text-slate-500">Posted</dt>
                    <dd className="mt-1 font-semibold text-navy-900">
                      {formatDate(job.publishedAt)}
                    </dd>
                  </div>
                </dl>
              </div>
              </Reveal>

              <Reveal className="mt-6">
                <div className="rounded-2xl gradient-navy p-6">
                  <h4 className="text-lg font-bold text-white">
                    Need help?
                  </h4>
                <p className="mt-2 text-sm leading-relaxed text-navy-100/80">
                  If you have a disability or require any reasonable
                  accommodation during the application process, please contact
                  our HR team.
                </p>
                <a
                  href="mailto:careers@enec.gov.ae"
                  className="mt-4 block rounded-lg bg-cyan-500/15 px-4 py-3 text-center text-sm font-semibold text-cyan-300 transition-colors hover:bg-cyan-500/25"
                >
                  careers@enec.gov.ae
                </a>
              </div>
              </Reveal>
            </aside>
          </div>
        </div>
      </section>

      {relatedJobs.length > 0 && (
        <section className="border-t border-slate-200 bg-slate-50">
          <div className="section-padding">
            <div className="container-narrow">
              <h2 className="text-3xl font-bold text-navy-900">
                Similar Positions
              </h2>
              <div className="mt-10 grid gap-6 md:grid-cols-3">
                {relatedJobs.map((rel, i) => (
                  <Reveal key={rel.slug} delay={i * 0.08}>
                    <Link
                      href={`/careers/jobs/${rel.slug}`}
                      className="group block h-full rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                    >
                      <h3 className="text-lg font-bold text-navy-900 transition-colors group-hover:text-cyan-600">
                        {rel.title}
                      </h3>
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                          {rel.department}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          {rel.location}
                        </span>
                      </div>
                      <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-slate-500">
                        {rel.summary}
                      </p>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}