import type { SeoPageRecord, UpsertSeoPagePayload } from "@/types/seoPage";



export function getSeoApiBaseUrl(): string {
 
  const fromEnv = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"; 
  return fromEnv.replace(/\/+$/, "");
}

export async function listSeoPages(): Promise<SeoPageRecord[]> {
  const response = await fetch(`${getSeoApiBaseUrl()}/api/pages`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Unable to fetch pages");
  }

  const data = (await response.json()) as { pages: SeoPageRecord[] };
  return data.pages || [];
}

export async function resolveSeoPageBySlug(slug: string): Promise<SeoPageRecord | null> {
  const response = await fetch(
    `${getSeoApiBaseUrl()}/api/pages/resolve?slug=${encodeURIComponent(slug)}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    },
  );

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error("Unable to resolve page");
  }

  const data = (await response.json()) as { page: SeoPageRecord };
  return data.page;
}

export async function createSeoPage(payload: UpsertSeoPagePayload): Promise<SeoPageRecord> {
  const response = await fetch(`${getSeoApiBaseUrl()}/api/pages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.message || "Unable to create page");
  }

  const data = (await response.json()) as { page: SeoPageRecord };
  return data.page;
}

export async function updateSeoPage(id: string, payload: UpsertSeoPagePayload): Promise<SeoPageRecord> {
  const response = await fetch(`${getSeoApiBaseUrl()}/api/pages/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.message || "Unable to update page");
  }

  const data = (await response.json()) as { page: SeoPageRecord };
  return data.page;
}

export async function deleteSeoPage(id: string): Promise<void> {
  const response = await fetch(`${getSeoApiBaseUrl()}/api/pages/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.message || "Unable to delete page");
  }
}
