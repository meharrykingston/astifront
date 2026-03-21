"use client";

import React from "react";
import { Copy, ExternalLink, FileText, MoreVertical, Pencil, Trash2 } from "lucide-react";
import type { SeoPageRecord } from "@/types/seoPage";

interface PageListProps {
  pages: SeoPageRecord[];
  selectedPageIds: string[];
  onToggleSelect: (pageId: string) => void;
  onToggleSelectAll: () => void;
  onEdit: (page: SeoPageRecord) => void;
  onDelete: (pageId: string) => void;
}

const statusClasses: Record<SeoPageRecord["status"], string> = {
  published: "border-emerald-200 bg-emerald-50 text-emerald-700",
  draft: "border-slate-200 bg-slate-100 text-slate-700",
};

function RowMenu({ url, onDelete }: { url: string; onDelete: () => void }) {
  const openInNewTab = () => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const copyUrl = async () => {
    try {
      const absoluteUrl = `${window.location.origin}${url}`;
      await navigator.clipboard.writeText(absoluteUrl);
    } catch {
      // no-op
    }
  };

  return (
    <details className="relative">
      <summary
        className="inline-flex h-7 w-7 cursor-pointer list-none items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 sm:h-8 sm:w-8 [&::-webkit-details-marker]:hidden"
        aria-label="More actions"
      >
        <MoreVertical className="h-3.5! w-3.5!" />
      </summary>

      <div className="absolute right-0 z-10 mt-1.5 w-44 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
        <button
          onClick={openInNewTab}
          className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs sm:text-sm text-slate-700 hover:bg-slate-100"
        >
          <ExternalLink className="h-3.5! w-3.5!" />
          Open page
        </button>
        <button
          onClick={copyUrl}
          className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs sm:text-sm text-slate-700 hover:bg-slate-100"
        >
          <Copy className="h-3.5! w-3.5!" />
          Copy URL
        </button>
        <button
          onClick={onDelete}
          className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs sm:text-sm text-red-600 hover:bg-red-50"
        >
          <Trash2 className="h-3.5! w-3.5!" />
          Delete page
        </button>
      </div>
    </details>
  );
}

