import React, { useMemo, useState } from "react";
import SeoLayout from "@/components/seo/SeoLayout";
import type { NextPageWithLayout } from "../_app";
import styles from "./assets.module.css";
import {
  CheckCircle2,
  Film,
  Image as ImageIcon,
  Link2,
  Search,
  UploadCloud,
  Video,
} from "lucide-react";

type AssetType = "image" | "video";
type AssetStatus = "published" | "draft";

type AssetItem = {
  id: string;
  name: string;
  type: AssetType;
  sizeMb: number;
  format: string;
  status: AssetStatus;
  uploadedAt: string;
  uploadedBy: string;
  previewUrl: string;
  usedIn: string[];
};

const seedAssets: AssetItem[] = [
  {
    id: "AST-001",
    name: "hero-clinic-team.jpg",
    type: "image",
    sizeMb: 0.84,
    format: "jpg",
    status: "published",
    uploadedAt: "2026-03-14",
    uploadedBy: "John Doe",
    previewUrl: "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=1200&q=80",
    usedIn: ["/", "/services", "/blog/seo-fixes-healthcare"],
  },
  {
    id: "AST-002",
    name: "seo-dashboard-preview.png",
    type: "image",
    sizeMb: 0.42,
    format: "png",
    status: "published",
    uploadedAt: "2026-03-12",
    uploadedBy: "Jane Smith",
    previewUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
    usedIn: ["/features", "/blog/core-web-vitals-clinic-pages"],
  },
  {
    id: "AST-003",
    name: "schema-walkthrough.mp4",
    type: "video",
    sizeMb: 21.8,
    format: "mp4",
    status: "draft",
    uploadedAt: "2026-03-10",
    uploadedBy: "Priya Mehta",
    previewUrl: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&q=80",
    usedIn: ["/blog/schema-markup-hospital-services"],
  },
  {
    id: "AST-004",
    name: "patient-journey.webp",
    type: "image",
    sizeMb: 0.33,
    format: "webp",
    status: "published",
    uploadedAt: "2026-03-09",
    uploadedBy: "John Doe",
    previewUrl: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1200&q=80",
    usedIn: ["/blog", "/pricing", "/contact"],
  },
];

const statusClass: Record<AssetStatus, string> = {
  published: "bg-emerald-100 text-emerald-700",
  draft: "bg-slate-200 text-slate-700",
};

