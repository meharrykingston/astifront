export type SeoUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function seoLogin(email: string, password: string) {
  const response = await fetch(`${apiBase}/api/seo/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || "Login failed");
  }

  return (await response.json()) as { token: string; user: SeoUser };
}

export async function seoMe(token: string) {
  const response = await fetch(`${apiBase}/api/seo/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || "Unauthorized");
  }
  return (await response.json()) as { user: SeoUser };
}

export function getSeoToken() {
  if (typeof window === "undefined") return "";
  return window.sessionStorage.getItem("seo_token") || "";
}

export function clearSeoToken() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem("seo_token");
}

export function getTokenExpiryMs(token: string): number | null {
  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return null;
    const payload = JSON.parse(atob(payloadPart));
    if (!payload.exp) return null;
    return payload.exp * 1000;
  } catch {
    return null;
  }
}
