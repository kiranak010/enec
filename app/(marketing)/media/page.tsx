import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Download,
  FileText,
  Images,
  Mail,
  Newspaper,
  Radio,
} from "lucide-react";
import Button from "@/components/ui/button";
import PageHeader from "@/components/ui/page-header";
import Reveal from "@/components/ui/reveal";
import CardImage from "@/components/ui/card-image";
import { images } from "@/lib/images";
import { site } from "@/config/site";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Media Center",
  description:
    "Press releases, publications, images and media resources from Emirates Nuclear Energy Corporation. For media inquiries, contact media@enec.gov.ae.",
};

const pressReleases = [
  {
    title: "ENEC Announces Record Generation in Fiscal Year",
    date: "2025-12-12",
    slug: "milestone-25-gw-of-clean-energy-capacity",
    summary:
      "Annual generation across the fleet reached a new high, reinforcing the reliability of nuclear baseload power.",
  },
  {
    title: "New Reactor Unit Enters Commercial Operation Ahead of Schedule",
    date: "2025-11-20",
    slug: "advancing-next-generation-reactor-technology",
    summary:
      "The latest unit in our construction portfolio achieved first power and commercial operation ahead of its planned schedule.",
  },
  {
    title: "ENEC Strengthens Supply Chain with New Contracts",
    date: "2025-10-04",
    slug: "global-partnership-for-clean-energy-expansion",
    summary:
      "Multi-year contracts with regional fabricators will support our next wave of new-build projects.",
  },
  {
    title: "Quarterly Safety Performance Report Published",
    date: "2025-09-18",
    slug: "new-safety-standards-set-industry-benchmark",
    summary:
      "Fleet-wide safety indicators remain at world-class levels, with continued improvement across leading indicators.",
  },
];

const publications = [
  {
    title: "Energy in Perspective: The Nuclear Option",
    type: "Position Paper",
    year: "2025",
    description:
      "A balanced look at the role of nuclear energy in a decarbonised, secure and affordable power system.",
  },
  {
    title: "Small Modular Reactors: A Deployment Roadmap",
    type: "Technical Brief",
    year: "2024",
    description:
      "Our assessment of siting, licensing and supply-chain readiness for advanced reactor deployment.",
  },
  {
    title: "Workforce of the Future",
    type: "Research Report",
    year: "2024",
    description:
      "How the industry can attract, train and retain the talent required to double clean nuclear capacity.",
  },
];

const gallery = [
  {
    caption: "Meridian Reactor — safety-related concrete works",
    gradient: "linear-gradient(135deg, #0B1D3A, #00A3E0)",
  },
  {
    caption: "Pacific Clean Energy Plant — turbine hall",
    gradient: "linear-gradient(135deg, #0D2847, #1ABFE9)",
  },
  {
    caption: "Control room operations at dawn",
    gradient: "linear-gradient(135deg, #060F1E, #25436B)",
  },
  {
    caption: "Fuel handling facility interior",
    gradient: "linear-gradient(135deg, #0B1D3A, #00516B)",
  },
  {
    caption: "Interchange of containment vessel",
    gradient: "linear-gradient(135deg, #0D2847, #00A3E0)",
  },
  {
    caption: "Skills academy training centre",
    gradient: "linear-gradient(135deg, #060F1E, #1ABFE9)",
  },
  {
    caption: "Cooling water intake structures",
    gradient: "linear-gradient(135deg, #0B1D3A, #25436B)",
  },
  {
    caption: "Emergency diesel generator hall",
    gradient: "linear-gradient(135deg, #0D2847, #00516B)",
  },
];

const downloads = [
  { title: "Company Fact Sheet 2026", type: "PDF", size: "2.4 MB" },
  { title: "Logo Pack (Primary & Reversed)", type: "ZIP", size: "8.1 MB" },
  {
    title: "Executive Headshots — High Resolution",
    type: "ZIP",
    size: "14.6 MB",
  },
  {
    title: "Fleet Photography — Editorial Selection",
    type: "ZIP",
    size: "48.2 MB",
  },
];

const fileTypeColors: Record<string, string> = {
  PDF: "bg-red-500/10 text-red-700",
  ZIP: "bg-amber-500/10 text-amber-700",
};

