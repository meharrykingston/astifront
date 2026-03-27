"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import type { AnalysisMeta, AnalysisResult } from "@/types/analysis";
import {
  defaultConditions,
  defaultDoctors,
  defaultTests,
  defaultTimeline,
} from "@/components/analysis/analysisData";
import { BodyVisualization } from "@/components/analysis/BodyVisualization";
import { ConditionsAndSeverity } from "@/components/analysis/ConditionsAndSeverity";
import { SpecialistAndDoctors } from "@/components/analysis/SpecialistAndDoctors";
import { TestsAndTimeline } from "@/components/analysis/TestsAndTimeline";
import { NextSteps } from "@/components/analysis/NextSteps";

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
  error: boolean;
  stage: number;
  symptomLabel: string;
  answersCount: number;
  onRestart: () => void;
};

function AgentBadge({
  name,
  role,
  color,
}: {
  name: string;
  role: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className={`agent-avatar ${color}`}>{name.slice(0, 2)}</div>
      <div>
        <p className="text-xs font-semibold text-slate-500">{role}</p>
        <p className="text-sm font-semibold text-slate-900">{name}</p>
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="h-1.5 w-1.5 animate-[dotPulse_1.4s_infinite] rounded-full bg-(--accent)" />
      <span className="h-1.5 w-1.5 animate-[dotPulse_1.4s_0.2s_infinite] rounded-full bg-(--accent)/70" />
      <span className="h-1.5 w-1.5 animate-[dotPulse_1.4s_0.4s_infinite] rounded-full bg-(--accent)/40" />
    </span>
  );
}

function Waveform() {
  return (
    <span className="agent-wave">
      <span />
      <span />
      <span />
      <span />
    </span>
  );
}

function useTypedText(text: string, active: boolean, speed = 18) {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (!active) return;
    setValue("");
    let index = 0;
    const id = window.setInterval(() => {
      index += 1;
      setValue(text.slice(0, index));
      if (index >= text.length) {
        window.clearInterval(id);
      }
    }, speed);
    return () => window.clearInterval(id);
  }, [text, active, speed]);

  return value;
}

export function AgentChatFlow({
  analysis,
  meta,
  summaryStream,
  loading,
  error,
  stage,
  symptomLabel,
  answersCount,
  onRestart,
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

  const messages = useMemo(
    () => [
      {
        stage: 0,
        name: "Astikan AI",
        role: "System",
        color: "agent-system",
        text: `Starting your personalized symptom analysis. Captured ${answersCount} responses for ${symptomLabel}.`,
      },
      {
        stage: 1,
        name: "Clinician Agent",
        role: "Symptoms",
        color: "agent-clinician",
        text: "Reviewing your answers, timing, and intensity to establish a calm clinical summary.",
      },
      {
        stage: 2,
        name: "Body Scan",
        role: "Visualization",
        color: "agent-scan",
        text: "Scanning the body region indicated by your symptoms and highlighting the focal area.",
      },
      {
        stage: 3,
        name: "Diagnostic Agent",
        role: "Causes",
        color: "agent-dx",
        text: "Matching symptom patterns with likely causes and recovery expectations.",
      },
      {
        stage: 4,
        name: "Care Navigator",
        role: "Support",
        color: "agent-care",
        text: "Aligning specialist guidance and nearby care options with your comfort level.",
      },
      {
        stage: 5,
        name: "Recovery Coach",
        role: "Plan",
        color: "agent-recovery",
        text: "Preparing a gentle plan for tests and recovery pacing.",
      },
      {
        stage: 6,
        name: "Action Center",
        role: "Next steps",
        color: "agent-action",
        text: "Ready for your next actions.",
      },
    ],
    [answersCount, symptomLabel]
  );

  return (
    <div className="analysis-wrapper mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 pb-24 pt-10 sm:px-6">
      {messages
        .filter((msg) => stage >= msg.stage)
        .map((msg) => {
          const typed = useTypedText(msg.text, stage === msg.stage);
          return (
            <motion.div
              key={`${msg.stage}-${msg.name}`}
              {...fadeUp}
              className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <AgentBadge name={msg.name} role={msg.role} color={msg.color} />
                <Waveform />
              </div>
              <p className="mt-4 text-sm text-slate-700">
                {stage === msg.stage ? typed : msg.text}
              </p>
            </motion.div>
          );
        })}

      {stage >= 1 && (
        <motion.div {...fadeUp} className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm">
          <AgentBadge name="Clinician Agent" role="Symptoms" color="agent-clinician" />
          <div className="mt-4 text-sm text-slate-700">
            {loading && !summaryStream && (
              <p className="inline-flex items-center gap-2">
                Reviewing your answers <TypingDots />
              </p>
            )}
            {summaryStream && <p>{summaryStream}</p>}
            {error && !summaryStream && (
              <p>Review complete. Summarizing a calm, conservative view of your inputs.</p>
            )}
          </div>
        </motion.div>
      )}

      {stage >= 2 && (
        <motion.div {...fadeUp} className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm">
          <AgentBadge name="Body Scan" role="Visualization" color="agent-scan" />
          <p className="mt-4 text-sm text-slate-600">
            Scanning the body region indicated by your symptoms <TypingDots />
          </p>
          <div className="mt-6">
            <div className="scan-frame">
              <BodyVisualization bodyNote={bodyNote} highlightLabel={highlightLabel} />
            </div>
          </div>
        </motion.div>
      )}

      {stage >= 3 && (
        <motion.div {...fadeUp} className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm">
          <AgentBadge name="Diagnostic Agent" role="Causes" color="agent-dx" />
          <p className="mt-4 text-sm text-slate-600">
            Matching symptoms with likely causes and recovery windows.
          </p>
          <div className="mt-6">
            <ConditionsAndSeverity
              conditions={conditions}
              severityLevel={severityLevel}
              severityDescription={severityDescription}
              severityWidth={severityWidth}
            />
          </div>
        </motion.div>
      )}

      {stage >= 4 && (
        <motion.div {...fadeUp} className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm">
          <AgentBadge name="Care Navigator" role="Support" color="agent-care" />
          <p className="mt-4 text-sm text-slate-600">
            Aligning specialist guidance and nearby care options.
          </p>
          <div className="mt-6">
            <SpecialistAndDoctors specialist={specialist} doctors={doctors} />
          </div>
        </motion.div>
      )}

      {stage >= 5 && (
        <motion.div {...fadeUp} className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm">
          <AgentBadge name="Recovery Coach" role="Plan" color="agent-recovery" />
          <p className="mt-4 text-sm text-slate-600">
            Building a gentle plan for tests and recovery pacing.
          </p>
          <div className="mt-6">
            <TestsAndTimeline tests={tests} timeline={timeline} />
          </div>
        </motion.div>
      )}

      {stage >= 6 && (
        <motion.div {...fadeUp} className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm">
          <AgentBadge name="Action Center" role="Next steps" color="agent-action" />
          <p className="mt-4 text-sm text-slate-600">
            Save progress and continue your care journey.
          </p>
          <div className="mt-6">
            <NextSteps onRestart={onRestart} />
          </div>
        </motion.div>
      )}
    </div>
  );
}
