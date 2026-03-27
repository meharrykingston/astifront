"use client";

import { motion } from "framer-motion";
import type { TestCard, TimelineStep } from "@/types/analysis";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
};

type Props = {
  tests: TestCard[];
  timeline: TimelineStep[];
};

export function TestsAndTimeline({ tests, timeline }: Props) {
  return (
    <motion.section {...fadeUp} className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm sm:p-8">
        <h3 className="text-xl font-semibold text-slate-900">Suggested tests</h3>
        <p className="mt-2 text-sm text-slate-600">
          Doctors may recommend these to confirm or rule out causes.
        </p>
        <div className="mt-6 grid gap-4">
          {tests.map((test) => (
            <div key={test.name} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-slate-900">{test.name}</h4>
                <span className="text-xs font-semibold text-[#2b7f74]">{test.cost}</span>
              </div>
              <p className="mt-2 text-xs text-slate-500">{test.purpose}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm sm:p-8">
        <h3 className="text-xl font-semibold text-slate-900">Recovery timeline</h3>
        <p className="mt-2 text-sm text-slate-600">
          Typical progression observed for similar symptom patterns.
        </p>
        <div className="mt-6 space-y-4">
          {timeline.map((step, index) => (
            <div key={step.range} className="relative rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4">
              {index < timeline.length - 1 && (
                <span className="absolute left-[27px] top-[54px] h-[calc(100%-38px)] w-[2px] bg-slate-200" />
              )}
              <div className="flex items-start gap-4">
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full border border-white bg-white shadow-sm">
                  <div
                    className={`h-3.5 w-3.5 rounded-full ${
                      step.intensity === "high"
                        ? "bg-[#2fb1a7]"
                        : step.intensity === "medium"
                        ? "bg-[#8ed9cc]"
                        : "bg-[#d9f2ed]"
                    }`}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900">{step.range}</p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                        step.intensity === "high"
                          ? "bg-[#e7f7f3] text-[#2b7f74]"
                          : step.intensity === "medium"
                          ? "bg-[#edf8f5] text-[#3d8f82]"
                          : "bg-slate-200/60 text-slate-600"
                      }`}
                    >
                      {step.intensity === "high"
                        ? "Active symptoms"
                        : step.intensity === "medium"
                        ? "Improving"
                        : "Recovery phase"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{step.text}</p>
                </div>
                <div className="hidden rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-500 sm:block">
                  {step.intensity === "high"
                    ? "Monitor closely"
                    : step.intensity === "medium"
                    ? "Continue care"
                    : "Stabilizing"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

