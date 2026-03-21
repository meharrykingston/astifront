import styles from "./analysis.module.css";

export default function AnalysisPage() {
  return (
    <div className={styles.page}>
      <section className="analysis-page theme-cycle">
        <iframe
          className="analysis-iframe"
          src="/analysis-static.html"
          title="Astikan AI Analysis"
        />
      </section>
    </div>
  );
}
