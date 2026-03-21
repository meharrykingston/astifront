export type AdminSummary = {
  pages: { total: number; published: number; draft: number; approved: number };
  users: { seoTotal: number };
  logs: { total: number };
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt?: string;
  lastLoginAt?: string | null;
};

export type AdminLog = {
  id: string;
  level: string;
  source: string;
  message: string;
  createdAt: string;
  meta: Record<string, unknown>;
};

const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function authHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  if (typeof window === "undefined") return headers;
  const token = window.localStorage.getItem("superadmin_token") || "";
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

export async function adminLogin(email: string, password: string) {
  const response = await fetch(`${apiBase}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || "Login failed");
  }

  return (await response.json()) as { token: string; user: AdminUser };
}

export async function fetchSummary(): Promise<AdminSummary> {
  const response = await fetch(`${apiBase}/api/admin/summary`, {
    headers: { ...authHeaders() },
  });
  if (!response.ok) throw new Error("Unable to load summary");
  return (await response.json()) as AdminSummary;
}

export async function fetchUsers(): Promise<AdminUser[]> {
  const response = await fetch(`${apiBase}/api/admin/users`, {
    headers: { ...authHeaders() },
  });
  if (!response.ok) throw new Error("Unable to load users");
  const data = (await response.json()) as { users: AdminUser[] };
  return data.users;
}

export async function createUser(payload: {
  name: string;
  email: string;
  role: string;
  password: string;
}): Promise<AdminUser> {
  const response = await fetch(`${apiBase}/api/admin/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Unable to create user");
  const data = (await response.json()) as { user: AdminUser };
  return data.user;
}

export async function updateUser(id: string, payload: { name?: string; role?: string; status?: string }) {
  const response = await fetch(`${apiBase}/api/admin/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Unable to update user");
  const data = (await response.json()) as { user: AdminUser };
  return data.user;
}

export async function deleteUser(id: string) {
  const response = await fetch(`${apiBase}/api/admin/users/${id}`, {
    method: "DELETE",
    headers: { ...authHeaders() },
  });
  if (!response.ok) throw new Error("Unable to delete user");
}

export async function resetUserPassword(id: string, password: string) {
  const response = await fetch(`${apiBase}/api/admin/users/${id}/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ password }),
  });
  if (!response.ok) throw new Error("Unable to reset password");
}

export async function fetchLogs(): Promise<AdminLog[]> {
  const response = await fetch(`${apiBase}/api/admin/logs`, {
    headers: { ...authHeaders() },
  });
  if (!response.ok) throw new Error("Unable to load logs");
  const data = (await response.json()) as { logs: AdminLog[] };
  return data.logs;
}

export async function runJob(job: "sitemap" | "cleanup") {
  const response = await fetch(`${apiBase}/api/admin/jobs/${job}`, {
    method: "POST",
    headers: { ...authHeaders() },
  });
  if (!response.ok) throw new Error("Unable to run job");
}
