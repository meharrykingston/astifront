"use client";

import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Eye,
  Filter,
  Search,
  Signal,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

type SignalType =
  | "indexing"
  | "ranking"
  | "ctr"
  | "crawl_budget"
  | "core_web_vitals"
  | "structured_data";
type SignalStatus = "healthy" | "warning" | "critical";

type SignalRecord = {
  id: string;
  signal: SignalType;
  page: string;
  metric: string;
  current: string;
  previous: string;
  delta: number;
  status: SignalStatus;
  updatedAt: string;
  insight: string;
};

const signalData: SignalRecord[] = [
  {
    id: "SIG-001",
    signal: "indexing",
    page: "/services",
    metric: "Indexed pages ratio",
    current: "92%",
    previous: "95%",
    delta: -3.1,
    status: "warning",
    updatedAt: "2026-03-14",
    insight: "Some newly submitted URLs are pending discovery.",
  },
  {
    id: "SIG-002",
    signal: "ranking",
    page: "/blog/seo-fixes-healthcare",
    metric: "Avg position",
    current: "4.3",
    previous: "5.1",
    delta: 15.7,
    status: "healthy",
    updatedAt: "2026-03-14",
    insight: "Keyword cluster moved into top 5.",
  },
  {
    id: "SIG-003",
    signal: "ctr",
    page: "/pricing",
    metric: "Organic CTR",
    current: "2.1%",
    previous: "3.4%",
    delta: -38.2,
    status: "critical",
    updatedAt: "2026-03-13",
    insight: "Meta title may be mismatched to search intent.",
  },
  {
    id: "SIG-004",
    signal: "crawl_budget",
    page: "/blog",
    metric: "Crawl requests/day",
    current: "1,430",
    previous: "1,120",
    delta: 27.6,
    status: "healthy",
    updatedAt: "2026-03-13",
    insight: "Search bots crawling newly published content more frequently.",
  },
  {
    id: "SIG-005",
    signal: "core_web_vitals",
    page: "/features",
    metric: "LCP p75",
    current: "3.8s",
    previous: "2.9s",
    delta: -31.0,
    status: "critical",
    updatedAt: "2026-03-14",
    insight: "Hero media load delaying LCP on mobile.",
  },
  {
    id: "SIG-006",
    signal: "structured_data",
    page: "/blog/schema-markup-hospital-services",
    metric: "Valid schema items",
    current: "7",
    previous: "5",
    delta: 40.0,
    status: "healthy",
    updatedAt: "2026-03-12",
    insight: "Added FAQ and breadcrumb schema successfully.",
  },
];

const signalLabel: Record<SignalType, string> = {
  indexing: "Indexing",
  ranking: "Ranking",
  ctr: "CTR",
  crawl_budget: "Crawl Budget",
  core_web_vitals: "Core Web Vitals",
  structured_data: "Structured Data",
};

const statusClass: Record<SignalStatus, string> = {
  healthy: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  critical: "bg-rose-100 text-rose-700",
};

