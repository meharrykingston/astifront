import type { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const SITE_URL =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://astikan.com";

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  try {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    const response = await fetch(`${apiBase}/api/pages/count`);
    const { total } = await response.json();
    const limit = 50000;
    const sitemapCount = Math.ceil(total / limit) || 1;

    for (let i = 1; i <= sitemapCount; i += 1) {
      xml += `<sitemap><loc>${SITE_URL}/sitemaps/${i}.xml</loc></sitemap>`;
    }
  } catch {
    xml += `<sitemap><loc>${SITE_URL}/sitemaps/1.xml</loc></sitemap>`;
  }

  xml += `</sitemapindex>`;

  res.setHeader("Content-Type", "application/xml");
  res.write(xml);
  res.end();

  return { props: {} };
};

export default function SitemapIndex() {
  return null;
}
