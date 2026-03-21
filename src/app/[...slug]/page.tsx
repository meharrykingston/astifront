import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SeoPageTemplate from "@/components/seo/SeoPageTemplate";
import type { SeoPageRecord } from "@/types/seoPage";

export const revalidate = 86400;
export const dynamicParams = true;

type DynamicSeoPageProps = {
  params: Promise<{ slug: string[] }>;
};

function toFullPath(slugParts: string[] | undefined): string {
  return `/${(slugParts || []).join("/")}`;
}

async function fetchPage(fullPath: string): Promise<SeoPageRecord | null> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pages/resolve?slug=${fullPath}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    next: { revalidate },
  });

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error("Unable to resolve page");
  }

  const data = (await response.json()) as { page: SeoPageRecord };
  return data.page;
}

export async function generateMetadata({ params }: DynamicSeoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const fullPath = toFullPath(slug);
  const page = await fetchPage(fullPath);

  if (!page) {
    return {};
  }

  return {
    title: page.titleTag,
    description: page.metaDescription,
    keywords: page.metaTag,
  };
}

export default async function DynamicSeoPage({ params }: DynamicSeoPageProps) {
  const { slug } = await params;
  const fullPath = toFullPath(slug);
  const page = await fetchPage(fullPath);

  if (!page || page.status !== "published") {
    notFound();
  }

  return <SeoPageTemplate page={page} />;
}