const AssetsPage: NextPageWithLayout = () => {
  const [assets, setAssets] = useState<AssetItem[]>(seedAssets);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | AssetType>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [bulkText, setBulkText] = useState("campaign-header.jpg\ncta-block.webp\nclinic-tour.mp4");
  const [uploading, setUploading] = useState(false);

  const filtered = useMemo(() => {
    return assets.filter((a) => {
      const q = query.trim().toLowerCase();
      const matchQ =
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q) ||
        a.usedIn.some((x) => x.toLowerCase().includes(q));
      const matchType = typeFilter === "all" || a.type === typeFilter;
      return matchQ && matchType;
    });
  }, [assets, query, typeFilter]);

  const totals = useMemo(() => {
    const images = filtered.filter((x) => x.type === "image").length;
    const videos = filtered.filter((x) => x.type === "video").length;
    const usageRefs = filtered.reduce((sum, x) => sum + x.usedIn.length, 0);
    return {
      total: filtered.length,
      images,
      videos,
      usageRefs,
    };
  }, [filtered]);

  const runBulkUpload = () => {
    const lines = bulkText
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean);
    if (!lines.length) return;
    setUploading(true);

    setTimeout(() => {
      const created: AssetItem[] = lines.map((name, i) => {
        const lower = name.toLowerCase();
        const isVideo = lower.endsWith(".mp4") || lower.endsWith(".mov") || lower.endsWith(".webm");
        return {
          id: `AST-${Date.now() + i}`,
          name,
          type: isVideo ? "video" : "image",
          sizeMb: isVideo ? 12 + i : 0.2 + i * 0.1,
          format: name.split(".").pop() || "bin",
          status: "draft",
          uploadedAt: new Date().toISOString().slice(0, 10),
          uploadedBy: "SEO User",
          previewUrl:
            "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&q=80",
          usedIn: [],
        };
      });
      setAssets((prev) => [...created, ...prev]);
      setUploading(false);
      setBulkText("");
    }, 900);
  };

  return (
    <div className={styles.page}>
    <section className="min-h-screen w-full overflow-x-hidden bg-slate-50 p-3 font-['Sora'] text-slate-900 sm:p-5 lg:p-6">
      <div className="mx-auto w-full max-w-375 space-y-4">
        <header className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
              Asset Management
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              Upload images/videos, bulk import assets, and track where each asset is used.
            </p>
          </div>
          <div className="inline-flex h-9 items-center rounded-xl border border-slate-200 bg-white px-3 text-xs sm:text-sm font-medium shadow-sm">
            Assets in library: {totals.total}
          </div>
        </header>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Kpi label="Total" value={totals.total.toString()} icon={UploadCloud} />
          <Kpi label="Images" value={totals.images.toString()} icon={ImageIcon} />
          <Kpi label="Videos" value={totals.videos.toString()} icon={Film} />
          <Kpi label="Usage refs" value={totals.usageRefs.toString()} icon={Link2} />
        </div>

        <section className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
            <h2 className="text-sm lg:text-base font-semibold text-slate-900">Single Upload</h2>
            <label className="mt-3 block cursor-pointer rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center hover:bg-slate-100">
              <input type="file" className="hidden" />
              <UploadCloud className="mx-auto h-4! w-4! text-slate-600" />
              <p className="mt-2 text-xs sm:text-sm font-semibold text-slate-800">Click to upload image/video</p>
              <p className="mt-1 text-xs sm:text-sm text-slate-500">Supported: JPG, PNG, WEBP, MP4, MOV</p>
            </label>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
            <h2 className="text-sm lg:text-base font-semibold text-slate-900">Bulk Upload</h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              Paste one filename per line to simulate bulk import.
            </p>
            <textarea
              rows={4}
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs sm:text-sm"
            />
            <button
              onClick={runBulkUpload}
              disabled={uploading}
              className="mt-2 inline-flex h-8 items-center gap-1 rounded-lg bg-blue-600 px-2 text-xs sm:text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {uploading ? <CheckCircle2 className="h-3.5! w-3.5! animate-pulse" /> : <UploadCloud className="h-3.5! w-3.5!" />}
              {uploading ? "Uploading..." : "Run Bulk Upload"}
            </button>
          </article>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_auto_auto]">
            <div className="relative min-w-0">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5! w-3.5! -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by file name, id, or used-in page..."
                className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 text-xs sm:text-sm outline-none focus:border-blue-300 focus:bg-white"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as "all" | AssetType)}
              className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs sm:text-sm"
            >
              <option value="all">All Types</option>
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
            <div className="inline-flex rounded-xl border border-slate-200 bg-white p-0.5">
              <button
                onClick={() => setViewMode("grid")}
                className={`h-8 rounded-lg px-2 text-xs sm:text-sm font-medium ${viewMode === "grid" ? "bg-slate-900 text-white" : "text-slate-700"}`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`h-8 rounded-lg px-2 text-xs sm:text-sm font-medium ${viewMode === "list" ? "bg-slate-900 text-white" : "text-slate-700"}`}
              >
                List
              </button>
            </div>
          </div>
        </section>

        {viewMode === "grid" ? (
          <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((asset) => (
              <article key={asset.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="aspect-video bg-slate-100">
                  <img src={asset.previewUrl} alt={asset.name} className="h-full w-full object-cover" />
                </div>
                <div className="space-y-2 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-xs sm:text-sm font-semibold text-slate-900">{asset.name}</p>
                      <p className="text-xs sm:text-sm text-slate-500">{asset.id}</p>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-xs sm:text-sm font-semibold ${statusClass[asset.status]}`}>
                      {asset.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 text-xs sm:text-sm text-slate-600">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5">{asset.type}</span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5">{asset.format}</span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5">{asset.sizeMb.toFixed(2)} MB</span>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-700">Used In ({asset.usedIn.length})</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {asset.usedIn.length === 0 && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs sm:text-sm font-medium text-amber-700">
                          Not used yet
                        </span>
                      )}
                      {asset.usedIn.slice(0, 3).map((u) => (
                        <span key={u} className="rounded-full bg-blue-100 px-2 py-0.5 text-xs sm:text-sm font-medium text-blue-700">
                          {u}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </section>
        ) : (
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="divide-y divide-slate-100">
              {filtered.map((asset) => (
                <div key={asset.id} className="p-3">
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-[1.5fr_auto_auto_1fr] md:items-center">
                    <div className="min-w-0">
                      <p className="truncate text-xs sm:text-sm font-semibold text-slate-900">{asset.name}</p>
                      <p className="text-xs sm:text-sm text-slate-500">
                        {asset.id} {asset.uploadedAt} {asset.uploadedBy}
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs sm:text-sm font-semibold text-slate-700">
                      {asset.type} {asset.format} {asset.sizeMb.toFixed(2)} MB
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-xs sm:text-sm font-semibold ${statusClass[asset.status]}`}>
                      {asset.status}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {asset.usedIn.length === 0 && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs sm:text-sm font-medium text-amber-700">
                          Not used yet
                        </span>
                      )}
                      {asset.usedIn.map((u) => (
                        <span key={u} className="rounded-full bg-blue-100 px-2 py-0.5 text-xs sm:text-sm font-medium text-blue-700">
                          {u}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </section>
    </div>
  );
};

AssetsPage.getLayout = (page) => <SeoLayout>{page}</SeoLayout>;

export default AssetsPage;

function Kpi({
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

