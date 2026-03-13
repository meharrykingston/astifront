"use client";
import React from 'react';
import { 
  BarChart3, 
  FileText, 
  AlertCircle, 
  MousePointer2, 
  TrendingUp,
  Search,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  CheckCircle2,
  XCircle
} from 'lucide-react';

export default function SEODashboard() {
  
  const gscMetrics = [
    { label: 'Total Clicks', value: '124.5K', change: '+12%', icon: MousePointer2, color: 'text-indigo-600' },
    { label: 'Total Impressions', value: '3.2M', change: '+5%', icon: BarChart3, color: 'text-blue-600' },
    { label: 'Avg. Position', value: '14.2', change: '-0.8', icon: Search, color: 'text-emerald-600' },
    { label: 'Ranking Keywords', value: '8,420', change: '+210', icon: TrendingUp, color: 'text-violet-600' },
  ];

  return (
    <div className="max-w-400 mx-auto space-y-6 pb-10 px-4">
      
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6 mt-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Search Intelligence</h1>
          <p className="text-sm text-gray-400 font-medium italic">Astikan Healthcare Analytics Engine</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-2xl text-xs font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 shrink-0 uppercase tracking-widest">
          {/* ICON CAGE */}
          <div className="w-4 h-4 flex items-center justify-center shrink-0">
             <RefreshCw size={14} />
          </div>
          Sync GSC Data
        </button>
      </div>

      {/* 2. Top GSC Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {gscMetrics.map((stat) => (
          <div key={stat.label} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm transition-all group">
            <div className="flex items-center justify-between mb-4">
              {/* ICON CAGE */}
              <div className={`w-10 h-10 flex items-center justify-center bg-gray-50 ${stat.color} rounded-2xl shrink-0 border border-gray-50`}>
                <stat.icon size={18} strokeWidth={2.5} className="shrink-0" />
              </div>
              <div className={`flex items-center gap-1 text-[11px] font-black ${stat.change.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
                {stat.change}
                {/* ICON CAGE */}
                <div className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                   {stat.change.startsWith('+') ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                </div>
              </div>
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
            <p className="text-2xl font-black text-gray-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* 3. Status & Health (Enhanced Visibility Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Active Pages */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm border-b-4 border-b-emerald-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
              <CheckCircle2 size={18} className="shrink-0" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Active Pages</span>
          </div>
          <p className="text-4xl font-black text-gray-900 tracking-tighter leading-none">1,024,000</p>
          <p className="text-[11px] font-bold text-emerald-600 mt-2">Live on Google</p>
        </div>

        {/* Inactive Pages */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm border-b-4 border-b-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center shrink-0 border border-slate-100">
              <XCircle size={18} className="shrink-0" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Inactive Pages</span>
          </div>
          <p className="text-4xl font-black text-slate-400 tracking-tighter leading-none">216,000</p>
          <p className="text-[11px] font-bold text-slate-400 mt-2 text-balance leading-tight">Crawled - Not Indexed</p>
        </div>

        {/* 404 Pages */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm border-b-4 border-b-rose-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0 border border-rose-100">
              <AlertCircle size={18} className="shrink-0" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Crawl Errors</span>
          </div>
          <p className="text-4xl font-black text-rose-600 tracking-tighter leading-none">2,840</p>
          <p className="text-[11px] font-bold text-rose-500 mt-2">404 Pages Found</p>
        </div>

        {/* Blogs */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm border-b-4 border-b-indigo-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
              <FileText size={18} className="shrink-0" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Medical Blogs</span>
          </div>
          <p className="text-4xl font-black text-gray-900 tracking-tighter leading-none">4,520</p>
          <p className="text-[11px] font-bold text-indigo-600 mt-2">Published Articles</p>
        </div>

      </div>

      {/* 4. Footer Keywords Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
            <div className="w-4 h-4 flex items-center justify-center shrink-0">
               <Globe size={14} />
            </div>
            Device Distribution
          </h3>
          <div className="flex gap-4 h-4 rounded-full overflow-hidden bg-gray-50 border border-gray-100">
            <div className="bg-indigo-600 w-[65%]" />
            <div className="bg-indigo-300 w-[25%]" />
            <div className="bg-gray-200 w-[10%]" />
          </div>
          <div className="grid grid-cols-3 mt-6">
            <div><p className="text-[10px] font-black text-gray-400 uppercase">Mobile</p><p className="text-lg font-bold">65%</p></div>
            <div><p className="text-[10px] font-black text-gray-400 uppercase">Desktop</p><p className="text-lg font-bold">25%</p></div>
            <div><p className="text-[10px] font-black text-gray-400 uppercase">Tablet</p><p className="text-lg font-bold">10%</p></div>
          </div>
        </div>

        <div className="bg-slate-950 text-white rounded-3xl p-8 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Top Performing Keywords</h3>
            <div className="w-4 h-4 flex items-center justify-center shrink-0 text-emerald-400">
               <TrendingUp size={16} />
            </div>
          </div>
          <div className="space-y-4">
            {[
              { kw: 'Acute Migraine', pos: '#1' },
              { kw: 'Health Remedies', pos: '#3' },
              { kw: 'Astikan Health', pos: '#1' },
            ].map((k, i) => (
              <div key={i} className="flex items-center justify-between p-3.5 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-colors">
                <span className="text-sm font-bold truncate pr-4">{k.kw}</span>
                <span className="text-[10px] font-black bg-indigo-600 px-2 py-1 rounded-lg shrink-0">{k.pos}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}