import type { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async ({ res, params }) => {
  const SITE_URL =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://astikan.com";

  const rawId = String(params?.id ?? "");
  const idString = rawId.replace(".xml", "");
  const pageNum = parseInt(idString, 10);

  if (!pageNum || Number.isNaN(pageNum)) {
    res.statusCode = 400;
    res.end("Invalid Sitemap ID");
    return { props: {} };
  }

  const limit = 50000;
  const skip = (pageNum - 1) * limit;

  try {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    const response = await fetch(
      `${apiBase}/api/pages?skip=${skip}&limit=${limit}`,
      { cache: "no-store" }
    );

    if (!response.ok) throw new Error("Backend connection failed");

    const data = await response.json();
    const pages = data.pages || [];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page: any) => `
  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${new Date(page.updatedAt || Date.now()).toISOString()}</lastmod>
  </url>
`
  )
  .join("")}
</urlset>`.trim();

    res.setHeader("Content-Type", "application/xml");
    res.setHeader("Cache-Control", "no-store, max-age=0");
    res.write(xml);
    res.end();
    return { props: {} };
  } catch {
    res.statusCode = 500;
    res.end("Backend Fetch Error");
    return { props: {} };
  }
};

export default function SitemapSlice() {
  return null;
}
