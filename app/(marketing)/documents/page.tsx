import type { Metadata } from "next";
import {
  Calendar,
  Download,
  FileText,
  Search,
  SearchX,
  SlidersHorizontal,
  TrendingUp,
} from "lucide-react";
import { prisma } from "@/lib/prisma";

import Button from "@/components/ui/button";
import PageHeader from "@/components/ui/page-header";
import Reveal from "@/components/ui/reveal";
import CardImage from "@/components/ui/card-image";
import { images } from "@/lib/images";

export const metadata: Metadata = {
  title: "Document Center",
  description:
    "Download annual reports, sustainability disclosures, technical papers and corporate policies from Emirates Nuclear Energy Corporation.",
};

type DocumentCategoryKey =
  | "ANNUAL_REPORT"
  | "SUSTAINABILITY_REPORT"
  | "CORPORATE_PRESENTATION"
  | "TECHNICAL_REPORT"
  | "POLICY"
  | "PUBLICATION"
  | "PRESS_RELEASE";

interface DocumentData {
  title: string;
  description: string | null;
  category: DocumentCategoryKey;
  categoryLabel: string;
  fileUrl: string;
  fileType: string;
  fileSizeKb: number | null;
  year: number | null;
  downloadCount: number;
}

const categoryLabels: Record<DocumentCategoryKey, string> = {
  ANNUAL_REPORT: "Annual Reports",
  SUSTAINABILITY_REPORT: "Sustainability Reports",
  CORPORATE_PRESENTATION: "Corporate Presentations",
  TECHNICAL_REPORT: "Technical Reports",
  POLICY: "Policies",
  PUBLICATION: "Publications",
  PRESS_RELEASE: "Press Releases",
};

const categoryColors: Record<DocumentCategoryKey, string> = {
  ANNUAL_REPORT: "bg-cyan-500/10 text-cyan-700",
  SUSTAINABILITY_REPORT: "bg-emerald-500/10 text-emerald-700",
  CORPORATE_PRESENTATION: "bg-navy-500/10 text-navy-700",
  TECHNICAL_REPORT: "bg-purple-500/10 text-purple-700",
  POLICY: "bg-amber-500/10 text-amber-700",
  PUBLICATION: "bg-blue-500/10 text-blue-700",
  PRESS_RELEASE: "bg-red-500/10 text-red-700",
};

const fileTypeColors: Record<string, string> = {
  PDF: "bg-red-500/10 text-red-700",
  XLSX: "bg-emerald-500/10 text-emerald-700",
  PPTX: "bg-amber-500/10 text-amber-700",
};

