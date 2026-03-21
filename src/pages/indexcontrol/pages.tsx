import React, { useEffect, useMemo, useState } from "react";
import { Filter, Plus, RefreshCw, Search, SlidersHorizontal, Upload } from "lucide-react";
import PageList from "@/components/seo/pages/PageList";
import UploadDropzone from "@/components/seo/pages/UploadDropzone";
import Builder from "@/components/seo/pages/Builder";
import SeoLayout from "@/components/seo/SeoLayout";
import type { NextPageWithLayout } from "../_app";
import styles from "./pages.module.css";
import type { SeoPageRecord, UpsertSeoPagePayload } from "@/types/seoPage";
import { deleteSeoPage, listSeoPages, updateSeoPage } from "@/lib/seoPagesApi";
import { useSeoUser } from "@/components/seo/SeoAuthContext";

const PagesManager: NextPageWithLayout = () => {
  const user = useSeoUser();
  const role = user?.role || "seo_viewer";
  const canEdit = role === "seo_admin" || role === "seo_editor";
  const canDelete = role === "seo_admin";
  const [activeView, setActiveView] = useState<"list" | "upload" | "builder">("list");
  const [editingPage, setEditingPage] = useState<SeoPageRecord | null>(null);
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | SeoPageRecord["status"]>("all");
  const [authorFilter, setAuthorFilter] = useState<"all" | string>("all");
  const [sortBy, setSortBy] = useState<"recent" | "views_desc" | "views_asc" | "title_asc">("recent");
  const [itemsPerView, setItemsPerView] = useState<50 | 100 | 200>(50);
  const [pages, setPages] = useState<SeoPageRecord[]>([]);
  const [selectedPageIds, setSelectedPageIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBulkSaving, setIsBulkSaving] = useState(false);
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

  const visiblePages = useMemo(() => filteredPages.slice(0, itemsPerView), [filteredPages, itemsPerView]);

  useEffect(() => {
    setSelectedPageIds((prev) => prev.filter((id) => visiblePages.some((page) => page.id === id)));
  }, [visiblePages]);

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
      setSelectedPageIds((prev) => prev.filter((id) => id !== pageId));
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

  const toggleSelect = (pageId: string) => {
    setSelectedPageIds((prev) => (prev.includes(pageId) ? prev.filter((id) => id !== pageId) : [...prev, pageId]));
  };

  const toggleSelectAll = () => {
    const filteredIds = visiblePages.map((page) => page.id);
    const areAllVisibleSelected =
      filteredIds.length > 0 && filteredIds.every((id) => selectedPageIds.includes(id));

    setSelectedPageIds((prev) =>
      areAllVisibleSelected
        ? prev.filter((id) => !filteredIds.includes(id))
        : [...new Set([...prev, ...filteredIds])],
    );
  };

  const runBulkStatusUpdate = async (nextStatus: SeoPageRecord["status"]) => {
    const selectedPages = visiblePages.filter((page) => selectedPageIds.includes(page.id));
    const targetPages = selectedPages.filter((page) => page.status !== nextStatus);
    if (targetPages.length === 0) return;

    setIsBulkSaving(true);
    setError("");
    try {
      await Promise.all(targetPages.map((page) => updateSeoPage(page.id, toUpdatePayload(page, nextStatus))));
      await loadPages();
      setSelectedPageIds([]);
    } catch (err) {
      const message = err instanceof Error ? err.message : `Unable to bulk update to ${nextStatus}`;
      setError(message);
    } finally {
      setIsBulkSaving(false);
    }
  };

  const runBulkDelete = async () => {
  if (selectedPageIds.length === 0) return;

  const shouldDelete = window.confirm(`Delete ${selectedPageIds.length} selected pages?`);
  if (!shouldDelete) return;

  setIsBulkSaving(true);
  setError("");
  
  try {
    // Ek hi baar mein saari IDs bhej rahe hain
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pages/bulk-delete`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: selectedPageIds }), // Body ab empty nahi hai!
    });

    if (!response.ok) throw new Error("Bulk delete failed");

    await loadPages();
    setSelectedPageIds([]);
  } catch (err) {
    setError(err instanceof Error ? err.message : "Unable to bulk delete");
  } finally {
    setIsBulkSaving(false);
  }
};

  const onSavePage = async (_payload: UpsertSeoPagePayload, _pageId?: string) => {
    await loadPages();
  };

  if (activeView === "upload") {
    return (
      <div className={styles.page}>
        <UploadDropzone onBack={() => setActiveView("list")} />
      </div>
    );
  }

  if (activeView === "builder") {
    return (
      <div className={styles.page}>
        <Builder
          pageData={editingPage ?? undefined}
          onBack={() => setActiveView("list")}
          onSave={onSavePage}
        />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className="min-h-screen w-full overflow-x-hidden bg-slate-50 p-3 font-['Sora'] text-slate-900 sm:p-5 lg:p-6">
      <div className="mx-auto w-full max-w-375 min-w-0 space-y-4">
        <header className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Pages</h1>
            <p className="mt-1 text-sm lg:text-base text-slate-600">Manage all your website pages</p>
          </div>

          <div className="flex w-full flex-wrap gap-2 lg:w-auto">
            <button
              onClick={() => void loadPages()}
              className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs sm:text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-100 lg:flex-none"
            >
              <RefreshCw className="h-3.5! w-3.5!" />
              Refresh
            </button>
            <button
              onClick={() => setActiveView("upload")}
              disabled={!canEdit}
              className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs sm:text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-100 lg:flex-none"
            >
              <Upload className="h-3.5! w-3.5!" />
              Upload Pages
            </button>
            <button
              onClick={openCreateBuilder}
              disabled={!canEdit}
              className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 lg:flex-none"
            >
              <Plus className="h-3.5! w-3.5!" />
              Create Page
            </button>
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
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <label className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={visiblePages.length > 0 && visiblePages.every((page) => selectedPageIds.includes(page.id))}
                onChange={toggleSelectAll}
                className="h-4 w-4 rounded border-slate-300"
              />
              Select all visible ({selectedPageIds.length} selected)
            </label>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => void runBulkStatusUpdate("draft")}
                disabled={!canEdit || selectedPageIds.length === 0 || isBulkSaving}
                className="inline-flex h-8 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs sm:text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-slate-100"
              >
                Bulk Draft
              </button>
              <button
                onClick={() => void runBulkStatusUpdate("published")}
                disabled={!canEdit || selectedPageIds.length === 0 || isBulkSaving}
                className="inline-flex h-8 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 px-3 text-xs sm:text-sm font-medium text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-emerald-100"
              >
                Bulk Publish
              </button>
              <button
                onClick={() => void runBulkDelete()}
                disabled={!canDelete || selectedPageIds.length === 0 || isBulkSaving}
                className="inline-flex h-8 items-center justify-center rounded-lg border border-red-200 bg-red-50 px-3 text-xs sm:text-sm font-medium text-red-700 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-red-100"
              >
                Bulk Delete
              </button>
            </div>
          </div>
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
            <label className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 px-3 text-xs sm:text-sm font-medium text-slate-700">
              Show
              <select
                value={itemsPerView}
                onChange={(e) => setItemsPerView(Number(e.target.value) as 50 | 100 | 200)}
                className="h-7 rounded-md border border-slate-200 bg-white px-2 text-xs sm:text-sm outline-none"
              >
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={200}>200</option>
              </select>
              items
            </label>
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
  );
};

PagesManager.getLayout = (page) => <SeoLayout>{page}</SeoLayout>;

export default PagesManager;
