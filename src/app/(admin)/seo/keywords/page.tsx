"use client";

import React, { useMemo, useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  Filter,
  Globe2,
  Search,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

type Device = "mobile" | "desktop" | "tablet";
type Intent = "informational" | "commercial" | "transactional" | "navigational";
type KeywordStatus = "tracked" | "watchlist" | "paused";
type Priority = "high" | "medium" | "low";

type KeywordRow = {
  id: string;
  keyword: string;
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  device: Device;
  country: string;
  intent: Intent;
  status: KeywordStatus;
  difficulty: number;
  volume: number;
  lastUpdated: string;
  priority: Priority;
};

const seedKeywords: KeywordRow[] = [
  {
    id: "KW-001",
    keyword: "healthcare seo agency",
    page: "/services",
    clicks: 821,
    impressions: 21980,
    ctr: 3.73,
    position: 5.1,
    device: "desktop",
    country: "US",
    intent: "commercial",
    status: "tracked",
    difficulty: 67,
    volume: 5400,
    lastUpdated: "2026-03-14",
    priority: "high",
  },
  {
    id: "KW-002",
    keyword: "medical seo checklist",
    page: "/blog/seo-fixes-healthcare",
    clicks: 634,
    impressions: 15840,
    ctr: 4.0,
    position: 4.3,
    device: "mobile",
    country: "US",
    intent: "informational",
    status: "tracked",
    difficulty: 52,
    volume: 3900,
    lastUpdated: "2026-03-14",
    priority: "high",
  },
  {
    id: "KW-003",
    keyword: "core web vitals clinic pages",
    page: "/blog/core-web-vitals-clinic-pages",
    clicks: 278,
    impressions: 9310,
    ctr: 2.99,
    position: 7.4,
    device: "mobile",
    country: "IN",
    intent: "informational",
    status: "watchlist",
    difficulty: 41,
    volume: 1800,
    lastUpdated: "2026-03-13",
    priority: "medium",
  },
  {
    id: "KW-004",
    keyword: "seo platform for clinics",
    page: "/features",
    clicks: 189,
    impressions: 5420,
    ctr: 3.49,
    position: 8.2,
    device: "desktop",
    country: "GB",
    intent: "transactional",
    status: "watchlist",
    difficulty: 58,
    volume: 1200,
    lastUpdated: "2026-03-12",
    priority: "medium",
  },
  {
    id: "KW-005",
    keyword: "meta description templates",
    page: "/blog/meta-description-templates",
    clicks: 412,
    impressions: 13870,
    ctr: 2.97,
    position: 6.9,
    device: "desktop",
    country: "US",
    intent: "informational",
    status: "tracked",
    difficulty: 49,
    volume: 4800,
    lastUpdated: "2026-03-10",
    priority: "medium",
  },
  {
    id: "KW-006",
    keyword: "clinic marketing agency",
    page: "/contact",
    clicks: 72,
    impressions: 3340,
    ctr: 2.16,
    position: 14.1,
    device: "tablet",
    country: "US",
    intent: "commercial",
    status: "paused",
    difficulty: 76,
    volume: 6200,
    lastUpdated: "2026-03-09",
    priority: "low",
  },
  {
    id: "KW-007",
    keyword: "schema markup hospital pages",
    page: "/blog/schema-markup-hospital-services",
    clicks: 95,
    impressions: 4290,
    ctr: 2.21,
    position: 12.4,
    device: "mobile",
    country: "CA",
    intent: "informational",
    status: "watchlist",
    difficulty: 43,
    volume: 900,
    lastUpdated: "2026-03-08",
    priority: "low",
  },
];

const statusClass: Record<KeywordStatus, string> = {
  tracked: "bg-emerald-100 text-emerald-700",
  watchlist: "bg-blue-100 text-blue-700",
  paused: "bg-slate-200 text-slate-700",
};

const priorityClass: Record<Priority, string> = {
  high: "bg-rose-100 text-rose-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-emerald-100 text-emerald-700",
};

const intentClass: Record<Intent, string> = {
  informational: "bg-indigo-100 text-indigo-700",
  commercial: "bg-fuchsia-100 text-fuchsia-700",
  transactional: "bg-emerald-100 text-emerald-700",
  navigational: "bg-cyan-100 text-cyan-700",
};

export default function KeywordsPage() {
  const [rows, setRows] = useState<KeywordRow[]>(seedKeywords);
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [deviceFilter, setDeviceFilter] = useState<"all" | Device>("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [intentFilter, setIntentFilter] = useState<"all" | Intent>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | KeywordStatus>("all");
  const [sortBy, setSortBy] = useState<
    "impressions_desc" | "clicks_desc" | "position_asc" | "ctr_desc"
  >("impressions_desc");

  const countries = useMemo(
    () => ["all", ...new Set(rows.map((r) => r.country))],
    [rows],
  );

  const filtered = useMemo(() => {
    let data = [...rows];
    const q = query.trim().toLowerCase();
    if (q) {
      data = data.filter(
        (r) =>
          r.keyword.toLowerCase().includes(q) ||
          r.page.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q),
      );
    }
    if (deviceFilter !== "all") data = data.filter((r) => r.device === deviceFilter);
    if (countryFilter !== "all") data = data.filter((r) => r.country === countryFilter);
    if (intentFilter !== "all") data = data.filter((r) => r.intent === intentFilter);
    if (statusFilter !== "all") data = data.filter((r) => r.status === statusFilter);

    data.sort((a, b) => {
      if (sortBy === "clicks_desc") return b.clicks - a.clicks;
      if (sortBy === "position_asc") return a.position - b.position;
      if (sortBy === "ctr_desc") return b.ctr - a.ctr;
      return b.impressions - a.impressions;
    });
    return data;
  }, [rows, query, deviceFilter, countryFilter, intentFilter, statusFilter, sortBy]);

  const totals = useMemo(() => {
    const totalClicks = filtered.reduce((s, x) => s + x.clicks, 0);
    const totalImpressions = filtered.reduce((s, x) => s + x.impressions, 0);
    const avgCtr = totalImpressions ? (totalClicks / totalImpressions) * 100 : 0;
    const avgPosition = filtered.length
      ? filtered.reduce((s, x) => s + x.position, 0) / filtered.length
      : 0;
    const top10 = filtered.filter((x) => x.position <= 10).length;
    return {
      count: filtered.length,
      clicks: totalClicks,
      impressions: totalImpressions,
      avgCtr,
      avgPosition,
      top10,
    };
  }, [filtered]);

  const opportunities = useMemo(
    () =>
      filtered
        .filter((r) => r.position > 4 && r.position <= 20 && r.impressions > 3000)
        .slice(0, 5),
    [filtered],
  );

  const updateRow = (id: string, patch: Partial<KeywordRow>) => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  };

  return (
    <section className="min-h-screen w-full overflow-x-hidden bg-slate-50 p-3 font-['Sora'] text-slate-900 sm:p-5 lg:p-6">
      <div className="mx-auto w-full max-w-375 space-y-4">
        <header className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
              Keyword Management
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              Google Search Console keyword intelligence, tracking, and optimization actions
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm shadow-sm">
            <span className="font-semibold text-slate-800">Tracked Keywords:</span>{" "}
            {totals.count.toLocaleString()}
          </div>
        </header>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          <KpiCard label="Total Clicks" value={totals.clicks.toLocaleString()} icon={TrendingUp} />
          <KpiCard
            label="Impressions"
            value={totals.impressions.toLocaleString()}
            icon={ArrowUpRight}
          />
          <KpiCard label="Avg CTR" value={`${totals.avgCtr.toFixed(2)}%`} icon={Target} />
          <KpiCard
            label="Avg Position"
            value={totals.avgPosition.toFixed(1)}
            icon={CheckCircle2}
          />
          <KpiCard label="Top 10 Keywords" value={totals.top10.toString()} icon={Sparkles} />
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_auto]">
            <div className="relative min-w-0">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5! w-3.5! -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by keyword, page, or id..."
                className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 text-xs sm:text-sm outline-none focus:border-blue-300 focus:bg-white"
              />
            </div>
            <button
              onClick={() => setShowFilters((v) => !v)}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 text-xs sm:text-sm font-medium text-slate-800 transition hover:bg-slate-50"
            >
              <Filter className="h-3.5! w-3.5!" />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="mt-3 grid grid-cols-1 gap-2 rounded-xl border border-slate-100 bg-slate-50 p-2 sm:grid-cols-2 lg:grid-cols-5">
              <FilterSelect
                label="Device"
                value={deviceFilter}
                onChange={(v) => setDeviceFilter(v as "all" | Device)}
                options={[
                  { value: "all", label: "All Devices" },
                  { value: "mobile", label: "Mobile" },
                  { value: "desktop", label: "Desktop" },
                  { value: "tablet", label: "Tablet" },
                ]}
              />
              <FilterSelect
                label="Country"
                value={countryFilter}
                onChange={setCountryFilter}
                options={countries.map((c) => ({
                  value: c,
                  label: c === "all" ? "All Countries" : c,
                }))}
              />
              <FilterSelect
                label="Intent"
                value={intentFilter}
                onChange={(v) => setIntentFilter(v as "all" | Intent)}
                options={[
                  { value: "all", label: "All Intents" },
                  { value: "informational", label: "Informational" },
                  { value: "commercial", label: "Commercial" },
                  { value: "transactional", label: "Transactional" },
                  { value: "navigational", label: "Navigational" },
                ]}
              />
              <FilterSelect
                label="Status"
                value={statusFilter}
                onChange={(v) => setStatusFilter(v as "all" | KeywordStatus)}
                options={[
                  { value: "all", label: "All Status" },
                  { value: "tracked", label: "Tracked" },
                  { value: "watchlist", label: "Watchlist" },
                  { value: "paused", label: "Paused" },
                ]}
              />
              <FilterSelect
                label="Sort By"
                value={sortBy}
                onChange={(v) =>
                  setSortBy(
                    v as "impressions_desc" | "clicks_desc" | "position_asc" | "ctr_desc",
                  )
                }
                options={[
                  { value: "impressions_desc", label: "Impressions desc" },
                  { value: "clicks_desc", label: "Clicks desc" },
                  { value: "position_asc", label: "Best position" },
                  { value: "ctr_desc", label: "CTR desc" },
                ]}
              />
            </div>
          )}
        </section>

        <section className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-3">
              <h2 className="inline-flex items-center gap-1 text-sm lg:text-base font-semibold">
                <Sparkles className="h-3.5! w-3.5! text-blue-600" />
                Keyword Opportunities
              </h2>
            </div>
            <div className="space-y-2 p-3">
              {opportunities.length === 0 && (
                <p className="text-xs sm:text-sm text-slate-500">No immediate opportunities found.</p>
              )}
              {opportunities.map((item) => (
                <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                  <p className="truncate text-xs sm:text-sm font-semibold text-slate-900">{item.keyword}</p>
                  <p className="mt-1 truncate text-xs sm:text-sm text-slate-600">{item.page}</p>
                  <div className="mt-2 flex flex-wrap gap-1 text-xs sm:text-sm">
                    <span className="rounded-full bg-slate-200 px-2 py-0.5">
                      Pos {item.position.toFixed(1)}
                    </span>
                    <span className="rounded-full bg-slate-200 px-2 py-0.5">
                      Impr {item.impressions.toLocaleString()}
                    </span>
                    <span className="rounded-full bg-slate-200 px-2 py-0.5">
                      CTR {item.ctr.toFixed(2)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-3">
              <h2 className="inline-flex items-center gap-1 text-sm lg:text-base font-semibold">
                <Globe2 className="h-3.5! w-3.5! text-blue-600" />
                Country & Device Snapshot
              </h2>
            </div>
            <div className="space-y-2 p-3 text-xs sm:text-sm">
              {(["US", "IN", "GB", "CA"] as const).map((country) => {
                const list = filtered.filter((x) => x.country === country);
                const clicks = list.reduce((s, x) => s + x.clicks, 0);
                return (
                  <div
                    key={country}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5"
                  >
                    <span className="font-semibold text-slate-800">{country}</span>
                    <span className="text-slate-600">{clicks.toLocaleString()} clicks</span>
                  </div>
                );
              })}
            </div>
          </article>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-3">
            <h2 className="text-sm lg:text-base font-semibold text-slate-900">Keyword Table</h2>
          </div>

          <div className="divide-y divide-slate-100">
            {filtered.length === 0 && (
              <p className="p-4 text-xs sm:text-sm text-slate-500">No keyword data found.</p>
            )}

            {filtered.map((row) => (
              <div key={row.id} className="p-3">
                <div className="grid gap-2 md:hidden">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-xs sm:text-sm font-semibold text-slate-900">{row.keyword}</p>
                      <p className="truncate text-xs sm:text-sm text-slate-500">{row.page}</p>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-xs sm:text-sm font-semibold ${statusClass[row.status]}`}>
                      {row.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-xs sm:text-sm text-slate-700">
                    <span>Clicks: {row.clicks.toLocaleString()}</span>
                    <span>Impr: {row.impressions.toLocaleString()}</span>
                    <span>CTR: {row.ctr.toFixed(2)}%</span>
                    <span>Pos: {row.position.toFixed(1)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-xs sm:text-sm">
                    <span className={`rounded-full px-2 py-0.5 text-center font-medium ${intentClass[row.intent]}`}>
                      {row.intent}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-center font-medium ${priorityClass[row.priority]}`}>
                      {row.priority}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() =>
                        updateRow(row.id, {
                          status: row.status === "tracked" ? "paused" : "tracked",
                        })
                      }
                      className="h-7 rounded-lg border border-slate-200 px-2 text-xs sm:text-sm font-medium hover:bg-slate-100"
                    >
                      {row.status === "tracked" ? "Pause" : "Track"}
                    </button>
                    <button
                      onClick={() =>
                        updateRow(row.id, {
                          priority:
                            row.priority === "high"
                              ? "medium"
                              : row.priority === "medium"
                                ? "low"
                                : "high",
                        })
                      }
                      className="h-7 rounded-lg border border-slate-200 px-2 text-xs sm:text-sm font-medium hover:bg-slate-100"
                    >
                      Rotate Priority
                    </button>
                  </div>
                </div>

                <div className="hidden md:grid md:grid-cols-[1.9fr_1.5fr_0.9fr_0.9fr_0.8fr_0.8fr_0.8fr_0.9fr_1.2fr] md:items-center md:gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-xs sm:text-sm font-semibold text-slate-900">{row.keyword}</p>
                    <p className="text-xs sm:text-sm text-slate-500">{row.id}</p>
                  </div>
                  <p className="truncate text-xs sm:text-sm text-slate-700">{row.page}</p>
                  <p className="text-xs sm:text-sm text-slate-700">{row.clicks.toLocaleString()}</p>
                  <p className="text-xs sm:text-sm text-slate-700">{row.impressions.toLocaleString()}</p>
                  <p className="text-xs sm:text-sm text-slate-700">{row.ctr.toFixed(2)}%</p>
                  <p className="text-xs sm:text-sm text-slate-700">{row.position.toFixed(1)}</p>
                  <span className={`w-fit rounded-full px-2 py-0.5 text-xs sm:text-sm font-semibold ${statusClass[row.status]}`}>
                    {row.status}
                  </span>
                  <span className={`w-fit rounded-full px-2 py-0.5 text-xs sm:text-sm font-semibold ${intentClass[row.intent]}`}>
                    {row.intent}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    <button
                      onClick={() =>
                        updateRow(row.id, {
                          status: row.status === "tracked" ? "paused" : "tracked",
                        })
                      }
                      className="h-7 rounded-lg border border-slate-200 px-2 text-xs sm:text-sm font-medium hover:bg-slate-100"
                    >
                      {row.status === "tracked" ? "Pause" : "Track"}
                    </button>
                    <button
                      onClick={() =>
                        updateRow(row.id, {
                          status: "watchlist",
                        })
                      }
                      className="h-7 rounded-lg border border-slate-200 px-2 text-xs sm:text-sm font-medium hover:bg-slate-100"
                    >
                      Watchlist
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
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100">
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
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}


