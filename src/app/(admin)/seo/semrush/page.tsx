"use client";

import React, { useMemo, useState } from "react";
import {
  BarChart3,
  Bot,
  Building2,
  Globe2,
  Link2,
  MapPin,
  Search,
  TrendingUp,
} from "lucide-react";

type Scope = "domain" | "country" | "location";
type Trend = "up" | "down" | "flat";

type SemrushRow = {
  id: string;
  domain: string;
  keywordRankings: number;
  backlinks: number;
  organicTraffic: number;
  aiTraffic: number;
  audienceScore: number;
  topChannel: "organic" | "direct" | "referral" | "social";
  marketTrend: Trend;
  listingHealth: number;
  mapsAvgPosition: number;
  scope: Scope;
};

const semrushData: SemrushRow[] = [
  {
    id: "SMR-001",
    domain: "astikan.com",
    keywordRankings: 5420,
    backlinks: 18430,
    organicTraffic: 128900,
    aiTraffic: 11840,
    audienceScore: 84,
    topChannel: "organic",
    marketTrend: "up",
    listingHealth: 91,
    mapsAvgPosition: 2.9,
    scope: "domain",
  },
  {
    id: "SMR-002",
    domain: "astikan.co.uk",
    keywordRankings: 2140,
    backlinks: 7810,
    organicTraffic: 48600,
    aiTraffic: 4620,
    audienceScore: 78,
    topChannel: "direct",
    marketTrend: "up",
    listingHealth: 87,
    mapsAvgPosition: 3.6,
    scope: "country",
  },
  {
    id: "SMR-003",
    domain: "astikan.in",
    keywordRankings: 3980,
    backlinks: 12690,
    organicTraffic: 93600,
    aiTraffic: 10120,
    audienceScore: 81,
    topChannel: "organic",
    marketTrend: "flat",
    listingHealth: 88,
    mapsAvgPosition: 4.1,
    scope: "country",
  },
  {
    id: "SMR-004",
    domain: "ny.astikan.com",
    keywordRankings: 940,
    backlinks: 2900,
    organicTraffic: 22800,
    aiTraffic: 2890,
    audienceScore: 73,
    topChannel: "referral",
    marketTrend: "down",
    listingHealth: 79,
    mapsAvgPosition: 6.2,
    scope: "location",
  },
  {
    id: "SMR-005",
    domain: "sf.astikan.com",
    keywordRankings: 1120,
    backlinks: 3340,
    organicTraffic: 27500,
    aiTraffic: 3120,
    audienceScore: 76,
    topChannel: "social",
    marketTrend: "up",
    listingHealth: 82,
    mapsAvgPosition: 5.4,
    scope: "location",
  },
];

const trendClass: Record<Trend, string> = {
  up: "bg-emerald-100 text-emerald-700",
  down: "bg-rose-100 text-rose-700",
  flat: "bg-slate-200 text-slate-700",
};

const channelClass: Record<SemrushRow["topChannel"], string> = {
  organic: "bg-blue-100 text-blue-700",
  direct: "bg-indigo-100 text-indigo-700",
  referral: "bg-amber-100 text-amber-700",
  social: "bg-fuchsia-100 text-fuchsia-700",
};