export default function MediaCenterPage() {
  return (
    <>
      <PageHeader
        eyebrow="Media Centre"
        title="Media Center"
        description={
          <>
            Press releases, publications, imagery and resources for journalists
            and partners covering our people, projects and the wider nuclear
            energy story.
          </>
        }
        image={images.mediaBriefing}
      />

      <section className="section-padding bg-white">
        <div className="container-narrow">
          <div className="flex items-center gap-3">
            <Newspaper className="h-6 w-6 text-cyan-600" />
            <h2 className="text-3xl font-bold text-navy-900">Press Releases</h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {pressReleases.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.08}>
                <Link
                  href={`/news/${item.slug}`}
                  className="group rounded-2xl border border-slate-200 bg-white p-7 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-500/50 hover:shadow-lg"
                >
                  <time className="text-xs font-medium uppercase tracking-widest text-slate-400">
                    {formatDate(item.date)}
                  </time>
                  <h3 className="mt-3 text-xl font-bold text-navy-900 transition-colors group-hover:text-cyan-600">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-500">
                    {item.summary}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-600">
                    Read Release
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-slate-50">
        <div className="container-narrow">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-navy-700" />
            <h2 className="text-3xl font-bold text-navy-900">Publications</h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {publications.map((pub, i) => (
              <Reveal key={pub.title} delay={i * 0.08}>
                <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-7 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-navy-500/10 px-3 py-1 text-xs font-semibold text-navy-700">
                      {pub.type}
                    </span>
                    <span className="text-xs font-medium text-slate-400">
                      {pub.year}
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-navy-900">
                    {pub.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-500">
                    {pub.description}
                  </p>
                  <Button
                    href="/documents"
                    variant="outline"
                    size="sm"
                    className="mt-auto self-start pt-0"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-narrow">
          <div className="flex items-center gap-3">
            <Images className="h-6 w-6 text-cyan-600" />
            <h2 className="text-3xl font-bold text-navy-900">Image Gallery</h2>
          </div>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600">
            High-resolution imagery is available to accredited media on request.
            Preview thumbnails below.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
            {gallery.map((img, i) => (
              <Reveal key={img.caption} delay={i * 0.08}>
                <figure className="group overflow-hidden rounded-xl">
                  <CardImage
                    src={images.mediaBriefing}
                    alt={img.caption}
                    className="aspect-[4/3]"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <figcaption className="mt-3 text-xs font-medium leading-relaxed text-slate-500">
                    {img.caption}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-slate-50">
        <div className="container-narrow">
          <div className="flex items-center gap-3">
            <Download className="h-6 w-6 text-navy-700" />
            <h2 className="text-3xl font-bold text-navy-900">Downloads</h2>
          </div>

          <Reveal>
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  {downloads.map((file, i) => (
                    <a
                      key={file.title}
                      href="#"
                      className={`group flex flex-wrap items-center justify-between gap-4 p-6 transition-colors hover:bg-cyan-500/5 ${
                        i > 0 ? "border-t border-slate-200" : ""
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-navy-900 text-white">
                          <FileText className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="font-semibold text-navy-900 group-hover:text-cyan-600">
                            {file.title}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-400">
                            {file.size}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${fileTypeColors[file.type] ?? "bg-slate-100 text-slate-600"}`}
                        >
                          {file.type}
                        </span>
                        <Download className="h-4 w-4 text-slate-400 transition-colors group-hover:text-cyan-600" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              <div className="h-fit rounded-2xl gradient-navy p-8">
                <div className="flex items-center gap-3">
                  <Radio className="h-6 w-6 text-cyan-400" />
                  <h3 className="text-xl font-bold text-white">
                    Media Contacts
                  </h3>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-navy-100/80">
                  For media inquiries, interviews and imagery requests:
                </p>
                <a
                  href={`mailto:${site.email.media}`}
                  className="mt-5 flex items-center gap-3 rounded-xl bg-cyan-500/10 px-4 py-3.5 text-sm font-semibold text-cyan-300 transition-colors hover:bg-cyan-500/20"
                >
                  <Mail className="h-4 w-4 shrink-0" />
                  {site.email.media}
                </a>
                <p className="mt-6 text-xs leading-relaxed text-navy-200/70">
                  Media response is available worldwide 24/7 for breaking news.
                  All imagery and assets must be credited to ENEC Power
                  Company.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
