import type { Metadata } from "next";
import {
  Award,
  CheckCircle2,
  ClipboardList,
  FileSearch,
  Handshake,
  Mail,
  ShieldAlert,
  Truck,
} from "lucide-react";
import SectionHeading from "@/components/ui/section-heading";
import PageHeader from "@/components/ui/page-header";
import Reveal from "@/components/ui/reveal";
import { images } from "@/lib/images";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Suppliers & Partners",
  description:
    "Partner with Emirates Nuclear Energy Corporation. Learn about supplier requirements, our qualification process, opportunities by category and procurement policies.",
};

const qualificationSteps = [
  {
    icon: FileSearch,
    step: "01",
    title: "Registration & Pre-Qualification",
    description:
      "Complete the supplier registration form, providing company profile, financial standing, certifications and references. Verified suppliers advance to the full pre-qualification review.",
  },
  {
    icon: ClipboardList,
    step: "02",
    title: "Technical & Quality Assessment",
    description:
      "We evaluate your quality-management system, manufacturing capability, engineering resources and past performance against the specific requirements of each commodity group.",
  },
  {
    icon: ShieldAlert,
    step: "03",
    title: "Safety, Ethics & Compliance Review",
    description:
      "Every supplier is screened for safety performance, environmental stewardship, labour standards, anti-corruption compliance and alignment with our supplier code of conduct.",
  },
  {
    icon: Award,
    step: "04",
    title: "Approval & Integration",
    description:
      "Successful suppliers are entered into the approved vendor list for the relevant commodity group, onboarded into our procurement system, and invited to bid on upcoming opportunities.",
  },
];

const opportunityCategories = [
  {
    icon: Truck,
    title: "Component Fabrication",
    description:
      "Forgings, pressure vessels, heat exchangers, pumps, valves and specialty steel structures for new-build and operating plants.",
  },
  {
    icon: Award,
    title: "Engineering Services",
    description:
      "Design, analysis, testing, inspection and consulting services supporting our design and construction programmes.",
  },
  {
    icon: Handshake,
    title: "Operations & Maintenance",
    description:
      "Outage support, tooling, spare parts and specialised maintenance services that keep our fleet running at world-class levels.",
  },
  {
    icon: ShieldAlert,
    title: "Safety & Protective Systems",
    description:
      "Fire protection, radiological monitoring, security systems and personnel protective equipment supplied to the highest nuclear-grade standards.",
  },
];

const policies = [
  {
    title: "Competitive, transparent sourcing",
    description:
      "Qualified suppliers are given fair and equal access to bidding opportunities through a structured, auditable procurement process.",
  },
  {
    title: "Our supplier code of conduct",
    description:
      "All suppliers must uphold ethical conduct, environmental responsibility, workforce welfare and strict adherence to applicable law.",
  },
  {
    title: "Nuclear-grade quality assurance",
    description:
      "Suppliers of safety-related items must maintain certified quality-management systems and participate in joint quality surveillance.",
  },
  {
    title: "Commitment to integrity",
    description:
      "We do not accept bribes, kickbacks or any form of improper influence. Report concerns confidentially through our ethics line.",
  },
];

export default function SuppliersPage() {
  return (
    <>
      <PageHeader
        eyebrow="Suppliers & Partners"
        title="Partnering for Excellence"
        description={
          <>
            Emirates Nuclear Energy Corporation relies on a global network of partners
            who share our uncompromising commitment to safety, quality and
            integrity. Together, we deliver the infrastructure that powers a
            cleaner future.
          </>
        }
        image={images.workshop}
      />

      <section className="section-padding bg-white">
        <div className="container-narrow">
          <SectionHeading
            title="Supplier Requirements"
            subtitle="Becoming a partner of ENEC begins with meeting our baseline requirements. We look for suppliers who match our values and can perform to world-class standards."
          />

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: ShieldAlert,
                title: "Safety & Quality First",
                description:
                  "Certified quality management systems, a demonstrated safety culture and a track record of delivering defect-free work in safety-critical environments.",
              },
              {
                icon: CheckCircle2,
                title: "Financial Stability",
                description:
                  "Sound financial standing to support long-duration programmes, with transparent reporting and the capacity to manage sustained production schedules.",
              },
              {
                icon: Award,
                title: "Track Record",
                description:
                  "Verifiable experience supplying equivalent goods or services to regulated industries, complemented by independent references and performance data.",
              },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 0.08}>
                <div className="rounded-2xl border border-slate-200 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600">
                    <item.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-6 text-xl font-bold text-navy-900">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-slate-50">
        <div className="container-narrow">
          <SectionHeading
            title="Supplier Qualification Process"
            subtitle="Our four-stage qualification process ensures we work only with partners who can deliver safely, reliably and to specification."
            centered
          />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {qualificationSteps.map((step, i) => (
              <Reveal key={step.step} delay={i * 0.08}>
                <div className="relative rounded-2xl bg-white p-7 shadow-sm">
                  <span className="text-4xl font-black text-slate-200">
                    {step.step}
                  </span>
                  <span className="mt-4 flex h-11 w-11 items-center justify-center rounded-xl bg-navy-900 text-white">
                    <step.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-navy-900">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {step.description}
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
            title="Opportunities by Category"
            subtitle="Explore the commodity groups where we are actively building our supply network and sourcing partners."
          />

          <div className="grid gap-6 md:grid-cols-2">
            {opportunityCategories.map((cat, i) => (
              <Reveal key={cat.title} delay={i * 0.08}>
                <div className="flex items-start gap-5 rounded-2xl border border-slate-200 bg-white p-7 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-lg">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600">
                    <cat.icon className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-navy-900">
                      {cat.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {cat.description}
                    </p>
                  </div>
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
                title="Procurement Policies"
                subtitle="Our procurement principles define how we engage, evaluate and collaborate with every supplier in our network."
              />
              <ul className="space-y-5">
                {policies.map((policy) => (
                  <li
                    key={policy.title}
                    className="rounded-2xl border border-slate-200 bg-white p-6"
                  >
                    <h3 className="font-bold text-navy-900">{policy.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {policy.description}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal>
            <div>
              <div className="h-fit rounded-2xl gradient-navy p-10">
                <h3 className="text-2xl font-bold text-white">
                  Start the Conversation
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-navy-100/80">
                  If your company meets our requirements and you would like to
                  begin the registration process, our procurement team is ready
                  to help.
                </p>
                <a
                  href={`mailto:${site.email.suppliers}`}
                  className="mt-8 flex items-center gap-3 rounded-xl bg-cyan-500/10 px-5 py-4 text-sm font-semibold text-cyan-300 transition-colors hover:bg-cyan-500/20"
                >
                  <Mail className="h-4 w-4 shrink-0" />
                  {site.email.suppliers}
                </a>
                <div className="mt-8 border-t border-white/10 pt-6">
                  <p className="text-sm font-semibold text-white">
                    What happens next?
                  </p>
                  <ol className="mt-4 space-y-3 text-sm text-navy-100/80">
                    <li className="flex gap-3">
                      <span className="font-bold text-cyan-400">1.</span>
                      You send an initial inquiry describing your capability.
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-cyan-400">2.</span>
                      Our supplier development team responds within five working
                      days.
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-cyan-400">3.</span>
                      You complete the registration and pre-qualification pack.
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
