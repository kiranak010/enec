import type { Metadata } from 'next'
import { CalendarDays, ShieldCheck } from 'lucide-react'
import SectionHeading from '@/components/ui/section-heading'
import PageHeader from '@/components/ui/page-header'
import Reveal from '@/components/ui/reveal'
import { site } from '@/config/site'
import { images } from '@/lib/images'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Read the Emirates Nuclear Energy Corporation privacy policy — how we collect, use, protect and share your personal information.',
}

const sections = [
  {
    title: '1. Information We Collect',
    body: [
      'We collect information you provide directly — such as your name, email address, phone number, company and message when you contact us, apply for a position, register as a supplier, or subscribe to our newsroom.',
      'We also collect information automatically when you visit our website, including browser type and version, device information, pages viewed, referral source, and your IP address. This information supports site security, analytics and the improvement of our services.',
      'Where you use our contact form or job application channels, we may additionally collect information relevant to those interactions, such as your CV and communication preferences.',
    ],
  },
  {
    title: '2. How We Use Your Information',
    body: [
      'We use the information we collect to respond to your enquiries, process applications, provide requested services and information, and manage our relationship with you.',
      'We use analytics data to understand how visitors use our website, to maintain security, and to improve the relevance and performance of our content and services.',
      'Where we rely on consent, we will make that clear to you at the point of collection, and you may withdraw consent at any time by contacting us.',
    ],
  },
  {
    title: '3. Sharing of Information',
    body: [
      'We do not sell your personal information. We share information only where necessary to operate our business and deliver our services, including with trusted service providers who process data on our behalf under appropriate confidentiality obligations.',
      'We may disclose information where required or permitted by law, to protect our rights and safety, prevent fraud, or comply with a legal obligation.',
      'In the context of a corporate transaction — such as a merger, acquisition or asset sale — your information may be transferred as part of the transferred assets.',
    ],
  },
  {
    title: '4. Security of Your Information',
    body: [
      'We apply administrative, technical and physical safeguards designed to protect your personal information against loss, theft, misuse, unauthorised access and alteration.',
      'These measures include encryption in transit, access controls, monitoring, and regular security reviews aligned to recognised industry frameworks.',
      'No method of transmission or storage is completely secure. While we work hard to protect your information, we cannot guarantee absolute security.',
    ],
  },
  {
    title: '5. Data Retention',
    body: [
      'We retain personal information only for as long as necessary to fulfil the purposes described in this policy, comply with legal and regulatory obligations, resolve disputes, and enforce our agreements.',
      'When information is no longer needed, we securely delete or anonymise it within our established retention schedules.',
    ],
  },
  {
    title: '6. Children’s Privacy',
    body: [
      'Our website and services are directed to adults and are not intended for children under the age of 16. We do not knowingly collect personal information from children.',
      'If you believe we have collected information from a child, please contact us so we can take appropriate action.',
    ],
  },
  {
    title: '7. International Data Transfers',
    body: [
      `${site.name} operates globally, and your information may be transferred to and processed in countries other than the one in which you reside. Where such transfers occur, we implement appropriate safeguards to protect your personal information in accordance with applicable data protection law.`,
    ],
  },
  {
    title: '8. Your Rights and Choices',
    body: [
      'Depending on your jurisdiction, you may have the right to access, correct, delete or restrict the processing of your personal information, and to object to certain processing activities.',
      'To exercise these rights, contact us using the details below. We may need to verify your identity before acting on your request, and we will respond within the timeframes required by law.',
    ],
  },
  {
    title: '9. Cookies and Similar Technologies',
    body: [
      'We use essential cookies to enable core website functionality and security. We may also use analytics cookies and similar technologies to understand site usage and improve performance.',
      'You can control cookies through your browser settings. Disabling certain cookies may affect how our website functions for you.',
    ],
  },
  {
    title: '10. Changes to This Policy',
    body: [
      'We may update this privacy policy from time to time to reflect changes in our practices, technology or legal obligations. We will post any changes on this page with a revised “Last updated” date.',
      'Material changes will be communicated in a more prominent manner, such as a notice on our website. Continued use of our website after changes take effect constitutes acceptance of the updated policy.',
    ],
  },
  {
    title: '11. Contact Us',
    body: [
      `If you have questions about this privacy policy, or wish to exercise your privacy rights, please contact our data protection team:`,
    ],
  },
]

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Privacy Policy"
        description={
          <>
            This policy explains how {site.name} handles personal
            information collected through our website and services.
          </>
        }
        image={images.documentArchive}
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
              title="Our Commitment to Your Privacy"
              subtitle={
                'Trust is the foundation of our business. We are transparent about what we collect and why, and we apply industry-leading safeguards to protect your information.'
              }
            />

            <div className="space-y-12">
              {sections.map((section, i) => (
                <Reveal key={section.title} delay={i * 0.05}>
                  <div>
                    <h2 className="text-2xl font-bold text-navy-900">
                      {section.title}
                    </h2>
                    <div className="mt-4 space-y-4">
                      {section.body.map((paragraph) => (
                        <p
                          key={paragraph.slice(0, 48)}
                          className="leading-relaxed text-slate-600"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </Reveal>
              ))}

              <Reveal>
                <div className="rounded-2xl bg-slate-50 p-8">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-6 w-6 text-cyan-600" />
                    <h2 className="text-xl font-bold text-navy-900">
                      Contact Our Data Protection Team
                    </h2>
                  </div>
                  <p className="mt-4 leading-relaxed text-slate-600">
                    {site.headquarters.name}
                    <br />
                    {site.headquarters.address}
                    <br />
                    Email:{' '}
                    <a
                      href={`mailto:${site.email.general}`}
                      className="font-semibold text-cyan-600 underline decoration-cyan-500/40 underline-offset-2 hover:decoration-cyan-500"
                    >
                      {site.email.general}
                    </a>
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}