const fallbackDocuments: DocumentData[] = [
  {
    title: "2025 Annual Report",
    description:
      "Comprehensive overview of performance, financial results, safety metrics and strategic priorities.",
    category: "ANNUAL_REPORT",
    categoryLabel: "Annual Reports",
    fileUrl: "#",
    fileType: "PDF",
    fileSizeKb: 4200,
    year: 2025,
    downloadCount: 14200,
  },
  {
    title: "2024 Annual Report",
    description:
      "Annual report covering operations, safety, environmental stewardship and financial performance.",
    category: "ANNUAL_REPORT",
    categoryLabel: "Annual Reports",
    fileUrl: "#",
    fileType: "PDF",
    fileSizeKb: 3800,
    year: 2024,
    downloadCount: 21600,
  },
  {
    title: "2025 Sustainability Report",
    description:
      "Full ESG disclosure including environmental performance, community investment and workforce diversity data.",
    category: "SUSTAINABILITY_REPORT",
    categoryLabel: "Sustainability Reports",
    fileUrl: "#",
    fileType: "PDF",
    fileSizeKb: 3100,
    year: 2025,
    downloadCount: 9800,
  },
  {
    title: "2024 ESG Data Supplement",
    description:
      "Detailed environmental, social and governance data tables supporting the annual report.",
    category: "SUSTAINABILITY_REPORT",
    categoryLabel: "Sustainability Reports",
    fileUrl: "#",
    fileType: "XLSX",
    fileSizeKb: 560,
    year: 2024,
    downloadCount: 4200,
  },
  {
    title: "Fleet Performance Review 2025",
    description:
      "Technical assessment of fleet safety, reliability and efficiency performance trends.",
    category: "TECHNICAL_REPORT",
    categoryLabel: "Technical Reports",
    fileUrl: "#",
    fileType: "PDF",
    fileSizeKb: 2800,
    year: 2025,
    downloadCount: 7600,
  },
  {
    title: "Gen IV Technology Readiness Assessment",
    description:
      "Analysis of advanced reactor technology maturity, licensing readiness and deployment timelines.",
    category: "TECHNICAL_REPORT",
    categoryLabel: "Technical Reports",
    fileUrl: "#",
    fileType: "PDF",
    fileSizeKb: 2100,
    year: 2024,
    downloadCount: 5400,
  },
  {
    title: "Quality Assurance Policy",
    description:
      "Enterprise policy defining quality-management standards for nuclear safety-related goods and services.",
    category: "POLICY",
    categoryLabel: "Policies",
    fileUrl: "#",
    fileType: "PDF",
    fileSizeKb: 380,
    year: 2025,
    downloadCount: 3100,
  },
  {
    title: "Supply Chain Code of Conduct",
    description:
      "Principles and expectations governing ethical conduct, safety and sustainability across the supply chain.",
    category: "POLICY",
    categoryLabel: "Policies",
    fileUrl: "#",
    fileType: "PDF",
    fileSizeKb: 420,
    year: 2024,
    downloadCount: 6200,
  },
  {
    title: "2025 Corporate Presentation",
    description:
      "Overview of company profile, fleet, sustainability leadership and strategic roadmap.",
    category: "CORPORATE_PRESENTATION",
    categoryLabel: "Corporate Presentations",
    fileUrl: "#",
    fileType: "PPTX",
    fileSizeKb: 8200,
    year: 2025,
    downloadCount: 4800,
  },
];

function formatFileSize(kb: number | null): string {
  if (!kb) return "—";
  if (kb >= 1024) return `${(kb / 1024).toFixed(1)} MB`;
  return `${kb} KB`;
}

function formatDownloads(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return String(count);
}

async function fetchDocuments(): Promise<DocumentData[]> {
  try {
    const rows = await prisma.document.findMany({
      where: { published: true },
      orderBy: [{ year: "desc" }, { title: "asc" }],
      take: 50,
    });

    if (rows.length > 0) {
      return rows.map((d) => ({
        title: d.title,
        description: d.description,
        category: d.category,
        categoryLabel:
          categoryLabels[d.category as DocumentCategoryKey] ?? d.category,
        fileUrl: d.fileUrl,
        fileType: d.fileType ?? "File",
        fileSizeKb: d.fileSizeKb,
        year: d.year,
        downloadCount: d.downloadCount,
      }));
    }
  } catch {
    // Database not available — use fallback
  }

  return fallbackDocuments;
}

interface DocSearchParams {
  category?: string;
  q?: string;
}

