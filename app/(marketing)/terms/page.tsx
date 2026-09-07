import type { Metadata } from 'next'
import { CalendarDays, Scale } from 'lucide-react'
import SectionHeading from '@/components/ui/section-heading'
import PageHeader from '@/components/ui/page-header'
import Reveal from '@/components/ui/reveal'
import { site } from '@/config/site'
import { images } from '@/lib/images'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Read the terms and conditions governing access to and use of the Emirates Nuclear Energy Corporation website.',
}

const sections = [
  {
    title: '1. Acceptance of Terms',
    body: [
      `These Terms of Service ("Terms") govern your access to and use of the website operated by ${site.name} (${site.legal.companyName}, registration number ${site.legal.registrationNumber}) and related digital services (together, the "Website").`,
      'By accessing or using the Website, you agree to be bound by these Terms. If you do not agree with any part of these Terms, you should not use the Website.',
    ],
  },
  {
    title: '2. Use of the Website',
    body: [
      'The Website is provided for general information about our company, services, projects and career opportunities. You may use the Website for lawful, personal, non-commercial purposes.',
      'You agree not to misuse the Website, including by attempting to gain unauthorised access, introducing malicious code, interfering with its operation, or using it in any way that could damage, disable or impair the availability of our services to others.',
      'We may restrict, suspend or terminate access to the Website, in whole or in part, at any time and without notice where we consider it necessary to protect the integrity or security of the Website.',
    ],
  },
  {
    title: '3. Intellectual Property',
    body: [
      'All content published on the Website — including text, graphics, logos, imagery, reports, data and software — is owned by or licensed to us and is protected by applicable intellectual property laws.',
      'You may view, download and print content from the Website for personal, non-commercial reference, provided that you retain all copyright and proprietary notices and do not modify or redistribute the material without our prior written consent.',
      'The name "Emirates Nuclear Energy Corporation", the "ENEC" mark and related logos are our trademarks. Nothing in these Terms grants you any right, title or interest in our intellectual property.',
    ],
  },
  {
    title: '4. Information Accuracy',
    body: [
      'We strive to keep the content on the Website accurate and current, but we make no warranties or representations that the information provided is complete, accurate or up to date at all times.',
      'Project figures, timelines and corporate statistics are provided in good faith and may change as programmes and plans evolve. Your reliance on any information on the Website is at your own risk.',
    ],
  },
  {
    title: '5. Limitation of Liability',
    body: [
      'To the fullest extent permitted by applicable law, we shall not be liable for any indirect, incidental, special, consequential or punitive damages, or any loss of profits or revenues, arising out of or in connection with your use of, or inability to use, the Website.',
      'Our total aggregate liability arising from or related to the Website shall not exceed the amount paid by you, if any, for access to the Website in the twelve months preceding the claim.',
    ],
  },
  {
    title: '6. Third-Party Content and Links',
    body: [
      'The Website may contain links to third-party websites and services. We are not responsible for the content, policies or practices of any third-party website, and your use of such sites is governed by their own terms and privacy policies.',
      'References to third parties, including partners and suppliers, do not constitute an endorsement or recommendation unless expressly stated.',
    ],
  },
  {
    title: '7. Changes to the Website and These Terms',
    body: [
      'We may update, modify or discontinue the Website (or any part of it) at any time without notice. We may also revise these Terms from time to time. The most current version will always be posted on this page.',
      'Your continued use of the Website following any changes constitutes acceptance of the revised Terms.',
    ],
  },
  {
    title: '8. Governing Law and Disputes',
    body: [
      'These Terms are governed by and construed in accordance with the laws of Abu Dhabi, United Arab Emirates, without regard to its conflict-of-law principles.',
      'Any disputes arising out of or relating to these Terms or your use of the Website shall be subject to the exclusive jurisdiction of the courts located in Abu Dhabi, United Arab Emirates.',
    ],
  },
  {
    title: '9. Contact',
    body: [
      'Questions about these Terms should be directed to us using the contact details below.',
    ],
  },
]

export default function TermsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Terms of Service"
        description={
          <>
            The terms governing your use of the {site.name} website.
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
              title="Terms & Conditions"
              subtitle={`Please read these Terms carefully before using the Website. By using the Website you acknowledge that you have read, understood and agreed to be bound by them.`}
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
                    <Scale className="h-6 w-6 text-cyan-600" />
                    <h2 className="text-xl font-bold text-navy-900">
                      Legal Contact
                    </h2>
                  </div>
                  <p className="mt-4 leading-relaxed text-slate-600">
                    {site.legal.companyName}
                    <br />
                    Registration number: {site.legal.registrationNumber}
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