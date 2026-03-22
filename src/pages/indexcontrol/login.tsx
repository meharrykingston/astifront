import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { seoLogin } from "@/services/seoAuthClient";
import styles from "./login.module.css";

export default function SeoLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = window.sessionStorage.getItem("seo_token");
    if (token) {
      void router.replace("/indexcontrol/dashboard");
    }
  }, [router]);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await seoLogin(email, password);
      window.sessionStorage.setItem("seo_token", result.token);
      void router.replace("/indexcontrol/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <div className={styles.panel}>
          <div className={styles.brandRow}>
            <div className={styles.logoMark} aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M12 21s-6.7-4.4-9.2-8C.7 10.3 1.4 6.6 4.4 5a5.4 5.4 0 0 1 5.9.7L12 7.1l1.7-1.4A5.4 5.4 0 0 1 19.6 5c3 1.6 3.7 5.3 1.6 8-2.5 3.6-9.2 8-9.2 8Z" />
              </svg>
            </div>
            <div>
              <p className={styles.kicker}>IndexControl</p>
              <h1 className={styles.title}>Sign in to manage SEO</h1>
              <p className={styles.subtitle}>Secure access for your editorial and SEO workflows.</p>
            </div>
          </div>

          {error && (
            <div className={styles.errorBox}>
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className={styles.form}>
            <label className={styles.label}>
              Email
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={styles.input}
                placeholder="you@company.com"
              />
            </label>
            <label className={styles.label}>
              Password
              <input
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={styles.input}
                placeholder="Your secure password"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className={styles.primaryButton}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>

        <div className={styles.preview}>
          <div className={styles.previewCard}>
            <p className={styles.previewTitle}>Daily visibility snapshot</p>
            <p className={styles.previewValue}>1,248</p>
            <p className={styles.previewLabel}>active pages tracked</p>
            <div className={styles.previewGrid}>
              <div>
                <p className={styles.previewStat}>78%</p>
                <p className={styles.previewMeta}>published</p>
              </div>
              <div>
                <p className={styles.previewStat}>12</p>
                <p className={styles.previewMeta}>alerts</p>
              </div>
              <div>
                <p className={styles.previewStat}>24h</p>
                <p className={styles.previewMeta}>last update</p>
              </div>
            </div>
          </div>
          <div className={styles.previewGlow} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
