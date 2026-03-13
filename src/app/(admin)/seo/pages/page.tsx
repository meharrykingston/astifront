"use client";
import React from 'react';
import { 
  Plus, 
  Upload, 
  Search, 
  Filter, 
  MoreHorizontal, 
  ExternalLink, 
  FileText,
  CheckCircle2,
  Clock
} from 'lucide-react';

export default function PagesManager() {
  
  const pageData = [
    { title: "Acute Migraine Symptoms", slug: "/symptoms/acute-migraine", status: "Active", type: "pSEO", date: "Mar 12, 2026" },
    { title: "Best Remedies for Back Pain", slug: "/symptoms/back-pain-relief", status: "Active", type: "pSEO", date: "Mar 11, 2026" },
    { title: "Understanding Viral Fever", slug: "/symptoms/viral-fever", status: "Pending", type: "Blog", date: "Mar 10, 2026" },
  ];

  return (
    <div className="space-y-6">
      
      {/* 1. Top Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* BIG SEARCH INPUT */}
        <div className="relative w-full md:max-w-xl group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-gray-400 group-focus-within:text-indigo-600 transition-colors shrink-0">
            <Search size={16} strokeWidth={2.5} />
          </div>
          <input 
            type="text" 
            placeholder="Search through 1.2M pages (by title or slug)..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl text-sm font-bold shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all"
          />
        </div>

        {/* BUTTONS */}
        <div className="flex items-center gap-3 shrink-0">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-gray-200 text-gray-700 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm">
            <div className="w-4 h-4 flex items-center justify-center shrink-0">
               <Upload size={14} strokeWidth={2.5} />
            </div>
            Upload Page
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
            <div className="w-4 h-4 flex items-center justify-center shrink-0">
               <Plus size={14} strokeWidth={3} />
            </div>
            Create Page
          </button>
        </div>
      </div>

      {/* 2. Page List Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Live Indexing Inventory</h3>
          <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:bg-gray-50 rounded-lg transition-colors shrink-0">
            <Filter size={16} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Page Name</th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Last Updated</th>
                <th className="px-8 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pageData.map((page, i) => (
                <tr key={i} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                        <FileText size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 leading-tight">{page.title}</p>
                        <p className="text-[11px] font-medium text-gray-400 mt-0.5">{page.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 flex items-center justify-center shrink-0">
                        {page.status === 'Active' ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Clock size={14} className="text-amber-500" />}
                      </div>
                      <span className={`text-[11px] font-black uppercase tracking-tighter ${page.status === 'Active' ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {page.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-xs font-bold text-gray-500">{page.type}</td>
                  <td className="px-8 py-5 text-xs font-bold text-gray-400">{page.date}</td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-gray-300 hover:text-indigo-600 transition-colors shrink-0">
                        <ExternalLink size={16} />
                      </button>
                      <button className="p-2 text-gray-300 hover:text-gray-600 transition-colors shrink-0">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}