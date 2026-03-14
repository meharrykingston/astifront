"use client";

import React from 'react';
import { FileText, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import type { SeoPage } from '../page';

interface PageListProps {
  pages: SeoPage[];
  onEdit: (page: SeoPage) => void;
  onDelete: (pageId: number) => void;
}

const statusClasses: Record<SeoPage['status'], string> = {
  published: 'bg-emerald-100 text-emerald-700',
  draft: 'bg-slate-200 text-slate-700',
  scheduled: 'bg-amber-100 text-amber-700',
};

export default function PageList({ pages, onEdit, onDelete }: PageListProps) {
  return (
    <section className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white font-['Sora'] shadow-sm">
      <div className="hidden border-b border-slate-100 px-4 py-3 text-xs sm:text-sm font-semibold text-slate-500 md:grid md:grid-cols-[2.1fr_1.2fr_1.2fr_1.5fr_1fr_1.4fr_0.7fr] md:gap-3">
        <span>Title</span>
        <span>Slug</span>
        <span>Status</span>
        <span>Author</span>
        <span className="text-right">Views</span>
        <span>Last Modified</span>
        <span className="text-right">Actions</span>
      </div>

      <div className="divide-y divide-slate-100">
        {pages.length === 0 && (
          <div className="px-4 py-8 text-center text-xs sm:text-sm text-slate-500">No pages found for current filters.</div>
        )}

        {pages.map((page) => (
          <div key={page.id} className="px-3 py-3 sm:px-4 md:px-4 md:py-0">
            <div className="grid gap-2 md:hidden">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <FileText className="h-3.5! w-3.5! text-slate-400" />
                    <p className="truncate text-xs sm:text-sm font-semibold text-slate-900">{page.title}</p>
                  </div>
                  <p className="mt-1 truncate font-mono text-xs sm:text-sm text-slate-500">{page.slug}</p>
                </div>
                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs sm:text-sm font-semibold ${statusClasses[page.status]}`}>
                  {page.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-1 text-xs sm:text-sm text-slate-600">
                <span>Author: {page.author}</span>
                <span>Views: {page.views.toLocaleString()}</span>
                <span>Date: {page.lastModified}</span>
              </div>

              <div className="mt-1 flex items-center justify-end gap-1">
                <button
                  onClick={() => onEdit(page)}
                  className="inline-flex h-7 items-center gap-1 rounded-lg border border-slate-200 px-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  <Pencil className="h-3.5! w-3.5!" />
                  Edit
                </button>
                <button
                  onClick={() => onDelete(page.id)}
                  className="inline-flex h-7 items-center gap-1 rounded-lg border border-red-200 px-2 text-xs sm:text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-3.5! w-3.5!" />
                  Delete
                </button>
              </div>
            </div>

            <div className="hidden md:grid md:grid-cols-[2.1fr_1.2fr_1.2fr_1.5fr_1fr_1.4fr_0.7fr] md:items-center md:gap-3 md:px-0 md:py-3">
              <div className="flex min-w-0 items-center gap-2">
                <FileText className="h-3.5! w-3.5! shrink-0 text-slate-400" />
                <p className="truncate text-xs sm:text-sm font-semibold text-slate-900">{page.title}</p>
              </div>
              <p className="truncate font-mono text-xs sm:text-sm text-slate-600">{page.slug}</p>
              <span className={`inline-flex w-fit rounded-full px-2 py-0.5 text-xs sm:text-sm font-semibold ${statusClasses[page.status]}`}>
                {page.status}
              </span>
              <p className="truncate text-xs sm:text-sm text-slate-700">{page.author}</p>
              <p className="text-right text-xs sm:text-sm text-slate-700">{page.views.toLocaleString()}</p>
              <p className="text-xs sm:text-sm text-slate-700">{page.lastModified}</p>

              <div className="flex items-center justify-end gap-1">
                <button
                  onClick={() => onEdit(page)}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100"
                  aria-label="Edit page"
                >
                  <Pencil className="h-3.5! w-3.5!" />
                </button>
                <button
                  onClick={() => onDelete(page.id)}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100"
                  aria-label="Delete page"
                >
                  <Trash2 className="h-3.5! w-3.5!" />
                </button>
                <button
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100"
                  aria-label="More actions"
                >
                  <MoreVertical className="h-3.5! w-3.5!" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


