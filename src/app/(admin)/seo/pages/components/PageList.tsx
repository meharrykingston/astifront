"use client";

import React from 'react';
import { FileText, Edit, Trash2 } from 'lucide-react';

interface PageListProps {
  pages: any[];
  onEdit: (page: any) => void;
}

const PageList: React.FC<PageListProps> = ({ pages, onEdit }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm w-full overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-slate-100">
        <h2 className="text-base font-semibold text-slate-900">All Pages</h2>
      </div>

      <div className="w-full">
        {/* --- MOBILE VIEW (Vertical Stacked Cards) --- */}
        <div className="block md:hidden divide-y divide-slate-100">
          {pages.map((page) => (
            <div key={page.id} className="p-4 flex flex-col gap-3 hover:bg-slate-50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <FileText className="w-4! h-4! shrink-0" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-slate-900 truncate">{page.title}</p>
                    <p className="text-[11px] text-slate-500 truncate">{page.path}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                  page.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {page.status}
                </span>
              </div>
              
              <div className="flex justify-end gap-2 mt-2 pt-3 border-t border-slate-100">
                <button 
                  onClick={() => onEdit(page)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-medium transition-colors"
                >
                  <Edit className="w-3! h-3! shrink-0" /> Edit
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded text-[11px] font-medium transition-colors">
                  <Trash2 className="w-3! h-3! shrink-0" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* --- DESKTOP VIEW (Professional Table) --- */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-175">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="py-3 px-5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">Page Name</th>
                <th className="py-3 px-5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">Path</th>
                <th className="py-3 px-5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">Status</th>
                <th className="py-3 px-5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">Last Modified</th>
                <th className="py-3 px-5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pages.map((page) => (
                <tr key={page.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4! h-4! text-slate-400 shrink-0" />
                      <span className="text-[13px] font-medium text-slate-900">{page.title}</span>
                    </div>
                  </td>
                  <td className="py-3 px-5 text-[13px] text-slate-500 font-mono">{page.path}</td>
                  <td className="py-3 px-5">
                    <span className={`inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      page.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {page.status}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-[13px] text-slate-500">{page.lastModified}</td>
                  <td className="py-3 px-5 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onEdit(page)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      >
                        <Edit className="w-4! h-4! shrink-0" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                        <Trash2 className="w-4! h-4! shrink-0" />
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
};

export default PageList;