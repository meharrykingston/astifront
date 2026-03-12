"use client";
import React from 'react';
import {
  TrendingUp,
  MousePointer2,
  Eye,
  Target,
  CheckCircle,
  Clock,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Calendar,
  ChevronDown,
  AlertCircle
} from 'lucide-react';

export default function SEODashboard() {
 
  const stats = [
    { label: 'Total Impressions', value: '4.2M', growth: '+12.5%', icon: Eye, color: 'text-gray-900', bg: 'bg-gray-100' },
    { label: 'Total Clicks', value: '89.2K', growth: '+8.2%', icon: MousePointer2, color: 'text-gray-900', bg: 'bg-gray-100' },
    { label: 'Avg. Position', value: '14.2', growth: '-1.4', icon: Target, color: 'text-gray-900', bg: 'bg-gray-100' },
    { label: 'Avg. CTR', value: '2.1%', growth: '+0.4%', icon: TrendingUp, color: 'text-gray-900', bg: 'bg-gray-100' },
  ];

  
  const indexingData = [
    { status: 'Indexed', count: '420,000', color: 'bg-black', description: 'Pages live on Google' },
    { status: 'Crawled - Not Indexed', count: '380,000', color: 'bg-gray-400', description: 'Google knows, but hasn\'t listed' },
    { status: 'Discovered - Not Indexed', count: '200,000', color: 'bg-gray-200', description: 'Google found the links' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 pb-10 px-4 sm:px-6 lg:px-8 bg-white min-h-screen">

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-black tracking-tight">SEO Performance</h1>
          <p className="text-sm sm:text-base text-gray-500 font-medium italic">Real-time monitoring for 1M+ symptom pages.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <button className="flex items-center justify-between w-full md:w-60 h-14 bg-white border border-black px-3 rounded-2xl hover:bg-black hover:text-white transition-all shadow-sm group shrink-0">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200 overflow-hidden group-hover:bg-gray-800">
                <Calendar size={18} className="text-gray-600 group-hover:text-white transition-colors shrink-0" />
              </div>

              <div className="flex flex-col items-start justify-center leading-none">
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1 group-hover:text-gray-300">Range</span>
                <span className="text-sm sm:text-sm font-bold text-black whitespace-nowrap truncate group-hover:text-white">Last 28 Days</span>
              </div>
            </div>

            <div className="w-8 h-8 flex items-center justify-center shrink-0">
              <ChevronDown size={14} className="text-gray-400 group-hover:text-white transition-colors shrink-0" />
            </div>
          </button>
        </div>
      </div>

      {/* Analytics Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-gray-200 shadow-sm hover:border-black transition-all">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0 border border-gray-200`}>
                <stat.icon size={18} className="sm:w-5 sm:h-5" />
              </div>
              <span className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg border ${stat.growth.startsWith('+') ? 'bg-black text-white border-black' : 'bg-white text-black border-black'}`}>
                {stat.growth}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 font-medium truncate">{stat.label}</p>
            <p className="text-xl sm:text-2xl font-bold text-black mt-0.5 sm:mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Indexing Section */}
      <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-black shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <h3 className="font-bold text-lg sm:text-xl text-black flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-black text-white rounded-lg sm:rounded-xl flex items-center justify-center shrink-0">
              <CheckCircle size={18} className="sm:w-5 sm:h-5" />
            </div>
            <span>Indexing Coverage</span>
          </h3>

          <button className="inline-flex items-center self-start sm:self-center gap-2 px-3 py-2 bg-white text-black rounded-xl hover:bg-black hover:text-white transition-all border border-black shrink-0">
            <div className="w-5 h-5 flex items-center justify-center shrink-0">
              <AlertCircle size={16} strokeWidth={2.5} />
            </div>
            <span className="text-[10px] sm:text-xs font-black whitespace-nowrap tracking-wide sm:tracking-widest uppercase">
              Sitemap Errors
            </span>
            <ExternalLink size={14} />
          </button>
        </div>

        {/* Grayscale distribution bar */}
        <div className="h-3 sm:h-3.5 w-full bg-gray-100 rounded-full flex overflow-hidden mb-6 sm:mb-8 border border-gray-200">
          <div className="h-full bg-black w-[42%]" />
          <div className="h-full bg-gray-400 w-[38%]" />
          <div className="h-full bg-gray-200 w-[20%]" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-8">
          {indexingData.map((data) => (
            <div key={data.status}>
              <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                <div className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${data.color} border border-black/10`} />
                <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider">{data.status}</span>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-black leading-none mb-0.5 sm:mb-1">{data.count}</p>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">{data.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Lower Dashboard Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <div className="bg-white rounded-2xl sm:rounded-3xl border-2 border-black shadow-sm overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-gray-200 bg-gray-50 flex items-center gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center shrink-0 text-white bg-black rounded-lg">
              <AlertTriangle size={18} className="sm:w-5 sm:h-5" />
            </div>
            <h4 className="font-bold text-black text-sm sm:text-base">Critical Alerts</h4>
          </div>
          <div className="p-5 sm:p-6">
            <div className="flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white border-l-4 border-black items-start shadow-sm">
              <div className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 text-black shrink-0">
                <Clock size={16} className="sm:w-4 sm:h-4" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-black uppercase tracking-tight">404 Errors Spiked</p>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1 font-medium">2.4k pages returned 404 in the last 24 hours.</p>
              </div>
            </div>
          </div>
        </div>

        {/* pSEO Performance by Template */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 sm:p-6 border-b border-gray-200 bg-gray-50 font-bold text-black flex items-center gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center shrink-0 text-black bg-gray-200 rounded-lg">
              <TrendingUp size={18} className="sm:w-5 sm:h-5" />
            </div>
            <span className="text-sm sm:text-base">Top pSEO Templates</span>
          </div>
          <div className="divide-y divide-gray-100 flex-1">
            {['Symptom Guide', 'Condition Deep Dive', 'Doctor Discovery'].map((name) => (
              <div key={name} className="p-4 sm:p-5 flex items-center justify-between hover:bg-black hover:text-white transition-all cursor-pointer group">
                <span className="font-semibold text-gray-800 group-hover:text-white transition-colors text-sm sm:text-base truncate pr-2">{name}</span>
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <span className="text-[10px] sm:text-xs font-bold text-black bg-gray-100 group-hover:bg-white/20 group-hover:text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg border border-gray-200 transition-colors whitespace-nowrap">42.1k clicks</span>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full text-gray-300 group-hover:text-white transition-all">
                    <ChevronRight size={16} className="sm:w-4.5 sm:h-4.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}