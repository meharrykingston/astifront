import React, { useMemo, useState } from "react";
import SeoLayout from "@/components/seo/SeoLayout";
import type { NextPageWithLayout } from "../_app";
import styles from "./blog.module.css";
import {
  ArrowLeft,
  Eye,
  FileText,
  Filter,
  MoreVertical,
  PenSquare,
  Plus,
  Save,
  Search,
  Trash2,
  Upload,
} from "lucide-react";

type BlogStatus = "published" | "draft" | "scheduled";
type ViewMode = "list" | "import" | "editor" | "preview";

type BlogPost = {
  id: number;
  title: string;
  slug: string;
  author: string;
  status: BlogStatus;
  category: string;
  views: number;
  seoScore: number;
  updatedAt: string;
  excerpt: string;
  content: string;
};

const postsSeed: BlogPost[] = [
  {
    id: 1,
    title: "10 SEO Fixes for Healthcare Websites",
    slug: "/blog/seo-fixes-healthcare",
    author: "John Doe",
    status: "published",
    category: "SEO",
    views: 18432,
    seoScore: 91,
    updatedAt: "2026-03-13",
    excerpt: "Practical fixes for crawlability, indexing, and on-page quality.",
    content: "Focus on sitemap hygiene, canonical consistency, and internal linking for better medical SEO.",
  },
  {
    id: 2,
    title: "Core Web Vitals for Clinic Landing Pages",
    slug: "/blog/core-web-vitals-clinic-pages",
    author: "Jane Smith",
    status: "published",
    category: "Performance",
    views: 12304,
    seoScore: 88,
    updatedAt: "2026-03-12",
    excerpt: "Improve LCP, CLS, and INP on healthcare conversion pages.",
    content: "Prioritize image optimization, layout stability, and script deferral to improve user experience.",
  },
  {
    id: 3,
    title: "Meta Description Templates that Improve CTR",
    slug: "/blog/meta-description-templates",
    author: "John Doe",
    status: "draft",
    category: "Content",
    views: 0,
    seoScore: 73,
    updatedAt: "2026-03-11",
    excerpt: "Formula-based templates for better snippet clicks.",
    content: "Use intent-aware descriptors, measurable outcomes, and concise hooks.",
  },
];

const emptyPost = (): BlogPost => ({
  id: Date.now(),
  title: "",
  slug: "/blog/",
  author: "John Doe",
  status: "draft",
  category: "SEO",
  views: 0,
  seoScore: 80,
  updatedAt: new Date().toISOString().slice(0, 10),
  excerpt: "",
  content: "",
});

const statusClass: Record<BlogStatus, string> = {
  published: "bg-emerald-100 text-emerald-700",
  draft: "bg-slate-200 text-slate-700",
  scheduled: "bg-amber-100 text-amber-700",
};

