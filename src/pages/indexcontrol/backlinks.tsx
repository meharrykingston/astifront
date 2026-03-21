import React, { useMemo, useState } from "react";
import SeoLayout from "@/components/seo/SeoLayout";
import type { NextPageWithLayout } from "../_app";
import styles from "./backlinks.module.css";
import {
  AlertTriangle,
  ArrowUpRight,
  ExternalLink,
  Filter,
  Link2,
  Network,
  Search,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

type BacklinkType = "external" | "internal";
type LinkStatus = "active" | "lost" | "new" | "nofollow";
type LinkQuality = "high" | "medium" | "low";

type BacklinkRecord = {
  id: string;
  type: BacklinkType;
  sourceUrl: string;
  targetUrl: string;
  anchor: string;
  domain: string;
  authority: number;
  status: LinkStatus;
  quality: LinkQuality;
  firstSeen: string;
  lastSeen: string;
};

type Opportunity = {
  id: string;
  targetPage: string;
  suggestion: string;
  priority: "high" | "medium" | "low";
  sourceType: "guest_post" | "directory" | "partner" | "internal";
};

const backlinkData: BacklinkRecord[] = [
  {
    id: "BL-1001",
    type: "external",
    sourceUrl: "https://mednews.example.com/seo-guide",
    targetUrl: "/blog/internal-linking-medical-blogs",
    anchor: "internal linking strategy",
    domain: "mednews.example.com",
    authority: 78,
    status: "active",
    quality: "high",
    firstSeen: "2026-02-20",
    lastSeen: "2026-03-14",
  },
  {
    id: "BL-1002",
    type: "external",
    sourceUrl: "https://healthforum.example.org/resources",
    targetUrl: "/services",
    anchor: "healthcare seo agency",
    domain: "healthforum.example.org",
    authority: 63,
    status: "nofollow",
    quality: "medium",
    firstSeen: "2026-01-10",
    lastSeen: "2026-03-11",
  },
  {
    id: "BL-1003",
    type: "external",
    sourceUrl: "https://startupseo.example.net/tools",
    targetUrl: "/blog/schema-markup-hospital-services",
    anchor: "schema markup checklist",
    domain: "startupseo.example.net",
    authority: 52,
    status: "lost",
    quality: "medium",
    firstSeen: "2025-12-01",
    lastSeen: "2026-03-05",
  },
  {
    id: "BL-1004",
    type: "internal",
    sourceUrl: "/blog/seo-fixes-healthcare",
    targetUrl: "/services",
    anchor: "technical seo audit",
    domain: "astikan.local",
    authority: 0,
    status: "active",
    quality: "high",
    firstSeen: "2026-03-01",
    lastSeen: "2026-03-14",
  },
  {
    id: "BL-1005",
    type: "internal",
    sourceUrl: "/blog/meta-description-templates",
    targetUrl: "/blog",
    anchor: "blog seo templates",
    domain: "astikan.local",
    authority: 0,
    status: "new",
    quality: "medium",
    firstSeen: "2026-03-12",
    lastSeen: "2026-03-14",
  },
  {
    id: "BL-1006",
    type: "external",
    sourceUrl: "https://caremarket.example.io/top-tools",
    targetUrl: "/features",
    anchor: "seo platform for clinics",
    domain: "caremarket.example.io",
    authority: 71,
    status: "new",
    quality: "high",
    firstSeen: "2026-03-13",
    lastSeen: "2026-03-14",
  },
];

const opportunities: Opportunity[] = [
  {
    id: "OP-01",
    targetPage: "/pricing",
    suggestion: "Acquire 5 high-authority comparison links",
    priority: "high",
    sourceType: "guest_post",
  },
  {
    id: "OP-02",
    targetPage: "/contact",
    suggestion: "Add 3 internal links from top traffic blog posts",
    priority: "medium",
    sourceType: "internal",
  },
  {
    id: "OP-03",
    targetPage: "/services",
    suggestion: "Submit to 4 niche healthcare directories",
    priority: "medium",
    sourceType: "directory",
  },
  {
    id: "OP-04",
    targetPage: "/blog/core-web-vitals-clinic-pages",
    suggestion: "Get 2 partner backlinks from dev agencies",
    priority: "low",
    sourceType: "partner",
  },
];

const statusClass: Record<LinkStatus, string> = {
  active: "bg-emerald-100 text-emerald-700",
  lost: "bg-rose-100 text-rose-700",
  new: "bg-blue-100 text-blue-700",
  nofollow: "bg-amber-100 text-amber-700",
};

const qualityClass: Record<LinkQuality, string> = {
  high: "bg-emerald-100 text-emerald-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-rose-100 text-rose-700",
};

const priorityClass: Record<Opportunity["priority"], string> = {
  high: "bg-rose-100 text-rose-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-emerald-100 text-emerald-700",
};

const BacklinksPage: NextPageWithLayout = () => {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | BacklinkType>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | LinkStatus>("all");
  const [qualityFilter, setQualityFilter] = useState<"all" | LinkQuality>("all");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return backlinkData.filter((row) => {
      const q = query.trim().toLowerCase();
      const matchQ =
        !q ||
        row.sourceUrl.toLowerCase().includes(q) ||
        row.targetUrl.toLowerCase().includes(q) ||
        row.anchor.toLowerCase().includes(q) ||
        row.domain.toLowerCase().includes(q);
      const matchType = typeFilter === "all" || row.type === typeFilter;
      const matchStatus = statusFilter === "all" || row.status === statusFilter;
      const matchQuality = qualityFilter === "all" || row.quality === qualityFilter;
      return matchQ && matchType && matchStatus && matchQuality;
    });
  }, [query, qualityFilter, statusFilter, typeFilter]);

  const totals = useMemo(() => {
    return {
      all: filtered.length,
      external: filtered.filter((r) => r.type === "external").length,
      internal: filtered.filter((r) => r.type === "internal").length,
      lost: filtered.filter((r) => r.status === "lost").length,
      highRisk: filtered.filter((r) => r.quality === "low").length,
    };
  }, [filtered]);

  const topDomains = useMemo(() => {
    const map = new Map<string, { count: number; avgDa: number; totalDa: number }>();
    filtered
      .filter((x) => x.type === "external")
      .forEach((row) => {
        const curr = map.get(row.domain) ?? { count: 0, avgDa: 0, totalDa: 0 };
        curr.count += 1;
        curr.totalDa += row.authority;
        curr.avgDa = Math.round(curr.totalDa / curr.count);
        map.set(row.domain, curr);
      });
    return [...map.entries()]
      .map(([domain, v]) => ({ domain, ...v }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [filtered]);

  return (
    <div className={styles.page}>
    <section className="min-h-screen w-full overflow-x-hidden bg-slate-50 p-3 font-['Sora'] text-slate-900 sm:p-5 lg:p-6">
      <div className="mx-auto w-full max-w-375 space-y-4">
        <header className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
              Backlink Management
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              External and internal backlink intelligence for SEO decisions
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm shadow-sm">
            <span className="font-semibold">Required Opportunities:</span> {opportunities.length}
          </div>
        </header>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          <KpiCard label="Total Links" value={totals.all} icon={Link2} />
          <KpiCard label="External" value={totals.external} icon={ArrowUpRight} />
          <KpiCard label="Internal" value={totals.internal} icon={Network} />
          <KpiCard label="Lost Links" value={totals.lost} icon={AlertTriangle} />
          <KpiCard label="Low Quality" value={totals.highRisk} icon={ShieldAlert} />
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_auto]">
            <div className="relative min-w-0">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5! w-3.5! -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search source, target, anchor, domain..."
                className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 text-xs sm:text-sm outline-none focus:border-blue-300 focus:bg-white"
              />
            </div>
            <button
              onClick={() => setShowFilters((v) => !v)}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 text-xs sm:text-sm font-medium text-slate-800 hover:bg-slate-50"
            >
              <Filter className="h-3.5! w-3.5!" />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="mt-3 grid grid-cols-1 gap-2 rounded-xl border border-slate-100 bg-slate-50 p-2 sm:grid-cols-3 lg:grid-cols-4">
              <FilterSelect
                label="Type"
                value={typeFilter}
                onChange={(v) => setTypeFilter(v as "all" | BacklinkType)}
                options={[
                  { value: "all", label: "All Types" },
                  { value: "external", label: "External" },
                  { value: "internal", label: "Internal" },
                ]}
              />
              <FilterSelect
                label="Status"
                value={statusFilter}
                onChange={(v) => setStatusFilter(v as "all" | LinkStatus)}
                options={[
                  { value: "all", label: "All Status" },
                  { value: "active", label: "Active" },
                  { value: "new", label: "New" },
                  { value: "lost", label: "Lost" },
                  { value: "nofollow", label: "Nofollow" },
                ]}
              />
              <FilterSelect
                label="Quality"
                value={qualityFilter}
                onChange={(v) => setQualityFilter(v as "all" | LinkQuality)}
                options={[
                  { value: "all", label: "All Quality" },
                  { value: "high", label: "High" },
                  { value: "medium", label: "Medium" },
                  { value: "low", label: "Low" },
                ]}
              />
              <button
                onClick={() => {
                  setTypeFilter("all");
                  setStatusFilter("all");
                  setQualityFilter("all");
                }}
                className="h-8 self-end rounded-lg border border-slate-200 bg-white px-2 text-xs sm:text-sm font-medium hover:bg-slate-100"
              >
                Reset Filters
              </button>
            </div>
          )}
        </section>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-3">
              <h2 className="text-sm lg:text-base font-semibold">Top Referring Domains</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {topDomains.length === 0 && (
                <p className="p-3 text-xs sm:text-sm text-slate-500">No external domain data.</p>
              )}
              {topDomains.map((d) => (
                <div key={d.domain} className="flex items-center justify-between gap-2 p-3">
                  <div className="min-w-0">
                    <p className="truncate text-xs sm:text-sm font-semibold text-slate-900">{d.domain}</p>
                    <p className="text-xs sm:text-sm text-slate-500">Avg DA: {d.avgDa}</p>
                  </div>
                  <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-xs sm:text-sm font-semibold text-slate-700">
                    {d.count} links
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-3">
              <h2 className="inline-flex items-center gap-1 text-sm lg:text-base font-semibold">
                <Sparkles className="h-3.5! w-3.5! text-blue-600" />
                Required Backlink Opportunities
              </h2>
            </div>
            <div className="space-y-2 p-3">
              {opportunities.map((o) => (
                <div key={o.id} className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate text-xs sm:text-sm font-semibold text-slate-900">{o.targetPage}</p>
                    <span className={`rounded-full px-2 py-0.5 text-xs sm:text-sm font-semibold ${priorityClass[o.priority]}`}>
                      {o.priority}
                    </span>
                  </div>
                  <p className="mt-1 text-xs sm:text-sm text-slate-600">{o.suggestion}</p>
                  <p className="mt-1 text-xs sm:text-sm text-slate-500">Source type: {o.sourceType}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-3">
            <h2 className="text-sm lg:text-base font-semibold">Backlink Records (Internal + External)</h2>
          </div>

          <div className="divide-y divide-slate-100">
            {filtered.length === 0 && (
              <p className="p-4 text-xs sm:text-sm text-slate-500">No backlink data found.</p>
            )}

            {filtered.map((row) => (
              <div key={row.id} className="p-3">
                <div className="grid grid-cols-1 gap-2 md:grid-cols-[1.5fr_1.4fr_auto_auto_auto] md:items-center">
                  <div className="min-w-0">
                    <p className="truncate text-xs sm:text-sm font-semibold text-slate-900">{row.sourceUrl}</p>
                    <p className="truncate text-xs sm:text-sm text-slate-500">to {row.targetUrl}</p>
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-xs sm:text-sm text-slate-700">{row.anchor}</p>
                    <p className="truncate text-xs sm:text-sm text-slate-500">
                      {row.type} - {row.domain}
                    </p>
                  </div>

                  <span className={`w-fit rounded-full px-2 py-0.5 text-xs sm:text-sm font-semibold ${statusClass[row.status]}`}>
                    {row.status}
                  </span>

                  <span className={`w-fit rounded-full px-2 py-0.5 text-xs sm:text-sm font-semibold ${qualityClass[row.quality]}`}>
                    {row.quality}
                  </span>

                  <button className="inline-flex h-7 w-fit items-center gap-1 rounded-lg border border-slate-200 px-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-100">
                    Open
                    <ExternalLink className="h-3.5! w-3.5!" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
    </div>
  );
};

BacklinksPage.getLayout = (page) => <SeoLayout>{page}</SeoLayout>;

export default BacklinksPage;

function KpiCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 text-center shadow-sm">
      <span className="mx-auto inline-flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100">
        <Icon className="h-3.5! w-3.5! text-slate-700" />
      </span>
      <p className="mt-2 text-xs sm:text-sm text-slate-600">{label}</p>
      <p className="text-xl font-semibold leading-none">{value}</p>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="text-xs sm:text-sm font-medium text-slate-600">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs sm:text-sm"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

