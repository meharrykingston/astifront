"use client";

import axios from 'axios';
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { ArrowLeft, Eye, Info, Loader2, Plus, Save, Trash2, X } from "lucide-react";
import type {
  SeoContentSection,
  SeoPageKind,
  SeoPageRecord,
  SeoPageStatus,
  UpsertSeoPagePayload,
} from "@/types/seoPage";
import SeoPageTemplate from "@/components/seo/SeoPageTemplate";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const quillModules = {
  toolbar: [
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "clean"],
  ],
};

interface BuilderProps {
  onBack: () => void;
  pageData?: SeoPageRecord;
  onSave: (payload: UpsertSeoPagePayload, pageId?: string) => Promise<void>;
}

type FormState = {
  titleTag: string;
  targetKeyword: string;
  pageKind: SeoPageKind;
  overview: string;
  sections: SeoContentSection[];
  quickAnswer: string;
  metaTag: string;
  metaDescription: string;
  url: string;
  status: SeoPageStatus;
  author: string;
  h1: string;
  h3: string;
  keywordPlacement: string;
  imageAltText: string;
  internalLinks: string;
};

const labels = {
  titleTag: "Title Tag (Browser title + hero fallback if H1 empty)",
  targetKeyword: "Primary Target Keyword",
  url: "URL (Real page route/slug)",
  metaDescription: "Meta Description (Hero intro paragraph + search snippet)",
  overview: "Overview (Overview card content on real page)",
  h1: "Heading Structure (H1 - hero main heading)",
  h3: "Heading Structure (H3 - optional subtopics, one per line)",
  keywordPlacement: "Keyword Placement (SEO keyword notes, one per line)",
  imageAltText: "Image Alt Text (image SEO alt metadata, not visible text)",
  internalLinks: "Internal Linking (internal SEO links list, not visible text)",
  quickAnswer: "Quick Answer (AEO / GEO block below H1 title)",
  metaTag: "Meta Tag (SEO keyword chips in Overview, comma-separated)",
  author: "Author (CMS record, not visible in template)",
  pageKind: "Page Type (CMS classification, not visible in template)",
  status: "Status (publish control, not visible in template)",
} as const;

const defaultH3 = ["Daily triggers", "Lifestyle adjustments", "Warning signs", "Recovery tips"].join("\n");

const defaultKeywordPlacement = [
  "Primary keyword in H1",
  "Primary keyword in first paragraph",
  "Secondary keyword in at least one H2",
  "Long-tail keyword in last section",
].join("\n");

