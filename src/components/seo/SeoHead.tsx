"use client";

import Head from "next/head";

const DEFAULT_SITE_URL = "https://www.astikan.com";
const DEFAULT_OG_IMAGE = "https://www.astikan.com/home-banner.jpg";

type SeoHeadProps = {
  title: string;
  description: string;
  canonicalPath?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  robots?: string;
  keywords?: string;
  author?: string;
  language?: string;
  geoRegion?: string;
  geoCountry?: string;
  themeColor?: string;
  faviconHref?: string;
  aiAllow?: string;
  aiContent?: string;
  aiEntities?: string;
  aiIntent?: string;
};

const normalizePath = (path: string | undefined) => {
  if (!path) return "";
  return path.startsWith("/") ? path : `/${path}`;
};

export default function SeoHead({
  title,
  description,
  canonicalPath,
  ogTitle,
  ogDescription,
  ogImage,
  ogType = "website",
  twitterTitle,
  twitterDescription,
  twitterImage,
  robots = "index,follow",
  keywords,
  author = "Astikan Health",
  language = "en-IN",
  geoRegion = "IN",
  geoCountry = "IN",
  themeColor = "#2f6df6",
  faviconHref = "/favicon.ico",
  aiAllow = "crawl,index,store",
  aiContent = "true",
  aiEntities = "lab test, doctor consultation, healthcare services",
  aiIntent = "healthcare services",
}: SeoHeadProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL;
  const normalizedPath = canonicalPath ? normalizePath(canonicalPath) : "";
  const canonicalUrl = normalizedPath ? `${siteUrl}${normalizedPath}` : siteUrl;
  const resolvedOgTitle = ogTitle || title;
  const resolvedOgDescription = ogDescription || description;
  const resolvedOgImage = ogImage || DEFAULT_OG_IMAGE;
  const resolvedTwitterTitle = twitterTitle || title;
  const resolvedTwitterDescription = twitterDescription || description;
  const resolvedTwitterImage = twitterImage || resolvedOgImage;

  return (
    <Head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords ? <meta name="keywords" content={keywords} /> : null}
      <meta name="robots" content={robots} />
      <link rel="canonical" href={canonicalUrl} />
      <meta name="author" content={author} />
      <meta name="language" content={language} />
      <meta name="geo.region" content={geoRegion} />
      <meta name="geo.country" content={geoCountry} />
      <meta name="theme-color" content={themeColor} />
      <link rel="icon" href={faviconHref} />

      <meta property="og:title" content={resolvedOgTitle} />
      <meta property="og:description" content={resolvedOgDescription} />
      <meta property="og:image" content={resolvedOgImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={ogType} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={resolvedTwitterTitle} />
      <meta name="twitter:description" content={resolvedTwitterDescription} />
      <meta name="twitter:image" content={resolvedTwitterImage} />

      <meta name="ai-allow" content={aiAllow} />
      <meta name="ai-content" content={aiContent} />
      <meta name="ai-entities" content={aiEntities} />
      <meta name="ai-intent" content={aiIntent} />
    </Head>
  );
}
