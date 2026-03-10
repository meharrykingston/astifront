import { motion } from "framer-motion";
import type { ConditionCard, DoctorCard, TestCard, TimelineStep, MedicineCard } from "@/types/analysis";
import {
  defaultConditions,
  defaultDoctors,
  defaultMedicines,
  defaultTests,
  defaultTimeline,
} from "@/components/analysis/analysisData";
import { BodyVisualization } from "@/components/analysis/BodyVisualization";
import { ConditionsAndSeverity } from "@/components/analysis/ConditionsAndSeverity";
import { SpecialistAndDoctors } from "@/components/analysis/SpecialistAndDoctors";
import { TestsAndTimeline } from "@/components/analysis/TestsAndTimeline";
import { MedicineSuggestions } from "@/components/analysis/MedicineSuggestions";
import { NextSteps } from "@/components/analysis/NextSteps";
import { InteractiveGuidance } from "@/components/analysis/InteractiveGuidance";
import { AnalysisLoader } from "@/components/analysis/AnalysisLoader";
import type { AnalysisMeta, AnalysisResult } from "@/types/analysis";
import { useTypedText } from "@/hooks/useTypedText";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
};

type Props = {
  analysis: AnalysisResult | null;
  meta: AnalysisMeta | null;
  summaryStream: string;
  loading: boolean;
  stage: number;
  symptomLabel: string;
  answersCount: number;
  loaderIndex: number;
  guidanceValue: string;
  onGuidanceChange: (value: string) => void;
  onGuidanceSend: () => void;
  onRestart: () => void;
};

export function AnalysisWidgets({
  analysis,
  summaryStream,
  loading,
  stage,
  symptomLabel,
  answersCount,
  loaderIndex,
  guidanceValue,
  onGuidanceChange,
  onGuidanceSend,
  onRestart,
}: Props) {
  const conditions: ConditionCard[] = analysis?.conditions?.length
    ? analysis.conditions
    : defaultConditions;
  const doctors: DoctorCard[] = analysis?.doctors?.length ? analysis.doctors : defaultDoctors;
  const tests: TestCard[] = analysis?.tests?.length ? analysis.tests : defaultTests;
  const medicines: MedicineCard[] = analysis?.medicines?.length
    ? analysis.medicines
    : defaultMedicines;
  const timeline: TimelineStep[] = analysis?.timeline?.length ? analysis.timeline : defaultTimeline;
  const bodyNote =
    analysis?.bodyNote ?? "Your symptoms suggest irritation in the stomach region.";
  const highlightLabel = analysis?.highlightLabel ?? "stomach irritation area";
  const specialist = analysis?.specialist ?? "Gastroenterologist";
  const severityLevel = analysis?.severity?.level ?? "Low concern";
  const severityDescription =
    analysis?.severity?.description ??
    "Consult a doctor if symptoms persist or worsen.";
  const severityScore =
    typeof analysis?.severity?.score === "number" ? analysis.severity.score : 0.35;
  const severityWidth = `${Math.min(Math.max(severityScore, 0), 1) * 100}%`;

  const loaderMessages = [
    "Analyzing your symptoms",
    "Comparing medical patterns",
    "Checking possible causes",
    "Finding nearby doctors",
  ];

  const typedSummary = useTypedText(
    summaryStream || "Preparing insights based on your responses.",
    { speed: 16, active: !loading }
  );
  const typedBodyNote = useTypedText(bodyNote, { speed: 14, active: stage >= 1 });
  const typedConditions = useTypedText(
    "These are the most likely explanations returned by Astikan AI.",
    { speed: 14, active: stage >= 2 }
  );
  const typedSpecialist = useTypedText(
    "Based on your symptoms, the recommended specialist is:",
    { speed: 14, active: stage >= 3 }
  );
  const typedTests = useTypedText(
    "Doctors may recommend these tests to confirm or rule out causes.",
    { speed: 14, active: stage >= 4 }
  );
  const typedMeds = useTypedText(
    "Commonly prescribed medicines. Always confirm with a doctor.",
    { speed: 14, active: stage >= 5 }
  );

  return (
    <div className="analysis-wrapper mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 pb-24 pt-10 sm:px-6">
      {loading && (
        <AnalysisLoader messages={loaderMessages} activeIndex={loaderIndex} />
      )}

      {!loading && (
        <motion.section {...fadeUp} className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">AI Summary</h3>
          <p className="mt-2 text-sm text-slate-600">
            {typedSummary}
            <span className="typing-caret" aria-hidden="true" />
          </p>
          <p className="mt-4 text-xs text-slate-400">
            {answersCount} responses · {symptomLabel}
          </p>
        </motion.section>
      )}

      {stage >= 1 && (
        <div>
          <p className="mb-3 text-sm text-slate-600">{typedBodyNote}</p>
          <BodyVisualization bodyNote={bodyNote} highlightLabel={highlightLabel} />
        </div>
      )}
      {stage >= 2 && (
        <div>
          <p className="mb-3 text-sm text-slate-600">{typedConditions}</p>
          <ConditionsAndSeverity
            conditions={conditions}
            severityLevel={severityLevel}
            severityDescription={severityDescription}
            severityWidth={severityWidth}
          />
        </div>
      )}
      {stage >= 3 && (
        <div>
          <p className="mb-3 text-sm text-slate-600">
            {typedSpecialist} <span className="font-semibold">{specialist}</span>
          </p>
          <SpecialistAndDoctors specialist={specialist} doctors={doctors} />
        </div>
      )}
      {stage >= 4 && (
        <div>
          <p className="mb-3 text-sm text-slate-600">{typedTests}</p>
          <TestsAndTimeline tests={tests} timeline={timeline} />
        </div>
      )}
      {stage >= 5 && (
        <div>
          <p className="mb-3 text-sm text-slate-600">{typedMeds}</p>
          <MedicineSuggestions medicines={medicines} />
        </div>
      )}
      {stage >= 6 && <NextSteps onRestart={onRestart} />}
      {stage >= 6 && (
        <InteractiveGuidance
          value={guidanceValue}
          onChange={onGuidanceChange}
          onSend={onGuidanceSend}
        />
      )}
    </div>
  );
}
