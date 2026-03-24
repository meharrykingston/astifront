import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Eye, Loader2, Save } from "lucide-react";
import { type BlogRecord, type BlogStatus, type UpsertBlogPayload } from "@/services/blogService";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const quillModules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "clean"],
  ],
};

function slugify(text: string) {
  const slug = text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
  return slug || "untitled-post";
}

function toBlogPath(value: string): string {
  const input = value.trim();
  if (!input) return "/blog/untitled-post";
  if (input.startsWith("/blog/")) return input;
  if (input.startsWith("/")) return `/blog/${input.slice(1)}`;
  return `/blog/${input}`;
}

function parseCommaSeparated(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

type BlogBuildProps = {
  post: BlogRecord;
  onBack: () => void;
  onSave: (payload: UpsertBlogPayload) => Promise<void>;
};

export default function BlogBuild({ post, onBack, onSave }: BlogBuildProps) {
  const [draft, setDraft] = useState<BlogRecord>(post);
  const [slugEditedManually, setSlugEditedManually] = useState(Boolean(post.slug && post.slug !== "/blog/untitled-post"));
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [keywordsString, setKeywordsString] = useState(post.keywords?.join(", ") || "");
  const [backlinksString, setBacklinksString] = useState(post.backlinks?.join(", ") || "");

  useEffect(() => {
    setDraft(post);
    setSlugEditedManually(Boolean(post.slug && post.slug !== "/blog/untitled-post"));
    setKeywordsString(post.keywords?.join(", ") || "");
    setBacklinksString(post.backlinks?.join(", ") || "");
  }, [post]);

  useEffect(() => {
    if (showPreview) return;

    const toolbar = document.querySelector(".blog-build-editor .ql-toolbar");
    if (!toolbar) return;

    const setTooltip = (selector: string, label: string) => {
      const nodes = toolbar.querySelectorAll<HTMLElement>(selector);
      nodes.forEach((node) => {
        node.setAttribute("title", label);
        node.setAttribute("aria-label", label);
        node.setAttribute("data-tooltip", label);
      });
    };

    setTooltip("button.ql-bold", "Bold");
    setTooltip("button.ql-italic", "Italic");
    setTooltip("button.ql-underline", "Underline");
    setTooltip("button.ql-link", "Insert Link");
    setTooltip("button.ql-clean", "Clear Formatting");
    setTooltip("button.ql-list[value='ordered']", "Ordered List");
    setTooltip("button.ql-list[value='bullet']", "Bullet List");
    setTooltip(".ql-picker.ql-header .ql-picker-label", "Heading");
  }, [showPreview]);

  const updateTitle = (title: string) => {
    setDraft((prev) => ({
      ...prev,
      title,
      slug: slugEditedManually ? prev.slug : toBlogPath(slugify(title)),
    }));
  };

  const saveDraft = async () => {
    setIsSaving(true);
    try {
      const finalKeywords = parseCommaSeparated(keywordsString);
      const finalBacklinks = parseCommaSeparated(backlinksString);

      await onSave({
        id: draft.id || undefined,
        title: draft.title.trim(),
        slug: toBlogPath(draft.slug || slugify(draft.title)),
        author: draft.author.trim() || "SEO Team",
        status: draft.status,
        category: draft.category.trim() || "SEO",
        excerpt: draft.excerpt.trim(),
        content: draft.content,
        metaTitle: (draft.metaTitle || "").trim(),
        metaDescription: (draft.metaDescription || "").trim(),
        keywords: finalKeywords,
        backlinks: finalBacklinks,
      });
      alert("Blog saved successfully.");
      onBack();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to save the blog.";
      alert(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="min-h-screen w-full overflow-x-hidden bg-slate-50 p-4 font-['Sora'] text-slate-900 sm:p-6">
      <div className="mx-auto w-full max-w-6xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onBack}
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Back
          </button>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowPreview((prev) => !prev)}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 text-sm font-semibold text-blue-700 hover:bg-blue-100"
            >
              <Eye className="h-4! w-4!" />
              {showPreview ? "Hide Preview" : "Preview"}
            </button>

            <button
              onClick={saveDraft}
              disabled={isSaving}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSaving ? <Loader2 className="h-4! w-4! animate-spin" /> : <Save className="h-4! w-4!" />}
              {isSaving ? "Saving..." : "Save Post"}
            </button>
          </div>
        </div>

        {showPreview ? (
          <div className="min-w-0 overflow-hidden rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <h3 className="text-lg font-semibold text-slate-900">{draft.title || "Untitled Blog"}</h3>

            {draft.excerpt?.trim() && (
              <section className="mt-3 rounded-2xl border border-blue-100 bg-linear-to-r from-blue-50 to-cyan-50 p-4 sm:p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Quick Summary</p>
                <p className="mt-2 wrap-break-word text-base leading-relaxed text-slate-700 sm:text-lg">{draft.excerpt}</p>
              </section>
            )}

            <div
              className="prose prose-slate mt-6 max-w-none wrap-break-word overflow-hidden rounded-xl bg-white p-4 prose-a:break-all prose-a:text-blue-700 prose-a:underline prose-h1:text-slate-900 prose-h2:text-slate-900 prose-li:break-words prose-p:break-words"
              dangerouslySetInnerHTML={{ __html: draft.content || "<p>No content yet.</p>" }}
            />
          </div>
        ) : (
          <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">{draft.id ? "Edit Blog" : "Create Blog"}</h2>

            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
              <label className="text-sm font-medium text-slate-700">Title
                <input value={draft.title} onChange={(e) => updateTitle(e.target.value)} className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-blue-300 focus:bg-white" placeholder="Enter blog title" />
              </label>

              <label className="text-sm font-medium text-slate-700">Slug
                <input value={draft.slug} onChange={(e) => { setSlugEditedManually(true); setDraft((prev) => ({ ...prev, slug: toBlogPath(e.target.value) })); }} className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-blue-300 focus:bg-white" placeholder="/blog/my-post" />
              </label>

              <label className="text-sm font-medium text-slate-700">Category
                <input value={draft.category} onChange={(e) => setDraft((prev) => ({ ...prev, category: e.target.value }))} className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-blue-300 focus:bg-white" placeholder="SEO" />
              </label>

              <label className="text-sm font-medium text-slate-700">Status
                <select value={draft.status} onChange={(e) => setDraft((prev) => ({ ...prev, status: e.target.value as BlogStatus }))} className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-blue-300 focus:bg-white">
                  <option value="draft">Draft</option><option value="published">Published</option><option value="scheduled">Scheduled</option>
                </select>
              </label>

              <label className="lg:col-span-2 text-sm font-medium text-slate-700">Excerpt
                <textarea rows={3} value={draft.excerpt} onChange={(e) => setDraft((prev) => ({ ...prev, excerpt: e.target.value }))} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-blue-300 focus:bg-white" placeholder="Short summary for listings and previews" />
              </label>

              <label className="lg:col-span-2 text-sm font-medium text-slate-700">Content
                <div className="mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white">
                  <ReactQuill theme="snow" modules={quillModules} value={draft.content} onChange={(value) => setDraft((prev) => ({ ...prev, content: value }))} className="blog-build-editor [&_.ql-container]:min-h-72 [&_.ql-container]:border-0 [&_.ql-editor]:min-h-72 [&_.ql-toolbar]:border-0 [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-slate-200" />
                </div>
              </label>
            </div>

            <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-4">
              <h3 className="text-base font-semibold text-slate-900">SEO Settings</h3>
              <div className="mt-3 grid grid-cols-1 gap-4 lg:grid-cols-2">
                <label className="text-sm font-medium text-slate-700">Meta Title
                  <input value={draft.metaTitle || ""} onChange={(e) => setDraft((prev) => ({ ...prev, metaTitle: e.target.value }))} className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-300" placeholder="SEO optimized title for search engines" />
                </label>

                <label className="text-sm font-medium text-slate-700 lg:col-span-2">Meta Description
                  <textarea rows={3} value={draft.metaDescription || ""} onChange={(e) => setDraft((prev) => ({ ...prev, metaDescription: e.target.value }))} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-300" placeholder="Short description shown in search results" />
                  <p className={`mt-1 text-xs ${(draft.metaDescription || "").length > 160 ? "text-amber-600" : "text-slate-500"}`}>{(draft.metaDescription || "").length}/160 characters</p>
                </label>

                <label className="text-sm font-medium text-slate-700">Keywords
                  <input value={keywordsString} onChange={(e) => setKeywordsString(e.target.value)} className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-300" placeholder="health, wellness, symptom checker" />
                </label>

                <label className="text-sm font-medium text-slate-700">Backlinks
                  <input value={backlinksString} onChange={(e) => setBacklinksString(e.target.value)} className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-300" placeholder="https://example.com/article-a, https://example.com/article-b" />
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

