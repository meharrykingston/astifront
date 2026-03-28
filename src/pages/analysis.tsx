"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import styles from "./analysis.module.css";
import { TopNav } from "@/components/shared/TopNav";
import { SymptomStory } from "@/components/analysis/SymptomStory";
import { ConditionsAndSeverity } from "@/components/analysis/ConditionsAndSeverity";
import { SpecialistAndDoctors } from "@/components/analysis/SpecialistAndDoctors";
import { TestsAndTimeline } from "@/components/analysis/TestsAndTimeline";
import { MedicineSuggestions } from "@/components/analysis/MedicineSuggestions";
import { NextSteps } from "@/components/analysis/NextSteps";
import type { ConditionCard, DoctorCard, MedicineCard, TestCard, TimelineStep } from "@/types/analysis";
import {
  defaultConditions,
  defaultDoctors,
  defaultMedicines,
  defaultTests,
  defaultTimeline,
} from "@/components/analysis/analysisData";

type StoryStep = {
  zone?: string;
  text?: string;
};

type AnalysisData = {
  summary?: string;
  bodyNote?: string;
  body_note?: string;
  highlightLabel?: string;
  highlight_label?: string;
  severity?: { level?: string; description?: string; score?: number } | string;
  severity_level?: string;
  severity_description?: string;
  severity_score?: number;
  conditions?: unknown[];
  top_conditions?: unknown[];
  specialist?: string;
  recommended_specialist?: string;
  doctors?: unknown[];
  nearby_doctors?: unknown[];
  tests?: unknown[];
  recommended_tests?: unknown[];
  timeline?: unknown[];
  recovery_timeline?: unknown[];
  medicines?: unknown[];
  medicine_suggestions?: unknown[];
  story_script?: StoryStep[];
};

type StoredPayload = {
  status?: string;
  symptoms?: string;
  location?: { lat: number; lng: number } | null;
  analysis?: AnalysisData;
  summary?: string;
};

const toSeverityWidth = (score: number) => {
  const normalized = score > 1 ? score / 100 : score;
  return `${Math.min(Math.max(normalized, 0), 1) * 100}%`;
};

const toCondition = (item: unknown, index: number): ConditionCard => {
  if (typeof item === "string") {
    return {
      name: item,
      summary: "Likely related to your symptom pattern.",
      recovery: "Consult a doctor for personalized recovery guidance.",
    };
  }

  if (item && typeof item === "object") {
    const raw = item as Record<string, unknown>;
    return {
      name: String(raw.name ?? raw.condition ?? `Condition ${index + 1}`),
      summary: String(raw.summary ?? raw.reason ?? "Likely related to your symptom pattern."),
      recovery: String(raw.recovery ?? raw.recovery_time ?? "Consult a doctor for personalized recovery guidance."),
    };
  }

  return {
    name: `Condition ${index + 1}`,
    summary: "Likely related to your symptom pattern.",
    recovery: "Consult a doctor for personalized recovery guidance.",
  };
};

const toDoctor = (item: unknown, index: number): DoctorCard => {
  const raw = (item && typeof item === "object" ? item : {}) as Record<string, unknown>;
  return {
    name: String(raw.name ?? `Doctor ${index + 1}`),
    specialty: String(raw.specialty ?? raw.type ?? "Internal Medicine"),
    rating: String(raw.rating ?? "4.5"),
    distance: String(raw.distance ?? "Nearby"),
    fee: String(raw.fee ?? raw.consultation_fee ?? "Fee on booking"),
  };
};

const toTest = (item: unknown, index: number): TestCard => {
  if (typeof item === "string") {
    return { name: item, purpose: "Used for diagnostic confirmation.", cost: "Varies by provider" };
  }

  const raw = (item && typeof item === "object" ? item : {}) as Record<string, unknown>;
  return {
    name: String(raw.name ?? `Test ${index + 1}`),
    purpose: String(raw.purpose ?? raw.why ?? "Used for diagnostic confirmation."),
    cost: String(raw.cost ?? raw.price ?? "Varies by provider"),
  };
};

