import React, { useMemo, useState } from 'react';
import SeoLayout from '@/components/seo/SeoLayout';
import type { NextPageWithLayout } from '../_app';
import styles from "./dashboard.module.css";
import {
  BookOpen,
  BookX,
  Eye,
  FileText,
  FileX2,
  KeyRound,
  Search,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

type DashboardMetric = {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  iconWrapClass: string;
  iconClass: string;
  trendClass: string;
};

type Point = { x: number; y: number };

const chartLabels = ['Mar 1', 'Mar 3', 'Mar 5', 'Mar 7', 'Mar 9', 'Mar 11', 'Mar 13'];
const impressionsData = [45678, 52123, 48790, 61000, 57890, 68765, 73456];
const clicksData = [3100, 3400, 3200, 4500, 4300, 4700, 5100];
const positionData = [8.4, 8.0, 7.7, 7.3, 7.1, 6.7, 6.4];

const metrics: DashboardMetric[] = [
  {
    title: 'Pages',
    value: '12,840',
    change: '+91',
    positive: true,
    icon: FileText,
    iconWrapClass: 'bg-emerald-50',
    iconClass: 'text-emerald-600',
    trendClass: 'text-emerald-600',
  },
  {
    title: 'Blogs',
    value: '1,420',
    change: '+28',
    positive: false,
    icon: FileX2,
    iconWrapClass: 'bg-rose-50',
    iconClass: 'text-rose-600',
    trendClass: 'text-rose-600',
  },
  {
    title: 'Keywords',
    value: '54,320',
    change: '+214',
    positive: true,
    icon: BookOpen,
    iconWrapClass: 'bg-emerald-50',
    iconClass: 'text-emerald-600',
    trendClass: 'text-emerald-600',
  },
  {
    title: '404 Pages',
    value: '156',
    change: '-12',
    positive: false,
    icon: BookX,
    iconWrapClass: 'bg-rose-50',
    iconClass: 'text-rose-600',
    trendClass: 'text-rose-600',
  },
  {
    title: "Today's traffic",
    value: '38,910',
    change: '+91',
    positive: true,
    icon: KeyRound,
    iconWrapClass: 'bg-emerald-50',
    iconClass: 'text-emerald-600',
    trendClass: 'text-emerald-600',
  },
];

const latestPageBuilds = [
  { page: '/symptoms/stomach-pain', status: 'Published', time: '9 min ago' },
  { page: '/analysis/ai-triage', status: 'Rebuilt', time: '27 min ago' },
  { page: '/conditions/acid-reflux', status: 'Published', time: '1 hour ago' },
  { page: '/symptoms/headache', status: 'Rebuilt', time: '2 hours ago' },
  { page: '/guides/telemedicine', status: 'Published', time: 'Today' },
];

const latestBlogBuilds = [
  { page: '/blog/clinical-triage-ai', status: 'Published', time: '14 min ago' },
  { page: '/blog/seo-structure', status: 'Rebuilt', time: '46 min ago' },
  { page: '/blog/schema-updates', status: 'Published', time: '2 hours ago' },
  { page: '/blog/health-seo', status: 'Rebuilt', time: 'Today' },
  { page: '/blog/clarity-insights', status: 'Published', time: 'Today' },
];

const latestQueryBuilds = [
  { query: 'symptom checker for stomach pain', delta: '+12%', time: '10 min ago' },
  { query: 'how long does headache last', delta: '+6%', time: '34 min ago' },
  { query: 'acid reflux diet tips', delta: '+3%', time: '1 hour ago' },
  { query: 'fever after vaccine', delta: '+9%', time: 'Today' },
  { query: 'chronic fatigue guide', delta: '+2%', time: 'Today' },
];

const chartFrame = {
  width: 700,
  height: 320,
  left: 54,
  right: 14,
  top: 16,
  bottom: 292,
};

const xStep = (chartFrame.right + chartFrame.width - chartFrame.left - chartFrame.right) / (chartLabels.length - 1);

const getX = (index: number) => chartFrame.left + index * ((chartFrame.width - chartFrame.left - chartFrame.right) / (chartLabels.length - 1));

const getPoints = (values: number[], minValue: number, maxValue: number): Point[] => {
  const range = Math.max(maxValue - minValue, 1);
  return values.map((value, index) => {
    const ratio = (value - minValue) / range;
    return {
      x: getX(index),
      y: chartFrame.bottom - ratio * (chartFrame.bottom - chartFrame.top),
    };
  });
};

const linePath = (points: Point[]) => points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');

const areaPath = (points: Point[]) => {
  if (!points.length) return '';
  return `${linePath(points)} L${points[points.length - 1].x},${chartFrame.bottom} L${points[0].x},${chartFrame.bottom} Z`;
};

const ticks = (minValue: number, maxValue: number, count = 5) => {
  const range = Math.max(maxValue - minValue, 1);
  return Array.from({ length: count }, (_, i) => {
    const ratio = i / (count - 1);
    const value = maxValue - ratio * range;
    const y = chartFrame.top + ratio * (chartFrame.bottom - chartFrame.top);
    return { value, y };
  });
};

const resolveIndexFromClientX = (clientX: number, rect: DOMRect) => {
  const plotWidth = chartFrame.width - chartFrame.left - chartFrame.right;
  const step = plotWidth / (chartLabels.length - 1);
  const localX = ((clientX - rect.left) / rect.width) * chartFrame.width;
  const clamped = Math.min(Math.max(localX, chartFrame.left), chartFrame.width - chartFrame.right);
  const index = Math.round((clamped - chartFrame.left) / step);
  return Math.min(Math.max(index, 0), chartLabels.length - 1);
};

const DashboardPage: NextPageWithLayout = () => {
  const [activeIndex, setActiveIndex] = useState(3);
  const [activePositionIndex, setActivePositionIndex] = useState(3);

  const maxTrafficValue = useMemo(() => Math.max(...impressionsData, ...clicksData), []);
  const trafficMin = 0;
  const trafficImpressionPoints = useMemo(() => getPoints(impressionsData, trafficMin, maxTrafficValue), [maxTrafficValue]);
  const trafficClickPoints = useMemo(() => getPoints(clicksData, trafficMin, maxTrafficValue), [maxTrafficValue]);
  const trafficTicks = useMemo(() => ticks(trafficMin, maxTrafficValue), [maxTrafficValue]);

  const positionMin = useMemo(() => Math.floor(Math.min(...positionData) - 0.5), []);
  const positionMax = useMemo(() => Math.ceil(Math.max(...positionData) + 0.5), []);
  const positionPoints = useMemo(() => getPoints(positionData, positionMin, positionMax), [positionMin, positionMax]);
  const positionTicksData = useMemo(() => ticks(positionMin, positionMax, 4), [positionMin, positionMax]);
  const onTrafficPointer = (clientX: number, target: EventTarget | null) => {
    const svg = (target as Element | null)?.closest('svg');
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    setActiveIndex(resolveIndexFromClientX(clientX, rect));
  };
  const onPositionPointer = (clientX: number, target: EventTarget | null) => {
    const svg = (target as Element | null)?.closest('svg');
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    setActivePositionIndex(resolveIndexFromClientX(clientX, rect));
  };

  return (
    <div className={styles.page}>
      <section className="w-full overflow-x-hidden font-['Sora']">
      <div className="mx-auto w-full max-w-375 min-w-0">
        <div className={styles.hero}>
          <div className={styles.heroGrid}>
            <div>
              <h1 className={styles.heroTitle}>Dashboard</h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            const TrendIcon = metric.positive ? TrendingUp : TrendingDown;
            return (
              <article
                key={metric.title}
                className={`${styles.metricCard} rounded-2xl border border-slate-200 bg-white p-3.5 text-center shadow-[0_1px_1px_rgba(15,23,42,0.03)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm`}
              >
                <div className="mb-2 flex items-center justify-center">
                  <div className={`${styles.metricIconWrap} ${metric.iconWrapClass}`}>
                    <Icon className={`${styles.metricIcon} ${metric.iconClass}`} strokeWidth={2.2} />
                  </div>
                </div>

                <h2 className="text-sm lg:text-base font-medium text-slate-700 sm:text-base">{metric.title}</h2>
                <p className="mt-1.5 text-2xl font-semibold leading-none tracking-tight text-slate-950 sm:text-3xl">
                  {metric.value}
                </p>
                <div className={`mt-2 inline-flex items-center justify-center gap-1 text-xs sm:text-sm font-medium ${metric.trendClass}`}>
                  <TrendIcon className="h-3.5! w-3.5!" strokeWidth={2.3} />
                  <span>{metric.change}</span>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:mt-7 lg:grid-cols-3">
          <article className={styles.listCard}>
            <div className={styles.listHeader}>
              <h2>Latest Page Builds</h2>
              <button type="button" className={styles.viewAllBtn}>
                View All
              </button>
            </div>
            <div className={styles.listBody}>
              {latestPageBuilds.map((row) => (
                <button key={row.page} type="button" className={styles.listRow}>
                  <div>
                    <p className={styles.listTitle}>{row.page}</p>
                    <span className={styles.listMeta}>{row.status}</span>
                  </div>
                  <span className={styles.listTime}>{row.time}</span>
                </button>
              ))}
            </div>
          </article>

          <article className={styles.listCard}>
            <div className={styles.listHeader}>
              <h2>Latest Blog Builds</h2>
              <button type="button" className={styles.viewAllBtn}>
                View All
              </button>
            </div>
            <div className={styles.listBody}>
              {latestBlogBuilds.map((row) => (
                <button key={row.page} type="button" className={styles.listRow}>
                  <div>
                    <p className={styles.listTitle}>{row.page}</p>
                    <span className={styles.listMeta}>{row.status}</span>
                  </div>
                  <span className={styles.listTime}>{row.time}</span>
                </button>
              ))}
            </div>
          </article>

          <article className={styles.listCard}>
            <div className={styles.listHeader}>
              <h2>Latest Search Queries</h2>
              <button type="button" className={styles.viewAllBtn}>
                View All
              </button>
            </div>
            <div className={styles.listBody}>
              {latestQueryBuilds.map((row) => (
                <button key={row.query} type="button" className={styles.listRow}>
                  <div>
                    <p className={styles.listTitle}>{row.query}</p>
                    <span className={styles.listMeta}>{row.delta}</span>
                  </div>
                  <span className={styles.listTime}>{row.time}</span>
                </button>
              ))}
            </div>
          </article>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:mt-7 lg:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-4">
            <div className="mb-3 flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-950 sm:mb-4">
              <Eye className="h-3.5! w-3.5!" strokeWidth={2} />
              <h2>Impressions &amp; Clicks</h2>
            </div>

            <div className="relative h-64 w-full sm:h-72">
              <svg
                viewBox={`0 0 ${chartFrame.width} ${chartFrame.height}`}
                className="h-full w-full touch-none"
                onPointerDown={(e) => onTrafficPointer(e.clientX, e.target)}
                onPointerMove={(e) => {
                  if (e.buttons > 0) onTrafficPointer(e.clientX, e.target);
                }}
                onTouchStart={(e) => onTrafficPointer(e.touches[0].clientX, e.target)}
                onTouchMove={(e) => onTrafficPointer(e.touches[0].clientX, e.target)}
              >
                <defs>
                  <linearGradient id="trafficImpressionFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.05" />
                  </linearGradient>
                  <linearGradient id="trafficImpressionLine" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0%" stopColor="#0ea5a3" />
                    <stop offset="100%" stopColor="#22d3ee" />
                  </linearGradient>
                  <linearGradient id="trafficClickLine" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#60a5fa" />
                  </linearGradient>
                  <filter id="trafficGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#0ea5a3" floodOpacity="0.25" />
                  </filter>
                </defs>
                {trafficTicks.map((tick) => (
                  <line
                    key={`traffic-y-${tick.y}`}
                    x1={chartFrame.left}
                    y1={tick.y}
                    x2={chartFrame.width - chartFrame.right}
                    y2={tick.y}
                    stroke="#cbd5e1"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                ))}

                {chartLabels.map((label, index) => (
                  <line
                    key={`traffic-x-${label}`}
                    x1={getX(index)}
                    y1={chartFrame.top}
                    x2={getX(index)}
                    y2={chartFrame.bottom}
                    stroke="#cbd5e1"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                ))}

                <line x1={chartFrame.left} y1={chartFrame.top} x2={chartFrame.left} y2={chartFrame.bottom} stroke="#64748b" strokeWidth="1.3" />
                <path d={areaPath(trafficImpressionPoints)} fill="url(#trafficImpressionFill)" />
                <path
                  d={linePath(trafficImpressionPoints)}
                  fill="none"
                  stroke="url(#trafficImpressionLine)"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#trafficGlow)"
                />
                <path
                  d={linePath(trafficClickPoints)}
                  fill="none"
                  stroke="url(#trafficClickLine)"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <circle
                  cx={trafficImpressionPoints[activeIndex].x}
                  cy={trafficImpressionPoints[activeIndex].y}
                  r="5"
                  fill="#2563eb"
                  stroke="#fff"
                  strokeWidth="1.5"
                />

                {chartLabels.map((label, index) => (
                  <rect
                    key={`traffic-hit-${label}`}
                    x={getX(index) - xStep / 2}
                    y={chartFrame.top}
                    width={xStep}
                    height={chartFrame.bottom - chartFrame.top}
                    fill="transparent"
                    stroke="none"
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => setActiveIndex(index)}
                  />
                ))}
              </svg>

              <div className="pointer-events-none absolute left-0 top-3 h-[calc(100%-1.7rem)] w-10 text-[9px] text-slate-600 sm:text-xs">
                {trafficTicks.map((tick, i) => (
                  <span
                    key={`traffic-tick-${i}`}
                    className="absolute left-0 -translate-y-1/2"
                    style={{ top: `${((tick.y - chartFrame.top) / (chartFrame.bottom - chartFrame.top)) * 100}%` }}
                  >
                    {Math.round(tick.value).toLocaleString()}
                  </span>
                ))}
              </div>

              <div className="pointer-events-none absolute bottom-0 left-11 right-2 flex justify-between text-[9px] text-slate-600 sm:text-xs">
                {chartLabels.map((label) => (
                  <span key={label}>{label}</span>
                ))}
              </div>

              <div
                className="absolute hidden rounded-md border border-slate-200 bg-white/95 p-2 text-xs sm:text-sm shadow-sm sm:block"
                style={{
                  left: `${(trafficImpressionPoints[activeIndex].x / chartFrame.width) * 100}%`,
                  top: `${Math.min((trafficImpressionPoints[activeIndex].y / chartFrame.height) * 100 + 5, 82)}%`,
                  transform: 'translate(-50%, 0)',
                }}
              >
                <p className="font-medium text-slate-900">{chartLabels[activeIndex]}</p>
                <p className="mt-1 text-blue-600">impressions : {impressionsData[activeIndex].toLocaleString()}</p>
                <p className="mt-0.5 text-emerald-600">clicks : {clicksData[activeIndex].toLocaleString()}</p>
              </div>
            </div>

            <div className="mt-2 flex items-center justify-center gap-4 text-xs sm:text-sm">
              <span className="inline-flex items-center gap-1 text-blue-600">
                <span className="h-1 w-1 rounded-full bg-blue-600" />
                impressions
              </span>
              <span className="inline-flex items-center gap-1 text-emerald-600">
                <span className="h-1 w-1 rounded-full bg-emerald-600" />
                clicks
              </span>
            </div>
            <div className="mt-1 text-center text-xs sm:text-sm text-slate-700 sm:hidden">
              {chartLabels[activeIndex]} · impressions {impressionsData[activeIndex].toLocaleString()} · clicks{' '}
              {clicksData[activeIndex].toLocaleString()}
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-4">
            <div className="mb-3 flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-950 sm:mb-4">
              <Search className="h-3.5! w-3.5!" strokeWidth={2} />
              <h2>Average Position</h2>
            </div>

            <div className="relative h-64 w-full sm:h-72">
              <svg
                viewBox={`0 0 ${chartFrame.width} ${chartFrame.height}`}
                className="h-full w-full touch-none"
                onPointerDown={(e) => onPositionPointer(e.clientX, e.target)}
                onPointerMove={(e) => {
                  if (e.buttons > 0) onPositionPointer(e.clientX, e.target);
                }}
                onTouchStart={(e) => onPositionPointer(e.touches[0].clientX, e.target)}
                onTouchMove={(e) => onPositionPointer(e.touches[0].clientX, e.target)}
              >
                <defs>
                  <linearGradient id="positionLine" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#c084fc" />
                  </linearGradient>
                  <filter id="positionGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#8b5cf6" floodOpacity="0.25" />
                  </filter>
                </defs>
                {positionTicksData.map((tick) => (
                  <line
                    key={`pos-y-${tick.y}`}
                    x1={chartFrame.left}
                    y1={tick.y}
                    x2={chartFrame.width - chartFrame.right}
                    y2={tick.y}
                    stroke="#cbd5e1"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                ))}

                {chartLabels.map((label, index) => (
                  <line
                    key={`pos-x-${label}`}
                    x1={getX(index)}
                    y1={chartFrame.top}
                    x2={getX(index)}
                    y2={chartFrame.bottom}
                    stroke="#cbd5e1"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                ))}

                <line x1={chartFrame.left} y1={chartFrame.top} x2={chartFrame.left} y2={chartFrame.bottom} stroke="#64748b" strokeWidth="1.3" />
                <line
                  x1={chartFrame.left}
                  y1={chartFrame.bottom}
                  x2={chartFrame.width - chartFrame.right}
                  y2={chartFrame.bottom}
                  stroke="#64748b"
                  strokeWidth="1.3"
                />

                <path
                  d={linePath(positionPoints)}
                  fill="none"
                  stroke="url(#positionLine)"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#positionGlow)"
                />
                {positionPoints.map((point, index) => (
                  <circle
                    key={`pos-point-${index}`}
                    cx={point.x}
                    cy={point.y}
                    r={index === activePositionIndex ? 5 : 4.2}
                    fill="#a855f7"
                    onMouseEnter={() => setActivePositionIndex(index)}
                    onClick={() => setActivePositionIndex(index)}
                  />
                ))}
              </svg>

              <div className="pointer-events-none absolute left-2 top-3 h-[calc(100%-1.7rem)] w-8 text-[9px] text-slate-600 sm:text-xs">
                {positionTicksData.map((tick, i) => (
                  <span
                    key={`position-tick-${i}`}
                    className="absolute left-0 -translate-y-1/2"
                    style={{ top: `${((tick.y - chartFrame.top) / (chartFrame.bottom - chartFrame.top)) * 100}%` }}
                  >
                    {tick.value.toFixed(0)}
                  </span>
                ))}
              </div>

              <div className="pointer-events-none absolute bottom-0 left-11 right-2 flex justify-between text-[9px] text-slate-600 sm:text-xs">
                {chartLabels.map((label) => (
                  <span key={label}>{label}</span>
                ))}
              </div>

              <div
                className="absolute hidden rounded-md border border-slate-200 bg-white/95 p-2 text-xs sm:text-sm shadow-sm sm:block"
                style={{
                  left: `${(positionPoints[activePositionIndex].x / chartFrame.width) * 100}%`,
                  top: `${Math.min((positionPoints[activePositionIndex].y / chartFrame.height) * 100 + 5, 82)}%`,
                  transform: 'translate(-50%, 0)',
                }}
              >
                <p className="font-medium text-slate-900">{chartLabels[activePositionIndex]}</p>
                <p className="mt-1 text-violet-600">position : {positionData[activePositionIndex].toFixed(1)}</p>
              </div>
            </div>
            <div className="mt-1 text-center text-xs sm:text-sm text-slate-700 sm:hidden">
              {chartLabels[activePositionIndex]} · position {positionData[activePositionIndex].toFixed(1)}
            </div>
          </article>
        </div>

      </div>
    </section>
    </div>
  );
};


DashboardPage.getLayout = (page) => <SeoLayout>{page}</SeoLayout>;

export default DashboardPage;
