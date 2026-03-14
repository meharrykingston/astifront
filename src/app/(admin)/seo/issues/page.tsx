"use client";

import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  Bug,
  Copy,
  ExternalLink,
  FileWarning,
  Gauge,
  Link2Off,
  LayoutTemplate,
  Map,
  Search,
  ShieldAlert,
} from "lucide-react";

type IssueCategory =
  | "sitemap"
  | "broken_links"
  | "duplicate_content"
  | "layout_shift"
  | "page_speed"
  | "technical";

type Severity = "high" | "medium" | "low";

type IssueRecord = {
  id: string;
  category: IssueCategory;
  page: string;
  issue: string;
  severity: Severity;
  status: "open" | "in_progress" | "resolved";
  detectedAt: string;
  value?: string;
};

const issuesSeed: IssueRecord[] = [
  {
    id: "SMP-101",
    category: "sitemap",
    page: "/sitemap-products.xml",
    issue: "Submitted URL marked noindex",
    severity: "high",
    status: "open",
    detectedAt: "2026-03-14",
  },
  {
    id: "SMP-102",
    category: "sitemap",
    page: "/sitemap-blog.xml",
    issue: "Sitemap fetch failed (5xx)",
    severity: "medium",
    status: "in_progress",
    detectedAt: "2026-03-13",
  },
  {
    id: "BLK-221",
    category: "broken_links",
    page: "/blog/react-hooks-guide",
    issue: "Broken outbound link (404)",
    severity: "medium",
    status: "open",
    detectedAt: "2026-03-14",
  },
  {
    id: "BLK-222",
    category: "broken_links",
    page: "/contact",
    issue: "Internal link target missing",
    severity: "high",
    status: "open",
    detectedAt: "2026-03-11",
  },
  {
    id: "DUP-301",
    category: "duplicate_content",
    page: "/services",
    issue: "Duplicate title + meta description",
    severity: "medium",
    status: "in_progress",
    detectedAt: "2026-03-12",
  },
  {
    id: "DUP-302",
    category: "duplicate_content",
    page: "/services-overview",
    issue: "Near-duplicate primary content",
    severity: "low",
    status: "open",
    detectedAt: "2026-03-09",
  },
  {
    id: "CLS-411",
    category: "layout_shift",
    page: "/pricing",
    issue: "Cumulative Layout Shift above threshold",
    severity: "high",
    status: "open",
    detectedAt: "2026-03-14",
    value: "CLS 0.29",
  },
  {
    id: "CLS-412",
    category: "layout_shift",
    page: "/home",
    issue: "Hero image loading causes shift",
    severity: "medium",
    status: "in_progress",
    detectedAt: "2026-03-10",
    value: "CLS 0.17",
  },
  {
    id: "SPD-501",
    category: "page_speed",
    page: "/features",
    issue: "Low mobile page speed index",
    severity: "medium",
    status: "open",
    detectedAt: "2026-03-12",
    value: "PSI 46",
  },
  {
    id: "SPD-502",
    category: "page_speed",
    page: "/blog",
    issue: "Render-blocking JS impacting FCP",
    severity: "low",
    status: "open",
    detectedAt: "2026-03-08",
    value: "PSI 58",
  },
  {
    id: "TEC-701",
    category: "technical",
    page: "/account/reset",
    issue: "Blocked by robots.txt",
    severity: "high",
    status: "open",
    detectedAt: "2026-03-14",
  },
  {
    id: "TEC-702",
    category: "technical",
    page: "/checkout",
    issue: "Structured data validation warning",
    severity: "low",
    status: "resolved",
    detectedAt: "2026-03-07",
  },
];

const categoryMeta: Record<
  IssueCategory,
  {
    label: string;
    icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
    iconWrap: string;
    iconColor: string;
  }
