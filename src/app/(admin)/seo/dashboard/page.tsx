import React from 'react';
import './dashboard.css';
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

// Mock Data
const gscMetrics = [
  { 
    title: 'Active Pages', 
    value: '1,240', 
    subtext: 'Indexed & Traffic > 0',
    change: '+5.2%', 
    positive: true, 
    icon: FileCheck,
    bgColor: '#eff6ff',
    iconColor: '#3b82f6'
  },
  { 
    title: 'Inactive Pages', 
    value: '45', 
    subtext: 'Excluded / Zero Traffic',
    change: '-2.1%', 
    positive: true, 
    icon: FileX,
    bgColor: '#f1f5f9',
    iconColor: '#64748b'
  },
  { 
    title: 'Active Blogs', 
    value: '320', 
    subtext: 'Blogs with Clicks',
    change: '+12%', 
    positive: true, 
    icon: BookOpenCheck,
    bgColor: '#f0fdf4',
    iconColor: '#22c55e'
  },
  { 
    title: 'Inactive Blogs', 
    value: '18', 
    subtext: 'Needs Optimization',
    change: '+3', 
    positive: false, 
    icon: BookX,
    bgColor: '#fef2f2',
    iconColor: '#ef4444'
  },
  { 
    title: 'Total Keywords', 
    value: '5,840', 
    subtext: 'Unique Queries',
    change: '+8.4%', 
    positive: true, 
    icon: KeyRound,
    bgColor: '#faf5ff',
    iconColor: '#a855f7'
  },
  { 
    title: '404 Errors', 
    value: '12', 
    subtext: 'Pages Not Found',
    change: '-5', 
    positive: true, 
    icon: AlertTriangle,
    bgColor: '#fff7ed',
    iconColor: '#f97316'
  },
];

const topQueries = [
  { query: 'nextjs seo guide', clicks: 450, impressions: 3200, ctr: '14.2%', position: 4.5 },
  { query: 'google search console api', clicks: 380, impressions: 4100, ctr: '9.2%', position: 6.1 },
  { query: 'admin panel tailwind', clicks: 210, impressions: 1800, ctr: '11.6%', position: 3.2 },
  { query: 'react sidebar component', clicks: 190, impressions: 2100, ctr: '9.0%', position: 5.0 },
];

const DashboardPage = () => {
  return (
    <div className="dashboard-container">
      
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">SEO Overview</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Data synced with Google Search Console</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm h-9">
          <Search size={16} />
          Sync Data
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        {gscMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div className="metric-card" key={index}>
              <div className="metric-content">
                <h3>{metric.title}</h3>
                <p className="value">{metric.value}</p>
                <p className="subtext">{metric.subtext}</p>
                <span className={`change ${metric.positive ? 'positive' : 'negative'}`}>
                  {metric.positive ? <TrendingUp size={12} className="inline mr-1" /> : <TrendingDown size={12} className="inline mr-1" />}
                  {metric.change}
                </span>
              </div>
              
              {/* Icon Container - No inline size prop needed, handled by CSS */}
              <div className="metric-icon" style={{ backgroundColor: metric.bgColor }}>
                <Icon style={{ color: metric.iconColor }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Table Section */}
      <div className="section-container">
        <div className="section-header">
          <h2 className="section-title">Top Performing Keywords</h2>
          <a href="/seo/keywords" className="text-sm text-blue-600 hover:underline hidden sm:flex items-center gap-1">
            View All <ArrowUpRight size={14} />
          </a>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pb-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Query</th>
                <th className="pb-3 text-xs font-medium text-slate-500 uppercase tracking-wider text-right">Clicks</th>
                <th className="pb-3 text-xs font-medium text-slate-500 uppercase tracking-wider text-right">Impressions</th>
                <th className="pb-3 text-xs font-medium text-slate-500 uppercase tracking-wider text-right">CTR</th>
                <th className="pb-3 text-xs font-medium text-slate-500 uppercase tracking-wider text-right">Position</th>
              </tr>
            </thead>
            <tbody>
              {topQueries.map((item, index) => (
                <tr key={index} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                  <td className="py-3 text-sm font-medium text-slate-800 pr-4">{item.query}</td>
                  <td className="py-3 text-sm text-slate-600 text-right">{item.clicks}</td>
                  <td className="py-3 text-sm text-slate-600 text-right">{item.impressions}</td>
                  <td className="py-3 text-sm text-slate-600 text-right">{item.ctr}</td>
                  <td className="py-3 text-sm text-slate-600 text-right">{item.position}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default DashboardPage;