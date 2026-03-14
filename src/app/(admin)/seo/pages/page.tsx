"use client";

import React, { useState } from 'react';
import PageList from './components/PageList';
import UploadDropzone from './components/UploadDropzone';
import Builder from './components/Builder';
import { Search, Plus, UploadCloud, Map } from 'lucide-react';

export default function PagesManager() {
  const [activeView, setActiveView] = useState<'list' | 'upload' | 'builder'>('list');
  const [editingPage, setEditingPage] = useState<any>(null);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans overflow-x-hidden w-full p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto w-full space-y-6">
        
        {/* HEADER - Only show if not in Builder mode for cleaner space */}
        {activeView !== 'builder' && (
          <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="relative w-full lg:max-w-md shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4! h-4! text-slate-400 shrink-0" />
              <input type="text" placeholder="Search pages..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 shadow-sm outline-none" />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              <button onClick={() => setActiveView('upload')} className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-[13px] font-medium hover:bg-slate-50 transition-colors shadow-sm">
                <UploadCloud className="w-4! h-4! shrink-0" /> Upload
              </button>
              <button onClick={() => { setEditingPage(null); setActiveView('builder'); }} className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-[13px] font-medium hover:bg-blue-700 transition-colors shadow-sm">
                <Plus className="w-4! h-4! shrink-0" /> Create Page
              </button>
            </div>
          </header>
        )}

        {/* DYNAMIC VIEW RENDERER */}
        <main className="w-full">
          {activeView === 'list' && (
            <PageList 
              pages={[{ id: 1, title: 'Sample Page', path: '/sample', status: 'Published', lastModified: 'Today' }]} 
              onEdit={(page) => { setEditingPage(page); setActiveView('builder'); }} 
            />
          )}
          {activeView === 'upload' && <UploadDropzone onBack={() => setActiveView('list')} />}
          {activeView === 'builder' && <Builder pageData={editingPage} onBack={() => setActiveView('list')} />}
        </main>
      </div>
    </div>
  );
}