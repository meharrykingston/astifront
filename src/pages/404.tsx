import Link from "next/link";
import styles from "./404.module.css";

export default function NotFoundPage() {
  return (
    <div className={styles.page}>
      <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 px-4 text-slate-900">
        <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Page not found
          </p>
          <h1 className="mt-3 text-3xl font-semibold">We could not find that page</h1>
          <p className="mt-3 text-sm text-slate-600">
            The link may be incorrect or the page may have moved. You can return to the main site or head
            to the analysis flow.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Go to home
            </Link>
            <Link
              href="/analysis"
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            >
              Go to analysis
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
