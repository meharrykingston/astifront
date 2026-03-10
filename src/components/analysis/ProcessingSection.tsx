"use client";

import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { lottiePulse } from "@/components/analysis/analysisData";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
};

type Props = {
  steps: string[];
  activeStep: number;
  summary: string;
  loading: boolean;
  error: boolean;
  errorMessage?: string | null;
  badge: string;
  userLabel: string;
  answersCount: number;
  debug?: boolean;
  storyLine?: string;
};

export function ProcessingSection({
  steps,
  activeStep,
  summary,
  loading,
  error,
  errorMessage,
  badge,
  userLabel,
  answersCount,
  debug = false,
  storyLine,
}: Props) {
  return (
    <motion.section
      {...fadeUp}
      className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white px-6 py-8 shadow-[0_30px_60px_rgba(15,23,42,0.08)] sm:px-10"
    >
      <div className="absolute right-10 top-6 hidden h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(77,149,255,0.2),rgba(255,255,255,0))] sm:block" />
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#e7f0ff] px-4 py-2 text-xs font-semibold text-[#1f67f2]">
            Astikan AI Analysis
            <span className="inline-flex items-center gap-1">
              <span className="h-1.5 w-1.5 animate-[dotPulse_1.4s_infinite] rounded-full bg-[#1f67f2]" />
              <span className="h-1.5 w-1.5 animate-[dotPulse_1.4s_0.2s_infinite] rounded-full bg-[#1f67f2]/70" />
              <span className="h-1.5 w-1.5 animate-[dotPulse_1.4s_0.4s_infinite] rounded-full bg-[#1f67f2]/40" />
            </span>
          </div>
          <div className="text-xs font-semibold text-slate-500">{badge}</div>

          <h2 className="text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">
            Symptom insights generated
          </h2>
          {storyLine && <p className="text-sm text-slate-600">{storyLine}</p>}
          <p className="max-w-xl text-sm text-slate-600 sm:text-base">
            We combine your responses with clinical guidelines to highlight possible
            causes, care options, and next steps.
          </p>

          <div className="space-y-3">
            {steps.map((step) => (
              <div
                key={step}
                className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition ${
                  steps[activeStep] === step
                    ? "border-[#bcd8ff] bg-[#eef4ff]"
                    : "border-slate-100 bg-slate-50"
                }`}
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full shadow-[0_0_10px_rgba(47,177,167,0.6)] ${
                    steps[activeStep] === step ? "bg-[#1f67f2]" : "bg-[#2fb1a7]"
                  }`}
                />
                <p className="text-sm font-medium text-slate-700">{step}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 text-sm text-slate-600">
            <div className="flex items-start gap-3">
              <div className="mt-1 h-2.5 w-2.5 rounded-full bg-[#1f67f2]" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Astikan AI
                </p>
                {loading && (
                  <p className="mt-2 inline-flex items-center gap-2">
                    Generating summary
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 animate-[dotPulse_1.4s_infinite] rounded-full bg-[#1f67f2]" />
                      <span className="h-1.5 w-1.5 animate-[dotPulse_1.4s_0.2s_infinite] rounded-full bg-[#1f67f2]/70" />
                      <span className="h-1.5 w-1.5 animate-[dotPulse_1.4s_0.4s_infinite] rounded-full bg-[#1f67f2]/40" />
                    </span>
                  </p>
                )}
                {error && debug && (
                  <p className="mt-2 text-amber-600">
                    AI service error: {errorMessage ?? "Unknown error"}
                  </p>
                )}
                {!loading && !error && summary && <p className="mt-2">{summary}</p>}
                {!loading && !error && !summary && (
                  <p className="mt-2">
                    Summarizing your responses into a calm, clinical overview.
                  </p>
                )}
              </div>
            </div>
            <div className="rounded-xl bg-white px-3 py-2 text-xs text-slate-500">
              User input: {userLabel} · {answersCount} responses captured
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Analysis</span>
              <span>78%</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-slate-100">
              <div className="h-full w-[78%] animate-[progressGlow_4s_linear_infinite] rounded-full bg-gradient-to-r from-[#4ca3ff] via-[#6fb5ff] to-[#2fb1a7]" />
            </div>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="absolute -bottom-4 right-6 hidden h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(47,177,167,0.35),rgba(255,255,255,0))] lg:block" />
          <div className="relative flex h-72 w-full items-center justify-center rounded-3xl border border-slate-200 bg-gradient-to-b from-[#f7fbff] to-white">
            <div className="absolute left-4 top-4 h-16 w-16 rounded-2xl bg-white shadow-sm">
              <Lottie animationData={lottiePulse} loop className="h-16 w-16" />
            </div>
            <div className="relative h-56 w-40">
              <svg viewBox="0 0 140 260" className="h-full w-full text-slate-300">
                <path
                  d="M70 10c22 0 40 18 40 40 0 16-8 30-20 36v20c0 14 8 22 16 30 8 8 14 20 14 36 0 32-22 70-50 70s-50-38-50-70c0-16 6-28 14-36 8-8 16-16 16-30v-20c-12-6-20-20-20-36C30 28 48 10 70 10Z"
                  fill="#e9eef7"
                />
                <path
                  d="M54 130c8-6 32-6 40 0"
                  stroke="#c1ccde"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <rect x="48" y="135" width="44" height="34" rx="16" fill="#dbe7ff" />
              </svg>
              <div className="absolute left-1/2 top-[58%] h-14 w-14 -translate-x-1/2 rounded-full bg-[#56d3b7]/40 blur-xl" />
              <div className="absolute left-1/2 top-[58%] h-10 w-10 -translate-x-1/2 rounded-full border border-[#2fb1a7] bg-[#c9f3ea] animate-[pulseGlow_2.8s_ease-in-out_infinite]" />
              <div className="absolute left-1/2 top-[58%] -translate-x-1/2 translate-y-12 text-xs font-semibold text-[#2b7f74]">
                stomach area
              </div>
              <div className="absolute inset-0 rounded-3xl border border-transparent bg-[linear-gradient(120deg,rgba(76,163,255,0.2),rgba(255,255,255,0),rgba(47,177,167,0.2))] opacity-30" />
              <div className="absolute inset-0 animate-[scan_6s_linear_infinite] rounded-3xl bg-[linear-gradient(90deg,transparent,rgba(76,163,255,0.35),transparent)]" />
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

