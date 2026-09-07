import type { Metadata } from 'next'
import {
  Accessibility,
  CalendarDays,
  CheckCircle2,
  Info,
  Mail,
  XCircle,
} from 'lucide-react'
import SectionHeading from '@/components/ui/section-heading'
import PageHeader from '@/components/ui/page-header'
import Reveal from '@/components/ui/reveal'
import { site } from '@/config/site'
import { images } from '@/lib/images'

export const metadata: Metadata = {
  title: 'Accessibility Statement',
  description:
    'Emirates Nuclear Energy Corporation’s commitment to digital accessibility and compliance with WCAG 2.2 Level AA.',
}

const features = [
  {
    title: 'Keyboard navigation',
    description:
      'All core functionality is accessible using a keyboard alone, with logical tab order and visible focus indicators.',
  },
  {
    title: 'Semantic HTML & screen readers',
    description:
      'Pages are built with semantic markup and appropriate ARIA attributes, with content structured in a logical, readable order.',
  },
  {
    title: 'Colour contrast',
    description:
      'Text and interactive elements meet or exceed WCAG 2.2 AA contrast ratios across all pages of the website.',
  },
  {
    title: 'Alternative text for images',
    description:
      'All informative images have descriptive alt text. Where content is purely decorative, images are marked appropriately.',
  },
  {
    title: 'Responsive design',
    description:
      'All pages are fully responsive and functional from mobile devices to large desktop displays, with appropriate touch targets.',
  },
  {
    title: 'Forms and input labelling',
    description:
      'All form fields have explicit labels, required fields are clearly indicated, and error messages are programmatically associated with the relevant field.',
  },
]

const knownLimitations = [
  {
    title: 'Archived PDF documents',
    description:
      'Some older downloadable reports and archived PDF documents may not meet full WCAG 2.2 AA standards. These are marked in our document library. Active documents and website pages conform to AA.',
  },
  {
    title: 'Third-party content',
    description:
      'Embedded content from third-party platforms may not always meet the same accessibility standards. We strive to use third-party providers committed to accessibility, but cannot guarantee their compliance.',
  },
  {
    title: 'Real-time data visualisations',
    description:
      'Some interactive charts and live data visualisations present data graphically. We provide text-based summaries or accessible data tables as alternatives wherever possible.',
  },
]

export default function AccessibilityPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Accessibility Statement"
        description={
          <>
            We are committed to making the Emirates Nuclear Energy Corporation
            website accessible to the widest possible audience, including
            people with disabilities.
          </>
        }
        image={images.city}
      >
        <p className="mt-6 flex items-center gap-2 text-sm text-navy-100/80">
          <CalendarDays className="h-4 w-4 text-cyan-400" />
          Last updated: January 1, 2026
        </p>
      </PageHeader>

      <section className="section-padding bg-white">
        <div className="container-narrow">
          <div className="max-w-4xl">
            <SectionHeading
              title="Our Commitment to Accessibility"
              subtitle="We recognise the importance of digital accessibility and are committed to conforming with the Web Content Accessibility Guidelines (WCAG) 2.2, Level AA, across our website. Accessibility is not an afterthought — it is an integral part of our digital development process."
            />

            <Reveal>
              <div className="flex items-start gap-4 rounded-2xl bg-cyan-500/5 p-8">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600">
                  <Accessibility className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-xl font-bold text-navy-900">
                    Current Standard
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    This website strives to meet the Web Content Accessibility
                    Guidelines (WCAG) 2.2 Level AA. These guidelines explain
                    how to make web content more accessible for people with
                    disabilities and more user-friendly for everyone.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section-padding bg-slate-50">
        <div className="container-narrow">
          <SectionHeading
            title="Accessibility Features"
            subtitle="We have designed and built this website with accessibility as a core requirement across planning, design, content creation and development."
            centered
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <Reveal key={feature.title} delay={i * 0.08}>
                <div
                  className="rounded-2xl bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <span className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                    <CheckCircle2 className="h-5 w-5" />
                  </span>
                  <h3 className="mt-3 text-lg font-bold text-navy-900">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {feature.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-narrow">
          <SectionHeading
            title="Known Limitations"
            subtitle="While we work to ensure full accessibility across the website, we acknowledge the following areas where limitations exist. We are actively working to address these."
            centered
          />

          <div className="space-y-5">
            {knownLimitations.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.08}>
                <div
                  className="flex items-start gap-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-7"
                >
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                    <Info className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-bold text-navy-900">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-slate-50">
        <div className="container-narrow">
          <div className="max-w-4xl space-y-10">
            <SectionHeading
              title="Feedback & Contact"
              subtitle="We welcome feedback on the accessibility of this website. If you encounter an accessibility barrier, please contact us and we will do our best to address it promptly."
            />

            <Reveal>
            <div className="rounded-2xl gradient-navy p-10">
              <h3 className="text-2xl font-bold text-white">
                Have a question or concern about accessibility?
              </h3>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-navy-100/80">
                Please contact our digital accessibility team. We aim to
                acknowledge all accessibility enquiries within two business
                days and will work with you to resolve any barriers as
                quickly as possible.
              </p>
              <a
                href={`mailto:${site.email.general}`}
                className="mt-8 inline-flex items-center gap-3 rounded-xl bg-cyan-500/10 px-5 py-4 text-sm font-semibold text-cyan-300 transition-colors hover:bg-cyan-500/20"
              >
                <Mail className="h-4 w-4 shrink-0" />
                {site.email.general}
              </a>
              <p className="mt-4 text-xs text-navy-200/70">
                Please include “Accessibility” in the subject line so your
                enquiry reaches the right team.
              </p>
            </div>
            </Reveal>

            <Reveal>
              <div className="rounded-2xl border border-slate-200 bg-white p-8">
                <h3 className="flex items-center gap-3 text-lg font-bold text-navy-900">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-600">
                    <XCircle className="h-4 w-4" />
                  </span>
                  Reporting an Accessibility Issue
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  If you find a page or feature that is not accessible, please
                  provide as much detail as you can: the page URL, the issue you
                  encountered, and the assistive technology you are using (if
                  any). This will help us diagnose and resolve the issue more
                  quickly.
                </p>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                  Accessibility is an ongoing commitment. We review and audit our
                  website regularly, and any known issues are tracked, prioritised
                  and resolved through our standard digital improvement process.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}