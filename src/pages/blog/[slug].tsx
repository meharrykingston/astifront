import Head from "next/head";
import Link from "next/link";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { ArrowLeft } from "lucide-react";
import { blogService, type BlogRecord } from "@/services/blogService";

type BlogDetailProps = {
  blog: BlogRecord | null;
};

function formatDateDDMMYYYY(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

export const getServerSideProps: GetServerSideProps<BlogDetailProps> = async (context) => {
  const slugParam = context.params?.slug;
  const slugValue = Array.isArray(slugParam) ? slugParam[0] : slugParam;

  if (!slugValue) {
    context.res.statusCode = 404;
    return { props: { blog: null } };
  }

  try {
    const blog = await blogService.getBySlug(`/blog/${slugValue}`);
    if (!blog || blog.status !== "published") {
      context.res.statusCode = 404;
      return { props: { blog: null } };
    }

    return { props: { blog } };
  } catch {
    context.res.statusCode = 404;
    return { props: { blog: null } };
  }
};

export default function BlogDetailPage({ blog }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (!blog) {
    return (
      <main className="relative min-h-screen overflow-x-clip bg-linear-to-br from-slate-100 via-blue-50 to-cyan-100 px-4 py-8 font-['Sora'] text-slate-900 sm:px-6 lg:py-12">
        <div className="mx-auto w-full max-w-4xl">
          <section className="rounded-2xl border border-white/70 bg-white/75 p-6 text-center shadow-xl backdrop-blur-xl sm:p-8">
            <h1 className="text-2xl font-bold text-slate-900">Blog Not Found</h1>
            <p className="mt-2 text-slate-600">The blog you requested does not exist or is not published yet.</p>
            <div className="mt-6">
              <Link
                href="/"
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                <ArrowLeft className="h-4! w-4!" />
                Back to Home
              </Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  const seoTitle = blog.metaTitle?.trim() || blog.title;
  const seoDescription = blog.metaDescription?.trim() || blog.excerpt || "Read this healthcare blog from Astikan.";
  const canonicalSlug = blog.slug.replace(/^\/blog\//, "").replace(/^\/+/, "");
  const canonicalUrl = `https://astikan.com/blog/${canonicalSlug}`;

  return (
    <main className="relative min-h-screen overflow-x-clip bg-linear-to-br from-slate-100 via-blue-50 to-cyan-100 px-4 py-8 font-['Sora'] text-slate-900 sm:px-6 lg:py-12">
      <Head>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="keywords" content={(blog.keywords || []).join(", ")} />
      </Head>

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_14%,rgba(56,189,248,0.24),transparent_34%),radial-gradient(circle_at_82%_10%,rgba(59,130,246,0.22),transparent_30%),radial-gradient(circle_at_52%_90%,rgba(14,165,233,0.2),transparent_32%)]" />
        <div className="absolute inset-0 opacity-35 [background:linear-gradient(rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-size-[38px_38px]" />
        <div className="absolute -top-18 -left-25 h-64 w-64 rounded-full bg-blue-200/65 blur-3xl" />
        <div className="absolute -right-30 top-36 h-72 w-72 rounded-full bg-cyan-200/55 blur-3xl" />
        <div className="absolute -bottom-25 left-1/3 h-72 w-72 rounded-full bg-indigo-200/50 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-4xl px-4 sm:px-6">
        <article className="min-w-0 rounded-2xl border border-white/70 bg-white/75 p-5 shadow-xl backdrop-blur-xl sm:p-7">
          <header className="border-b border-slate-200 pb-5">
            <p className="text-sm text-blue-700">Category: {blog.category}</p>
            <h1 className="mt-2 wrap-break-word text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">{blog.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600">
              <span>Author: {blog.author || "SEO Team"}</span>
              <span>Last Updated: {formatDateDDMMYYYY(blog.updatedAt)}</span>
            </div>
          </header>

          {blog.excerpt?.trim() && (
            <section className="mt-5 rounded-2xl border border-blue-100 bg-linear-to-r from-blue-50 to-cyan-50 p-4 sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Quick Summary</p>
              <p className="mt-2 wrap-break-word text-base leading-relaxed text-slate-700 sm:text-lg">{blog.excerpt}</p>
            </section>
          )}

          <div
            className="prose prose-slate mt-6 max-w-none lg:prose-xl prose-headings:text-slate-900 prose-strong:text-slate-900 prose-li:marker:text-blue-500 wrap-break-word prose-a:break-all prose-h1:mt-8 prose-h1:mb-4 prose-h2:mt-8 prose-h2:mb-3 blog-content-area"
            dangerouslySetInnerHTML={{ __html: blog.content || "<p>No content available.</p>" }}
          />

          <div className="mt-8">
            <Link
              href="/blog"
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              <ArrowLeft className="h-4! w-4!" />
              Back to Blogs
            </Link>
          </div>
        </article>
      </div>

      <style jsx global>{`
        .blog-content-area a {
          color: #2563eb !important;
          text-decoration: underline !important;
          font-weight: 600 !important;
        }

        .blog-content-area a:hover {
          color: #1d4ed8 !important;
        }
      `}</style>
    </main>
  );
}

