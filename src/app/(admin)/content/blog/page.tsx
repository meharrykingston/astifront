"use client";
import React, { useState } from 'react';
import { 
  Type, Image as ImageIcon, Link as LinkIcon, 
  MoreVertical, Save, Globe, Calendar,
  User, Tag, Eye, CheckCircle2
} from 'lucide-react';

export default function BlogEditor() {
  const [status, setStatus] = useState('Draft');

  return (
    <div className="max-w-7xl mx-auto px-4 pb-20">
      {/* Top Action Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-lg border border-amber-100">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
            <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest">{status}</span>
          </div>
          <span className="text-xs text-gray-400 font-medium">Last autosave: 17:22</span>
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-xl transition-all text-xs font-bold uppercase tracking-tight">
            <div className="w-4 h-4 flex items-center justify-center shrink-0"><Eye size={16} /></div>
            Preview
          </button>
          <button className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 text-xs uppercase tracking-tight">
            <div className="w-4 h-4 flex items-center justify-center shrink-0"><Globe size={16} /></div>
            Publish
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Writing Area */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 md:p-12 rounded-[2.5rem] border border-gray-200 shadow-sm min-h-175 flex flex-col">
            {/* Title */}
            <textarea 
              placeholder="Enter article title..."
              className="w-full text-3xl md:text-5xl font-black placeholder:text-gray-100 border-none outline-none resize-none mb-8 leading-tight text-gray-900"
              rows={1}
            />

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 mb-10 p-1.5 bg-gray-50 rounded-2xl w-fit border border-gray-100/50">
              {[
                { icon: Type, label: 'Text' },
                { icon: ImageIcon, label: 'Media' },
                { icon: LinkIcon, label: 'Link' }
              ].map((tool, i) => (
                <button key={i} className="p-2.5 hover:bg-white hover:shadow-sm rounded-xl text-gray-500 hover:text-blue-600 transition-all">
                  <div className="w-5 h-5 flex items-center justify-center shrink-0">
                    <tool.icon size={18} />
                  </div>
                </button>
              ))}
              <div className="w-px h-5 bg-gray-200 mx-2"></div>
              {['H1', 'H2', 'Quote'].map((text) => (
                <button key={text} className="px-3 py-1.5 text-[10px] font-black text-gray-400 hover:text-blue-600 uppercase tracking-tighter">
                  {text}
                </button>
              ))}
            </div>

            {/* Body Editor */}
            <textarea 
              placeholder="Begin writing medical content..."
              className="flex-1 w-full text-lg text-gray-700 placeholder:text-gray-200 border-none outline-none resize-none leading-relaxed font-medium"
            />
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 font-black text-[10px] uppercase tracking-[0.2em] text-gray-400">
              Post Settings
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-500 uppercase flex items-center gap-2">
                  <div className="w-4 h-4 flex items-center justify-center text-blue-500"><User size={14} /></div>
                  Author
                </label>
                <select className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none cursor-pointer">
                  <option>Dr. Rahul (Medical Lead)</option>
                  <option>Kaushalendra (Admin)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-500 uppercase flex items-center gap-2">
                  <div className="w-4 h-4 flex items-center justify-center text-blue-500"><Tag size={14} /></div>
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Symptoms', 'Healthcare'].map(tag => (
                    <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase rounded-lg border border-slate-200">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SEO Checklist */}
          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-5">Integrity Check</h4>
            <div className="space-y-4">
              {[
                { label: 'Primary Keywords in H1', checked: true },
                { label: 'Alt Text on Images', checked: false },
                { label: 'Readability Score', checked: true }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 border ${item.checked ? 'bg-blue-500 border-blue-500' : 'border-slate-700'}`}>
                    {item.checked && <CheckCircle2 size={12} strokeWidth={3} />}
                  </div>
                  <span className={`text-xs font-medium ${item.checked ? 'text-slate-300' : 'text-slate-100'}`}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}