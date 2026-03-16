"use client";

import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Code2,
  Copy,
  ExternalLink,
  Globe2,
  Heading1,
  Image as ImageIcon,
  Link2,
  Loader2,
  Search,
  ShieldCheck,
  Tags,
  TrendingUp,
} from "lucide-react";

type CrawlType = "page" | "blog";
type ExtractedMeta = { name: string; value: string };

type CrawlResult = {
  url: string;
  title: string;
  metaDescription: string;
  canonical: string;
  robots: string;
  language: string;
  viewport: string;
  statusCode: number;
  responseMs: number;
  titleLength: number;
  descriptionLength: number;
  headings: { h1: string[]; h2: string[]; h3: string[] };
  openGraph: ExtractedMeta[];
  twitter: ExtractedMeta[];
  metaTags: ExtractedMeta[];
  structuredData: string[];
  images: { total: number; missingAlt: number; oversized: number };
  links: {
    internal: number;
    external: number;
    broken: number;
    nofollow: number;
  };
  techFlags: { label: string; status: "pass" | "warn" | "fail"; note: string }[];
};

const passFailClass = {
  pass: "bg-emerald-100 text-emerald-700",
  warn: "bg-amber-100 text-amber-700",
  fail: "bg-rose-100 text-rose-700",
} as const;

function getMockCrawl(url: string, type: CrawlType): CrawlResult {
  const host = (() => {
    try {
      return new URL(url).hostname;
    } catch {
      return "example.com";
    }
  })();

  const sampleTitle =
    type === "blog"
      ? "How Top Brands Build SEO Content Pipelines in 2026"
      : "Healthcare SEO Services - Technical, Local and Content SEO";

  const sampleDescription =
    type === "blog"
      ? "Actionable framework to audit, plan and scale SEO content with measurable growth signals."
      : "End-to-end SEO services for healthcare websites, including audits, pagespeed and authority growth.";

  return {
    url,
    title: sampleTitle,
    metaDescription: sampleDescription,
    canonical: url,
    robots: "index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1",
    language: "en",
    viewport: "width=device-width, initial-scale=1",
    statusCode: 200,
    responseMs: 618,
    titleLength: sampleTitle.length,
    descriptionLength: sampleDescription.length,
    headings: {
      h1: [type === "blog" ? "SEO Content Pipeline Blueprint" : "Healthcare SEO Services"],
      h2: ["Why this strategy works", "Execution framework", "Tracking impact", "FAQs"],
      h3: ["Crawl & index checks", "Internal linking", "Schema and rich results"],
    },
    openGraph: [
      { name: "og:title", value: sampleTitle },
      { name: "og:description", value: sampleDescription },
      { name: "og:type", value: type === "blog" ? "article" : "website" },
      { name: "og:url", value: url },
      { name: "og:site_name", value: host },
    ],
    twitter: [
      { name: "twitter:card", value: "summary_large_image" },
      { name: "twitter:title", value: sampleTitle },
      { name: "twitter:description", value: sampleDescription },
    ],
    metaTags: [
      { name: "charset", value: "utf-8" },
      { name: "author", value: "Editorial Team" },
      { name: "theme-color", value: "#0f172a" },
      { name: "referrer", value: "strict-origin-when-cross-origin" },
    ],
    structuredData: ["Article", "BreadcrumbList", "FAQPage"],
    images: {
      total: 18,
      missingAlt: 2,
      oversized: 3,
    },
    links: {
      internal: 64,
      external: 13,
      broken: 2,
      nofollow: 4,
    },
    techFlags: [
      { label: "HTTPS", status: "pass", note: "Valid certificate and secure delivery." },
      { label: "Canonical", status: "pass", note: "Canonical matches requested URL." },
      { label: "Robots Directives", status: "warn", note: "Aggressive snippet limits can reduce visibility." },
      { label: "Core Web Vitals", status: "warn", note: "INP could be improved on mobile templates." },
      { label: "Broken External Links", status: "fail", note: "2 broken links found in content body." },
    ],
  };
}

