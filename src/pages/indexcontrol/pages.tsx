import React, { useEffect, useMemo, useState } from "react";
import { Filter, Plus, Search, SlidersHorizontal, Upload } from "lucide-react";
import PageList from "@/components/seo/pages/PageList";
import UploadDropzone from "@/components/seo/pages/UploadDropzone";
import Builder from "@/components/seo/pages/Builder";
import SeoLayout from "@/components/seo/SeoLayout";
import styles from "./pages.module.css";
import type { SeoPageRecord, UpsertSeoPagePayload } from "@/types/seoPage";
import { deleteSeoPage, listSeoPages } from "@/lib/seoPagesApi";
import { useSeoUser } from "@/components/seo/SeoAuthContext";

const PagesManager = () => {
  const user = useSeoUser();
  const role = user?.role || "seo_viewer";
  const canEdit = true;
  const canDelete = true;
  const [activeView, setActiveView] = useState<"list" | "upload" | "builder">("list");
  const [editingPage, setEditingPage] = useState<SeoPageRecord | null>(null);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | SeoPageRecord["status"]>("all");
  const [authorFilter, setAuthorFilter] = useState<"all" | string>("all");
  const [sortBy, setSortBy] = useState<"recent" | "views_desc" | "views_asc" | "title_asc">("recent");
  const [pages, setPages] = useState<SeoPageRecord[]>([]);
  const [selectedPageIds, setSelectedPageIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const authors = useMemo(() => ["all", ...new Set(pages.map((p) => p.author))], [pages]);

  const loadPages = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await listSeoPages();
      const normalizedData = data.map((page) => {
        const rawKind = String((page as SeoPageRecord & { pageKind?: string }).pageKind || "").toLowerCase();
        const pageKind = rawKind === "condition" ? "cause" : rawKind;
        return {
          ...page,
          pageKind: pageKind as SeoPageRecord["pageKind"],
        };
      });
      setPages(normalizedData);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to load pages";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadPages();
  }, []);

  useEffect(() => {
    setSelectedPageIds((prev) => prev.filter((id) => pages.some((page) => page.id === id)));
  }, [pages]);

  const filteredPages = useMemo(() => {
    let result = [...pages];

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (p) =>
          p.titleTag.toLowerCase().includes(q) ||
          p.url.toLowerCase().includes(q) ||
          p.author.toLowerCase().includes(q) ||
          String(p.targetKeyword || "").toLowerCase().includes(q) ||
          String(p.metaTag || "").toLowerCase().includes(q) ||
          (p.keywordPlacement || []).some((keyword) => String(keyword || "").toLowerCase().includes(q)),
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((p) => p.status === statusFilter);
    }

    if (authorFilter !== "all") {
      result = result.filter((p) => p.author === authorFilter);
    }

    result.sort((a, b) => {
      if (sortBy === "views_desc") return b.views - a.views;
      if (sortBy === "views_asc") return a.views - b.views;
      if (sortBy === "title_asc") return a.titleTag.localeCompare(b.titleTag);
      return b.updatedAt.localeCompare(a.updatedAt);
    });

    return result;
  }, [pages, query, statusFilter, authorFilter, sortBy]);

  const visiblePages = useMemo(() => filteredPages, [filteredPages]);

  const toggleSelect = (pageId: string) => {
    setSelectedPageIds((prev) =>
      prev.includes(pageId) ? prev.filter((id) => id !== pageId) : [...prev, pageId],
    );
  };

  const toggleSelectAll = () => {
    setSelectedPageIds((prev) => {
      if (visiblePages.length === 0) return prev;
      const allVisibleSelected = visiblePages.every((page) => prev.includes(page.id));
      return allVisibleSelected ? prev.filter((id) => !visiblePages.some((page) => page.id === id)) : [
        ...prev,
        ...visiblePages.map((page) => page.id).filter((id) => !prev.includes(id)),
      ];
    });
  };


  const pageStats = useMemo(() => {
    const counts = pages.reduce<Record<string, number>>((acc, page) => {
      const kind = String(page.pageKind || "unknown").toLowerCase();
      acc[kind] = (acc[kind] || 0) + 1;
      return acc;
    }, {});

    const typeCards = Object.entries(counts)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([kind, count]) => ({
        key: kind,
        label: `${kind.charAt(0).toUpperCase()}${kind.slice(1)} Pages`,
        count,
      }));

    return {
      total: pages.length,
      typeCards,
    };
  }, [pages]);

  const openCreateBuilder = () => {
    setShowQuickActions(false);
    setEditingPage(null);
    setActiveView("builder");
  };

  const onDeletePage = async (pageId: string) => {
    const pageToDelete = pages.find((page) => page.id === pageId);
    const label = pageToDelete?.titleTag || pageToDelete?.url || "this page";
    const shouldDelete = window.confirm(`Are you sure you want to delete "${label}"?`);
    if (!shouldDelete) return;

    try {
      await deleteSeoPage(pageId);
      await loadPages();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to delete page";
      setError(message);
    }
  };

  const toUpdatePayload = (page: SeoPageRecord, nextStatus?: SeoPageRecord["status"]): UpsertSeoPagePayload => ({
    pageKind: page.pageKind,
    targetKeyword: page.targetKeyword || "",
    overview: page.overview || "",
    sections: page.sections || [],
    content: page.content || "",
    quickAnswer: page.quickAnswer || "",
    titleTag: page.titleTag || "",
    metaTag: page.metaTag || "",
    metaDescription: page.metaDescription || "",
    url: page.url || "",
    status: nextStatus || page.status,
    author: page.author || "SEO Team",
    headingStructure: {
      h1: page.headingStructure?.h1 || "",
      h2: (page.headingStructure?.h2 || []).join("\n"),
      h3: (page.headingStructure?.h3 || []).join("\n"),
    },
    keywordPlacement: (page.keywordPlacement || []).join("\n"),
    imageAltText: (page.imageAltText || []).join("\n"),
    internalLinks: (page.internalLinks || []).join("\n"),
  });


  const onSavePage = async (_payload: UpsertSeoPagePayload, _pageId?: string) => {
    await loadPages();
  };

  if (activeView === "builder") {
    return (
      <Builder
        pageData={editingPage ?? undefined}
        onBack={() => setActiveView("list")}
        onSave={onSavePage}
      />
    );
  }

  if (activeView === "upload") {
    return (
      <SeoLayout>
        <div className={styles.page}>
          <UploadDropzone onBack={() => setActiveView("list")} />
        </div>
      </SeoLayout>
    );
  }

  return (
    <SeoLayout>
      <div className={styles.page}>
        <div className="min-h-screen w-full overflow-x-hidden bg-slate-50 p-3 font-['Sora'] text-slate-900 sm:p-5 lg:p-6">
        <div className="mx-auto w-full max-w-375 min-w-0 space-y-4">
          <header className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Pages</h1>
            </div>

            <div className="relative flex w-full justify-end lg:w-auto">
              <button
                onClick={() => setShowQuickActions((v) => !v)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm transition hover:bg-blue-700"
                aria-label="Create or upload pages"
                title="Create or upload pages"
              >
                <Plus className="h-4! w-4!" />
              </button>

              {showQuickActions && (
                <div className="absolute right-0 top-12 z-50 w-44 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg">
                  <button
                    onClick={openCreateBuilder}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <Plus className="h-3.5! w-3.5!" />
                    Create Page
                  </button>
                  <button
                    onClick={() => {
                      setShowQuickActions(false);
                      setActiveView("upload");
                    }}
                    className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <Upload className="h-3.5! w-3.5!" />
                    Upload Pages
                  </button>
                </div>
              )}
            </div>
          </header>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs sm:text-sm text-red-700">
            {error}
          </div>
        )}

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm text-center">
            <p className="text-xs sm:text-sm font-medium text-slate-500">Total Pages</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{pageStats.total}</p>
          </div>

          {pageStats.typeCards.map((card) => (
            <div key={card.key} className="text-center rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs sm:text-sm font-medium text-slate-500">{card.label}</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{card.count}</p>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <div className="relative flex-1 min-w-0">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5! w-3.5! -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pages..."
                className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 text-xs sm:text-sm outline-none transition focus:border-blue-300 focus:bg-white"
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
            <div className="mt-3 grid grid-cols-1 gap-2 rounded-xl border border-slate-100 bg-slate-50 p-2 sm:grid-cols-2 lg:grid-cols-4">
              <label className="text-xs sm:text-sm font-medium text-slate-600">
                Status
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as "all" | SeoPageRecord["status"])}
                  className="mt-1 h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs sm:text-sm"
                >
                  <option value="all">All statuses</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </label>

              <label className="text-xs sm:text-sm font-medium text-slate-600">
                Author
                <select
                  value={authorFilter}
                  onChange={(e) => setAuthorFilter(e.target.value)}
                  className="mt-1 h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs sm:text-sm"
                >
                  {authors.map((author) => (
                    <option key={author} value={author}>
                      {author === "all" ? "All authors" : author}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-xs sm:text-sm font-medium text-slate-600">
                Sort By
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "recent" | "views_desc" | "views_asc" | "title_asc")}
                  className="mt-1 h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs sm:text-sm"
                >
                  <option value="recent">Last Modified</option>
                  <option value="views_desc">Views High to Low</option>
                  <option value="views_asc">Views Low to High</option>
                  <option value="title_asc">Title A-Z</option>
                </select>
              </label>

              <button
                onClick={() => {
                  setStatusFilter("all");
                  setAuthorFilter("all");
                  setSortBy("recent");
                }}
                className="inline-flex h-8 items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                <SlidersHorizontal className="h-3.5! w-3.5!" />
                Reset
              </button>
            </div>
          )}
        </section>

        {isLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-xs sm:text-sm text-slate-600">
            Loading pages...
          </div>
        ) : (
          <PageList
            pages={visiblePages}
            selectedPageIds={selectedPageIds}
            onToggleSelect={toggleSelect}
            onToggleSelectAll={toggleSelectAll}
            onEdit={(page) => {
              setEditingPage(page);
              setActiveView("builder");
            }}
            onDelete={onDeletePage}
            canEdit={canEdit}
            canDelete={canDelete}
          />
        )}
        </div>
      </div>
      </div>
    </SeoLayout>
  );
};

export default PagesManager;
