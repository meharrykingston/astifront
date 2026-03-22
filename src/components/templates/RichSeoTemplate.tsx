"use client";

import type { ComponentType } from "react";
import { useMemo, useState, useEffect } from "react";
import { ArrowUpRight, BookOpenCheck, ChevronRight, ClipboardList, FileSearch, Info, Pill, ShieldCheck, Stethoscope, Tag } from "lucide-react";
import type { SeoPageRecord } from "@/types/seoPage";

export type SeoTemplateTheme = {
  accentFrom: string;
  accentTo: string;
  badge: string;
  cta: string;
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
};

type SeoPageTemplateProps = {
  page: SeoPageRecord;
  theme: SeoTemplateTheme;
};

type SectionData = {
  id: string;
  title: string;
  paragraphs: string[];
  bodyHtml?: string;
};

function toParagraphs(text: string): string[] {
  return text
    .replace(/\r/g, "")
    .split(/\n{2,}/g)
    .map((item) => item.trim())
    .filter(Boolean);
}

function toBulletItems(text: string): string[] {
  const lines = text
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (!lines.length) return [];
  const allBullet = lines.every((line) => /^[-*\u2022]\s+/.test(line));
  if (!allBullet) return [];

  return lines.map((line) => line.replace(/^[-*\u2022]\s+/, "").trim()).filter(Boolean);
}

function splitContentBlocks(text: string): string[] {
  return text
    .replace(/\r/g, "")
    .split(/\n\s*---\s*\n/g)
    .map((block) => block.trim())
    .filter(Boolean);
}

function toId(label: string, fallback: string): string {
  const slug = label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  return slug || fallback;
}

