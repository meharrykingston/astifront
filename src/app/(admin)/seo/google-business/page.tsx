"use client";

import React, { useMemo, useState } from "react";
import {
  CheckCircle2,
  MapPin,
  MessageSquareReply,
  Plus,
  Search,
  ShieldCheck,
  Star,
  Store,
  Tag,
} from "lucide-react";

type ServiceStatus = "active" | "paused";
type Priority = "high" | "medium" | "low";

type GbpService = {
  id: string;
  name: string;
  category: string;
  priceLabel: string;
  description: string;
  status: ServiceStatus;
  priority: Priority;
  bookings: number;
};

type ReviewItem = {
  id: string;
  customer: string;
  rating: number;
  text: string;
  date: string;
  replied: boolean;
};

const priorityClass: Record<Priority, string> = {
  high: "bg-rose-100 text-rose-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-emerald-100 text-emerald-700",
};

const statusClass: Record<ServiceStatus, string> = {
  active: "bg-emerald-100 text-emerald-700",
  paused: "bg-slate-200 text-slate-700",
};

const servicesSeed: GbpService[] = [
  {
    id: "SRV-101",
    name: "Technical SEO Audit",
    category: "SEO Services",
    priceLabel: "Starts at $399",
    description: "Complete crawl/index diagnostics with fix plan.",
    status: "active",
    priority: "high",
    bookings: 28,
  },
  {
    id: "SRV-102",
    name: "Local SEO Setup",
    category: "Google Business",
    priceLabel: "Starts at $249",
    description: "GBP optimization, NAP consistency, and map pack targeting.",
    status: "active",
    priority: "high",
    bookings: 41,
  },
  {
    id: "SRV-103",
    name: "Monthly SEO Retainer",
    category: "SEO Services",
    priceLabel: "$899/mo",
    description: "Continuous optimization, content planning, and reporting.",
    status: "active",
    priority: "medium",
    bookings: 16,
  },
  {
    id: "SRV-104",
    name: "Schema Markup Implementation",
    category: "Technical",
    priceLabel: "Starts at $199",
    description: "Schema deployment for services, FAQ, reviews, and breadcrumbs.",
    status: "paused",
    priority: "low",
    bookings: 4,
  },
];

const reviewsSeed: ReviewItem[] = [
  {
    id: "REV-01",
    customer: "Aarav Mehta",
    rating: 5,
    text: "Great SEO consultation. Very clear roadmap and measurable results.",
    date: "2026-03-14",
    replied: false,
  },
  {
    id: "REV-02",
    customer: "Nina Patel",
    rating: 4,
    text: "Good response time and monthly reporting quality.",
    date: "2026-03-13",
    replied: true,
  },
  {
    id: "REV-03",
    customer: "Rahul Singh",
    rating: 3,
    text: "Service was fine, onboarding could be smoother.",
    date: "2026-03-12",
    replied: false,
  },
];