export default function PageList({
  pages,
  selectedPageIds,
  onToggleSelect,
  onToggleSelectAll,
  onEdit,
  onDelete,
}: PageListProps) {
  const allSelected = pages.length > 0 && pages.every((page) => selectedPageIds.includes(page.id));

  return (
    <section className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white font-['Sora'] shadow-sm">
      <div className="border-b border-slate-100 bg-linear-to-r from-slate-50 via-white to-slate-50 px-4 py-3 sm:px-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 sm:text-base">Page List</h2>
            <p className="text-xs text-slate-500 sm:text-sm">{pages.length} visible page{pages.length === 1 ? "" : "s"}</p>
          </div>
          <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
            {selectedPageIds.length} selected
          </span>
        </div>
      </div>

      <div className="hidden border-b border-slate-100 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 lg:grid lg:grid-cols-[0.5fr_2.6fr_1fr_2fr_1.2fr_1fr_1fr] lg:gap-3">
        <label className="inline-flex items-center justify-center">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={onToggleSelectAll}
            aria-label="Select all pages"
            className="h-4 w-4 rounded border-slate-300"
          />
        </label>
        <span>Page</span>
        <span>Status</span>
        <span>Keywords</span>
        <span>Metrics</span>
        <span>Updated</span>
        <span className="text-right">Actions</span>
      </div>

      <div className="divide-y divide-slate-100">
        {pages.length === 0 && (
          <div className="px-4 py-12 text-center">
            <p className="text-sm font-medium text-slate-700">No pages found</p>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">Try changing filters or search keywords.</p>
          </div>
        )}

        {pages.map((page) => {
          const isSelected = selectedPageIds.includes(page.id);
          const safeTitle = page.titleTag || "Untitled page";
          const safeUrl = page.url || "/";
          const safeAuthor = page.author || "SEO Team";
          const safeTargetKeyword = page.targetKeyword || "";
          const safeMetaKeywords = String(page.metaTag || "")
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
          const safePlacementKeywords = (page.keywordPlacement || [])
            .map((item) => String(item || "").trim())
            .filter(Boolean);
          const allKeywords = [...new Set([safeTargetKeyword, ...safeMetaKeywords, ...safePlacementKeywords].filter(Boolean))];
          const safeViews = Number.isFinite(Number(page.views)) ? Number(page.views) : 0;
          const safeStatus: SeoPageRecord["status"] = page.status === "published" ? "published" : "draft";
          const safeDate = page.updatedAt ? new Date(page.updatedAt).toISOString().slice(0, 10) : "-";

          return (
            <div key={page.id} className="p-3 sm:p-4 lg:px-4 lg:py-3">
              <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-sm transition hover:border-slate-200 hover:shadow-md lg:hidden">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex min-w-0 items-start gap-2">
                    <label className="mt-0.5 inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect(page.id)}
                        aria-label={`Select ${safeTitle}`}
                        className="h-4 w-4 rounded border-slate-300"
                      />
                    </label>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        
                        <a
                          href={safeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="truncate text-sm font-semibold text-slate-900 hover:text-blue-700 hover:underline"
                        >
                          {safeTitle}
                        </a>
                      </div>
                      <p className="mt-1 truncate font-mono text-xs text-slate-500">{safeUrl}</p>
                    </div>
                  </div>

                  <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${statusClasses[safeStatus]}`}>
                    {safeStatus}
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap gap-1">
                  {allKeywords.length === 0 ? (
                    <span className="text-xs text-slate-500">Keywords: -</span>
                  ) : (
                    allKeywords.slice(0, 6).map((keyword) => (
                      <span
                        key={`${page.id}-m-${keyword}`}
                        className="inline-flex max-w-full truncate rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700"
                      >
                        {keyword}
                      </span>
                    ))
                  )}
                </div>

                <div className="mt-2 grid grid-cols-2 gap-1 text-xs text-slate-600 sm:text-sm">
                  <span className="truncate">Author: {safeAuthor}</span>
                  <span>Views: {safeViews.toLocaleString()}</span>
                  <span>Date: {safeDate}</span>
                  <span className="truncate">Target: {safeTargetKeyword || "-"}</span>
                </div>

                <div className="mt-3 flex items-center justify-end gap-1.5">
                  <button
                    onClick={() => onEdit(page)}
                    className="inline-flex h-7 items-center gap-1 rounded-lg border border-slate-200 px-2.5 text-xs font-medium text-slate-700 hover:bg-slate-100 sm:h-8 sm:text-sm"
                  >
                    <Pencil className="h-3.5! w-3.5!" />
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(page.id)}
                    className="inline-flex h-7 items-center gap-1 rounded-lg border border-red-200 px-2.5 text-xs font-medium text-red-600 hover:bg-red-50 sm:h-8 sm:text-sm"
                  >
                    <Trash2 className="h-3.5! w-3.5!" />
                    Delete
                  </button>
                  <RowMenu url={safeUrl} onDelete={() => onDelete(page.id)} />
                </div>
              </div>

              <div className="hidden lg:grid lg:grid-cols-[0.5fr_2.6fr_1fr_2fr_1.2fr_1fr_1fr] lg:items-center lg:gap-3">
                <label className="inline-flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(page.id)}
                    aria-label={`Select ${safeTitle}`}
                    className="h-4 w-4 rounded border-slate-300"
                  />
                </label>

                <div className="min-w-0">
                  <div className="flex min-w-0 items-center gap-2">
                    
                    <a
                      href={safeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="truncate text-sm font-semibold text-slate-900 hover:text-blue-700 hover:underline"
                    >
                      {safeTitle}
                    </a>
                  </div>
                  <p className="mt-1 truncate font-mono text-xs text-slate-500">{safeUrl}</p>
                </div>

                <span className={`inline-flex w-fit rounded-full border px-2 py-0.5 text-xs font-semibold ${statusClasses[safeStatus]}`}>
                  {safeStatus}
                </span>

                <div className="flex flex-wrap gap-1">
                  {allKeywords.length === 0 ? (
                    <span className="text-xs text-slate-500">-</span>
                  ) : (
                    allKeywords.slice(0, 3).map((keyword) => (
                      <span
                        key={`${page.id}-d-${keyword}`}
                        className="inline-flex max-w-40 truncate rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700"
                      >
                        {keyword}
                      </span>
                    ))
                  )}
                </div>

                <div className="min-w-0 text-xs text-slate-600 sm:text-sm">
                  <p className="truncate">{safeAuthor}</p>
                  <p className="truncate">{safeViews.toLocaleString()} views</p>
                </div>

                <p className="text-xs text-slate-700 sm:text-sm">{safeDate}</p>

                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => onEdit(page)}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 sm:h-8 sm:w-8"
                    aria-label="Edit page"
                  >
                    <Pencil className="h-3.5! w-3.5!" />
                  </button>
                  <button
                    onClick={() => onDelete(page.id)}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50 sm:h-8 sm:w-8"
                    aria-label="Delete page"
                  >
                    <Trash2 className="h-3.5! w-3.5!" />
                  </button>
                  <RowMenu url={safeUrl} onDelete={() => onDelete(page.id)} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
