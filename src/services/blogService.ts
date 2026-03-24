export type BlogStatus = "published" | "draft" | "scheduled";

export type BlogRecord = {
  id: string;
  title: string;
  slug: string;
  author: string;
  status: BlogStatus;
  category: string;
  views: number;
  seoScore: number;
  updatedAt: string;
  excerpt: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords: string[];
  backlinks: string[];
};

export type UpsertBlogPayload = {
  id?: string;
  title: string;
  slug: string;
  author: string;
  status: BlogStatus;
  category: string;
  excerpt: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  backlinks?: string[];
};

const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const endpointCandidates = ["/api/blogs"];

function authHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};

  const seoToken = window.sessionStorage.getItem("seo_token") || "";
  const adminToken = window.localStorage.getItem("superadmin_token") || "";
  const token = seoToken || adminToken;
  if (!token) return {};

  return { Authorization: `Bearer ${token}` };
}

function toStatus(value: unknown): BlogStatus {
  if (value === "published" || value === "scheduled") return value;
  return "draft";
}

function toNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toString(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value;
  if (value == null) return fallback;
  return String(value);
}

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => toString(item).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function normalizeDateString(value: unknown): string {
  const raw = toString(value).trim();
  if (!raw) return new Date().toISOString().slice(0, 10);

  // Handle DD-MM-YYYY / DD/MM/YYYY
  const ddmmyyyy = raw.match(/^(\d{2})[-/](\d{2})[-/](\d{4})$/);
  if (ddmmyyyy) {
    const [, dd, mm, yyyy] = ddmmyyyy;
    return `${yyyy}-${mm}-${dd}`;
  }

  const parsed = new Date(raw);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }

  // Fallback to raw when unknown format comes from API
  return raw.slice(0, 10);
}

function slugify(text: string): string {
  const slug = toString(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  return slug || "untitled-post";
}

function normalizeSlug(rawSlug: unknown, fallbackTitle: unknown): string {
  const raw = toString(rawSlug).trim();
  const source = raw || slugify(toString(fallbackTitle));
  const clean = source.replace(/^https?:\/\/[^/]+/i, "").replace(/^\/+/, "");
  const withoutPrefix = clean.replace(/^(blog\/)+/i, "");
  const parts = withoutPrefix.split("/").filter(Boolean);
  const segment = parts[parts.length - 1] || slugify(toString(fallbackTitle));
  return `/blog/${segment}`;
}

function normalizeSlugLookup(slug: string): string {
  const clean = String(slug || "")
    .trim()
    .replace(/^https?:\/\/[^/]+/i, "")
    .replace(/^\/+/, "");
  if (!clean) return "/blog";
  const withoutPrefix = clean.replace(/^(blog\/)+/i, "");
  const parts = withoutPrefix.split("/").filter(Boolean);
  const segment = parts[parts.length - 1] || "";
  return segment ? `/blog/${segment}` : "/blog";
}

function normalizeRecord(raw: any): BlogRecord {
  return {
    id: toString(raw?.id ?? raw?._id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`),
    title: toString(raw?.title),
    slug: normalizeSlug(raw?.slug ?? raw?.url, raw?.title),
    author: toString(raw?.author, "SEO Team"),
    status: toStatus(raw?.status),
    category: toString(raw?.category, "General"),
    views: toNumber(raw?.views, 0),
    seoScore: toNumber(raw?.seoScore, 0),
    updatedAt: normalizeDateString(raw?.updatedAt ?? raw?.modifiedAt ?? raw?.createdAt),
    excerpt: toString(raw?.excerpt ?? raw?.summary),
    content: toString(raw?.content ?? raw?.body),
    metaTitle: toString(raw?.metaTitle),
    metaDescription: toString(raw?.metaDescription),
    keywords: toStringArray(raw?.keywords),
    backlinks: toStringArray(raw?.backlinks),
  };
}

async function readErrorMessage(response: Response): Promise<string> {
  const body = await response.json().catch(() => ({} as { message?: string }));
  return body?.message || "Request failed";
}

function normalizeListPayload(data: any): BlogRecord[] {
  const rawList = Array.isArray(data) ? data : Array.isArray(data?.blogs) ? data.blogs : Array.isArray(data?.data) ? data.data : [];
  return rawList.map(normalizeRecord);
}

async function requestListFrom(endpoint: string): Promise<BlogRecord[]> {
  const response = await fetch(`${apiBase}${endpoint}`, {
    headers: { ...authHeaders() },
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  const data = await response.json().catch(() => []);
  return normalizeListPayload(data);
}

async function upsertTo(endpoint: string, payload: UpsertBlogPayload): Promise<BlogRecord> {
  const isUpdate = Boolean(payload.id);
  const url = isUpdate ? `${apiBase}${endpoint}/${payload.id}` : `${apiBase}${endpoint}`;
  const response = await fetch(url, {
    method: isUpdate ? "PUT" : "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({
      ...payload,
      slug: normalizeSlug(payload.slug, payload.title),
      keywords: toStringArray(payload.keywords),
      backlinks: toStringArray(payload.backlinks),
      updatedAt: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  const data = await response.json().catch(() => payload);
  const raw = data?.blog || data?.data || data;
  return normalizeRecord({ ...raw, ...payload });
}

async function tryEndpoints<T>(request: (endpoint: string) => Promise<T>): Promise<T> {
  let lastError: Error | null = null;
  for (const endpoint of endpointCandidates) {
    try {
      return await request(endpoint);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Request failed");
    }
  }
  throw lastError || new Error("Unable to reach blog API");
}

export const blogService = {
  async getAll(): Promise<BlogRecord[]> {
    return tryEndpoints((endpoint) => requestListFrom(endpoint));
  },

  async getBySlug(slug: string): Promise<BlogRecord | null> {
    const normalizedTarget = normalizeSlugLookup(slug);
    const blogs = await this.getAll();
    return blogs.find((blog) => normalizeSlugLookup(blog.slug) === normalizedTarget) || null;
  },

  async createOrUpdate(payload: UpsertBlogPayload): Promise<BlogRecord> {
    return tryEndpoints((endpoint) => upsertTo(endpoint, payload));
  },
};