function BlogEditor({
  post,
  onBack,
  onSave,
}: {
  post: BlogPost;
  onBack: () => void;
  onSave: (post: BlogPost) => void;
}) {
  const [draft, setDraft] = useState<BlogPost>(post);

  return (
    <section className="min-h-screen w-full overflow-x-hidden bg-slate-50 p-2 font-['Sora'] text-slate-900 sm:p-5 lg:p-6">
      <div className="mx-auto w-full max-w-275 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={onBack}
            className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 text-xs sm:text-sm font-medium hover:bg-slate-100"
          >
            <ArrowLeft className="h-3.5! w-3.5!" />
            Back
          </button>
          <button
            onClick={() => onSave({ ...draft, updatedAt: new Date().toISOString().slice(0, 10) })}
            className="inline-flex h-8 items-center gap-1 rounded-lg bg-blue-600 px-2 text-xs sm:text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Save className="h-3.5! w-3.5!" />
            Save Post
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <h2 className="text-base font-semibold">{post.title ? "Edit Blog" : "Create Blog"}</h2>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <label className="text-xs sm:text-sm font-medium text-slate-600">
              Title
              <input
                value={draft.title}
                onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))}
                className="mt-1 h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs sm:text-sm"
              />
            </label>
            <label className="text-xs sm:text-sm font-medium text-slate-600">
              Slug
              <input
                value={draft.slug}
                onChange={(e) => setDraft((p) => ({ ...p, slug: e.target.value }))}
                className="mt-1 h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs sm:text-sm"
              />
            </label>
            <label className="text-xs sm:text-sm font-medium text-slate-600">
              Author
              <input
                value={draft.author}
                onChange={(e) => setDraft((p) => ({ ...p, author: e.target.value }))}
                className="mt-1 h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs sm:text-sm"
              />
            </label>
            <label className="text-xs sm:text-sm font-medium text-slate-600">
              Category
              <input
                value={draft.category}
                onChange={(e) => setDraft((p) => ({ ...p, category: e.target.value }))}
                className="mt-1 h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs sm:text-sm"
              />
            </label>
            <label className="text-xs sm:text-sm font-medium text-slate-600 sm:col-span-2">
              Excerpt
              <textarea
                rows={2}
                value={draft.excerpt}
                onChange={(e) => setDraft((p) => ({ ...p, excerpt: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs sm:text-sm"
              />
            </label>
            <label className="text-xs sm:text-sm font-medium text-slate-600 sm:col-span-2">
              Content
              <textarea
                rows={10}
                value={draft.content}
                onChange={(e) => setDraft((p) => ({ ...p, content: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs sm:text-sm"
              />
            </label>
            <label className="text-xs sm:text-sm font-medium text-slate-600">
              Status
              <select
                value={draft.status}
                onChange={(e) => setDraft((p) => ({ ...p, status: e.target.value as BlogStatus }))}
                className="mt-1 h-9 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs sm:text-sm"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </label>
          </div>
        </div>
      </div>
    </section>
  );
}

function BlogPreview({ post, onBack }: { post: BlogPost; onBack: () => void }) {
  return (
    <section className="min-h-screen w-full overflow-x-hidden bg-slate-50 p-3 font-['Sora'] sm:p-5 lg:p-6">
      <div className="mx-auto w-full max-w-225 space-y-4">
        <button
          onClick={onBack}
          className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          <ArrowLeft className="h-3.5! w-3.5!" />
          Back
        </button>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs sm:text-sm text-slate-500">{post.updatedAt} · {post.author}</p>
          <h1 className="mt-2 text-xl font-semibold text-slate-900">{post.title}</h1>
          <p className="mt-2 text-sm lg:text-base text-slate-600">{post.excerpt}</p>
          <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm lg:text-base text-slate-700">
            {post.content || "No content available."}
          </div>
        </article>
      </div>
    </section>
  );
}

function BlogImport({ onBack, onImport }: { onBack: () => void; onImport: (items: BlogPost[]) => void }) {
  const [raw, setRaw] = useState("Healthcare SEO Basics\nTechnical SEO Checklist\nLocal SEO for Clinics");

  const performImport = () => {
    const lines = raw
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean);

    const items = lines.map((title, i) => {
      const slugText = title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
      return {
        ...emptyPost(),
        id: Date.now() + i,
        title,
        slug: `/blog/${slugText || `imported-${i + 1}`}`,
        excerpt: "Imported from bulk tool.",
        content: "Review and finalize content before publishing.",
      } as BlogPost;
    });

    onImport(items);
  };

  return (
    <section className="min-h-screen w-full overflow-x-hidden bg-slate-50 p-3 font-['Sora'] sm:p-5 lg:p-6">
      <div className="mx-auto w-full max-w-225 space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            <ArrowLeft className="h-3.5! w-3.5!" />
            Back
          </button>
          <button
            onClick={performImport}
            className="inline-flex h-8 items-center gap-1 rounded-lg bg-blue-600 px-2 text-xs sm:text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Upload className="h-3.5! w-3.5!" />
            Import Now
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">Import Blog</h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-600">Paste one post title per line for quick import.</p>
          <textarea
            rows={10}
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            className="mt-3 w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs sm:text-sm"
          />
        </div>
      </div>
    </section>
  );
}

const BlogPage: NextPageWithLayout = () => {
  const [posts, setPosts] = useState<BlogPost[]>(postsSeed);
  const [mode, setMode] = useState<ViewMode>("list");
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | BlogStatus>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"recent" | "views_desc" | "seo_desc" | "title_asc">(
    "recent",
  );

  const categories = useMemo(() => ["all", ...new Set(posts.map((post) => post.category))], [posts]);

  const filteredPosts = useMemo(() => {
    let data = [...posts];
    const q = query.trim().toLowerCase();
    if (q) {
      data = data.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q) ||
          p.author.toLowerCase().includes(q),
      );
    }
    if (statusFilter !== "all") data = data.filter((p) => p.status === statusFilter);
    if (categoryFilter !== "all") data = data.filter((p) => p.category === categoryFilter);

    data.sort((a, b) => {
      if (sortBy === "views_desc") return b.views - a.views;
      if (sortBy === "seo_desc") return b.seoScore - a.seoScore;
      if (sortBy === "title_asc") return a.title.localeCompare(b.title);
      return b.updatedAt.localeCompare(a.updatedAt);
    });
    return data;
  }, [posts, query, statusFilter, categoryFilter, sortBy]);

  if (mode === "import") {
    return (
      <BlogImport
        onBack={() => setMode("list")}
        onImport={(items) => {
          setPosts((prev) => [...items, ...prev]);
          setMode("list");
        }}
      />
    );
  }

  if (mode === "editor") {
    return (
      <BlogEditor
        post={activePost ?? emptyPost()}
        onBack={() => setMode("list")}
        onSave={(post) => {
          setPosts((prev) => {
            const exists = prev.some((p) => p.id === post.id);
            if (!exists) return [post, ...prev];
            return prev.map((p) => (p.id === post.id ? post : p));
          });
          setMode("list");
        }}
      />
    );
  }

  if (mode === "preview" && activePost) {
    return <BlogPreview post={activePost} onBack={() => setMode("list")} />;
  }

  const total = filteredPosts.length;
  const published = filteredPosts.filter((p) => p.status === "published").length;
  const drafts = filteredPosts.filter((p) => p.status === "draft").length;
  const avgScore = filteredPosts.length > 0 ? Math.round(filteredPosts.reduce((sum, p) => sum + p.seoScore, 0) / filteredPosts.length) : 0;

  return (
    <div className={styles.page}>
    <section className="min-h-screen w-full overflow-x-hidden bg-slate-50 p-3 font-['Sora'] text-slate-900 sm:p-5 lg:p-6">
      <div className="mx-auto w-full max-w-375 min-w-0 space-y-4 px-1 sm:px-0">
        <header className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">Blog Management</h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">Manage blog posts, publishing workflow, and SEO performance</p>
          </div>

          <div className="flex w-full flex-wrap gap-2 lg:w-auto">
            <button
              onClick={() => setMode("import")}
              className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs sm:text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-100 lg:flex-none"
            >
              <Upload className="h-3.5! w-3.5!" />
              Import Blog
            </button>
            <button
              onClick={() => {
                setActivePost(emptyPost());
                setMode("editor");
              }}
              className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 lg:flex-none"
            >
              <Plus className="h-3.5! w-3.5!" />
              New Post
            </button>
          </div>
        </header>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-3 text-center shadow-sm"><p className="text-xs sm:text-sm text-slate-600">Total Posts</p><p className="mt-1 text-xl font-semibold leading-none">{total}</p></div>
          <div className="rounded-xl border border-slate-200 bg-white p-3 text-center shadow-sm"><p className="text-xs sm:text-sm text-slate-600">Published</p><p className="mt-1 text-xl font-semibold leading-none">{published}</p></div>
          <div className="rounded-xl border border-slate-200 bg-white p-3 text-center shadow-sm"><p className="text-xs sm:text-sm text-slate-600">Drafts</p><p className="mt-1 text-xl font-semibold leading-none">{drafts}</p></div>
          <div className="rounded-xl border border-slate-200 bg-white p-3 text-center shadow-sm"><p className="text-xs sm:text-sm text-slate-600">Avg SEO Score</p><p className="mt-1 text-xl font-semibold leading-none">{avgScore}</p></div>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_auto]">
            <div className="relative min-w-0">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5! w-3.5! -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, slug or author..."
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
            <div className="mt-3 grid grid-cols-1 gap-2 rounded-xl border border-slate-100 bg-slate-50 p-2 sm:grid-cols-3">
              <label className="text-xs sm:text-sm font-medium text-slate-600">Status
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as "all" | BlogStatus)} className="mt-1 h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs sm:text-sm">
                  <option value="all">All Status</option><option value="published">Published</option><option value="draft">Draft</option><option value="scheduled">Scheduled</option>
                </select>
              </label>
              <label className="text-xs sm:text-sm font-medium text-slate-600">Category
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="mt-1 h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs sm:text-sm">
                  {categories.map((c) => <option key={c} value={c}>{c === "all" ? "All Categories" : c}</option>)}
                </select>
              </label>
              <label className="text-xs sm:text-sm font-medium text-slate-600">Sort By
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value as "recent" | "views_desc" | "seo_desc" | "title_asc")} className="mt-1 h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs sm:text-sm">
                  <option value="recent">Last Modified</option><option value="views_desc">Views High to Low</option><option value="seo_desc">SEO Score High to Low</option><option value="title_asc">Title A-Z</option>
                </select>
              </label>
            </div>
          )}
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="hidden border-b border-slate-100 px-4 py-3 text-xs sm:text-sm font-semibold text-slate-500 md:grid md:grid-cols-[2.2fr_1.4fr_1fr_1.1fr_0.9fr_1.2fr_0.8fr] md:gap-3">
            <span>Title</span><span>Slug</span><span>Status</span><span>Category</span><span className="text-right">Views</span><span>Updated</span><span className="text-right">Actions</span>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredPosts.length === 0 && <p className="p-4 text-xs sm:text-sm text-slate-500">No blog posts found for current filters.</p>}
            {filteredPosts.map((post) => (
              <div key={post.id} className="px-3 py-3 sm:px-4 md:px-4 md:py-0">
                <div className="grid gap-2 md:hidden">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <FileText className="h-3.5! w-3.5! text-slate-400" />
                      <p className="truncate text-xs sm:text-sm font-semibold text-slate-900">{post.title}</p>
                    </div>
                    <p className="mt-1 truncate font-mono text-xs sm:text-sm text-slate-500">{post.slug}</p>
                    <div className="mt-1 flex items-center justify-between gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs sm:text-sm font-semibold ${statusClass[post.status]}`}>{post.status}</span>
                      <div className="flex items-center gap-1">
                        <button onClick={() => { setActivePost(post); setMode("preview"); }} className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100" aria-label="View">
                          <Eye className="h-3.5! w-3.5!" />
                        </button>
                        <button onClick={() => { setActivePost(post); setMode("editor"); }} className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100" aria-label="Edit">
                          <PenSquare className="h-3.5! w-3.5!" />
                        </button>
                        <button onClick={() => setPosts((prev) => prev.filter((x) => x.id !== post.id))} className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50" aria-label="Delete">
                          <Trash2 className="h-3.5! w-3.5!" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-xs sm:text-sm text-slate-600">
                    <span>Category: {post.category}</span>
                    <span>Views: {post.views.toLocaleString()}</span>
                    <span>SEO Score: {post.seoScore}</span>
                    <span>Date: {post.updatedAt}</span>
                  </div>
                </div>

                <div className="hidden md:grid md:grid-cols-[2.2fr_1.4fr_1fr_1.1fr_0.9fr_1.2fr_0.8fr] md:items-center md:gap-3 md:py-3">
                  <div className="flex min-w-0 items-center gap-2"><FileText className="h-3.5! w-3.5! shrink-0 text-slate-400" /><div className="min-w-0"><p className="truncate text-xs sm:text-sm font-semibold text-slate-900">{post.title}</p><p className="text-xs sm:text-sm text-slate-500">SEO {post.seoScore}/100</p></div></div>
                  <p className="truncate font-mono text-xs sm:text-sm text-slate-600">{post.slug}</p>
                  <span className={`w-fit rounded-full px-2 py-0.5 text-xs sm:text-sm font-semibold ${statusClass[post.status]}`}>{post.status}</span>
                  <p className="text-xs sm:text-sm text-slate-700">{post.category}</p>
                  <p className="text-right text-xs sm:text-sm text-slate-700">{post.views.toLocaleString()}</p>
                  <p className="text-xs sm:text-sm text-slate-700">{post.updatedAt}</p>
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => { setActivePost(post); setMode("preview"); }} className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100"><Eye className="h-3.5! w-3.5!" /></button>
                    <button onClick={() => { setActivePost(post); setMode("editor"); }} className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100"><PenSquare className="h-3.5! w-3.5!" /></button>
                    <button onClick={() => setPosts((prev) => prev.filter((x) => x.id !== post.id))} className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100"><Trash2 className="h-3.5! w-3.5!" /></button>
                    <button onClick={() => setPosts((prev) => [{ ...post, id: Date.now(), title: `${post.title} (Copy)`, status: "draft", updatedAt: new Date().toISOString().slice(0, 10) }, ...prev])} className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100"><MoreVertical className="h-3.5! w-3.5!" /></button>
                  </div>
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

BlogPage.getLayout = (page) => <SeoLayout>{page}</SeoLayout>;

export default BlogPage;
