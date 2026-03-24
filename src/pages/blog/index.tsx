import Head from "next/head";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Search } from "lucide-react";
import { blogService, type BlogRecord } from "@/services/blogService";

function formatDateDDMMYYYY(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

function toSlugSegment(slug: string) {
  const clean = String(slug || "")
    .trim()
    .replace(/^https?:\/\/[^/]+/i, "")
    .replace(/^\/+/, "");

  const withoutPrefix = clean.replace(/^blog\//i, "");
  const parts = withoutPrefix.split("/").filter(Boolean);
  return parts[parts.length - 1] || "";
}

export default function BlogListingPage() {
  const [blogs, setBlogs] = useState<BlogRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    setError("");

    blogService
      .getAll()
      .then((items) => {
        if (mounted) setBlogs(items);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Unable to load blogs.");
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const publishedBlogs = useMemo(() => blogs.filter((blog) => blog.status === "published"), [blogs]);

  const categories = useMemo(
    () => ["all", ...new Set(publishedBlogs.map((blog) => (blog.category || "General").trim() || "General"))],
    [publishedBlogs],
  );

  const filteredBlogs = useMemo(() => {
    let list = [...publishedBlogs];

    if (categoryFilter !== "all") {
      list = list.filter((blog) => blog.category === categoryFilter);
    }

    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((blog) => blog.title.toLowerCase().includes(q));
    }

    return list;
  }, [publishedBlogs, categoryFilter, query]);

  return (
    <main className="relative min-h-screen overflow-x-clip bg-linear-to-br from-slate-100 via-blue-50 to-cyan-100 px-4 py-8 font-['Sora'] text-slate-900 sm:px-6 lg:py-12">
      <Head>
        <title>Blogs | Astikan</title>
      </Head>

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(56,189,248,0.24),transparent_34%),radial-gradient(circle_at_80%_10%,rgba(59,130,246,0.22),transparent_30%),radial-gradient(circle_at_50%_90%,rgba(14,165,233,0.2),transparent_32%)]" />
        <div className="absolute inset-0 opacity-35 [background:linear-gradient(rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-size-[38px_38px]" />
        <div className="absolute -top-20 -left-25 h-64 w-64 rounded-full bg-blue-200/65 blur-3xl" />
        <div className="absolute -right-30 top-28 h-72 w-72 rounded-full bg-cyan-200/55 blur-3xl" />
        <div className="absolute -bottom-25 left-1/3 h-72 w-72 rounded-full bg-indigo-200/50 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl">
        <header className="mb-6 rounded-2xl border border-white/70 bg-white/75 p-5 shadow-xl backdrop-blur-xl sm:mb-8 sm:p-6">
          <p className="text-sm font-medium text-blue-700">Astikan Health Blog</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Medical Insights & Patient Guides</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-600 sm:text-base">
            Explore practical, doctor-reviewed guidance on symptoms, treatments, and preventive care.
          </p>
        </header>

        <section className="mb-5 grid grid-cols-1 gap-3 rounded-2xl border border-white/70 bg-white/75 p-6 shadow-lg backdrop-blur-xl md:grid-cols-[1fr_auto]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4! w-4! -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by blog title..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-300"
            />
          </label>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-blue-300"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </option>
            ))}
          </select>
        </section>

        <div className="mb-4 text-sm text-slate-600">
          Showing {filteredBlogs.length} published blog{filteredBlogs.length === 1 ? "" : "s"}
        </div>

        {isLoading && (
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={`skeleton-${i}`} className="animate-pulse rounded-2xl border border-white/70 bg-white/75 p-5 backdrop-blur-xl">
                <div className="h-6 w-22 rounded-full bg-slate-200" />
                <div className="mt-4 h-6 w-4/5 rounded bg-slate-200" />
                <div className="mt-2 h-4 w-full rounded bg-slate-200" />
                <div className="mt-2 h-4 w-5/6 rounded bg-slate-200" />
                <div className="mt-4 h-4 w-1/2 rounded bg-slate-200" />
                <div className="mt-5 h-11 w-28 rounded-xl bg-slate-200" />
              </div>
            ))}
          </section>
        )}

        {!isLoading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 backdrop-blur-xl">
            {error}
          </div>
        )}

        {!isLoading && !error && filteredBlogs.length === 0 && (
          <div className="rounded-2xl border border-white/70 bg-white/75 px-4 py-12 text-center text-slate-600 backdrop-blur-xl">
            No matching published blogs found.
          </div>
        )}

        {!isLoading && !error && filteredBlogs.length > 0 && (
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredBlogs.map((blog) => (
              <article key={blog.id} className="flex h-full flex-col rounded-2xl border border-white/70 bg-white/75 p-5 shadow-lg backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/90">
                <span className="text-center inline-flex w-fit rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700 ring-1 ring-blue-200">
                  {blog.category}
                </span>
                <h2 className="mt-3 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-base font-bold text-slate-900 sm:text-lg md:text-xl md:whitespace-normal">{blog.title}</h2>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">
                  {blog.excerpt || "Read the full article for complete guidance."}
                </p>

                <div className="mt-4 flex items-center gap-1.5 text-sm text-slate-500">
                  <CalendarDays className="h-4! w-4!" />
                  {formatDateDDMMYYYY(blog.updatedAt)}
                </div>

                <div className="mt-5 pt-1">
                  <Link
                    href={`/blog/${toSlugSegment(blog.slug)}`}
                    className="inline-flex h-11 items-center rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Read More
                  </Link>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}





