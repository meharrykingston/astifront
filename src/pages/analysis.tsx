"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import styles from "./analysis.module.css";
import { TopNav } from "@/components/shared/TopNav";
import { BodyVisualization } from "@/components/analysis/BodyVisualization";
import { ConditionsAndSeverity } from "@/components/analysis/ConditionsAndSeverity";
import { SpecialistAndDoctors } from "@/components/analysis/SpecialistAndDoctors";
import { TestsAndTimeline } from "@/components/analysis/TestsAndTimeline";
import { MedicineSuggestions } from "@/components/analysis/MedicineSuggestions";
import { NextSteps } from "@/components/analysis/NextSteps";
import {
  defaultConditions,
  defaultDoctors,
  defaultMedicines,
  defaultTests,
  defaultTimeline,
} from "@/components/analysis/analysisData";

type AnalysisData = {
  symptoms?: string;
  summary?: string;
  location?: { lat: number; lng: number } | null;
};

export default function AnalysisPage() {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("astikan:analysis");
      if (stored) {
        setAnalysisData(JSON.parse(stored) as AnalysisData);
      }
    } catch {
      setAnalysisData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div
      className={styles.page}
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f8fafc",
        overflow: "visible",
      }}
    >
      <section className="analysis-page theme-cycle" style={{ height: "auto", minHeight: "100vh", overflow: "visible" }}>
        <TopNav />

        <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8" style={{ height: "auto", overflow: "visible" }}>
          {loading ? (
            <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200/70 bg-white p-8 text-center shadow-sm">
              <p className="animate-pulse text-base font-semibold text-slate-700">Loading Results...</p>
            </div>
          ) : !showDetailedAnalysis ? (
            <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Initial Summary</p>
              <h1 className="mt-3 text-2xl font-semibold text-slate-900">Your Health Analysis</h1>
              <p className="mt-2 text-sm text-slate-600">
                <span className="font-semibold">Symptoms:</span> {analysisData?.symptoms || "Not provided"}
              </p>
              <div className="mt-5 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                {analysisData?.summary || "No summary found. Please start a new diagnosis."}
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  className="inline-flex items-center rounded-full bg-[#1f67f2] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(31,103,242,0.25)] transition hover:-translate-y-px"
                  onClick={() => setShowDetailedAnalysis(true)}
                >
                  View Detailed Analysis
                </button>
              </div>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: {
                  transition: {
                    staggerChildren: 0.12,
                  },
                },
              }}
              className="space-y-6"
            >
              <div>
                <button
                  type="button"
                  onClick={() => setShowDetailedAnalysis(false)}
                  className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300"
                >
                  ← Back to Summary
                </button>
              </div>

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <BodyVisualization
                  bodyNote="This visualization highlights where discomfort is most likely concentrated based on your responses."
                  highlightLabel="Affected area"
                />
              </motion.div>

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <ConditionsAndSeverity
                  conditions={defaultConditions}
                  severityLevel="Moderate"
                  severityDescription="Current symptoms suggest a manageable condition, but evaluation is recommended if pain persists."
                  severityWidth="56%"
                />
              </motion.div>

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <SpecialistAndDoctors
                  specialist={defaultDoctors[0]?.specialty || "Internal Medicine"}
                  doctors={defaultDoctors}
                />
              </motion.div>

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <TestsAndTimeline tests={defaultTests} timeline={defaultTimeline} />
              </motion.div>

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <MedicineSuggestions medicines={defaultMedicines} />
              </motion.div>

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <NextSteps onRestart={() => router.push("/")} />
              </motion.div>
            </motion.div>
          )}
        </main>
      </section>
    </div>
  );
}