export default function SemrushPage() {
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState<"all" | Scope>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return semrushData.filter((row) => {
      const matchesQuery = !q || row.domain.toLowerCase().includes(q) || row.id.toLowerCase().includes(q);
      const matchesScope = scope === "all" || row.scope === scope;
      return matchesQuery && matchesScope;
    });
  }, [query, scope]);

  const totals = useMemo(() => {
    const domains = filtered.length;
    const keywordRankings = filtered.reduce((sum, x) => sum + x.keywordRankings, 0);
    const backlinks = filtered.reduce((sum, x) => sum + x.backlinks, 0);
    const organicTraffic = filtered.reduce((sum, x) => sum + x.organicTraffic, 0);
    const aiTraffic = filtered.reduce((sum, x) => sum + x.aiTraffic, 0);
    const avgListing = domains ? Math.round(filtered.reduce((sum, x) => sum + x.listingHealth, 0) / domains) : 0;
    return { domains, keywordRankings, backlinks, organicTraffic, aiTraffic, avgListing };
  }, [filtered]);

  const topAudience = useMemo(
    () => [...filtered].sort((a, b) => b.audienceScore - a.audienceScore).slice(0, 4),
    [filtered],
  );

  const locationRows = useMemo(() => filtered.filter((x) => x.scope === "location"), [filtered]);

  return (
    <section className="min-h-screen w-full overflow-x-hidden bg-slate-50 p-3 font-['Sora'] text-slate-900 sm:p-5 lg:p-6">
      <div className="mx-auto w-full max-w-375 space-y-4">
        <header className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">Semrush Insights</h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              SERP performance, traffic channels including AI assistants, audience insights, and local listing visibility.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm shadow-sm">
            Data source: <span className="font-semibold text-slate-800">Semrush API</span>
          </div>
        </header>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-6">
          <KpiCard label="Tracked Domains" value={totals.domains.toString()} icon={Globe2} />
          <KpiCard label="Keyword Rankings" value={totals.keywordRankings.toLocaleString()} icon={Search} />
          <KpiCard label="Backlinks" value={totals.backlinks.toLocaleString()} icon={Link2} />
          <KpiCard label="Organic Traffic" value={totals.organicTraffic.toLocaleString()} icon={TrendingUp} />
          <KpiCard label="AI Search Traffic" value={totals.aiTraffic.toLocaleString()} icon={Bot} />
          <KpiCard label="Listing Health" value={`${totals.avgListing}%`} icon={MapPin} />
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_auto]">
            <div className="relative min-w-0">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5! w-3.5! -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by domain or record id..."
                className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 text-xs sm:text-sm outline-none focus:border-blue-300 focus:bg-white"
              />
            </div>

            <select
              value={scope}
              onChange={(e) => setScope(e.target.value as "all" | Scope)}
              className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs sm:text-sm"
            >
              <option value="all">All Scope</option>
              <option value="domain">Domain</option>
              <option value="country">Country</option>
              <option value="location">Location</option>
            </select>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-3">
              <h2 className="inline-flex items-center gap-1 text-sm lg:text-base font-semibold">
                <BarChart3 className="h-3.5! w-3.5! text-blue-600" />
                Audience & Channel Highlights
              </h2>
            </div>
            <div className="space-y-2 p-3">
              {topAudience.map((row) => (
                <div key={`${row.id}-aud`} className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-xs sm:text-sm font-semibold text-slate-900">{row.domain}</p>
                    <span className={`rounded-full px-2 py-0.5 text-xs sm:text-sm font-semibold ${trendClass[row.marketTrend]}`}>
                      {row.marketTrend}
                    </span>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-1 text-xs sm:text-sm text-slate-700">
                    <span>Audience score: {row.audienceScore}</span>
                    <span>Top channel: {row.topChannel}</span>
                    <span>Organic: {row.organicTraffic.toLocaleString()}</span>
                    <span>AI search: {row.aiTraffic.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-3">
              <h2 className="inline-flex items-center gap-1 text-sm lg:text-base font-semibold">
                <Building2 className="h-3.5! w-3.5! text-blue-600" />
                Local Listings & Maps Ranking
              </h2>
            </div>
            <div className="space-y-2 p-3">
              {locationRows.length === 0 && (
                <p className="text-xs sm:text-sm text-slate-500">No local location records in current filter.</p>
              )}
              {locationRows.map((row) => (
                <div key={`${row.id}-loc`} className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-xs sm:text-sm font-semibold text-slate-900">{row.domain}</p>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs sm:text-sm font-semibold text-emerald-700">
                      Maps pos {row.mapsAvgPosition.toFixed(1)}
                    </span>
                  </div>
                  <div className="mt-1 text-xs sm:text-sm text-slate-700">
                    Listing consistency health: <span className="font-semibold">{row.listingHealth}%</span>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-3">
            <h2 className="text-sm lg:text-base font-semibold text-slate-900">Semrush Dataset Records</h2>
          </div>

          <div className="divide-y divide-slate-100">
            {filtered.length === 0 && <p className="p-4 text-xs sm:text-sm text-slate-500">No records found.</p>}

            {filtered.map((row) => (
              <div key={row.id} className="p-3">
                <div className="grid grid-cols-1 gap-2 md:grid-cols-[1.4fr_1fr_auto_auto_auto] md:items-center">
                  <div className="min-w-0">
                    <p className="truncate text-xs sm:text-sm font-semibold text-slate-900">{row.domain}</p>
                    <p className="text-xs sm:text-sm text-slate-500">{row.id}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-1 text-xs sm:text-sm text-slate-700">
                    <span>KW: {row.keywordRankings.toLocaleString()}</span>
                    <span>BL: {row.backlinks.toLocaleString()}</span>
                    <span>Org: {row.organicTraffic.toLocaleString()}</span>
                    <span>AI: {row.aiTraffic.toLocaleString()}</span>
                  </div>

                  <span className={`w-fit rounded-full px-2 py-0.5 text-xs sm:text-sm font-semibold ${channelClass[row.topChannel]}`}>
                    {row.topChannel}
                  </span>

                  <span className={`w-fit rounded-full px-2 py-0.5 text-xs sm:text-sm font-semibold ${trendClass[row.marketTrend]}`}>
                    trend {row.marketTrend}
                  </span>

                  <span className="w-fit rounded-full bg-slate-100 px-2 py-0.5 text-xs sm:text-sm font-semibold text-slate-700">
                    maps {row.mapsAvgPosition.toFixed(1)}
                  </span>
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
