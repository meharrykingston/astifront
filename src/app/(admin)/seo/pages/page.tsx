"use client";

import React, { useMemo, useState } from 'react';
import {
  Filter,
  Plus,
  Search,
  SlidersHorizontal,
  Upload,
} from 'lucide-react';
import PageList from './components/PageList';
import UploadDropzone from './components/UploadDropzone';
import Builder from './components/Builder';

export type SeoPage = {
  id: number;
  title: string;
  slug: string;
  status: 'published' | 'draft' | 'scheduled';
  author: string;
  views: number;
  lastModified: string;
};

const seedPages: SeoPage[] = [
  { id: 1, title: 'Homepage', slug: '/', status: 'published', author: 'John Doe', views: 45678, lastModified: '2026-03-13' },
  { id: 2, title: 'About Us', slug: '/about', status: 'published', author: 'Jane Smith', views: 12345, lastModified: '2026-03-12' },
  { id: 3, title: 'Contact', slug: '/contact', status: 'published', author: 'John Doe', views: 8901, lastModified: '2026-03-10' },
  { id: 4, title: 'Services Overview', slug: '/services', status: 'published', author: 'Jane Smith', views: 23456, lastModified: '2026-03-09' },
  { id: 5, title: 'Pricing Plans', slug: '/pricing', status: 'draft', author: 'John Doe', views: 0, lastModified: '2026-03-08' },
  { id: 6, title: 'Blog Landing', slug: '/blog', status: 'published', author: 'Jane Smith', views: 34567, lastModified: '2026-03-07' },
  { id: 7, title: 'Product Features', slug: '/features', status: 'published', author: 'John Doe', views: 19876, lastModified: '2026-03-06' },
  { id: 8, title: 'Help Center', slug: '/help', status: 'scheduled', author: 'Priya Mehta', views: 0, lastModified: '2026-03-14' },
];

export default function PagesManager() {
  const [activeView, setActiveView] = useState<'list' | 'upload' | 'builder'>('list');
  const [editingPage, setEditingPage] = useState<SeoPage | null>(null);
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | SeoPage['status']>('all');
  const [authorFilter, setAuthorFilter] = useState<'all' | string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'views_desc' | 'views_asc' | 'title_asc'>('recent');
  const [pages, setPages] = useState<SeoPage[]>(seedPages);

  const authors = useMemo(() => ['all', ...new Set(pages.map((p) => p.author))], [pages]);

  const filteredPages = useMemo(() => {
    let result = [...pages];

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (p) => p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q) || p.author.toLowerCase().includes(q),
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter((p) => p.status === statusFilter);
    }

    if (authorFilter !== 'all') {
      result = result.filter((p) => p.author === authorFilter);
    }

    result.sort((a, b) => {
      if (sortBy === 'views_desc') return b.views - a.views;
      if (sortBy === 'views_asc') return a.views - b.views;
      if (sortBy === 'title_asc') return a.title.localeCompare(b.title);
      return b.lastModified.localeCompare(a.lastModified);
    });

    return result;
  }, [pages, query, statusFilter, authorFilter, sortBy]);

  const openCreateBuilder = () => {
    setEditingPage(null);
    setActiveView('builder');
  };

  const onDeletePage = (pageId: number) => {
    setPages((prev) => prev.filter((page) => page.id !== pageId));
  };

  if (activeView === 'upload') {
    return <UploadDropzone onBack={() => setActiveView('list')} />;
  }

  if (activeView === 'builder') {
    return <Builder pageData={editingPage ?? undefined} onBack={() => setActiveView('list')} />;
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-50 p-3 font-['Sora'] text-slate-900 sm:p-5 lg:p-6">
      <div className="mx-auto w-full max-w-375 min-w-0 space-y-4">
        <header className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Pages</h1>
            <p className="mt-1 text-sm lg:text-base text-slate-600">Manage all your website pages</p>
          </div>

          <div className="flex w-full flex-wrap gap-2 lg:w-auto">
            <button
              onClick={() => setActiveView('upload')}
              className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs sm:text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-100 lg:flex-none"
            >
              <Upload className="h-3.5! w-3.5!" />
              Upload Pages
            </button>
            <button
              onClick={openCreateBuilder}
              className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 lg:flex-none"
            >
              <Plus className="h-3.5! w-3.5!" />
              Create Page
            </button>
          </div>
        </header>

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
                  onChange={(e) => setStatusFilter(e.target.value as 'all' | SeoPage['status'])}
                  className="mt-1 h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs sm:text-sm"
                >
                  <option value="all">All statuses</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
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
                      {author === 'all' ? 'All authors' : author}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-xs sm:text-sm font-medium text-slate-600">
                Sort By
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'recent' | 'views_desc' | 'views_asc' | 'title_asc')}
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
                  setStatusFilter('all');
                  setAuthorFilter('all');
                  setSortBy('recent');
                }}
                className="inline-flex h-8 items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                <SlidersHorizontal className="h-3.5! w-3.5!" />
                Reset
              </button>
            </div>
          )}
        </section>

        <PageList
          pages={filteredPages}
          onEdit={(page) => {
            setEditingPage(page);
            setActiveView('builder');
          }}
          onDelete={onDeletePage}
        />
      </div>
    </div>
  );
}