const toMedicine = (item: unknown, index: number): MedicineCard => {
  if (typeof item === "string") {
    return {
      name: item,
      purpose: "Supports symptom relief for this condition.",
      precautions: "Use only as prescribed by your doctor.",
    };
  }

  const raw = (item && typeof item === "object" ? item : {}) as Record<string, unknown>;
  return {
    name: String(raw.name ?? `Medicine ${index + 1}`),
    purpose: String(raw.purpose ?? raw.use ?? "Supports symptom relief for this condition."),
    precautions: String(raw.precautions ?? raw.caution ?? "Use only as prescribed by your doctor."),
  };
};

const toTimelineStep = (item: unknown, index: number): TimelineStep => {
  const raw = (item && typeof item === "object" ? item : {}) as Record<string, unknown>;
  const intensityRaw = String(raw.intensity ?? "medium").toLowerCase();
  const intensity: TimelineStep["intensity"] =
    intensityRaw === "high" || intensityRaw === "low" ? intensityRaw : "medium";

  return {
    range: String(raw.range ?? raw.time ?? `Phase ${index + 1}`),
    text: String(raw.text ?? raw.description ?? "Expected recovery progression."),
    intensity,
  };
};

export default function AnalysisPage() {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [symptoms, setSymptoms] = useState<string>("");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);
  const [detailedSlideIndex, setDetailedSlideIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("astikan:analysis");
      if (stored) {
        const parsed = JSON.parse(stored) as StoredPayload;
        setAnalysisData(parsed?.analysis ? parsed.analysis : (parsed as AnalysisData));
        setSymptoms(
          parsed?.symptoms ||
            (parsed?.analysis?.summary
              ? `${parsed.analysis.summary.substring(0, 50)}...`
              : "") ||
            "General Health Query"
        );
        setUserLocation(parsed?.location ?? null);
      } else {
        setAnalysisData(null);
        setIsAnalyzing(false);
      }
    } catch {
      setAnalysisData(null);
      setIsAnalyzing(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const summaryText = analysisData?.summary || "No summary found...";
  const conditionSource = analysisData?.top_conditions?.length
    ? analysisData.top_conditions
    : analysisData?.conditions?.length
      ? analysisData.conditions
      : [];
  const conditions = conditionSource.length ? conditionSource.map(toCondition) : defaultConditions;

  const severityLevel =
    (typeof analysisData?.severity === "object" && analysisData.severity?.level) ||
    analysisData?.severity_level ||
    (typeof analysisData?.severity === "string" ? analysisData.severity : "") ||
    "Moderate";
  const severityDescription =
    (typeof analysisData?.severity === "object" && analysisData.severity?.description) ||
    analysisData?.severity_description ||
    "Current symptoms suggest a manageable condition, but evaluation is recommended if pain persists.";
  const severityScore =
    (typeof analysisData?.severity === "object" && typeof analysisData.severity?.score === "number"
      ? analysisData.severity.score
      : undefined) ??
    (typeof analysisData?.severity_score === "number" ? analysisData.severity_score : 0.56);
  const severityWidth = toSeverityWidth(severityScore);

  const doctorsSource = analysisData?.doctors?.length
    ? analysisData.doctors
    : analysisData?.nearby_doctors?.length
      ? analysisData.nearby_doctors
      : [];
  const doctors = doctorsSource.length ? doctorsSource.map(toDoctor) : defaultDoctors;

  const testsSource = analysisData?.tests?.length
    ? analysisData.tests
    : analysisData?.recommended_tests?.length
      ? analysisData.recommended_tests
      : [];
  const tests = testsSource.length ? testsSource.map(toTest) : defaultTests;

  const medicinesSource = analysisData?.medicines?.length
    ? analysisData.medicines
    : analysisData?.medicine_suggestions?.length
      ? analysisData.medicine_suggestions
      : [];
  const medicines = medicinesSource.length ? medicinesSource.map(toMedicine) : defaultMedicines;

  const timelineSource = analysisData?.timeline?.length
    ? analysisData.timeline
    : analysisData?.recovery_timeline?.length
      ? analysisData.recovery_timeline
      : [];
  const timeline = timelineSource.length ? timelineSource.map(toTimelineStep) : defaultTimeline;

  const specialist =
    analysisData?.recommended_specialist ??
    analysisData?.specialist ??
    defaultDoctors[0]?.specialty ??
    "Internal Medicine";
  const totalSlides = 8;

  useEffect(() => {
    if (!showDetailedAnalysis || loading || isAnalyzing) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setDetailedSlideIndex((prev) => {
        if (prev >= totalSlides - 1) {
          return prev;
        }
        return prev + 1;
      });
    }, 7000);

    return () => window.clearInterval(intervalId);
  }, [showDetailedAnalysis, loading, isAnalyzing, detailedSlideIndex, totalSlides]);

  console.log("Mapped Analysis Data:", analysisData);

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
          ) : isAnalyzing ? (
            <SymptomStory
              storyData={analysisData?.story_script || []}
              onComplete={() => setIsAnalyzing(false)}
            />
          ) : !showDetailedAnalysis ? (
            <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Initial Summary</p>
              <h1 className="mt-3 text-2xl font-semibold text-slate-900">Your Health Analysis</h1>
              <p className="mt-2 text-sm text-slate-600">
                <span className="font-semibold">Symptoms:</span> {symptoms || "Not provided"}
              </p>
              <div className="mt-5 whitespace-pre-wrap text-sm leading-7 text-slate-700">{summaryText}</div>

              <div className="mt-6">
                <button
                  type="button"
                  className="inline-flex items-center rounded-full bg-[#1f67f2] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(31,103,242,0.25)] transition hover:-translate-y-px"
                  onClick={() => {
                    setDetailedSlideIndex(0);
                    setShowDetailedAnalysis(true);
                  }}
                >
                  View Detailed Analysis
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setShowDetailedAnalysis(false)}
                  className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300"
                >
                  {"<- Back to Summary"}
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setDetailedSlideIndex((prev) => Math.max(prev - 1, 0))
                    }
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300"
                  >
                    Prev
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setDetailedSlideIndex((prev) => Math.min(prev + 1, totalSlides - 1))
                    }
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300"
                  >
                    Next
                  </button>
                </div>
              </div>

              <motion.div
                key={detailedSlideIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                {detailedSlideIndex === 0 && (
                  <div className="[&>section]:grid-cols-1 [&>section>div:nth-child(2)]:hidden">
                    <ConditionsAndSeverity
                      conditions={conditions}
                      severityLevel={severityLevel}
                      severityDescription={severityDescription}
                      severityWidth={severityWidth}
                    />
                  </div>
                )}
                {detailedSlideIndex === 1 && (
                  <div className="[&>section]:grid-cols-1 [&>section>div:nth-child(1)]:hidden">
                    <ConditionsAndSeverity
                      conditions={conditions}
                      severityLevel={severityLevel}
                      severityDescription={severityDescription}
                      severityWidth={severityWidth}
                    />
                  </div>
                )}
                {detailedSlideIndex === 2 && (
                  <div className="[&>section]:grid-cols-1 [&>section>div:nth-child(2)]:hidden">
                    <SpecialistAndDoctors specialist={specialist} doctors={doctors} userLocation={userLocation} />
                  </div>
                )}
                {detailedSlideIndex === 3 && (
                  <div className="[&>section]:grid-cols-1 [&>section>div:nth-child(1)]:hidden">
                    <SpecialistAndDoctors specialist={specialist} doctors={doctors} userLocation={userLocation} />
                  </div>
                )}
                {detailedSlideIndex === 4 && (
                  <div className="[&>section]:grid-cols-1 [&>section>div:nth-child(2)]:hidden">
                    <TestsAndTimeline tests={tests} timeline={timeline} />
                  </div>
                )}
                {detailedSlideIndex === 5 && (
                  <div className="[&>section]:grid-cols-1 [&>section>div:nth-child(1)]:hidden">
                    <TestsAndTimeline tests={tests} timeline={timeline} />
                  </div>
                )}
                {detailedSlideIndex === 6 && <MedicineSuggestions medicines={medicines} />}
                {detailedSlideIndex === 7 && <NextSteps onRestart={() => router.push("/")} />}
              </motion.div>
            </div>
          )}
        </main>
      </section>
    </div>
  );
}