export default function GoogleBusinessPage() {
  const [services, setServices] = useState<GbpService[]>(servicesSeed);
  const [reviews, setReviews] = useState<ReviewItem[]>(reviewsSeed);
  const [query, setQuery] = useState("");
  const [newService, setNewService] = useState({
    name: "",
    category: "SEO Services",
    priceLabel: "",
    description: "",
  });
  const [serviceAreas, setServiceAreas] = useState<string[]>([
    "New York",
    "San Francisco",
    "Chicago",
    "Austin",
  ]);
  const [areaInput, setAreaInput] = useState("");

  const filteredServices = useMemo(() => {
    const q = query.trim().toLowerCase();
    return services.filter(
      (s) =>
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q),
    );
  }, [services, query]);

  const stats = useMemo(() => {
    const active = services.filter((s) => s.status === "active").length;
    const totalBookings = services.reduce((sum, x) => sum + x.bookings, 0);
    const pendingReplies = reviews.filter((r) => !r.replied).length;
    const avgRating =
      reviews.length > 0
        ? (reviews.reduce((sum, x) => sum + x.rating, 0) / reviews.length).toFixed(1)
        : "0.0";
    return { active, totalBookings, pendingReplies, avgRating };
  }, [reviews, services]);

  const addService = () => {
    if (!newService.name.trim()) return;
    const item: GbpService = {
      id: `SRV-${Date.now()}`,
      name: newService.name.trim(),
      category: newService.category,
      priceLabel: newService.priceLabel || "Custom pricing",
      description: newService.description || "No description added yet.",
      status: "active",
      priority: "medium",
      bookings: 0,
    };
    setServices((prev) => [item, ...prev]);
    setNewService({ name: "", category: "SEO Services", priceLabel: "", description: "" });
  };

  const addArea = () => {
    const area = areaInput.trim();
    if (!area) return;
    if (!serviceAreas.includes(area)) setServiceAreas((prev) => [...prev, area]);
    setAreaInput("");
  };

  return (
    <section className="min-h-screen w-full overflow-x-hidden bg-slate-50 p-3 font-['Sora'] text-slate-900 sm:p-5 lg:p-6">
      <div className="mx-auto w-full max-w-375 space-y-4">
        <header className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
              Google Business Management
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              Manage Google Business services, categories, areas, posts, and review actions.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm shadow-sm">
            Profile status: <span className="font-semibold text-emerald-700">Verified</span>
          </div>
        </header>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          <KpiCard label="Active Services" value={stats.active.toString()} icon={Store} />
          <KpiCard label="Total Bookings" value={stats.totalBookings.toString()} icon={Tag} />
          <KpiCard label="Avg Rating" value={stats.avgRating} icon={Star} />
          <KpiCard label="Pending Replies" value={stats.pendingReplies.toString()} icon={MessageSquareReply} />
          <KpiCard label="Service Areas" value={serviceAreas.length.toString()} icon={MapPin} />
        </div>

        <section className="grid grid-cols-1 gap-3 xl:grid-cols-[1.4fr_1fr]">
          <article className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm lg:text-base font-semibold text-slate-900">Services Catalog</h2>
              <div className="relative w-full max-w-60 min-w-0">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5! w-3.5! -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search services..."
                  className="h-8 w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-2 text-xs sm:text-sm outline-none focus:border-blue-300 focus:bg-white"
                />
              </div>
            </div>

            <div className="mt-3 space-y-2">
              {filteredServices.map((service) => (
                <div key={service.id} className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-xs sm:text-sm font-semibold text-slate-900">{service.name}</p>
                      <p className="text-xs sm:text-sm text-slate-500">{service.category} {service.priceLabel}</p>
                    </div>
                    <div className="flex gap-1">
                      <span className={`rounded-full px-2 py-0.5 text-xs sm:text-sm font-semibold ${statusClass[service.status]}`}>
                        {service.status}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-xs sm:text-sm font-semibold ${priorityClass[service.priority]}`}>
                        {service.priority}
                      </span>
                    </div>
                  </div>
                  <p className="mt-1 text-xs sm:text-sm text-slate-600">{service.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs sm:text-sm font-medium text-slate-700">
                      {service.bookings} bookings
                    </span>
                    <button
                      onClick={() =>
                        setServices((prev) =>
                          prev.map((x) =>
                            x.id === service.id
                              ? { ...x, status: x.status === "active" ? "paused" : "active" }
                              : x,
                          ),
                        )
                      }
                      className="h-6 rounded-full border border-slate-300 px-2 text-xs sm:text-sm font-medium hover:bg-white"
                    >
                      {service.status === "active" ? "Pause" : "Activate"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="space-y-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
              <h2 className="text-sm lg:text-base font-semibold text-slate-900">Add New Service</h2>
              <div className="mt-2 grid grid-cols-1 gap-2">
                <input
                  value={newService.name}
                  onChange={(e) => setNewService((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Service name"
                  className="h-8 rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs sm:text-sm"
                />
                <select
                  value={newService.category}
                  onChange={(e) => setNewService((p) => ({ ...p, category: e.target.value }))}
                  className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs sm:text-sm"
                >
                  <option>SEO Services</option>
                  <option>Google Business</option>
                  <option>Technical</option>
                  <option>Content</option>
                </select>
                <input
                  value={newService.priceLabel}
                  onChange={(e) => setNewService((p) => ({ ...p, priceLabel: e.target.value }))}
                  placeholder="Price label (e.g., Starts at $199)"
                  className="h-8 rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs sm:text-sm"
                />
                <textarea
                  rows={3}
                  value={newService.description}
                  onChange={(e) => setNewService((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Service description..."
                  className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs sm:text-sm"
                />
                <button
                  onClick={addService}
                  className="inline-flex h-8 items-center justify-center gap-1 rounded-lg bg-blue-600 px-2 text-xs sm:text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <Plus className="h-3.5! w-3.5!" />
                  Add Service
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
              <h2 className="text-sm lg:text-base font-semibold text-slate-900">Service Areas</h2>
              <div className="mt-2 flex gap-1">
                <input
                  value={areaInput}
                  onChange={(e) => setAreaInput(e.target.value)}
                  placeholder="Add city/area"
                  className="h-8 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs sm:text-sm"
                />
                <button
                  onClick={addArea}
                  className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs sm:text-sm font-medium hover:bg-slate-100"
                >
                  Add
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {serviceAreas.map((area) => (
                  <span key={area} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs sm:text-sm font-medium text-slate-700">
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </article>
        </section>

        <section className="grid grid-cols-1 gap-3 xl:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
            <h2 className="text-sm lg:text-base font-semibold text-slate-900">Review Reply Queue</h2>
            <div className="mt-2 space-y-2">
              {reviews.map((review) => (
                <div key={review.id} className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs sm:text-sm font-semibold text-slate-900">{review.customer}</p>
                    <span className="text-xs sm:text-sm text-slate-500">{review.date}</span>
                  </div>
                  <p className="mt-1 text-xs sm:text-sm text-amber-600">
                    {"".repeat(review.rating)}{"".repeat(5 - review.rating)}
                  </p>
                  <p className="mt-1 text-xs sm:text-sm text-slate-600">{review.text}</p>
                  <div className="mt-2 flex items-center gap-1">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs sm:text-sm font-semibold ${
                        review.replied ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {review.replied ? "Replied" : "Pending reply"}
                    </span>
                    {!review.replied && (
                      <button
                        onClick={() =>
                          setReviews((prev) =>
                            prev.map((x) => (x.id === review.id ? { ...x, replied: true } : x)),
                          )
                        }
                        className="h-6 rounded-full border border-slate-300 px-2 text-xs sm:text-sm font-medium hover:bg-white"
                      >
                        Mark Replied
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
            <h2 className="text-sm lg:text-base font-semibold text-slate-900">Profile Completeness</h2>
            <div className="mt-3 space-y-2">
              {[
                "Primary category configured",
                "Services list updated",
                "Business hours updated",
                "Latest photos uploaded",
                "Review replies maintained",
                "Weekly GBP posts published",
              ].map((item, i) => (
                <div
                  key={item}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs sm:text-sm"
                >
                  <span className="text-slate-700">{item}</span>
                  {i < 5 ? (
                    <span className="inline-flex items-center gap-1 text-emerald-700">
                      <CheckCircle2 className="h-3.5! w-3.5!" />
                      Done
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-amber-700">
                      <MapPin className="h-3.5! w-3.5!" />
                      Pending
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-xl bg-emerald-50 p-2 text-xs sm:text-sm text-emerald-700">
              <span className="inline-flex items-center gap-1 font-semibold">
                <ShieldCheck className="h-3.5! w-3.5!" />
                Completeness Score: 92%
              </span>
            </div>
          </article>
        </section>
      </div>
    </section>
  );
}

function KpiCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100">
        <Icon className="h-3.5! w-3.5! text-slate-700" />
      </span>
      <p className="mt-2 text-xs sm:text-sm text-slate-600">{label}</p>
      <p className="text-xl font-semibold leading-none">{value}</p>
    </div>
  );
}


