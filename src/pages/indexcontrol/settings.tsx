import React, { useState } from "react";
import SeoLayout from "@/components/seo/SeoLayout";
import type { NextPageWithLayout } from "../_app";
import styles from "./settings.module.css";
import {
  Bell,
  KeyRound,
  Mail,
  Phone,
  Save,
  ShieldCheck,
  User,
} from "lucide-react";

const SEO_USER_NAME_KEY = "seo_user_name";

const SettingsPage: NextPageWithLayout = () => {
  const [profile, setProfile] = useState({
    fullName: "John Doe",
    email: "john.doe@astikan.com",
    phone: "+1 415 222 3344",
    role: "SEO Manager",
    timezone: "America/New_York",
  });

  const [prefs, setPrefs] = useState({
    emailAlerts: true,
    weeklyReport: true,
    criticalOnly: false,
    twoFactor: false,
  });

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const savedName = window.localStorage.getItem(SEO_USER_NAME_KEY);
    if (savedName?.trim()) {
      setProfile((prev) => ({ ...prev, fullName: savedName.trim() }));
    }
  }, []);

  const updateSharedUserName = (name: string) => {
    if (typeof window === "undefined") return;
    const nextName = name.trim();
    window.localStorage.setItem(SEO_USER_NAME_KEY, nextName || "Admin User");
    window.dispatchEvent(new Event("seo-user-name-change"));
  };

  return (
    <div className={styles.page}>
    <section className="min-h-screen w-full overflow-x-hidden bg-slate-50 p-3 font-['Sora'] text-slate-900 sm:p-5 lg:p-6">
      <div className="mx-auto w-full max-w-300 space-y-4">
        <header>
          <h1 className="text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
            Settings
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600">
            Manage personal information, notifications, and account security.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
            <h2 className="inline-flex items-center gap-1 text-sm lg:text-base font-semibold text-slate-900">
              <User className="h-3.5! w-3.5! text-slate-700" />
              Personal Info
            </h2>

            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <label className="text-xs sm:text-sm font-medium text-slate-600 sm:col-span-2">
                Full name
                <input
                  value={profile.fullName}
                  onChange={(e) => {
                    const nextName = e.target.value;
                    setProfile((p) => ({ ...p, fullName: nextName }));
                    updateSharedUserName(nextName);
                  }}
                  className="mt-1 h-8 w-full rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs sm:text-sm"
                />
              </label>

              <label className="text-xs sm:text-sm font-medium text-slate-600">
                Email
                <div className="relative mt-1">
                  <Mail className="pointer-events-none absolute left-2 top-1/2 h-3.5! w-3.5! -translate-y-1/2 text-slate-400" />
                  <input
                    value={profile.email}
                    onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                    className="h-8 w-full rounded-lg border border-slate-200 bg-slate-50 pl-7 pr-2 text-xs sm:text-sm"
                  />
                </div>
              </label>

              <label className="text-xs sm:text-sm font-medium text-slate-600">
                Phone
                <div className="relative mt-1">
                  <Phone className="pointer-events-none absolute left-2 top-1/2 h-3.5! w-3.5! -translate-y-1/2 text-slate-400" />
                  <input
                    value={profile.phone}
                    onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                    className="h-8 w-full rounded-lg border border-slate-200 bg-slate-50 pl-7 pr-2 text-xs sm:text-sm"
                  />
                </div>
              </label>

              <label className="text-xs sm:text-sm font-medium text-slate-600">
                Role
                <input
                  value={profile.role}
                  onChange={(e) => setProfile((p) => ({ ...p, role: e.target.value }))}
                  className="mt-1 h-8 w-full rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs sm:text-sm"
                />
              </label>

              <label className="text-xs sm:text-sm font-medium text-slate-600">
                Timezone
                <input
                  value={profile.timezone}
                  onChange={(e) => setProfile((p) => ({ ...p, timezone: e.target.value }))}
                  className="mt-1 h-8 w-full rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs sm:text-sm"
                />
              </label>
            </div>

            <button
              onClick={() => updateSharedUserName(profile.fullName)}
              className="mt-3 inline-flex h-8 items-center gap-1 rounded-lg bg-blue-600 px-2 text-xs sm:text-sm font-semibold text-white hover:bg-blue-700"
            >
              <Save className="h-3.5! w-3.5!" />
              Save Profile
            </button>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
            <h2 className="inline-flex items-center gap-1 text-sm lg:text-base font-semibold text-slate-900">
              <Bell className="h-3.5! w-3.5! text-slate-700" />
              Notification Preferences
            </h2>

            <div className="mt-3 space-y-2">
              <ToggleRow
                label="Email Alerts"
                note="Receive alerts for major SEO events"
                value={prefs.emailAlerts}
                onChange={(value) => setPrefs((p) => ({ ...p, emailAlerts: value }))}
              />
              <ToggleRow
                label="Weekly Reports"
                note="Get weekly SEO summary reports"
                value={prefs.weeklyReport}
                onChange={(value) => setPrefs((p) => ({ ...p, weeklyReport: value }))}
              />
              <ToggleRow
                label="Critical-Only Alerts"
                note="Only notify for critical incidents"
                value={prefs.criticalOnly}
                onChange={(value) => setPrefs((p) => ({ ...p, criticalOnly: value }))}
              />
            </div>
          </article>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
            <h2 className="inline-flex items-center gap-1 text-sm lg:text-base font-semibold text-slate-900">
              <KeyRound className="h-3.5! w-3.5! text-slate-700" />
              Security
            </h2>

            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <input
                type="password"
                placeholder="Current password"
                className="h-8 rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs sm:text-sm"
              />
              <input
                type="password"
                placeholder="New password"
                className="h-8 rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs sm:text-sm"
              />
            </div>

            <ToggleRow
              label="Two-factor authentication"
              note="Add extra security to your account"
              value={prefs.twoFactor}
              onChange={(value) => setPrefs((p) => ({ ...p, twoFactor: value }))}
            />

            <button className="mt-3 inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 text-xs sm:text-sm font-medium text-slate-800 hover:bg-slate-100">
              Update Password
            </button>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
            <h2 className="inline-flex items-center gap-1 text-sm lg:text-base font-semibold text-slate-900">
              <ShieldCheck className="h-3.5! w-3.5! text-slate-700" />
              Connected Accounts
            </h2>
            <div className="mt-3 space-y-2">
              {[
                "Google Search Console",
                "Google Analytics",
                "Google Business Profile",
                "Google Ads",
              ].map((item, index) => (
                <div
                  key={item}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5"
                >
                  <span className="text-xs sm:text-sm text-slate-700">{item}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs sm:text-sm font-semibold ${
                      index < 3 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {index < 3 ? "Connected" : "Pending"}
                  </span>
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
    </div>
  );
};

SettingsPage.getLayout = (page) => <SeoLayout>{page}</SeoLayout>;

export default SettingsPage;

function ToggleRow({
  label,
  note,
  value,
  onChange,
}: {
  label: string;
  note: string;
  value: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5">
      <div>
        <p className="text-xs sm:text-sm font-medium text-slate-800">{label}</p>
        <p className="text-xs sm:text-sm text-slate-500">{note}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`h-6 w-10 rounded-full p-0.5 transition ${value ? "bg-blue-600" : "bg-slate-300"}`}
        aria-pressed={value}
      >
        <span
          className={`block h-5 w-5 rounded-full bg-white transition ${value ? "translate-x-4" : "translate-x-0"}`}
        />
      </button>
    </div>
  );
}

