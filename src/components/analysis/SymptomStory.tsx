"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type StoryStep = {
  zone?: string;
  text?: string;
};

type Props = {
  storyData?: StoryStep[];
  onComplete: () => void;
};

const zones: Record<string, { cx: number; cy: number }> = {
  head: { cx: 50, cy: 22 },
  chest: { cx: 50, cy: 55 },
  stomach: { cx: 50, cy: 80 },
  lower_abdomen: { cx: 50, cy: 100 },
  left_arm: { cx: 18, cy: 75 },
  right_leg: { cx: 60, cy: 150 },
};

const fallbackStory: StoryStep[] = [
  { zone: "head", text: "Reviewing symptom onset and neurological context." },
  { zone: "chest", text: "Correlating cardiopulmonary patterns with your responses." },
  { zone: "stomach", text: "Checking gastrointestinal indicators and inflammation markers." },
  { zone: "lower_abdomen", text: "Evaluating lower abdominal pathways and referral pain." },
  { zone: "left_arm", text: "Finalizing cross-zone risk analysis and doctor guidance." },
];

const getZonePoint = (zone?: string) => zones[zone ?? ""] ?? zones.stomach;

export function SymptomStory({ storyData, onComplete }: Props) {
  const normalizedSteps = useMemo(() => {
    const incoming = Array.isArray(storyData)
      ? storyData.filter((step): step is StoryStep => !!step && (typeof step.text === "string" || typeof step.zone === "string"))
      : [];

    const base = incoming.length ? incoming.slice(0, 5) : fallbackStory.slice(0, 5);
    while (base.length < 5) {
      base.push(base[base.length - 1] ?? fallbackStory[base.length]);
    }

    return base;
  }, [storyData]);

  const [currentStep, setCurrentStep] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const completedRef = useRef(false);

  useEffect(() => {
    setCurrentStep(0);
    setElapsedMs(0);
    completedRef.current = false;

    const progressInterval = window.setInterval(() => {
      setElapsedMs((prev) => Math.min(prev + 100, 25000));
    }, 100);

    const stepInterval = window.setInterval(() => {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }, 5000);

    const finishTimeout = window.setTimeout(() => {
      if (!completedRef.current) {
        completedRef.current = true;
        onComplete();
      }
    }, 25000);

    return () => {
      window.clearInterval(progressInterval);
      window.clearInterval(stepInterval);
      window.clearTimeout(finishTimeout);
    };
  }, [onComplete, normalizedSteps]);

  const activeStep = normalizedSteps[currentStep] ?? fallbackStory[currentStep] ?? fallbackStory[0];
  const zone = getZonePoint(activeStep.zone);
  const progress = Math.min((elapsedMs / 25000) * 100, 100);

  return (
    <section className="mx-auto w-full max-w-4xl rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm sm:p-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Lets Understand what happen with you!</p>
          <motion.h2
            className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl"
            animate={{ opacity: [0.75, 1, 0.75] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            Astikan AI HealthEngine Analysis in Progress...
          </motion.h2>
          <p className="mt-2 text-sm text-slate-600">Correlating symptoms with anatomical and clinical patterns.</p>
        </div>
        <div className="w-full max-w-xs rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Scan progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
            <motion.div
              className="h-full rounded-full bg-linear-to-r from-[#1f67f2] to-[#2fb1a7]"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.2, ease: "linear" }}
            />
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="mx-auto w-full max-w-xs rounded-3xl border border-slate-200 bg-slate-50/80 p-5">
          <svg viewBox="0 0 100 170" className="h-105 w-full">
            <defs>
              <linearGradient id="storyBodyFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#f6f9ff" />
                <stop offset="100%" stopColor="#e0e8f5" />
              </linearGradient>
            </defs>

            <ellipse cx="50" cy="16" rx="10" ry="9" fill="url(#storyBodyFill)" stroke="#bdcce1" strokeWidth="1" />
            <path
              d="M50 27c10 0 18 5 22 12l5 14c1.5 3-1 6-4 6h-6v28c0 5 1 10 4 14l7 13c2.5 5 .5 9-4 9h-5c-2.5 0-4.5-1.5-5.5-3.8l-6-15c-1-2.3-1.5-4.8-1.5-7.2v-2.5h-8v2.5c0 2.4-.5 4.9-1.5 7.2l-6 15c-1 2.3-3 3.8-5.5 3.8h-5c-4.5 0-6.5-4-4-9l7-13c3-4 4-9 4-14V59h-6c-3 0-5.5-3-4-6l5-14c4-7 12-12 22-12Z"
              fill="url(#storyBodyFill)"
              stroke="#bdcce1"
              strokeWidth="1"
            />
            <path d="M36 57h10M54 57h10" stroke="#c7d4e5" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M43 76h14M43 95h14" stroke="#c7d4e5" strokeWidth="1" strokeLinecap="round" />

            <motion.circle
              cx={zone.cx}
              cy={zone.cy}
              r={11}
              fill="#2fb1a7"
              animate={{ opacity: [0, 0.3, 0], scale: [0.6, 1.2, 1.7] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              style={{ transformOrigin: `${zone.cx}px ${zone.cy}px` }}
            />
            <motion.circle
              cx={zone.cx}
              cy={zone.cy}
              r={6.5}
              fill="#80e1d2"
              animate={{ opacity: [0.3, 0.9, 0.3], scale: [0.9, 1.05, 0.9] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              style={{ transformOrigin: `${zone.cx}px ${zone.cy}px` }}
            />
            <motion.circle
              cx={zone.cx}
              cy={zone.cy}
              r={3.2}
              fill="#0f766e"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Live Clinical Narrative</p>
          <AnimatePresence mode="wait">
            <motion.p
              key={`${currentStep}-${activeStep.text ?? ""}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="mt-4 min-h-28 text-base leading-7 text-slate-700"
            >
              {activeStep.text ?? "Preparing your report..."}
            </motion.p>
          </AnimatePresence>
          <div className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-medium text-slate-500">
            Tracking zone: <span className="font-semibold text-slate-700">{activeStep.zone ?? "stomach"}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