function toPageTypeHeading(pageKind: string): string {
  const normalized = String(pageKind || "page").trim().toLowerCase();
  if (!normalized) return "Guide";
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function SectionIcon({ title }: { title: string }) {
  const smallIcon = { width: 16, height: 16 };
  if (/cause|risk/i.test(title)) return <FileSearch style={smallIcon} />;
  if (/symptom|sign/i.test(title)) return <Stethoscope style={smallIcon} />;
  if (/treatment|relief|manage/i.test(title)) return <ShieldCheck style={smallIcon} />;
  if (/medicine|drug|dose/i.test(title)) return <Pill style={smallIcon} />;
  if (/test|diagnos/i.test(title)) return <ClipboardList style={smallIcon} />;
  return <BookOpenCheck style={smallIcon} />;
}

export default function RichSeoTemplate({ page, theme }: SeoPageTemplateProps) {
  const [activeSection, setActiveSection] = useState("overview");
  const smallIcon = { width: 16, height: 16 };
  const medIcon = { width: 18, height: 18 };

  const h1 = page.headingStructure.h1.trim() || page.titleTag || "Astikan Health Guide";
  const quickAnswer = (page.quickAnswer || "").trim();
  const pageTypeHeading = useMemo(() => toPageTypeHeading(page.pageKind), [page.pageKind]);

  const contentBlocks = useMemo(() => splitContentBlocks(page.content || ""), [page.content]);
  const overview =
    (page.overview || "").trim() ||
    page.metaDescription ||
    "Get a practical, easy-to-read guide generated from your SEO page form.";
  const overviewParagraphs = useMemo(() => toParagraphs(overview), [overview]);

  const headings = useMemo(() => {
    const cleaned = page.headingStructure.h2.map((h) => h.trim()).filter(Boolean);
    if (cleaned.length) return cleaned;

    return ["Key Insights", "Why It Matters", "What To Do Next", "When To Seek Help", "Common Questions"];
  }, [page.headingStructure.h2]);

  const sections = useMemo<SectionData[]>(() => {
    const richSections = Array.isArray(page.sections) ? page.sections.filter((item) => item.heading || item.body) : [];
    if (richSections.length > 0) {
      return richSections.map((item, idx) => ({
        id: toId(item.heading || `section-${idx + 1}`, `section-${idx + 1}`),
        title: item.heading || `Section ${idx + 1}`,
        paragraphs: [],
        bodyHtml: item.body || "",
      }));
    }

    const usesSeparateOverview = Boolean((page.overview || "").trim());
    const sectionBlocks = usesSeparateOverview ? contentBlocks : contentBlocks.slice(1);

    return headings.map((title, idx) => ({
      id: toId(title, `section-${idx + 1}`),
      title,
      paragraphs: sectionBlocks[idx] ? toParagraphs(sectionBlocks[idx]) : [],
    }));
  }, [contentBlocks, headings, page.overview, page.sections]);

  const toc = useMemo(() => {
    const baseToc = [{ id: "overview", title: "Overview" }];
    const sectionItems = sections.map((s) => ({ id: s.id, title: s.title }));
    return [...baseToc, ...sectionItems];
  }, [sections]);

  const tags = useMemo(() => page.metaTag.split(",").map((k) => k.trim()).filter(Boolean), [page.metaTag]);
  const Icon = theme.icon;

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;
    window.scrollTo({ top: element.offsetTop - 100, behavior: "smooth" });
  };

  useEffect(() => {
    const onScroll = () => {
      const scan = toc
        .map((item) => ({
          id: item.id,
          top: document.getElementById(item.id)?.offsetTop ?? Number.NEGATIVE_INFINITY,
        }))
        .filter((x) => x.top !== Number.NEGATIVE_INFINITY);

      const y = window.scrollY + 140;
      let current = scan[0]?.id || "overview";
      for (let i = scan.length - 1; i >= 0; i -= 1) {
        if (scan[i].top <= y) {
          current = scan[i].id;
          break;
        }
      }
      setActiveSection(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [toc]);

  const renderParagraphBlock = (text: string, key: string) => {
    const bullets = toBulletItems(text);
    if (bullets.length > 0) {
      return (
        <ul key={key} className="list-disc space-y-2 pl-5 text-sm sm:text-base text-slate-700 leading-relaxed marker:text-indigo-500">
          {bullets.map((item, idx) => (
            <li key={`${key}-li-${idx}`}>{item}</li>
          ))}
        </ul>
      );
    }

    return (
      <p key={key} className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
        {text}
      </p>
    );
  };

  return (
    <div className="relative min-h-screen bg-slate-100 font-['Sora'] text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className={`absolute -left-20 top-10 h-72 w-72 rounded-full ${theme.accentFrom} blur-[140px] opacity-40`} />
        <div className={`absolute right-0 top-40 h-72 w-72 rounded-full ${theme.accentTo} blur-[140px] opacity-40`} />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/60 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-350 items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <button onClick={() => scrollToSection("overview")} className="inline-flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-white shadow-sm border border-slate-200">
              <img src="/favicon.png" alt="Astikan" style={{ width: 28, height: 28 }} />
            </span>
            <span className="text-base font-semibold tracking-tight text-slate-800">Astikan</span>
          </button>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            {toc.slice(0, 3).map((item) => (
              <button key={item.id} onClick={() => scrollToSection(item.id)} className="transition hover:text-slate-900">
                {item.title}
              </button>
            ))}
          </nav>

          <button
            onClick={() => scrollToSection(sections[0]?.id || "overview")}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
          >
            {theme.cta}
            <ArrowUpRight style={smallIcon} />
          </button>
        </div>
      </header>

      <section className="px-4 pt-12 pb-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700">
            <span className={`h-2.5 w-2.5 rounded-full bg-linear-to-br ${theme.accentFrom} ${theme.accentTo}`} />
            {theme.badge}
          </div>

          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900">
            {pageTypeHeading}
          </h2>
          <h1 className="mt-4 text-3xl sm:text-4xl lg:text-6xl font-extrabold tracking-tight text-slate-900">
            {h1}
          </h1>

          {quickAnswer ? (
            <div className="mx-auto mt-5 max-w-3xl rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-left">
              <p className="text-xs font-semibold text-slate-600">Quick answer</p>
              <p className="mt-1 text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">{quickAnswer}</p>
            </div>
          ) : null}

          <p className="mx-auto mt-5 max-w-3xl text-sm sm:text-base text-slate-600 leading-relaxed whitespace-pre-line">
            {page.metaDescription || overview}
          </p>
        </div>
      </section>

      <div className="mx-auto flex max-w-350 gap-8 px-4 pb-16 sm:px-6 lg:px-8">
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-28 rounded-3xl border border-white/70 bg-white/70 p-5 shadow-lg backdrop-blur-xl">
            <h2 className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-600">
              <Info style={smallIcon} className="text-slate-500" />
              In this guide
            </h2>
            <nav className="space-y-1.5">
              {toc.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition ${activeSection === item.id
                    ? "bg-white text-slate-900 font-semibold shadow-sm"
                    : "text-slate-600 hover:bg-white/70"
                    }`}
                >
                  <span>{item.title}</span>
                  {activeSection === item.id ? <ChevronRight style={smallIcon} /> : null}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        <main className="min-w-0 flex-1 space-y-8">
          <section id="overview" className="scroll-mt-28">
            <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-lg backdrop-blur-xl sm:p-8">
              <h2 className="inline-flex items-center gap-2 text-2xl font-bold text-slate-800">
                <BookOpenCheck style={medIcon} className="text-slate-600" />
                Overview
              </h2>
              <div className="mt-4 space-y-4">
                {overviewParagraphs.length > 0
                  ? overviewParagraphs.map((text, idx) => renderParagraphBlock(text, `overview-${idx}`))
                  : renderParagraphBlock(overview, "overview-fallback")}
              </div>

              {tags.length > 0 && (
                <div className="mt-5">
                  <p className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Tag style={smallIcon} />
                    SEO Keywords
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((item) => (
                      <span key={item} className="rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-sm text-slate-700">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-28">
              <div className="rounded-3xl border border-white/70 bg-white/85 p-6 shadow-lg backdrop-blur-xl sm:p-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600">
                  <SectionIcon title={section.title} />
                  {theme.label}
                </div>
                <h3 className="mt-3 text-xl sm:text-2xl font-bold text-slate-800">{section.title}</h3>
                <div className="mt-4 space-y-4">
                  {section.bodyHtml ? (
                    <div
                      className="prose prose-slate max-w-none text-sm sm:text-base prose-p:mb-4 prose-ul:my-4 prose-ol:my-4 prose-li:my-1 prose-a:text-indigo-600 prose-a:underline"
                      dangerouslySetInnerHTML={{ __html: section.bodyHtml }}
                    />
                  ) : section.paragraphs.length > 0 ? (
                    section.paragraphs.map((text, i) => renderParagraphBlock(text, `${section.id}-${i}`))
                  ) : (
                    <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                      Details for this section were not provided in the create form yet.
                    </p>
                  )}
                </div>
              </div>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}