export default function CompetitorPage() {
  const [url, setUrl] = useState("https://example.com/seo-healthcare-services");
  const [crawlType, setCrawlType] = useState<CrawlType>("page");
  const [includeAssets, setIncludeAssets] = useState(true);
  const [includeLinks, setIncludeLinks] = useState(true);
  const [includeSchema, setIncludeSchema] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CrawlResult | null>(getMockCrawl("https://example.com/seo-healthcare-services", "page"));

  const healthScore = useMemo(() => {
    if (!result) return 0;
    const score =
      100 -
      result.techFlags.filter((f) => f.status === "warn").length * 8 -
      result.techFlags.filter((f) => f.status === "fail").length * 18;
    return Math.max(0, score);
  }, [result]);

  const runCrawl = () => {
    setIsLoading(true);
    setTimeout(() => {
      setResult(getMockCrawl(url, crawlType));
      setIsLoading(false);
    }, 900);
  };

  return (
    <section className="min-h-screen w-full overflow-x-hidden bg-slate-50 p-3 font-['Sora'] text-slate-900 sm:p-5 lg:p-6">
      <div className="mx-auto w-full max-w-375 space-y-4">
        <header>
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Competitor Page Analyzer</h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600">
            Paste any page/blog URL to crawl and inspect SEO-relevant metadata, structure, links, and technical signals.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
          <div className="grid grid-cols-1 gap-2 lg:grid-cols-[1fr_auto_auto_auto]">
            <div className="relative min-w-0">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5! w-3.5! -translate-y-1/2 text-slate-400" />
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://competitor.com/page-url"
                className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 text-xs sm:text-sm outline-none focus:border-blue-300 focus:bg-white"
              />
            </div>

            <select
              value={crawlType}
              onChange={(e) => setCrawlType(e.target.value as CrawlType)}
              className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs sm:text-sm"
            >
              <option value="page">Page</option>
              <option value="blog">Blog</option>
            </select>

            <button
              onClick={runCrawl}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3 text-xs sm:text-sm font-semibold text-white hover:bg-blue-700"
            >
              {isLoading ? <Loader2 className="h-3.5! w-3.5! animate-spin" /> : <Globe2 className="h-3.5! w-3.5!" />}
              {isLoading ? "Crawling..." : "Analyze URL"}
            </button>

            <button
              onClick={() => setUrl("")}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 text-xs sm:text-sm font-medium hover:bg-slate-100"
            >
              Clear
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2 text-xs sm:text-sm">
            <ToggleChip label="Assets" active={includeAssets} onToggle={() => setIncludeAssets((v) => !v)} />
            <ToggleChip label="Links" active={includeLinks} onToggle={() => setIncludeLinks((v) => !v)} />
            <ToggleChip label="Schema" active={includeSchema} onToggle={() => setIncludeSchema((v) => !v)} />
          </div>
        </section>

        {result && (
          <>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              <MetricCard label="Health Score" value={healthScore.toString()} icon={ShieldCheck} />
              <MetricCard label="Status Code" value={result.statusCode.toString()} icon={CheckCircle2} />
              <MetricCard label="Response (ms)" value={result.responseMs.toString()} icon={TrendingUp} />
              <MetricCard label="Title Length" value={result.titleLength.toString()} icon={Heading1} />
              <MetricCard label="Description Length" value={result.descriptionLength.toString()} icon={Tags} />
            </div>

            <section className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              <Card title="Core SEO Meta" icon={Tags}>
                <InfoRow label="URL" value={result.url} />
                <InfoRow label="Title" value={result.title} />
                <InfoRow label="Meta Description" value={result.metaDescription} />
                <InfoRow label="Canonical" value={result.canonical} />
                <InfoRow label="Robots" value={result.robots} />
                <InfoRow label="Language" value={result.language} />
                <InfoRow label="Viewport" value={result.viewport} />
              </Card>

              <Card title="Headings Structure" icon={Heading1}>
                <HeadingList label="H1" items={result.headings.h1} />
                <HeadingList label="H2" items={result.headings.h2} />
                <HeadingList label="H3" items={result.headings.h3} />
              </Card>
            </section>

            <section className="grid grid-cols-1 gap-3 lg:grid-cols-3">
              <Card title="Open Graph" icon={Copy}>
                {result.openGraph.map((x) => (
                  <InfoRow key={x.name} label={x.name} value={x.value} />
                ))}
              </Card>

              <Card title="Twitter Meta" icon={Copy}>
                {result.twitter.map((x) => (
                  <InfoRow key={x.name} label={x.name} value={x.value} />
                ))}
              </Card>

              <Card title="Additional Meta" icon={Code2}>
                {result.metaTags.map((x) => (
                  <InfoRow key={x.name} label={x.name} value={x.value} />
                ))}
              </Card>
            </section>

            <section className="grid grid-cols-1 gap-3 lg:grid-cols-3">
              {includeLinks && (
                <Card title="Links Crawl" icon={Link2}>
                  <MiniStat label="Internal links" value={result.links.internal.toString()} />
                  <MiniStat label="External links" value={result.links.external.toString()} />
                  <MiniStat label="Broken links" value={result.links.broken.toString()} />
                  <MiniStat label="Nofollow links" value={result.links.nofollow.toString()} />
                </Card>
              )}

              {includeAssets && (
                <Card title="Images Audit" icon={ImageIcon}>
                  <MiniStat label="Total images" value={result.images.total.toString()} />
                  <MiniStat label="Missing alt" value={result.images.missingAlt.toString()} />
                  <MiniStat label="Oversized assets" value={result.images.oversized.toString()} />
                </Card>
              )}

              {includeSchema && (
                <Card title="Structured Data" icon={Code2}>
                  <div className="flex flex-wrap gap-1.5">
                    {result.structuredData.map((schema) => (
                      <span
                        key={schema}
                        className="rounded-full bg-slate-100 px-2 py-0.5 text-xs sm:text-sm font-semibold text-slate-700"
                      >
                        {schema}
                      </span>
                    ))}
                  </div>
                </Card>
              )}
            </section>

            <Card title="Technical Crawl Flags" icon={AlertTriangle}>
              <div className="space-y-2">
                {result.techFlags.map((flag) => (
                  <div key={flag.label} className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs sm:text-sm font-semibold text-slate-900">{flag.label}</p>
                      <span className={`rounded-full px-2 py-0.5 text-xs sm:text-sm font-semibold ${passFailClass[flag.status]}`}>
                        {flag.status}
                      </span>
                    </div>
                    <p className="mt-1 text-xs sm:text-sm text-slate-600">{flag.note}</p>
                  </div>
                ))}
              </div>
            </Card>

            <div className="flex flex-wrap gap-2">
              <button className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 text-xs sm:text-sm font-medium hover:bg-slate-100">
                Open URL
                <ExternalLink className="h-3.5! w-3.5!" />
              </button>
              <button className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 text-xs sm:text-sm font-medium hover:bg-slate-100">
                Export Crawl JSON
              </button>
              <button className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 text-xs sm:text-sm font-medium hover:bg-slate-100">
                Save to Comparison
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function ToggleChip({
  label,
  active,
  onToggle,
}: {
  label: string;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`rounded-full px-2 py-0.5 text-xs sm:text-sm font-semibold ${
        active ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"
      }`}
    >
      {label}
    </button>
  );
}

function Card({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-1.5 border-b border-slate-100 p-3">
        <Icon className="h-3.5! w-3.5! text-slate-600" />
        <h2 className="text-sm lg:text-base font-semibold text-slate-900">{title}</h2>
      </div>
      <div className="space-y-1.5 p-3">{children}</div>
    </section>
  );
}

function MetricCard({
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[110px_1fr] gap-2 rounded-lg border border-slate-100 bg-slate-50 px-2 py-1.5 text-xs sm:text-sm">
      <span className="font-semibold text-slate-700">{label}</span>
      <span className="break-all text-slate-600">{value}</span>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-2 py-1.5 text-xs sm:text-sm">
      <span className="text-slate-700">{label}</span>
      <span className="font-semibold text-slate-900">{value}</span>
    </div>
  );
}

function HeadingList({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 p-2">
      <p className="text-xs sm:text-sm font-semibold text-slate-700">{label}</p>
      <ul className="mt-1 space-y-1">
        {items.map((item) => (
          <li key={item} className="text-xs sm:text-sm text-slate-600">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

