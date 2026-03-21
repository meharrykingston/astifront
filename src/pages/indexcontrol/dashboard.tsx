import Link from 'next/link';
import React, { useMemo, useState } from 'react';
import SeoLayout from '@/components/seo/SeoLayout';
import type { NextPageWithLayout } from '../_app';
import styles from "./dashboard.module.css";
import {
  AlertCircle,
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

type QueryRow = {
  query: string;
  clicks: number;
  impressions: number;
  ctr: string;
  position: number;
};

type PageRow = {
  page: string;
  clicks: number;
  impressions: number;
  ctr: string;
  position: number;
};

type Point = { x: number; y: number };

const chartLabels = ['Mar 1', 'Mar 3', 'Mar 5', 'Mar 7', 'Mar 9', 'Mar 11', 'Mar 13'];
const impressionsData = [45678, 52123, 48790, 61000, 57890, 68765, 73456];
const clicksData = [3100, 3400, 3200, 4500, 4300, 4700, 5100];
const positionData = [8.4, 8.0, 7.7, 7.3, 7.1, 6.7, 6.4];

const metrics: DashboardMetric[] = [
  {
    title: 'Active Pages',
    value: '1,248',
    change: '+12.5%',
    positive: true,
    icon: FileText,
    iconWrapClass: 'bg-emerald-50',
    iconClass: 'text-emerald-600',
    trendClass: 'text-emerald-600',
  },
  {
    title: 'Inactive Pages',
    value: '87',
    change: '-5.2%',
    positive: false,
    icon: FileX2,
    iconWrapClass: 'bg-rose-50',
    iconClass: 'text-rose-600',
    trendClass: 'text-rose-600',
  },
  {
    title: 'Active Blogs',
    value: '342',
    change: '+8.3%',
    positive: true,
    icon: BookOpen,
    iconWrapClass: 'bg-emerald-50',
    iconClass: 'text-emerald-600',
    trendClass: 'text-emerald-600',
  },
  {
    title: 'Inactive Blogs',
    value: '23',
    change: '-2.1%',
    positive: false,
    icon: BookX,
    iconWrapClass: 'bg-rose-50',
    iconClass: 'text-rose-600',
    trendClass: 'text-rose-600',
  },
  {
    title: 'Keywords',
    value: '5,432',
    change: '+15.7%',
    positive: true,
    icon: KeyRound,
    iconWrapClass: 'bg-emerald-50',
    iconClass: 'text-emerald-600',
    trendClass: 'text-emerald-600',
  },
  {
    title: '404 Pages',
    value: '156',
    change: '+3.4%',
    positive: true,
    icon: AlertCircle,
    iconWrapClass: 'bg-orange-50',
    iconClass: 'text-orange-600',
    trendClass: 'text-orange-600',
  },
];

const topSearchQueries: QueryRow[] = [
  { query: 'web development tutorial', clicks: 1234, impressions: 45678, ctr: '2.7%', position: 3.2 },
  { query: 'react best practices', clicks: 987, impressions: 38456, ctr: '2.6%', position: 4.1 },
  { query: 'seo optimization guide', clicks: 856, impressions: 34221, ctr: '2.5%', position: 5.3 },
  { query: 'javascript frameworks', clicks: 743, impressions: 29876, ctr: '2.5%', position: 6.7 },
  { query: 'responsive design tips', clicks: 621, impressions: 25432, ctr: '2.4%', position: 7.2 },
];

const topPerformingPages: PageRow[] = [
  { page: '/blog/react-hooks-guide', clicks: 3456, impressions: 98765, ctr: '3.5%', position: 2.1 },
  { page: '/tutorials/javascript-basics', clicks: 2987, impressions: 87654, ctr: '3.4%', position: 2.8 },
  { page: '/optimization-checklist', clicks: 2543, impressions: 76543, ctr: '3.3%', position: 3.2 },
  { page: '/guides/web-performance', clicks: 2134, impressions: 65432, ctr: '3.3%', position: 3.9 },
  { page: '/blog/css-grid-flexbox', clicks: 1876, impressions: 54321, ctr: '3.5%', position: 2.5 },
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
        <div className="mb-4 sm:mb-5">
          <h1 className="text-lg font-semibold tracking-tight text-slate-950 sm:text-xl lg:text-2xl">
            SEO Analytics &amp; Management
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600">
            Monitor your website&apos;s search performance and SEO metrics
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            const TrendIcon = metric.positive ? TrendingUp : TrendingDown;
            return (
              <article
                key={metric.title}
                className="rounded-2xl border border-slate-200 bg-white p-3.5 text-center shadow-[0_1px_1px_rgba(15,23,42,0.03)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
              >
                <div className="mb-2 flex items-center justify-center">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${metric.iconWrapClass}`}>
                    <Icon className={`h-3.5! w-3.5! ${metric.iconClass}`} strokeWidth={2.2} />
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
                <path d={areaPath(trafficImpressionPoints)} fill="#14b8a6" fillOpacity="0.75" />
                <path d={linePath(trafficImpressionPoints)} fill="none" stroke="#0ea5a3" strokeWidth="2" />
                <path d={linePath(trafficClickPoints)} fill="none" stroke="#2563eb" strokeWidth="2" />

                <circle
                  cx={trafficImpressionPoints[activeIndex].x}
                  cy={trafficImpressionPoints[activeIndex].y}
                  r="4"
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

                <path d={linePath(positionPoints)} fill="none" stroke="#8b5cf6" strokeWidth="2.2" />
                {positionPoints.map((point, index) => (
                  <circle
                    key={`pos-point-${index}`}
                    cx={point.x}
                    cy={point.y}
                    r={index === activePositionIndex ? 5 : 4}
                    fill="#8b5cf6"
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

        <article className="mt-6 rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-4">
          <h2 className="mb-3 text-sm lg:text-base font-semibold text-slate-950">Top Search Queries</h2>
          <div className="md:hidden space-y-2">
            {topSearchQueries.map((row) => (
              <div key={`${row.query}-mobile`} className="rounded-lg border border-slate-200 p-2.5">
                <p className="text-xs sm:text-sm font-medium text-slate-900 wrap-break-word">{row.query}</p>
                <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 text-xs sm:text-sm text-slate-700">
                  <span>Clicks: {row.clicks.toLocaleString()}</span>
                  <span>Impr: {row.impressions.toLocaleString()}</span>
                  <span>CTR: {row.ctr}</span>
                  <span>Pos: {row.position.toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-700">
                  <th className="px-3 py-2 font-semibold">Query</th>
                  <th className="px-3 py-2 font-semibold text-right">Clicks</th>
                  <th className="px-3 py-2 font-semibold text-right">Impressions</th>
                  <th className="px-3 py-2 font-semibold text-right">CTR</th>
                  <th className="px-3 py-2 font-semibold text-right">Position</th>
                </tr>
              </thead>
              <tbody>
                {topSearchQueries.map((row) => (
                  <tr key={row.query} className="border-b border-slate-200 last:border-b-0">
                    <td className="px-3 py-2.5 text-slate-900">{row.query}</td>
                    <td className="px-3 py-2.5 text-right">{row.clicks.toLocaleString()}</td>
                    <td className="px-3 py-2.5 text-right">{row.impressions.toLocaleString()}</td>
                    <td className="px-3 py-2.5 text-right">{row.ctr}</td>
                    <td className="px-3 py-2.5 text-right">{row.position.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="mt-5 rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-4">
          <h2 className="mb-3 text-sm lg:text-base font-semibold text-slate-950">Top Performing Pages</h2>
          <div className="md:hidden space-y-2">
            {topPerformingPages.map((row) => (
              <div key={`${row.page}-mobile`} className="rounded-lg border border-slate-200 p-2.5">
                <Link className="text-xs sm:text-sm font-medium text-blue-600 break-all hover:underline" href={row.page}>
                  {row.page}
                </Link>
                <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 text-xs sm:text-sm text-slate-700">
                  <span>Clicks: {row.clicks.toLocaleString()}</span>
                  <span>Impr: {row.impressions.toLocaleString()}</span>
                  <span>CTR: {row.ctr}</span>
                  <span>Pos: {row.position.toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-700">
                  <th className="px-3 py-2 font-semibold">Page</th>
                  <th className="px-3 py-2 font-semibold text-right">Clicks</th>
                  <th className="px-3 py-2 font-semibold text-right">Impressions</th>
                  <th className="px-3 py-2 font-semibold text-right">CTR</th>
                  <th className="px-3 py-2 font-semibold text-right">Position</th>
                </tr>
              </thead>
              <tbody>
                {topPerformingPages.map((row) => (
                  <tr key={row.page} className="border-b border-slate-200 last:border-b-0">
                    <td className="px-3 py-2.5 text-slate-900">
                      <Link className="text-blue-600 hover:underline" href={row.page}>
                        {row.page}
                      </Link>
                    </td>
                    <td className="px-3 py-2.5 text-right">{row.clicks.toLocaleString()}</td>
                    <td className="px-3 py-2.5 text-right">{row.impressions.toLocaleString()}</td>
                    <td className="px-3 py-2.5 text-right">{row.ctr}</td>
                    <td className="px-3 py-2.5 text-right">{row.position.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </div>
    </section>
    </div>
  );
};

DashboardPage.getLayout = (page) => <SeoLayout>{page}</SeoLayout>;

export default DashboardPage;