function createSection(partial?: Partial<SeoContentSection>): SeoContentSection {
  return {
    id: partial?.id || `section-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    heading: partial?.heading || "",
    body: partial?.body || "",
  };
}

function splitContentBlocks(text: string): string[] {
  return String(text || "")
    .replace(/\r/g, "")
    .split(/\n\s*---\s*\n/g)
    .map((block) => block.trim())
    .filter(Boolean);
}

function getInitialSections(pageData?: SeoPageRecord): SeoContentSection[] {
  if (pageData?.sections && pageData.sections.length > 0) {
    return pageData.sections.map((section, idx) =>
      createSection({
        id: section.id || `section-${idx + 1}`,
        heading: section.heading,
        body: section.body,
      }),
    );
  }

  if (!pageData) return [];

  const headings = pageData.headingStructure?.h2 || [];
  const blocks = splitContentBlocks(pageData.content || "");
  const usesSeparateOverview = Boolean((pageData.overview || "").trim());
  const sectionBlocks = usesSeparateOverview ? blocks : blocks.slice(1);
  const count = Math.max(headings.length, sectionBlocks.length);

  if (count === 0) return [];

  return Array.from({ length: count }, (_, idx) =>
    createSection({
      id: `section-${idx + 1}`,
      heading: headings[idx] || `Section ${idx + 1}`,
      body: sectionBlocks[idx] || "",
    }),
  );
}

function getInitialForm(pageData?: SeoPageRecord): FormState {
  return {
    titleTag: pageData?.titleTag || "",
    targetKeyword: pageData?.targetKeyword || "",
    pageKind: pageData?.pageKind || "symptom",
    overview: pageData?.overview || "",
    sections: getInitialSections(pageData),
    quickAnswer: pageData?.quickAnswer || "",
    metaTag: pageData?.metaTag || "",
    metaDescription: pageData?.metaDescription || "",
    url: pageData?.url || "",
    status: pageData?.status || "draft",
    author: pageData?.author || "SEO Team",
    h1: pageData?.headingStructure.h1 || "",
    h3: pageData?.headingStructure.h3.join("\n") || defaultH3,
    keywordPlacement: pageData?.keywordPlacement.join("\n") || defaultKeywordPlacement,
    imageAltText: pageData?.imageAltText.join("\n") || "",
    internalLinks: pageData?.internalLinks.join("\n") || "",
  };
}

function getKindPrefix(pageKind: SeoPageKind): string {
  if (pageKind === "symptom") return "/symptoms";
  if (pageKind === "disease") return "/diseases";
  if (pageKind === "test") return "/tests";
  if (pageKind === "medicine") return "/medicines";
  if (pageKind === "cause") return "/causes";
  if (pageKind === "treatment") return "/treatments";
  return "/symptoms";
}

function normalizePreviewSlug(value: string, pageKind: SeoPageKind): string {
  const prefix = getKindPrefix(pageKind);
  const normalized = value.trim().replace(/\s+/g, "-").replace(/\/{2,}/g, "/");

  if (!normalized) return prefix;

  const withSlash = normalized.startsWith("/") ? normalized : `/${normalized}`;
  const segments = withSlash.split("/").filter(Boolean);
  const prefixSegment = prefix.replace("/", "");

  if (segments.length === 0) return prefix;
  if (segments[0] === prefixSegment) return `/${segments.join("/")}`;
  if (segments.length === 1) return `${prefix}/${segments[0]}`;

  return `${prefix}/${segments.slice(1).join("/")}`;
}

function splitLines(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function quillToText(value: string): string {
  return String(value || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default function Builder({ onBack, pageData, onSave }: BuilderProps) {
  const [form, setForm] = useState<FormState>(() => getInitialForm(pageData));
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [error, setError] = useState("");

  const modeLabel = pageData ? "Update SEO Page" : "Create SEO Page";
  const previewSlug = useMemo(() => normalizePreviewSlug(form.url, form.pageKind), [form.url, form.pageKind]);

  const updateField = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addSection = () => {
    setForm((prev) => ({ ...prev, sections: [...prev.sections, createSection()] }));
  };

  const deleteSection = (sectionId: string) => {
    setForm((prev) => ({ ...prev, sections: prev.sections.filter((section) => section.id !== sectionId) }));
  };

  const updateSection = (sectionId: string, key: "heading" | "body", value: string) => {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? {
            ...section,
            [key]: value,
          }
          : section,
      ),
    }));
  };

  const normalizedSections = useMemo(
    () =>
      form.sections
        .map((section) => ({
          ...section,
          heading: section.heading.trim(),
          body: section.body.trim(),
        }))
        .filter((section) => section.heading || quillToText(section.body)),
    [form.sections],
  );

  const legacyContent = useMemo(
    () => normalizedSections.map((section) => quillToText(section.body)).filter(Boolean).join("\n\n---\n\n"),
    [normalizedSections],
  );

  const previewPage = useMemo<SeoPageRecord>(() => {
    const now = new Date().toISOString();
    return {
      id: pageData?.id || "preview-page",
      pageKind: form.pageKind,
      overview: form.overview,
      sections: normalizedSections,
      content: legacyContent,
      quickAnswer: form.quickAnswer,
      titleTag: form.titleTag,
      targetKeyword: form.targetKeyword,
      metaTag: form.metaTag,
      metaDescription: form.metaDescription,
      url: normalizePreviewSlug(form.url, form.pageKind),
      status: form.status,
      author: form.author || "SEO Team",
      headingStructure: {
        h1: form.h1,
        h2: normalizedSections.map((section) => section.heading).filter(Boolean),
        h3: splitLines(form.h3),
      },
      keywordPlacement: splitLines(form.keywordPlacement),
      imageAltText: splitLines(form.imageAltText),
      internalLinks: splitLines(form.internalLinks),
      views: pageData?.views || 0,
      createdAt: pageData?.createdAt || now,
      updatedAt: now,
    };
  }, [form, legacyContent, normalizedSections, pageData]);

  const submit = async () => {
    setError("");
    setIsSaving(true);

    try {
      const payload = {
        titleTag: form.titleTag,
        targetKeyword: form.targetKeyword,
        pageKind: form.pageKind,
        overview: form.overview,
        sections: normalizedSections,
        content: legacyContent,
        quickAnswer: form.quickAnswer,
        metaTag: form.metaTag,
        metaDescription: form.metaDescription,
        url: form.url,
        status: form.status,
        author: form.author,
        headingStructure: {
          h1: form.h1,
          h2: normalizedSections.map((section) => section.heading).filter(Boolean).join("\n"),
          h3: form.h3,
        },
        keywordPlacement: form.keywordPlacement,
        imageAltText: form.imageAltText,
        internalLinks: form.internalLinks,
      };

      const pageId = pageData?.id || null;
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = pageId
        ? await axios.put(`${apiBaseUrl}/api/pages/${pageId}`, payload)
        : await axios.post(`${apiBaseUrl}/api/pages`, payload);

      if (response.status === 201 || response.status === 200) {
        await onSave(payload as UpsertSeoPagePayload, pageId ?? undefined);
        alert("🚀 Page Successfully Saved to Fastify Backend!");
        onBack(); // Wapas list par jaane ke liye
      }
    } catch (err: any) {
      console.error("Save Error:", err);
      setError(err.response?.data?.message || "Failed to connect to Fastify Server");
    } finally {
      setIsSaving(false);
    }
  };

  if (isPreviewOpen) {
    return (
      <div className="min-h-screen bg-slate-100 font-['Sora']">
        <div className="sticky top-0 z-70 border-b border-slate-200 bg-white/95 px-3 py-2 backdrop-blur sm:px-5">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-2">
            <button
              onClick={() => setIsPreviewOpen(false)}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              <ArrowLeft className="h-3.5! w-3.5!" />
              Back to editor
            </button>

            <div className="text-xs sm:text-sm font-medium text-slate-600">Live Preview: current unsaved form data</div>

            <button
              onClick={submit}
              disabled={isSaving}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-blue-600 px-4 text-xs sm:text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? <Loader2 className="h-3.5! w-3.5! animate-spin" /> : <Save className="h-3.5! w-3.5!" />}
              {isSaving ? "Saving..." : pageData ? "Update Page" : "Create Page"}
            </button>
          </div>
        </div>

        <SeoPageTemplate page={previewPage} />
      </div>
    );
  }

  return (
    <section className="min-h-screen w-full overflow-x-hidden bg-slate-50 font-['Sora'] text-slate-900">
      {isHelpOpen && (
        <div className="fixed inset-0 z-80 grid place-items-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-slate-900">
                <Info className="h-4! w-4!" />
                SEO Publishing Instructions
              </h2>
              <button
                onClick={() => setIsHelpOpen(false)}
                className="inline-flex h-8 items-center justify-center rounded-lg border border-slate-200 px-2 text-slate-600 hover:bg-slate-100"
              >
                <X className="h-3.5! w-3.5!" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs sm:text-sm text-slate-700">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="font-semibold text-slate-900">How Section Builder Works</p>
                <p className="mt-1">Create one content card per section.</p>
                <p className="mt-1">Write section heading in the top input.</p>
                <p className="mt-1">Write rich content in editor (bold, list, links).</p>
                <p className="mt-1">Section headings are used automatically for sidebar navigation.</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="font-semibold text-slate-900">Before You Publish</p>
                <p className="mt-1">Check Preview, confirm section order, and switch status to `Published` only when final.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="sticky top-0 z-60 border-b border-slate-200 bg-white/95 px-3 py-2 backdrop-blur sm:px-5">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2">
          <button
            onClick={onBack}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            <ArrowLeft className="h-3.5! w-3.5!" />
            Back to pages
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPreviewOpen(true)}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              <Eye className="h-3.5! w-3.5!" />
              Preview
            </button>

            <button
              onClick={() => setIsHelpOpen(true)}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              <Info className="h-3.5! w-3.5!" />
              Instructions
            </button>

            <button
              onClick={submit}
              disabled={isSaving}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-blue-600 px-4 text-xs sm:text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? <Loader2 className="h-3.5! w-3.5! animate-spin" /> : <Save className="h-3.5! w-3.5!" />}
              {isSaving ? "Saving..." : pageData ? "Update Page" : "Create Page"}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl space-y-4 p-3 sm:p-5 lg:p-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">{modeLabel}</h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600">
            SEO-first form with dynamic content blocks powered by React Quill.
          </p>
          <p className="mt-2 inline-flex rounded-lg bg-slate-100 px-2.5 py-1 text-xs sm:text-sm font-mono text-slate-700">
            Preview URL: {previewSlug}
          </p>
        </div>

        {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs sm:text-sm text-red-700">{error}</div>}

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <h2 className="text-sm sm:text-base font-semibold text-slate-900">Required SEO Inputs</h2>
            <div className="mt-3 grid gap-4 lg:grid-cols-2">
              <label className="text-xs sm:text-sm font-medium text-slate-700">
                {labels.titleTag}
                <input
                  value={form.titleTag}
                  onChange={(e) => updateField("titleTag", e.target.value)}
                  placeholder="Chest Pain Guide | Astikan"
                  className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs sm:text-sm outline-none focus:border-blue-300 focus:bg-white"
                />
              </label>

              <label className="text-xs sm:text-sm font-medium text-slate-700">
                {labels.url}
                <input
                  value={form.url}
                  onChange={(e) => updateField("url", e.target.value)}
                  placeholder="/chest-pain"
                  className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs sm:text-sm outline-none focus:border-blue-300 focus:bg-white"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Enter only slug like <span className="font-mono">chest-pain</span>. Route is auto-mapped by Page Type.
                </p>
              </label>

              <label className="lg:col-span-2 text-xs sm:text-sm font-medium text-slate-700">
                {labels.metaDescription}
                <textarea
                  rows={4}
                  value={form.metaDescription}
                  onChange={(e) => updateField("metaDescription", e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm outline-none focus:border-blue-300 focus:bg-white"
                />
              </label>

              <label className="lg:col-span-2 text-xs sm:text-sm font-medium text-slate-700">
                {labels.overview}
                <textarea
                  rows={4}
                  value={form.overview}
                  onChange={(e) => updateField("overview", e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm outline-none focus:border-blue-300 focus:bg-white"
                />
              </label>

              <label className="lg:col-span-2 text-xs sm:text-sm font-medium text-slate-700">
                {labels.quickAnswer}
                <textarea
                  rows={3}
                  value={form.quickAnswer}
                  onChange={(e) => updateField("quickAnswer", e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm outline-none focus:border-blue-300 focus:bg-white"
                />
              </label>

              <label className="text-xs sm:text-sm font-medium text-slate-700">
                {labels.h1}
                <input
                  value={form.h1}
                  onChange={(e) => updateField("h1", e.target.value)}
                  className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs sm:text-sm outline-none focus:border-blue-300 focus:bg-white"
                />
              </label>

              <label className="text-xs sm:text-sm font-medium text-slate-700">
                {labels.targetKeyword}
                <input
                  value={form.targetKeyword}
                  onChange={(e) => updateField("targetKeyword", e.target.value)}
                  placeholder="e.g. chest pain causes"
                  className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs sm:text-sm outline-none focus:border-blue-300 focus:bg-white"
                />
              </label>

              <label className="text-xs sm:text-sm font-medium text-slate-700">
                {labels.h3}
                <textarea
                  rows={6}
                  value={form.h3}
                  onChange={(e) => updateField("h3", e.target.value)}
                  placeholder={defaultH3}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm outline-none focus:border-blue-300 focus:bg-white"
                />
              </label>

              <label className="text-xs sm:text-sm font-medium text-slate-700">
                {labels.keywordPlacement}
                <textarea
                  rows={6}
                  value={form.keywordPlacement}
                  onChange={(e) => updateField("keywordPlacement", e.target.value)}
                  placeholder={defaultKeywordPlacement}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm outline-none focus:border-blue-300 focus:bg-white"
                />
              </label>

              <label className="text-xs sm:text-sm font-medium text-slate-700">
                {labels.imageAltText}
                <textarea
                  rows={5}
                  value={form.imageAltText}
                  onChange={(e) => updateField("imageAltText", e.target.value)}
                  placeholder={"Person holding chest\nDoctor checking patient"}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm outline-none focus:border-blue-300 focus:bg-white"
                />
              </label>

              <label className="lg:col-span-2 text-xs sm:text-sm font-medium text-slate-700">
                {labels.internalLinks}
                <textarea
                  rows={5}
                  value={form.internalLinks}
                  onChange={(e) => updateField("internalLinks", e.target.value)}
                  placeholder={"/symptoms/headache\n/tests/blood-test"}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm outline-none focus:border-blue-300 focus:bg-white"
                />
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm sm:text-base font-semibold text-slate-900">Dynamic Content Sections</h2>
              <button
                type="button"
                onClick={addSection}
                className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <Plus className="h-3.5! w-3.5!" />
                Add Section
              </button>
            </div>

            {form.sections.length === 0 ? (
              <button
                type="button"
                onClick={addSection}
                className="mt-4 grid h-36 w-full place-items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-xs sm:text-sm text-slate-500 hover:bg-slate-100"
              >
                Click to add your first content block
              </button>
            ) : (
              <div className="mt-4 space-y-4">
                {form.sections.map((section, idx) => (
                  <div key={section.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <p className="text-xs sm:text-sm font-semibold text-slate-800">Section {idx + 1}</p>
                      <button
                        type="button"
                        onClick={() => deleteSection(section.id)}
                        className="inline-flex h-8 items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2 text-xs sm:text-sm font-medium text-red-600 hover:bg-red-100"
                      >
                        <Trash2 className="h-3.5! w-3.5!" />
                        Delete
                      </button>
                    </div>

                    <input
                      value={section.heading}
                      onChange={(e) => updateSection(section.id, "heading", e.target.value)}
                      placeholder="Section heading"
                      className="w-full border-0 border-b border-slate-300 bg-transparent px-0 pb-2 text-sm sm:text-base font-medium text-slate-900 outline-none focus:border-blue-500"
                    />

                    <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50">
                      <ReactQuill
                        theme="snow"
                        modules={quillModules}
                        value={section.body}
                        onChange={(value) => updateSection(section.id, "body", value)}
                        className="[&_.ql-container]:min-h-50 [&_.ql-container]:border-0 [&_.ql-editor]:min-h-50 [&_.ql-editor]:text-sm sm:[&_.ql-editor]:text-base [&_.ql-toolbar]:border-0 [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-slate-200"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <h2 className="text-sm sm:text-base font-semibold text-slate-900">Template Content & Publishing Options</h2>
            <div className="mt-3 grid gap-4 lg:grid-cols-2">
              <label className="text-xs sm:text-sm font-medium text-slate-700">
                {labels.metaTag}
                <input
                  value={form.metaTag}
                  onChange={(e) => updateField("metaTag", e.target.value)}
                  placeholder="chest pain, chest tightness, chest pain causes"
                  className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs sm:text-sm outline-none focus:border-blue-300 focus:bg-white"
                />
              </label>

              <label className="text-xs sm:text-sm font-medium text-slate-700">
                {labels.author}
                <input
                  value={form.author}
                  onChange={(e) => updateField("author", e.target.value)}
                  className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs sm:text-sm outline-none focus:border-blue-300 focus:bg-white"
                />
              </label>

              <label className="text-xs sm:text-sm font-medium text-slate-700">
                {labels.pageKind}
                <select
                  value={form.pageKind}
                  onChange={(e) => setForm((prev) => ({ ...prev, pageKind: e.target.value as SeoPageKind }))}
                  className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs sm:text-sm outline-none focus:border-blue-300 focus:bg-white"
                >
                  <option value="symptom">Symptom</option>
                  <option value="disease">Disease</option>
                  <option value="test">Test</option>
                  <option value="medicine">Medicine</option>
                  <option value="cause">Cause</option>
                  <option value="treatment">Treatment</option>
                </select>
              </label>

              <label className="text-xs sm:text-sm font-medium text-slate-700">
                {labels.status}
                <select
                  value={form.status}
                  onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as SeoPageStatus }))}
                  className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs sm:text-sm outline-none focus:border-blue-300 focus:bg-white"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </label>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
