import React, { useMemo, useState } from "react";
import { FileText, Filter, Loader2, MoreVertical, Plus, Search, Upload } from "lucide-react";
import type { BlogRecord, BlogStatus } from "@/services/blogService";

const statusClass: Record<BlogStatus, string> = {
  published: "bg-emerald-100 text-emerald-700",
  draft: "bg-slate-200 text-slate-700",
  scheduled: "bg-amber-100 text-amber-700",
};

const desktopGridClass = "md:grid-cols-[minmax(0,4.4fr)_minmax(0,1.8fr)_minmax(120px,1fr)_minmax(120px,0.9fr)_minmax(70px,0.45fr)_minmax(160px,0.95fr)_minmax(64px,0.4fr)]";

function formatDateDDMMYYYY(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

function toTimestamp(value: string): number {
  const raw = String(value || "").trim();
  if (!raw) return 0;
  const ddmmyyyy = raw.match(/^(\d{2})[-/](\d{2})[-/](\d{4})$/);
  if (ddmmyyyy) {
    const [, dd, mm, yyyy] = ddmmyyyy;
    const parsed = new Date(`${yyyy}-${mm}-${dd}T00:00:00`);
    return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
  }
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
}

type BlogListProps = {
  posts: BlogRecord[];
  isFetching: boolean;
  isBulkUploading: boolean;
  onCreate: () => void;
  onOpenUpload: () => void;
  onEdit: (post: BlogRecord) => void;
  onPreview: (post: BlogRecord) => void;
  onDelete: (postId: string) => void;
  onCopyUrl: (slug: string) => void;
  onOpenUrl: (slug: string) => void;
};

export default function BlogList({
  posts,
  isFetching,
  isBulkUploading,
  onCreate,
  onOpenUpload,
  onEdit,
  onPreview,
  onDelete,
  onCopyUrl,
  onOpenUrl,
}: BlogListProps) {
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | BlogStatus>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"recent" | "views_desc" | "seo_desc" | "title_asc">("recent");

  const categories = useMemo(() => ["all", ...new Set(posts.map((post) => post.category || "General"))], [posts]);

  const filteredPosts = useMemo(() => {
    let data = [...posts];
    const q = query.trim().toLowerCase();
    if (q) {
      data = data.filter((p) => p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q) || p.author.toLowerCase().includes(q));
    }
    if (statusFilter !== "all") data = data.filter((p) => p.status === statusFilter);
    if (categoryFilter !== "all") data = data.filter((p) => p.category === categoryFilter);

    data.sort((a, b) => {
      if (sortBy === "views_desc") return b.views - a.views;
      if (sortBy === "seo_desc") return b.seoScore - a.seoScore;
      if (sortBy === "title_asc") return a.title.localeCompare(b.title);
      return toTimestamp(b.updatedAt) - toTimestamp(a.updatedAt);
    });
    return data;
  }, [posts, query, statusFilter, categoryFilter, sortBy]);

  const total = filteredPosts.length;
  const published = filteredPosts.filter((p) => p.status === "published").length;
  const drafts = filteredPosts.filter((p) => p.status === "draft").length;
  const avgScore = "--";

  return (
    <section className="min-h-screen w-full overflow-x-hidden bg-slate-50 p-4 font-['Sora'] text-slate-900 sm:p-6">
      <div className="mx-auto w-full max-w-7xl space-y-4">
        <header className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950">Blog Management</h1>
            <p className="mt-1 text-sm text-slate-600">Manage blog posts, publishing workflow, and SEO performance</p>
          </div>

          <div className="flex items-center gap-2">
            {isBulkUploading && (
              <span className="inline-flex h-11 items-center rounded-xl border border-blue-200 bg-blue-50 px-3 text-sm font-medium text-blue-700">
                Uploading...
              </span>
            )}

            <details className="relative">
              <summary
                className="inline-flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm transition hover:bg-blue-700 [&::-webkit-details-marker]:hidden"
                aria-label="Open blog actions"
                title="Blog actions"
              >
                <Plus className="h-5! w-5!" />
              </summary>

              <div className="absolute right-0 z-20 mt-2 w-44 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
                <button
                  onClick={onCreate}
                  className="flex h-11 w-full items-center gap-2 rounded-lg px-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  <Plus className="h-4! w-4!" />
                  Create Blog
                </button>
                <button
                  onClick={onOpenUpload}
                  className="flex h-11 w-full items-center gap-2 rounded-lg px-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  <Upload className="h-4! w-4!" />
                  Upload Blog
                </button>
              </div>
            </details>
          </div>
        </header>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-3 text-center shadow-sm"><p className="text-sm text-slate-600">Total Posts</p><p className="mt-1 text-2xl font-semibold leading-none">{total}</p></div>
          <div className="rounded-xl border border-slate-200 bg-white p-3 text-center shadow-sm"><p className="text-sm text-slate-600">Published</p><p className="mt-1 text-2xl font-semibold leading-none">{published}</p></div>
          <div className="rounded-xl border border-slate-200 bg-white p-3 text-center shadow-sm"><p className="text-sm text-slate-600">Drafts</p><p className="mt-1 text-2xl font-semibold leading-none">{drafts}</p></div>
          <div className="rounded-xl border border-slate-200 bg-white p-3 text-center shadow-sm"><p className="text-sm text-slate-600">Avg SEO Score</p><p className="mt-1 text-2xl font-semibold leading-none">{avgScore}</p></div>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_auto]">
            <div className="relative min-w-0">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4! w-4! -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, slug or author..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none focus:border-blue-300 focus:bg-white"
              />
            </div>
            <button
              onClick={() => setShowFilters((v) => !v)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
            >
              <Filter className="h-4! w-4!" />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="mt-3 grid grid-cols-1 gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3 sm:grid-cols-3">
              <label className="text-sm font-medium text-slate-600">Status
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as "all" | BlogStatus)} className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm">
                  <option value="all">All Status</option><option value="published">Published</option><option value="draft">Draft</option><option value="scheduled">Scheduled</option>
                </select>
              </label>
              <label className="text-sm font-medium text-slate-600">Category
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm">
                  {categories.map((c) => <option key={c} value={c}>{c === "all" ? "All Categories" : c}</option>)}
                </select>
              </label>
              <label className="text-sm font-medium text-slate-600">Sort By
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value as "recent" | "views_desc" | "seo_desc" | "title_asc")} className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm">
                  <option value="recent">Last Modified</option><option value="views_desc">Views High to Low</option><option value="seo_desc">SEO Score High to Low</option><option value="title_asc">Title A-Z</option>
                </select>
              </label>
            </div>
          )}
        </section>

        <section className="overflow-visible rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className={`hidden border-b border-slate-100 px-4 py-3 text-sm font-semibold text-slate-500 md:grid md:gap-5 ${desktopGridClass}`}>
            <span className="text-left">Title</span><span className="text-center">Keywords</span><span className="text-center">Status</span><span className="text-center">Category</span><span className="text-center">Views</span><span className="text-center">Updated<span className="mt-0.5 block text-[11px] font-normal text-slate-400">DD-MM-YYYY</span></span><span className="text-center">Actions</span>
          </div>

          {isFetching && (
            <div className="flex items-center gap-2 px-4 py-8 text-sm text-slate-600">
              <Loader2 className="h-4! w-4! animate-spin" />
              Loading blogs...
            </div>
          )}

          <div className="divide-y divide-slate-100">
            {!isFetching && filteredPosts.length === 0 && <p className="p-4 text-sm text-slate-500">No blog posts found for current filters.</p>}
            {filteredPosts.map((post) => (
              <div key={post.id} className="px-3 py-3 sm:px-4 md:px-4 md:py-0">
                <div className="grid gap-2 md:hidden">
                  <div className="min-w-0">
                    <button onClick={() => onPreview(post)} className="flex min-w-0 items-center gap-2 text-left">
                      <FileText className="h-4! w-4! text-slate-400" />
                      <p className="truncate text-sm font-semibold text-slate-900">{post.title}</p>
                    </button>
                    <p className="mt-1 truncate font-mono text-sm text-slate-500">{post.slug}</p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusClass[post.status]}`}>{post.status}</span>
                      <details className="relative">
                        <summary className="inline-flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 [&::-webkit-details-marker]:hidden" aria-label="More actions">
                          <MoreVertical className="h-4! w-4!" />
                        </summary>
                        <div className="absolute right-0 z-10 mt-1 w-44 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
                          <button onClick={() => onEdit(post)} className="flex h-10 w-full items-center rounded-lg px-2.5 text-left text-sm text-slate-700 hover:bg-slate-100">Edit</button>
                          <button onClick={() => onOpenUrl(post.slug)} className="flex h-10 w-full items-center rounded-lg px-2.5 text-left text-sm text-slate-700 hover:bg-slate-100">Open URL</button>
                          <button onClick={() => void onCopyUrl(post.slug)} className="flex h-10 w-full items-center rounded-lg px-2.5 text-left text-sm text-slate-700 hover:bg-slate-100">Copy URL</button>
                          <button onClick={() => onDelete(post.id)} className="flex h-10 w-full items-center rounded-lg px-2.5 text-left text-sm text-red-600 hover:bg-red-50">Delete</button>
                        </div>
                      </details>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-sm text-slate-600">
                    <span>Category: {post.category}</span><span>Views: {post.views.toLocaleString()}</span><span>Date: {formatDateDDMMYYYY(post.updatedAt)}</span><span className="col-span-2 truncate">Keywords: {(post.keywords || []).slice(0, 3).join(", ") || "-"}</span>
                  </div>
                </div>

                <div className={`hidden md:grid md:items-center md:gap-5 md:py-3 ${desktopGridClass}`}>
                  <div className="flex min-w-0 items-center gap-2 text-left">
                    <FileText className="h-4! w-4! shrink-0 text-slate-400" />
                    <div className="min-w-0 text-left">
                      <button onClick={() => onPreview(post)} className="max-w-full truncate text-left text-sm font-semibold text-slate-900 hover:text-blue-700 hover:underline">{post.title}</button>
                      <p className="truncate font-mono text-xs text-slate-500">{post.slug}</p>
                    </div>
                  </div>
                  <p className="line-clamp-2 text-center text-sm text-slate-600">{(post.keywords || []).slice(0, 4).join(", ") || "-"}</p>
                  <span className={`mx-auto w-fit rounded-full px-2 py-1 text-xs font-semibold ${statusClass[post.status]}`}>{post.status}</span>
                  <p className="text-center text-sm text-slate-700">{post.category}</p>
                  <p className="text-center text-sm text-slate-700">{post.views.toLocaleString()}</p>
                  <p className="whitespace-nowrap text-center text-sm text-slate-700">{formatDateDDMMYYYY(post.updatedAt)}</p>
                  <div className="flex items-center justify-center">
                    <details className="relative">
                      <summary className="inline-flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100 [&::-webkit-details-marker]:hidden" aria-label="More actions">
                        <MoreVertical className="h-4! w-4!" />
                      </summary>
                      <div className="absolute right-0 z-10 mt-1 w-44 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
                        <button onClick={() => onEdit(post)} className="flex h-10 w-full items-center rounded-lg px-2.5 text-left text-sm text-slate-700 hover:bg-slate-100">Edit</button>
                        <button onClick={() => onOpenUrl(post.slug)} className="flex h-10 w-full items-center rounded-lg px-2.5 text-left text-sm text-slate-700 hover:bg-slate-100">Open URL</button>
                        <button onClick={() => void onCopyUrl(post.slug)} className="flex h-10 w-full items-center rounded-lg px-2.5 text-left text-sm text-slate-700 hover:bg-slate-100">Copy URL</button>
                        <button onClick={() => onDelete(post.id)} className="flex h-10 w-full items-center rounded-lg px-2.5 text-left text-sm text-red-600 hover:bg-red-50">Delete</button>
                      </div>
                    </details>
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





