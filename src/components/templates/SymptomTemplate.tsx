"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronRight, HeartPulse, Info, Sparkles, Tag, FileText } from "lucide-react";
import type { SeoPageRecord } from "@/types/seoPage";

gsap.registerPlugin(ScrollTrigger);

type SeoPageTemplateProps = {
  page: SeoPageRecord;
};

type SectionData = {
  id: string;
  title: string;
  paragraphs: string[];
  bodyHtml?: string;
};

function isHiddenSectionTitle(title: string): boolean {
  return /^(final thoughts?|our approach)$/i.test(title.trim());
}

const iconClass = "h-5! w-5! sm:h-7! sm:w-7!";

function toParagraphs(text: string): string[] {
  return text
    .replace(/\r/g, "")
    .split(/\n{2,}/g)
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitContentBlocks(text: string): string[] {
  return text
    .replace(/\r/g, "")
    .split(/\n\s*---\s*\n/g)
    .map((block) => block.trim())
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
  const normalized = String(pageKind || "symptom").trim().toLowerCase();
  if (!normalized) return "Symptom";
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

export default function SymptomTemplate({ page }: SeoPageTemplateProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState("overview");

  const h1 = page.headingStructure.h1.trim() || page.titleTag || "Astikan Health Guide";
  const quickAnswer = (page.quickAnswer || "").trim();

  const contentBlocks = useMemo(() => splitContentBlocks(page.content || ""), [page.content]);
  const overview =
    (page.overview || "").trim() ||
    page.metaDescription ||
    "Get a practical, easy-to-read guide generated from your SEO page form.";
  const overviewParagraphs = useMemo(() => toParagraphs(overview), [overview]);

  const headings = useMemo(() => {
    const cleaned = page.headingStructure.h2.map((h) => h.trim()).filter(Boolean);
    if (cleaned.length) return cleaned;

    return ["What Is It", "Why It Happens", "Common Symptoms", "When To See A Doctor", "How To Get Relief"];
  }, [page.headingStructure.h2]);

  const sections = useMemo<SectionData[]>(() => {
    const richSections = Array.isArray(page.sections) ? page.sections.filter((item) => item.heading || item.body) : [];
    if (richSections.length > 0) {
      return richSections
        .map((item, idx) => ({
          id: toId(item.heading || `section-${idx + 1}`, `section-${idx + 1}`),
          title: item.heading || `Section ${idx + 1}`,
          paragraphs: [],
          bodyHtml: item.body || "",
        }))
        .filter((item) => !isHiddenSectionTitle(item.title));
    }

    const usesSeparateOverview = Boolean((page.overview || "").trim());
    const sectionBlocks = usesSeparateOverview ? contentBlocks : contentBlocks.slice(1);

    return headings
      .map((title, idx) => ({
        id: toId(title, `section-${idx + 1}`),
        title,
        paragraphs: sectionBlocks[idx] ? toParagraphs(sectionBlocks[idx]) : [],
      }))
      .filter((item) => !isHiddenSectionTitle(item.title));
  }, [contentBlocks, headings, page.overview, page.sections]);


  const toc = useMemo(() => {
    const baseToc = [{ id: "overview", title: "Overview" }];
    const sectionItems = sections
      .filter(s => s.id !== "overview")
      .map((s) => ({ id: s.id, title: s.title }));

    return [...baseToc, ...sectionItems];
  }, [sections]);

  const topNav = useMemo(
    () => [
      { label: "Symptoms", id: sections[0]?.id || "overview" },
      { label: "Conditions", id: sections[1]?.id || "overview" },
    ],
    [sections],
  );

  const tags = useMemo(() => page.metaTag.split(",").map((k) => k.trim()).filter(Boolean), [page.metaTag]);
  const pageTypeHeading = useMemo(() => toPageTypeHeading(page.pageKind), [page.pageKind]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;
    window.scrollTo({ top: element.offsetTop - 100, behavior: "smooth" });
  };

  useEffect(() => {
    gsap.fromTo(
      ".hero-item",
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: "power3.out" },
    );

    const blocks = gsap.utils.toArray(".gsap-section");
    blocks.forEach((block) => {
      gsap.fromTo(
        block as gsap.TweenTarget,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: "power2.out",
          scrollTrigger: {
            trigger: block as gsap.DOMTarget,
            start: "top 86%",
            toggleActions: "play none none none",
          },
        },
      );
    });
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const scan = toc
        .map((item) => ({
          id: item.id,
          top: document.getElementById(item.id)?.offsetTop ?? Number.NEGATIVE_INFINITY,
        }))
        .filter((x) => x.top !== Number.NEGATIVE_INFINITY);

      const y = window.scrollY + 130;
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

  const GlassCard = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
    <div
      className={`rounded-3xl border border-white/60 bg-white/45 backdrop-blur-xl shadow-[0_10px_34px_rgba(15,23,42,0.08)] ${className}`}
    >
      {children}
    </div>
  );

  const renderParagraphBlock = (text: string, key: string) => {
    const bullets = toBulletItems(text);
    if (bullets.length > 0) {
      return (
        <ul key={key} className="list-disc space-y-2 pl-5 text-sm sm:text-base text-slate-700 leading-relaxed marker:text-cyan-500">
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
    <div ref={containerRef} className="relative min-h-screen overflow-hidden bg-slate-100 font-['Sora'] text-slate-900">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-16 top-0 h-72 w-72 rounded-full bg-indigo-200/35 blur-[130px]" />
        <div className="absolute right-0 top-1/4 h-80 w-80 rounded-full bg-cyan-200/30 blur-[130px]" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-teal-200/30 blur-[130px]" />
      </div>

      <header className="sticky top-0 z-60 border-b border-white/60 bg-slate-50/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-350 items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <button onClick={() => scrollToSection("overview")} className="inline-flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-linear-to-br from-indigo-500 to-cyan-500 text-white shadow-sm">
              <HeartPulse className={iconClass} />
            </span>
            <span className="text-base md:text-lg font-semibold tracking-tight text-slate-800 sm:text-4xl">Astikan</span>
          </button>

          <nav className="hidden md:flex items-center gap-8 text-sm lg:text-base font-medium text-slate-600">
            {topNav.map((item) => (
              <button key={item.label} onClick={() => scrollToSection(item.id)} className="transition hover:text-slate-900">
                {item.label}
              </button>
            ))}
          </nav>

          <button
            onClick={() => scrollToSection(sections[0]?.id || "overview")}
            className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm lg:text-base font-semibold text-indigo-600 shadow-sm transition hover:bg-slate-50"
          >
            Find Relief
          </button>
        </div>
      </header>

      <section className="px-4 pt-12 pb-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="hero-item text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900">
            {pageTypeHeading}
          </h2>

          <div className="hero-item inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-4 py-2 text-sm font-semibold text-indigo-700">
            <Sparkles className={iconClass} />
            Astikan Symptom Guide
          </div>

          <h1 className="hero-item mt-6 text-3xl sm:text-4xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
            {h1}
          </h1>

          {quickAnswer ? (
            <div className="hero-item mx-auto mt-4 max-w-3xl rounded-2xl border border-indigo-200 bg-indigo-50/70 px-4 py-3 text-left">
              <p className="text-xs sm:text-sm font-semibold text-indigo-700">Quick Answer (AEO / GEO)</p>
              <p className="mt-1 text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">{quickAnswer}</p>
            </div>
          ) : null}

          <p className="hero-item mx-auto mt-5 max-w-3xl text-sm sm:text-base text-slate-600 leading-relaxed whitespace-pre-line">
            {page.metaDescription || overview}
          </p>
        </div>
      </section>

      <div className="mx-auto flex max-w-350 gap-8 px-4 pb-16 sm:px-6 lg:px-8">
        <aside className="hidden lg:block w-72 shrink-0">
          <GlassCard className="sticky top-28 p-5">
            <h2 className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-700">
              <Info className={`${iconClass} text-indigo-500`} />
              In this guide
            </h2>
            <nav className="space-y-1.5">
              {toc.map((item, index) => (
                <button
                  key={`${item.id}-${index}`}
                  onClick={() => scrollToSection(item.id)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition ${activeSection === item.id
                    ? "bg-white text-indigo-700 font-semibold shadow-sm"
                    : "text-slate-600 hover:bg-white/70"
                    }`}
                >
                  <span>{item.title}</span>
                  {activeSection === item.id ? <ChevronRight className={iconClass} /> : null}
                </button>
              ))}
            </nav>
          </GlassCard>
        </aside>

        <main className="min-w-0 flex-1 space-y-8">
          <section id="overview" className="gsap-section scroll-mt-28">
            <GlassCard className="p-6 sm:p-8">
              <h2 className="inline-flex items-center gap-2 text-2xl font-bold text-slate-800">
                <FileText className={`${iconClass} text-indigo-500`} />
                Overview
              </h2>
              <div className="mt-4 space-y-4">
                {overviewParagraphs.length > 0
                  ? overviewParagraphs.map((text, idx) => renderParagraphBlock(text, `overview-${idx}`))
                  : renderParagraphBlock(overview, "overview-fallback")}
              </div>

              {tags.length > 0 && (
                <div className="mt-5">
                  <p className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <Tag className={`${iconClass} text-indigo-500`} />
                    SEO Keywords
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((item) => (
                      <span key={item} className="rounded-full border border-indigo-200 bg-indigo-50/80 px-3 py-1 text-sm text-slate-700">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </GlassCard>
          </section>

          {sections.map((section) => (
            <section key={section.id} id={section.id} className="gsap-section scroll-mt-28">
              <GlassCard className="p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-800">{section.title}</h3>
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
              </GlassCard>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}

