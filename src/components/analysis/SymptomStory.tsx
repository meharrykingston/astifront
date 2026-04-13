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
  head: { cx: 100, cy: 52 },
  chest: { cx: 100, cy: 95 },
  stomach: { cx: 100, cy: 145 },
  lower_abdomen: { cx: 100, cy: 178 },
  left_arm: { cx: 42, cy: 165 },
  right_leg: { cx: 120, cy: 340 },
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

      <div className="mt-4 grid gap-4 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
        <div className="mx-auto w-full max-w-55 rounded-3xl border border-slate-200 bg-slate-50/80 p-2">
          <svg viewBox="0 0 200 450" className="h-75 w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f8fafd" />
                <stop offset="100%" stopColor="#e2e8f0" />
              </linearGradient>
            </defs>

            <g id="human-body" stroke="#94a3b8" strokeWidth="1" fill="url(#skinGrad)">
              <path id="head" d="M100 30c-10 0-18 8-18 22s8 22 18 22 18-8 18-22-8-22-18-22z" />

              <g id="chest">
                <path d="M72 75c-15 2-25 10-28 25 15 0 28 10 56 10s41-10 56-10c-3-15-13-23-28-25H72z" />
              </g>

              <g id="abs">
                <path d="M75 110h50c5 20 8 45 0 70-15 10-35 10-50 0-8-25-5-50 0-70z" />
              </g>

              <g id="arms">
                <path d="M42 85c-8 15-18 45-12 80 2 15 10 40 10 40s5-5 5-15-5-30-5-60c2-25 12-45 12-45" />
                <path d="M158 85c8 15 18 45 12 80-2 15-10 40-10 40s-5-5-5-15 5-30 5-60c-2-25-12-45-12-45" />
              </g>

              <g id="legs">
                <path d="M75 190c-5 30-15 80-10 130 5 40 15 90 20 95s10-5 10-20-5-70-5-100c0-40 10-105 10-105z" />
                <path d="M125 190c5 30 15 80 10 130-5 40-15 90-20 95s-10-5-10-20 5-70 5-100c0-40-10-105-10-105z" />
              </g>
            </g>

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
