import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import AdminLayout from "@/components/supermadin/AdminLayout";
import styles from "./dashboard.module.css";
import {
  AdminLog,
  AdminUser,
  createUser,
  deleteUser,
  fetchLogs,
  fetchSummary,
  fetchUsers,
  resetUserPassword,
  runJob,
  updateUser,
} from "@/services/adminClient";

const ROLE_OPTIONS = ["seo_admin", "seo_editor", "seo_viewer"] as const;

export default function SuperadminDashboard() {
  const router = useRouter();
  const [summary, setSummary] = useState<{ pages: any; users: any; logs: any } | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [createForm, setCreateForm] = useState({
    name: "",
    email: "",
    role: "seo_viewer",
    password: "",
  });
  const [resetPassword, setResetPassword] = useState<Record<string, string>>({});

  const loadAll = async () => {
    setLoading(true);
    setError("");
    try {
      const [summaryData, usersData, logsData] = await Promise.all([
        fetchSummary(),
        fetchUsers(),
        fetchLogs(),
      ]);
      setSummary(summaryData);
      setUsers(usersData);
      setLogs(logsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = window.localStorage.getItem("superadmin_token");
    if (!token) {
      void router.replace("/supermadin");
      return;
    }
    void loadAll();
  }, [router]);

  const onCreateUser = async () => {
    setError("");
    try {
      await createUser(createForm);
      setCreateForm({ name: "", email: "", role: "seo_viewer", password: "" });
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create user");
    }
  };

  const onUpdateUser = async (userId: string, updates: { role?: string; status?: string; name?: string }) => {
    setError("");
    try {
      await updateUser(userId, updates);
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update user");
    }
  };

  const onDeleteUser = async (userId: string) => {
    const confirmDelete = window.confirm("Delete this user?");
    if (!confirmDelete) return;
    setError("");
    try {
      await deleteUser(userId);
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete user");
    }
  };

  const onResetPassword = async (userId: string) => {
    const password = resetPassword[userId];
    if (!password) return;
    setError("");
    try {
      await resetUserPassword(userId, password);
      setResetPassword((prev) => ({ ...prev, [userId]: "" }));
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to reset password");
    }
  };

  const onRunJob = async (job: "sitemap" | "cleanup") => {
    setError("");
    try {
      await runJob(job);
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to run job");
    }
  };

  const kpis = useMemo(() => {
    if (!summary) return [];
    return [
      { label: "Total Pages", value: summary.pages.total },
      { label: "Published Pages", value: summary.pages.published },
      { label: "Draft Pages", value: summary.pages.draft },
      { label: "Approved Pages", value: summary.pages.approved },
      { label: "SEO Users", value: summary.users.seoTotal },
      { label: "Total Logs", value: summary.logs.total },
    ];
  }, [summary]);

  return (
    <div className={styles.page}>
      <AdminLayout title="Dashboard">
        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
            Loading dashboard...
          </div>
        ) : (
          <div className="space-y-6">
            <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {kpis.map((kpi) => (
                <div key={kpi.label} className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
                  <p className="text-xs font-semibold text-slate-500">{kpi.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">{kpi.value}</p>
                </div>
              ))}
            </section>

            <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <h2 className="text-base font-semibold text-slate-900">SEO User Management</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Create, edit, disable, or remove SEO users.
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <input
                    value={createForm.name}
                    onChange={(event) => setCreateForm((prev) => ({ ...prev, name: event.target.value }))}
                    placeholder="Full name"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                  />
                  <input
                    value={createForm.email}
                    onChange={(event) => setCreateForm((prev) => ({ ...prev, email: event.target.value }))}
                    placeholder="Email"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                  />
                  <select
                    value={createForm.role}
                    onChange={(event) => setCreateForm((prev) => ({ ...prev, role: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  >
                    {ROLE_OPTIONS.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                  <input
                    value={createForm.password}
                    onChange={(event) => setCreateForm((prev) => ({ ...prev, password: event.target.value }))}
                    placeholder="Temp password"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                  />
                </div>
                <button
                  onClick={onCreateUser}
                  className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                >
                  Create user
                </button>

                <div className="mt-5 space-y-3">
                  {users.map((user) => (
                    <div key={user.id} className="rounded-xl border border-slate-200 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{user.name || "Unnamed user"}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <select
                            value={user.role}
                            onChange={(event) => onUpdateUser(user.id, { role: event.target.value })}
                            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs"
                          >
                            {ROLE_OPTIONS.map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                          </select>
                          <select
                            value={user.status}
                            onChange={(event) => onUpdateUser(user.id, { status: event.target.value })}
                            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs"
                          >
                            <option value="active">active</option>
                            <option value="disabled">disabled</option>
                          </select>
                          <button
                            onClick={() => onDeleteUser(user.id)}
                            className="rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <input
                          value={resetPassword[user.id] || ""}
                          onChange={(event) =>
                            setResetPassword((prev) => ({ ...prev, [user.id]: event.target.value }))
                          }
                          placeholder="New password"
                          className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs"
                        />
                        <button
                          onClick={() => onResetPassword(user.id)}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700"
                        >
                          Reset password
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <section className="rounded-2xl border border-slate-200 bg-white p-5">
                  <h2 className="text-base font-semibold text-slate-900">Jobs</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Run daily automation tasks manually when needed.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => onRunJob("sitemap")}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
                    >
                      Run sitemap generation
                    </button>
                    <button
                      onClick={() => onRunJob("cleanup")}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
                    >
                      Run log cleanup
                    </button>
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5">
                  <h2 className="text-base font-semibold text-slate-900">Logs</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Latest frontend and backend events.
                  </p>
                  <div className="mt-4 max-h-72 space-y-2 overflow-y-auto">
                    {logs.map((log) => (
                      <div key={log.id} className="rounded-lg border border-slate-200 px-3 py-2 text-xs">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-slate-700">{log.level}</span>
                          <span className="text-slate-400">{new Date(log.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="mt-1 text-slate-700">{log.message}</p>
                        <p className="mt-1 text-slate-400">source: {log.source}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </section>
          </div>
        )}
      </AdminLayout>
    </div>
  );
}
