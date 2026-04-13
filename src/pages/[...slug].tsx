import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import SeoPageTemplate from "@/components/indexcontrol/SeoPageTemplate";
import type { SeoPageRecord } from "@/types/seoPage";
import styles from "./[...slug].module.css";
import SeoHead from "@/components/seo/SeoHead";

const REVALIDATE_SECONDS = 86400;

function toFullPath(slugParts: string[] | undefined): string {
  return `/${(slugParts || []).join("/")}`;
}

async function fetchPage(fullPath: string): Promise<SeoPageRecord | null> {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const response = await fetch(
    `${apiBase}/api/pages/resolve?slug=${fullPath}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error("Unable to resolve page");
  }

  const data = (await response.json()) as { page: SeoPageRecord };
  return data.page;
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: "blocking",
});

export const getStaticProps: GetStaticProps<{ page: SeoPageRecord }> = async (context) => {
  const slugParam = context.params?.slug;
  const slugParts = Array.isArray(slugParam)
    ? slugParam
    : typeof slugParam === "string"
      ? [slugParam]
      : [];
  const fullPath = toFullPath(slugParts);

  try {
    const page = await fetchPage(fullPath);

    if (!page || page.status !== "published") {
      return { notFound: true, revalidate: REVALIDATE_SECONDS };
    }

    return {
      props: { page },
      revalidate: REVALIDATE_SECONDS,
    };
  } catch {
    return { notFound: true, revalidate: REVALIDATE_SECONDS };
  }
};

export default function DynamicSeoPage({
  page,
}: InferGetStaticPropsType<typeof getStaticProps>) {

  if (!page) {
    return null; // Or a generic loading/error component
  }

  return (
    <div className={styles.page}>
      <SeoHead
        title={page.titleTag || "Astikan Health"}
        description={page.metaDescription || page.overview || "Astikan Health digital healthcare services."}
        canonicalPath={page.url}
        ogTitle={page.titleTag || "Astikan Health"}
        ogDescription={page.metaDescription || page.overview || "Astikan Health digital healthcare services."}
        keywords={page.metaTag || undefined}
        author={page.author || "Astikan Health"}
      />
      <SeoPageTemplate page={page} />
    </div>
  );
}