export default function SignalsPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | SignalStatus>("all");
  const [signalFilter, setSignalFilter] = useState<"all" | SignalType>("all");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return signalData.filter((row) => {
      const q = query.trim().toLowerCase();
      const matchQ =
        !q ||
        row.page.toLowerCase().includes(q) ||
        row.metric.toLowerCase().includes(q) ||
        row.insight.toLowerCase().includes(q) ||
        row.id.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || row.status === statusFilter;
      const matchSignal = signalFilter === "all" || row.signal === signalFilter;
      return matchQ && matchStatus && matchSignal;
    });
  }, [query, statusFilter, signalFilter]);

  const kpis = useMemo(() => {
    const healthy = filtered.filter((x) => x.status === "healthy").length;
    const warning = filtered.filter((x) => x.status === "warning").length;
    const critical = filtered.filter((x) => x.status === "critical").length;
    const improving = filtered.filter((x) => x.delta > 0).length;
    return { total: filtered.length, healthy, warning, critical, improving };
  }, [filtered]);

  const criticalAlerts = filtered.filter((x) => x.status === "critical");

  return (
    <section className="min-h-screen w-full overflow-x-hidden bg-slate-50 p-3 font-['Sora'] text-slate-900 sm:p-5 lg:p-6">
      <div className="mx-auto w-full max-w-375 space-y-4">
        <header className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
              Search Engine Signals
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              Monitor ranking, indexing, crawl, CTR, CWV and structured-data health signals.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm shadow-sm">
            Last sync: 2026-03-14 11:30
          </div>
        </header>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          <KpiCard label="Signals" value={kpis.total.toString()} icon={Signal} />
          <KpiCard label="Healthy" value={kpis.healthy.toString()} icon={CheckCircle2} />
          <KpiCard label="Warning" value={kpis.warning.toString()} icon={AlertTriangle} />
          <KpiCard label="Critical" value={kpis.critical.toString()} icon={TrendingDown} />
          <KpiCard label="Improving" value={kpis.improving.toString()} icon={TrendingUp} />
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_auto]">
            <div className="relative min-w-0">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5! w-3.5! -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by page, metric, signal id..."
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
            <div className="mt-3 grid grid-cols-1 gap-2 rounded-xl border border-slate-100 bg-slate-50 p-2 sm:grid-cols-2 lg:grid-cols-3">
              <FilterSelect
                label="Status"
                value={statusFilter}
                onChange={(v) => setStatusFilter(v as "all" | SignalStatus)}
                options={[
                  { value: "all", label: "All Status" },
                  { value: "healthy", label: "Healthy" },
                  { value: "warning", label: "Warning" },
                  { value: "critical", label: "Critical" },
                ]}
              />
              <FilterSelect
                label="Signal Type"
                value={signalFilter}
                onChange={(v) => setSignalFilter(v as "all" | SignalType)}
                options={[
                  { value: "all", label: "All Types" },
                  { value: "indexing", label: "Indexing" },
                  { value: "ranking", label: "Ranking" },
                  { value: "ctr", label: "CTR" },
                  { value: "crawl_budget", label: "Crawl Budget" },
                  { value: "core_web_vitals", label: "Core Web Vitals" },
                  { value: "structured_data", label: "Structured Data" },
                ]}
              />
              <button
                onClick={() => {
                  setStatusFilter("all");
                  setSignalFilter("all");
                }}
                className="h-8 self-end rounded-lg border border-slate-200 bg-white px-2 text-xs sm:text-sm font-medium hover:bg-slate-100"
              >
                Reset Filters
              </button>
            </div>
          )}
        </section>

        <section className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-3">
              <h2 className="inline-flex items-center gap-1 text-sm lg:text-base font-semibold">
                <AlertTriangle className="h-3.5! w-3.5! text-rose-600" />
                Critical Alerts
              </h2>
            </div>
            <div className="space-y-2 p-3">
              {criticalAlerts.length === 0 && (
                <p className="text-xs sm:text-sm text-slate-500">No critical alerts right now.</p>
              )}
              {criticalAlerts.map((x) => (
                <div key={x.id} className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate text-xs sm:text-sm font-semibold text-slate-900">{x.page}</p>
                    <span className={`rounded-full px-2 py-0.5 text-xs sm:text-sm font-semibold ${statusClass[x.status]}`}>
                      {x.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs sm:text-sm text-slate-700">{x.metric}</p>
                  <p className="mt-1 text-xs sm:text-sm text-slate-500">{x.insight}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-3">
              <h2 className="inline-flex items-center gap-1 text-sm lg:text-base font-semibold">
                <BarChart3 className="h-3.5! w-3.5! text-blue-600" />
                Signal Type Snapshot
              </h2>
            </div>
            <div className="space-y-2 p-3 text-xs sm:text-sm">
              {(Object.keys(signalLabel) as SignalType[]).map((type) => {
                const list = filtered.filter((x) => x.signal === type);
                const up = list.filter((x) => x.delta > 0).length;
                return (
                  <div
                    key={type}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5"
                  >
                    <span className="font-semibold text-slate-800">{signalLabel[type]}</span>
                    <span className="text-slate-600">
                      {list.length} items {up} improving
                    </span>
                  </div>
                );
              })}
            </div>
          </article>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-3">
            <h2 className="text-sm lg:text-base font-semibold text-slate-900">Signal Records</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {filtered.length === 0 && (
              <p className="p-4 text-xs sm:text-sm text-slate-500">No signal records found.</p>
            )}
            {filtered.map((row) => (
              <div key={row.id} className="p-3">
                <div className="grid grid-cols-1 gap-2 md:grid-cols-[1.5fr_1.3fr_1fr_1fr_auto] md:items-center">
                  <div className="min-w-0">
                    <p className="truncate text-xs sm:text-sm font-semibold text-slate-900">{row.page}</p>
                    <p className="text-xs sm:text-sm text-slate-500">
                      {row.id} {signalLabel[row.signal]}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-xs sm:text-sm text-slate-700">{row.metric}</p>
                    <p className="truncate text-xs sm:text-sm text-slate-500">{row.insight}</p>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700">
                    {row.current} <span className="text-slate-500">({row.previous})</span>
                  </p>

                  <div className="flex items-center gap-1 text-xs sm:text-sm">
                    {row.delta >= 0 ? (
                      <TrendingUp className="h-3.5! w-3.5! text-emerald-600" />
                    ) : (
                      <TrendingDown className="h-3.5! w-3.5! text-rose-600" />
                    )}
                    <span className={row.delta >= 0 ? "text-emerald-700" : "text-rose-700"}>
                      {row.delta > 0 ? "+" : ""}
                      {row.delta.toFixed(1)}%
                    </span>
                  </div>

                  <div className="flex items-center justify-end gap-1">
                    <span className={`rounded-full px-2 py-0.5 text-xs sm:text-sm font-semibold ${statusClass[row.status]}`}>
                      {row.status}
                    </span>
                    <button className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100">
                      <Eye className="h-3.5! w-3.5!" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}

function KpiCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
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

