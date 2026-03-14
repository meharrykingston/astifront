import React from 'react';
import { 
  FileCheck, 
  FileX, 
  BookOpenCheck, 
  BookX, 
  KeyRound, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight,
  Search
} from 'lucide-react';

// --- MOCK DATA (Using Lucide Icons) ---
const gscMetrics = [
  { title: 'Active Pages', value: '1,240', subtext: 'Indexed & Traffic > 0', change: '+5.2%', positive: true, icon: FileCheck, bgColor: '#eff6ff', iconColor: '#3b82f6' },
  { title: 'Inactive Pages', value: '45', subtext: 'Excluded / Zero Traffic', change: '-2.1%', positive: true, icon: FileX, bgColor: '#f1f5f9', iconColor: '#64748b' },
  { title: 'Active Blogs', value: '320', subtext: 'Blogs with Clicks', change: '+12%', positive: true, icon: BookOpenCheck, bgColor: '#f0fdf4', iconColor: '#22c55e' },
  { title: 'Inactive Blogs', value: '18', subtext: 'Needs Optimization', change: '+3', positive: false, icon: BookX, bgColor: '#fef2f2', iconColor: '#ef4444' },
  { title: 'Total Keywords', value: '5,840', subtext: 'Unique Queries', change: '+8.4%', positive: true, icon: KeyRound, bgColor: '#faf5ff', iconColor: '#a855f7' },
  { title: '404 Errors', value: '12', subtext: 'Pages Not Found', change: '-5', positive: true, icon: AlertTriangle, bgColor: '#fff7ed', iconColor: '#f97316' },
];

const topQueries = [
  { query: 'nextjs seo guide', clicks: 450, impressions: 3200, ctr: '14.2%', position: 4.5 },
  { query: 'google search console api', clicks: 380, impressions: 4100, ctr: '9.2%', position: 6.1 },
  { query: 'admin panel tailwind', clicks: 210, impressions: 1800, ctr: '11.6%', position: 3.2 },
  { query: 'react sidebar component', clicks: 190, impressions: 2100, ctr: '9.0%', position: 5.0 },
];

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans overflow-x-hidden w-full p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto w-full space-y-6">
        
        {/* HEADER */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">SEO Overview</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Data synced with Google Search Console</p>
          </div>
          <button className="flex items-center justify-center gap-2 px-4 h-10 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-[13px] font-medium shadow-sm w-full sm:w-auto whitespace-nowrap">
            {/* The v4 Postfix overrides any SVG sizing bugs */}
            <Search className="w-4! h-4! shrink-0" strokeWidth={2.5} />
            <span>Sync Data</span>
          </button>
        </header>

        {/* METRICS GRID: Horizontal Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
          {gscMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm flex items-center justify-between gap-4 w-full transition-transform hover:-translate-y-0.5">
                
                {/* Left Side: Icon + Text Stack */}
                <div className="flex items-center gap-4 min-w-0">
                  <div 
                    className="w-10 h-10 rounded-md flex items-center justify-center shrink-0" 
                    style={{ backgroundColor: metric.bgColor, color: metric.iconColor }}
                  >
                    {/* Strict 16x16px size override */}
                    <Icon className="w-4! h-4! shrink-0" strokeWidth={2.5} />
                  </div>

                  <div className="flex flex-col min-w-0">
                    <h3 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-0.5 truncate">
                      {metric.title}
                    </h3>
                    <div className="flex items-baseline gap-2 truncate">
                      <span className="text-xl font-bold text-slate-900 leading-none">
                        {metric.value}
                      </span>
                      <span className="text-[11px] text-slate-400 truncate hidden sm:inline-block">
                        {metric.subtext}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Trend Badge */}
                <div className="shrink-0">
                  <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-md ${metric.positive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {/* Strict 12x12px size override */}
                    {metric.positive ? <TrendingUp className="w-3! h-3! shrink-0" strokeWidth={2.5} /> : <TrendingDown className="w-3! h-3! shrink-0" strokeWidth={2.5} />}
                    {metric.change}
                  </span>
                </div>

              </div>
            );
          })}
        </div>

        {/* DATA SECTION */}
        <section className="bg-white rounded-lg border border-slate-200 shadow-sm w-full overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <h2 className="text-base font-semibold text-slate-900">Top Performing Keywords</h2>
            <a href="/seo/keywords" className="inline-flex items-center gap-1 text-[13px] text-blue-600 font-medium hover:underline w-fit">
              View All <ArrowUpRight className="w-4! h-4! shrink-0" strokeWidth={2} />
            </a>
          </div>
          
          <div className="w-full">
            {/* Mobile Stacked View */}
            <div className="block md:hidden divide-y divide-slate-100">
              {topQueries.map((item, index) => (
                <div key={index} className="p-4 space-y-2 hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-start gap-3">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase">Query</span>
                    <span className="text-[13px] font-medium text-slate-900 text-right">{item.query}</span>
                  </div>
                  <div className="flex justify-between items-center gap-3">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase">Clicks</span>
                    <span className="text-[13px] text-slate-700">{item.clicks}</span>
                  </div>
                  <div className="flex justify-between items-center gap-3">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase">Impressions</span>
                    <span className="text-[13px] text-slate-700">{item.impressions}</span>
                  </div>
                  <div className="flex justify-between items-center gap-3">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase">CTR</span>
                    <span className="text-[13px] text-slate-700">{item.ctr}</span>
                  </div>
                  <div className="flex justify-between items-center gap-3">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase">Position</span>
                    <span className="text-[13px] text-slate-700">{item.position}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <table className="hidden md:table w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="py-3 px-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b-2 border-slate-100">Query</th>
                  <th className="py-3 px-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b-2 border-slate-100 text-right">Clicks</th>
                  <th className="py-3 px-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b-2 border-slate-100 text-right">Impressions</th>
                  <th className="py-3 px-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b-2 border-slate-100 text-right">CTR</th>
                  <th className="py-3 px-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b-2 border-slate-100 text-right">Position</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topQueries.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-[13px] font-medium text-slate-900">{item.query}</td>
                    <td className="py-3 px-4 text-[13px] text-slate-700 text-right">{item.clicks}</td>
                    <td className="py-3 px-4 text-[13px] text-slate-700 text-right">{item.impressions}</td>
                    <td className="py-3 px-4 text-[13px] text-slate-700 text-right">{item.ctr}</td>
                    <td className="py-3 px-4 text-[13px] text-slate-700 text-right">{item.position}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;