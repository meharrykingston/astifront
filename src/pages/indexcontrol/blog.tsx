import React, { useEffect, useState } from "react";
import SeoLayout from "@/components/seo/SeoLayout";
import type { NextPageWithLayout } from "../_app";
import styles from "./blog.module.css";
import { blogService, type BlogRecord, type BlogStatus, type UpsertBlogPayload } from "@/services/blogService";
import BlogList from "@/components/seo/blogs/BlogList";
import BlogBuild from "@/components/seo/blogs/BlogBuild";
import BlogUpload from "@/components/seo/blogs/BlogUpload";

type ViewMode = "list" | "editor" | "preview";

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

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item || "").trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function createEmptyPost(): BlogRecord {
  return {
    id: "",
    title: "",
    slug: "/blog/untitled-post",
    author: "SEO Team",
    status: "draft",
    category: "SEO",
    views: 0,
    seoScore: 0,
    updatedAt: new Date().toISOString().slice(0, 10),
    excerpt: "",
    content: "",
    metaTitle: "",
    metaDescription: "",
    keywords: [],
    backlinks: [],
  };
}

function BlogPreview({ post, onBack }: { post: BlogRecord; onBack: () => void }) {
  return (
    <section className="min-h-screen w-full overflow-x-hidden bg-slate-50 p-4 font-['Sora'] sm:p-6">
      <div className="mx-auto w-full max-w-4xl space-y-4">
        <button
          onClick={onBack}
          className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          Back
        </button>

        <article className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            {post.updatedAt} � {post.author}
          </p>
          <h1 className="mt-3 wrap-break-word text-2xl font-semibold text-slate-900">{post.title || "Untitled Blog"}</h1>
          <p className="mt-3 wrap-break-word text-slate-600">{post.excerpt}</p>

          <div
            className="prose prose-slate mt-6 max-w-none wrap-break-word overflow-hidden prose-a:break-all prose-a:text-blue-700 prose-a:underline prose-h1:text-slate-900 prose-h2:text-slate-900 prose-li:break-words prose-p:break-words"
            dangerouslySetInnerHTML={{ __html: post.content || "<p>No content available.</p>" }}
          />
        </article>
      </div>
    </section>
  );
}

const BlogPage: NextPageWithLayout = () => {
  const [posts, setPosts] = useState<BlogRecord[]>([]);
  const [mode, setMode] = useState<ViewMode>("list");
  const [activePost, setActivePost] = useState<BlogRecord | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isBulkUploading, setIsBulkUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    let mounted = true;
    setIsFetching(true);

    blogService
      .getAll()
      .then((data) => {
        if (mounted) setPosts(data);
      })
      .catch((error) => {
        const message = error instanceof Error ? error.message : "Unable to fetch blogs.";
        alert(message);
      })
      .finally(() => {
        if (mounted) setIsFetching(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const copyUrl = async (slug: string) => {
    try {
      const base = typeof window !== "undefined" ? window.location.origin : "";
      await navigator.clipboard.writeText(`${base}${slug}`);
      alert("URL copied.");
    } catch {
      alert("Unable to copy URL.");
    }
  };

  const toUploadPayload = (raw: any): UpsertBlogPayload | null => {
    const title = String(raw?.title || "").trim();
    if (!title) return null;

    const statusRaw = String(raw?.status || "draft").toLowerCase();
    const status: BlogStatus = statusRaw === "published" || statusRaw === "scheduled" ? (statusRaw as BlogStatus) : "draft";

    return {
      id: raw?.id ? String(raw.id) : undefined,
      title,
      slug: toBlogPath(String(raw?.slug || slugify(title))),
      author: String(raw?.author || "SEO Team").trim() || "SEO Team",
      status,
      category: String(raw?.category || "SEO").trim() || "SEO",
      excerpt: String(raw?.excerpt || raw?.summary || "").trim(),
      content: String(raw?.content || raw?.body || ""),
      metaTitle: String(raw?.metaTitle || "").trim(),
      metaDescription: String(raw?.metaDescription || "").trim(),
      keywords: toStringArray(raw?.keywords),
      backlinks: toStringArray(raw?.backlinks),
    };
  };

  const processUploadFile = async (file: File) => {
    try {
      setIsBulkUploading(true);
      const text = await file.text();
      const parsed = JSON.parse(text);
      const source: unknown[] = Array.isArray(parsed)
        ? parsed
        : Array.isArray(parsed?.blogs)
          ? parsed.blogs
          : Array.isArray(parsed?.data)
            ? parsed.data
            : [parsed];

      const payloads = source
        .map((item: unknown) => toUploadPayload(item))
        .filter((item: UpsertBlogPayload | null): item is UpsertBlogPayload => Boolean(item));

      if (payloads.length === 0) {
        alert("No valid blog items found in uploaded file.");
        return;
      }

      const saved = await Promise.all(payloads.map((payload) => blogService.createOrUpdate(payload)));
      setPosts((prev) => {
        const map = new Map(prev.map((post) => [post.id, post]));
        for (const item of saved) map.set(item.id, item);
        return Array.from(map.values()).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
      });

      alert(`${saved.length} blog${saved.length > 1 ? "s" : ""} uploaded successfully.`);
      setShowUploadModal(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to upload blogs.";
      alert(message);
    } finally {
      setIsBulkUploading(false);
    }
  };

  if (mode === "editor") {
    return (
      <BlogBuild
        post={activePost ?? createEmptyPost()}
        onBack={() => setMode("list")}
        onSave={async (payload) => {
          const saved = await blogService.createOrUpdate(payload);
          setPosts((prev) => {
            const exists = prev.some((p) => p.id === saved.id);
            if (!exists) return [saved, ...prev];
            return prev.map((p) => (p.id === saved.id ? saved : p));
          });
        }}
      />
    );
  }

  if (mode === "preview" && activePost) {
    return <BlogPreview post={activePost} onBack={() => setMode("list")} />;
  }

  return (
    <div className={styles.page}>
      <BlogUpload
        isOpen={showUploadModal}
        isUploading={isBulkUploading}
        onClose={() => setShowUploadModal(false)}
        onUploadFile={processUploadFile}
      />

      <BlogList
        posts={posts}
        isFetching={isFetching}
        isBulkUploading={isBulkUploading}
        onCreate={() => {
          setActivePost(createEmptyPost());
          setMode("editor");
        }}
        onOpenUpload={() => setShowUploadModal(true)}
        onEdit={(post) => {
          setActivePost(post);
          setMode("editor");
        }}
        onPreview={(post) => {
          setActivePost(post);
          setMode("preview");
        }}
        onDelete={(postId) => setPosts((prev) => prev.filter((x) => x.id !== postId))}
        onCopyUrl={copyUrl}
      />
    </div>
  );
};

BlogPage.getLayout = (page) => <SeoLayout>{page}</SeoLayout>;

export default BlogPage;