> = {
  sitemap: {
    label: "Sitemap Errors",
    icon: Map,
    iconWrap: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  broken_links: {
    label: "Broken Links",
    icon: Link2Off,
    iconWrap: "bg-rose-50",
    iconColor: "text-rose-600",
  },
  duplicate_content: {
    label: "Duplicate Content",
    icon: Copy,
    iconWrap: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  layout_shift: {
    label: "Layout Shift (CLS)",
    icon: LayoutTemplate,
    iconWrap: "bg-violet-50",
    iconColor: "text-violet-600",
  },
  page_speed: {
    label: "Page Speed Index",
    icon: Gauge,
    iconWrap: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  technical: {
    label: "Technical Errors",
    icon: Bug,
    iconWrap: "bg-slate-100",
    iconColor: "text-slate-700",
  },
};

const severityClass: Record<Severity, string> = {
  high: "bg-rose-100 text-rose-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-emerald-100 text-emerald-700",
};

const statusClass: Record<IssueRecord["status"], string> = {
  open: "bg-rose-50 text-rose-700",
  in_progress: "bg-amber-50 text-amber-700",
  resolved: "bg-emerald-50 text-emerald-700",
};

const trackedPagesCount = 184;

export default function IssuesPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | IssueRecord["status"]>("all");
  const [severityFilter, setSeverityFilter] = useState<"all" | Severity>("all");

  const filtered = useMemo(() => {
    return issuesSeed.filter((row) => {
      const q = query.trim().toLowerCase();
      const matchQ =
        !q ||
        row.page.toLowerCase().includes(q) ||
        row.issue.toLowerCase().includes(q) ||
        row.id.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || row.status === statusFilter;
      const matchSeverity = severityFilter === "all" || row.severity === severityFilter;
      return matchQ && matchStatus && matchSeverity;
    });
  }, [query, statusFilter, severityFilter]);

  const totalIssues = filtered.length;
  const highPriority = filtered.filter((x) => x.severity === "high").length;
  const openIssues = filtered.filter((x) => x.status === "open").length;

  const grouped = useMemo(() => {
    return (Object.keys(categoryMeta) as IssueCategory[]).map((cat) => ({
      category: cat,
      items: filtered.filter((item) => item.category === cat),
    }));
  }, [filtered]);

  return (
    <section className="min-h-screen w-full overflow-x-hidden bg-slate-50 p-3 font-['Sora'] text-slate-900 sm:p-5 lg:p-6">
      <div className="mx-auto w-full max-w-375 space-y-4">
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
              SEO Issues
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              Google Search Console issue monitoring by page and category
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm shadow-sm">
            <span className="font-semibold text-slate-800">Tracked Pages:</span>{" "}
            {trackedPagesCount.toLocaleString()}
          </div>
        </header>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100">
              <FileWarning className="h-3.5! w-3.5! text-slate-700" />
            </div>
            <p className="mt-2 text-xs sm:text-sm font-medium text-slate-600">Total Issues</p>
            <p className="text-xl font-semibold leading-none">{totalIssues}</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50">
              <ShieldAlert className="h-3.5! w-3.5! text-rose-600" />
            </div>
            <p className="mt-2 text-xs sm:text-sm font-medium text-slate-600">High Priority</p>
            <p className="text-xl font-semibold leading-none">{highPriority}</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50">
              <AlertTriangle className="h-3.5! w-3.5! text-amber-600" />
            </div>
            <p className="mt-2 text-xs sm:text-sm font-medium text-slate-600">Open Issues</p>
            <p className="text-xl font-semibold leading-none">{openIssues}</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50">
              <Gauge className="h-3.5! w-3.5! text-emerald-600" />
            </div>
            <p className="mt-2 text-xs sm:text-sm font-medium text-slate-600">Health Score</p>
            <p className="text-xl font-semibold leading-none">82</p>
          </div>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_auto_auto]">
            <div className="relative min-w-0">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5! w-3.5! -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search issue id, page path, or error..."
                className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 text-xs sm:text-sm outline-none focus:border-blue-300 focus:bg-white"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as "all" | IssueRecord["status"])
              }
              className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs sm:text-sm"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>

            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as "all" | Severity)}
              className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs sm:text-sm"
            >
              <option value="all">All Severity</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {grouped.map(({ category, items }) => {
            const meta = categoryMeta[category];
            const Icon = meta.icon;
            return (
              <article
                key={category}
                className="rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-slate-100 p-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className={`inline-flex h-7 w-7 items-center justify-center rounded-lg ${meta.iconWrap}`}
                    >
                      <Icon className={`h-3.5! w-3.5! ${meta.iconColor}`} />
                    </span>
                    <h2 className="truncate text-sm lg:text-base font-semibold text-slate-900">
                      {meta.label}
                    </h2>
                  </div>
                  <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-xs sm:text-sm font-semibold text-slate-700">
                    {items.length} pages
                  </span>
                </div>

                <div className="p-3">
                  {items.length === 0 ? (
                    <p className="text-xs sm:text-sm text-slate-500">No issues in this segment.</p>
                  ) : (
                    <div className="space-y-2">
                      {items.slice(0, 5).map((item) => (
                        <div
                          key={item.id}
                          className="rounded-xl border border-slate-200 bg-slate-50 p-2.5"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="min-w-0 truncate text-xs sm:text-sm font-semibold text-slate-900">
                              {item.page}
                            </p>
                            <span
                              className={`shrink-0 rounded-full px-2 py-0.5 text-xs sm:text-sm font-semibold ${severityClass[item.severity]}`}
                            >
                              {item.severity}
                            </span>
                          </div>
                          <p className="mt-1 text-xs sm:text-sm text-slate-600">{item.issue}</p>
                          <div className="mt-2 flex items-center justify-between text-xs sm:text-sm text-slate-500">
                            <span
                              className={`rounded-full px-2 py-0.5 font-medium ${statusClass[item.status]}`}
                            >
                              {item.status.replace("_", " ")}
                            </span>
                            <span>{item.value ?? item.detectedAt}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-3">
            <h2 className="text-sm lg:text-base font-semibold text-slate-900">Issues by Page (Full List)</h2>
          </div>

          <div className="divide-y divide-slate-100">
            {filtered.length === 0 && (
              <p className="p-4 text-xs sm:text-sm text-slate-500">No issue records found.</p>
            )}

            {filtered.map((item) => (
              <div key={item.id} className="p-3">
                <div className="grid grid-cols-1 gap-2 md:grid-cols-[1.4fr_2fr_auto_auto] md:items-center">
                  <div className="min-w-0">
                    <p className="truncate text-xs sm:text-sm font-semibold text-slate-900">{item.page}</p>
                    <p className="text-xs sm:text-sm text-slate-500">{item.id}</p>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700">{item.issue}</p>

                  <span
                    className={`w-fit rounded-full px-2 py-0.5 text-xs sm:text-sm font-semibold ${severityClass[item.severity]}`}
                  >
                    {item.severity}
                  </span>

                  <button className="inline-flex h-7 w-fit items-center gap-1 rounded-lg border border-slate-200 px-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-100">
                    Page
                    <ExternalLink className="h-3.5! w-3.5!" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}


