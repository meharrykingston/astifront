"use client";

import { motion } from "framer-motion";
import type { AnalysisMeta, AnalysisResult } from "@/types/analysis";
import {
  defaultConditions,
  defaultDoctors,
  defaultProcessingSteps,
  defaultTests,
  defaultTimeline,
} from "@/components/analysis/analysisData";
import { ProcessingSection } from "@/components/analysis/ProcessingSection";
import { BodyVisualization } from "@/components/analysis/BodyVisualization";
import { ConditionsAndSeverity } from "@/components/analysis/ConditionsAndSeverity";
import { SpecialistAndDoctors } from "@/components/analysis/SpecialistAndDoctors";
import { TestsAndTimeline } from "@/components/analysis/TestsAndTimeline";
import { NextSteps } from "@/components/analysis/NextSteps";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
};

type Props = {
  analysis: AnalysisResult | null;
  meta: AnalysisMeta | null;
  summaryStream: string;
  loading: boolean;
  error: boolean;
  errorMessage?: string | null;
  activeStep: number;
  stage: number;
  storyLine?: string;
  symptomLabel: string;
  answersCount: number;
  onRestart: () => void;
  onNext: () => void;
  onBack: () => void;
};

export function AnalysisShell({
  analysis,
  meta,
  summaryStream,
  loading,
  error,
  errorMessage,
  activeStep,
  stage,
  storyLine,
  symptomLabel,
  answersCount,
  onRestart,
  onNext,
  onBack,
}: Props) {
  const conditions = analysis?.conditions?.length ? analysis.conditions : defaultConditions;
  const doctors = analysis?.doctors?.length ? analysis.doctors : defaultDoctors;
  const tests = analysis?.tests?.length ? analysis.tests : defaultTests;
  const timeline = analysis?.timeline?.length ? analysis.timeline : defaultTimeline;
  const bodyNote =
    analysis?.bodyNote ?? "Your symptoms suggest irritation in the stomach region.";
  const highlightLabel = analysis?.highlightLabel ?? "stomach irritation area";
  const specialist = analysis?.specialist ?? "Gastroenterologist";
  const severityLevel = analysis?.severity?.level ?? "Low";
  const severityDescription =
    analysis?.severity?.description ??
    "Most cases improve with simple treatment and lifestyle changes.";
  const severityScore =
    typeof analysis?.severity?.score === "number" ? analysis.severity.score : 0.28;
  const severityWidth = `${Math.min(Math.max(severityScore, 0), 1) * 100}%`;

  const badge = "Astikan AI";
  const debug = process.env.NEXT_PUBLIC_DEBUG_AI === "true";

  return (
    <div className="analysis-wrapper mx-auto flex w-full max-w-4xl flex-col items-center gap-10 px-4 pb-24 pt-12 sm:px-6">
      {stage === 0 && (
        <div className="w-full">
          <ProcessingSection
            steps={defaultProcessingSteps}
            activeStep={activeStep}
            summary={summaryStream}
            loading={loading}
            error={error}
            errorMessage={errorMessage}
            badge={badge}
            userLabel={symptomLabel}
            answersCount={answersCount}
            debug={debug}
            storyLine={storyLine}
          />
        </div>
      )}
      {stage === 1 && (
        <div className="w-full">
          <BodyVisualization bodyNote={bodyNote} highlightLabel={highlightLabel} />
        </div>
      )}
      {stage === 2 && (
        <div className="w-full">
          <ConditionsAndSeverity
            conditions={conditions}
            severityLevel={severityLevel}
            severityDescription={severityDescription}
            severityWidth={severityWidth}
          />
        </div>
      )}
      {stage === 3 && (
        <div className="w-full">
          <SpecialistAndDoctors specialist={specialist} doctors={doctors} />
        </div>
      )}
      {stage === 4 && (
        <div className="w-full">
          <TestsAndTimeline tests={tests} timeline={timeline} />
        </div>
      )}
      {stage === 5 && (
        <div className="w-full">
          <NextSteps onRestart={onRestart} />
        </div>
      )}

      <motion.section {...fadeUp} className="flex items-center justify-center gap-4">
        <div className="text-xs font-semibold text-slate-500">
          Step {stage + 1} of 6
        </div>
      </motion.section>
    </div>
  );
}