export default async function DocumentsPage({
  searchParams,
}: {
  searchParams: Promise<DocSearchParams>;
}) {
  const sp = await searchParams;
  const categoryFilter =
    typeof sp.category === "string" ? sp.category : undefined;
  const q = typeof sp.q === "string" ? sp.q.trim().toLowerCase() : undefined;

  const documents = await fetchDocuments();

  const categories = Array.from(
    new Set(documents.map((d) => d.category)),
  ).filter(Boolean) as DocumentCategoryKey[];

  const activeCategories =
    categories.length > 0
      ? categories
      : (Object.keys(categoryLabels) as DocumentCategoryKey[]);

  let filtered = documents;

  if (categoryFilter) {
    filtered = filtered.filter((d) => d.category === categoryFilter);
  }
  if (q) {
    filtered = filtered.filter((d) =>
      `${d.title} ${d.description ?? ""} ${d.categoryLabel}`
        .toLowerCase()
        .includes(q),
    );
  }

  const hasFilters = Boolean(categoryFilter || q);

  return (
    <>
      <PageHeader
        eyebrow="Document Centre"
        title="Document Center"
        description={
          <>
            Access our annual reports, sustainability disclosures, technical
            papers, corporate presentations and policies — all available for
            download.
          </>
        }
        image={images.documentArchive}
      />

      <section className="section-padding bg-slate-50">
        <div className="container-narrow">
          <Reveal>
            <form
              method="get"
              action="/documents"
              className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm sm:flex-row sm:items-center"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  name="q"
                  defaultValue={sp.q ?? ""}
                  placeholder="Search documents…"
                  aria-label="Search documents"
                  className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                />
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <SlidersHorizontal className="h-4 w-4" />
                Filter:
              </div>
              <div className="flex flex-wrap gap-2">
                {activeCategories.map((cat) => (
                  <a
                    key={cat}
                    href={
                      categoryFilter === cat
                        ? q
                          ? `/documents?q=${encodeURIComponent(q)}`
                          : "/documents"
                        : `/documents?category=${cat}${q ? `&q=${encodeURIComponent(q)}` : ""}`
                    }
                    className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                      categoryFilter === cat
                        ? "bg-navy-900 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {categoryLabels[cat]}
                  </a>
                ))}
              </div>
            </form>
          </Reveal>

          <Reveal>
            <div className="mt-10 flex items-center gap-2 text-sm text-slate-500">
              <FileText className="h-4 w-4" />
              <span>
                <strong className="text-navy-900">{filtered.length}</strong>{" "}
                {filtered.length === 1 ? "document" : "documents"}
              </span>
              {hasFilters && (
                <a
                  href="/documents"
                  className="ml-3 text-xs font-semibold text-cyan-600 underline decoration-cyan-500/40 underline-offset-2 hover:decoration-cyan-500"
                >
                  Clear filters
                </a>
              )}
            </div>

            <div className="mt-8">
              {filtered.length === 0 ? (
                <div className="mx-auto max-w-lg rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
                  <SearchX className="mx-auto h-10 w-10 text-slate-300" />
                  <h2 className="mt-6 text-xl font-bold text-navy-900">
                    No documents found
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-slate-500">
                    Try adjusting your search or changing the category filter.
                  </p>
                  <Button href="/documents" variant="outline" className="mt-8">
                    View All Documents
                  </Button>
                </div>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  {filtered.map((doc, i) => (
                    <a
                      key={doc.title}
                      href={doc.fileUrl}
                      className={`group flex flex-wrap items-center justify-between gap-4 p-6 transition-colors hover:bg-cyan-500/5 ${
                        i > 0 ? "border-t border-slate-200" : ""
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <CardImage
                          src={images.documentArchive}
                          alt=""
                          className="mt-0.5 h-11 w-11 shrink-0 rounded-lg"
                          sizes="44px"
                        />
                        <div className="max-w-xl">
                          <h3 className="text-sm font-bold text-navy-900 group-hover:text-cyan-600">
                            {doc.title}
                          </h3>
                          <p className="mt-1 max-w-lg text-xs leading-relaxed text-slate-500">
                            {doc.description}
                          </p>
                          <div className="mt-2.5 flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                            <span className="flex items-center gap-1.5 font-semibold text-slate-600">
                              <Calendar className="h-3 w-3" />
                              {doc.year ?? "—"}
                            </span>
                            <span className="h-3 w-px bg-slate-300" />
                            <span>{formatFileSize(doc.fileSizeKb)}</span>
                            <span className="h-3 w-px bg-slate-300" />
                            <span className="flex items-center gap-1.5">
                              <TrendingUp className="h-3 w-3" />
                              {formatDownloads(doc.downloadCount)} downloads
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`rounded-full px-3 py-1 text-[11px] font-bold ${categoryColors[doc.category] ?? "bg-slate-100 text-slate-600"}`}
                        >
                          {doc.categoryLabel}
                        </span>
                        <span
                          className={`rounded-full px-3 py-1 text-[11px] font-bold ${fileTypeColors[doc.fileType] ?? "bg-slate-100 text-slate-600"}`}
                        >
                          {doc.fileType}
                        </span>
                        <Download className="h-4 w-4 text-slate-400 transition-colors group-hover:text-cyan-600" />
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
