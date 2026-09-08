import type { Metadata } from 'next'
import {
  Lock,
  FileDown,
  Package,
  ClipboardCheck,
  BadgeCheck,
  Building2,
  FileText,
  CalendarClock,
} from 'lucide-react'
import PageHeader from '@/components/ui/page-header'
import SectionHeading from '@/components/ui/section-heading'
import Reveal from '@/components/ui/reveal'
import { images } from '@/lib/images'
import { site } from '@/config/site'

export const metadata: Metadata = {
  title: 'Vendor Portal',
  description:
    'Access the ENEC vendor portal: procurement notices, approved vendor list, submission tracking and partnership resources.',
}

const portalFeatures = [
  {
    icon: Package,
    title: 'Procurement Notices',
    description:
      'View current and upcoming procurement opportunities, tender notices and requests for quotation published for approved vendors.',
  },
  {
    icon: ClipboardCheck,
    title: 'Qualification Status',
    description:
      'Track the status of your pre-qualification, certification renewals and approved vendor list membership in real time.',
  },
  {
    icon: FileDown,
    title: 'Submission Tracking',
    description:
      'Upload and track the status of tenders, quotations and compliance documents through a single submission workflow.',
  },
  {
    icon: FileText,
    title: 'Document Library',
    description:
      'Access ENEC procurement policies, technical specifications, standard terms and the supplier code of conduct.',
  },
  {
    icon: CalendarClock,
    title: 'Schedules & Deadlines',
    description:
      'Keep up to date with bid deadlines, audits, payment milestones and contract renewal dates on a shared calendar.',
  },
  {
    icon: BadgeCheck,
    title: 'Approved Vendor List',
    description:
      'Confirmed partnership status, category assignments and points of contact for your supplier relationship.',
  },
]

const vendorBenefits = [
  'Transparent, auditable access to bidding opportunities',
  'Single source of truth for qualification and compliance',
  'Faster turnaround on tenders and queries',
  'Secure role-based account access for your team',
]

export default function VendorPortalPage() {
  return (
    <>
      <PageHeader
        eyebrow="Vendor Portal"
        title="A Single Gateway for Our Partners"
        description={
          <>
            The ENEC Vendor Portal is the secure gateway for our approved suppliers
            and prospective partners. Manage qualification, track submissions and
            stay aligned with procurement activity across the organization.
          </>
        }
        image={images.workshop}
      />

      <section className="section-padding bg-white">
        <div className="container-narrow">
          <SectionHeading
            title="What the Portal Delivers"
            subtitle="Everything your team needs to work with ENEC — in one secure, organized workspace."
          />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {portalFeatures.map((feature, i) => (
              <Reveal key={feature.title} delay={i * 0.08}>
                <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-lg">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600">
                    <feature.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-6 text-lg font-bold text-navy-900">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {feature.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-slate-50">
        <div className="container-narrow grid gap-12 lg:grid-cols-2">
          <Reveal>
            <div>
              <SectionHeading
                title="Get Started"
                subtitle="Registration and account activation happen through our supplier development team."
              />
              <ul className="space-y-4">
                {vendorBenefits.map((benefit) => (
                  <li
                    key={benefit}
                    className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-5"
                  >
                    <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-cyan-500" />
                    <p className="text-sm font-medium text-navy-900">{benefit}</p>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal>
            <div className="h-fit rounded-2xl gradient-navy p-10">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-300">
                <Lock className="h-6 w-6" />
              </span>
              <h3 className="mt-6 text-2xl font-bold text-white">Vendor Account</h3>
              <p className="mt-4 text-sm leading-relaxed text-navy-100/80">
                Portal access is granted to authorized representatives of approved
                and registered vendors. If you already hold an account, contact your
                ENEC supplier relationship manager for login details and access
                management.
              </p>
              <div className="mt-8 border-t border-white/10 pt-6">
                <p className="text-sm font-semibold text-white">Not yet a vendor?</p>
                <p className="mt-3 flex items-center gap-2 text-sm text-navy-100/80">
                  <Building2 className="h-4 w-4 shrink-0 text-cyan-400" />
                  Explore our supplier programme:
                </p>
                <a
                  href="/suppliers"
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-cyan-600"
                >
                  Visit Suppliers
                </a>
                <a
                  href={`mailto:${site.email.suppliers}`}
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  {site.email.suppliers}
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}