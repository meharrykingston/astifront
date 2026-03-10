"use client";

import { motion } from "framer-motion";
import type { TestCard, TimelineStep } from "@/types/analysis";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
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
          A gentle recovery path if symptoms stay mild.
        </p>
        <div className="mt-6 grid gap-4">
          {timeline.map((step) => (
            <div
              key={step.range}
              className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                <div
                  className={`h-6 w-6 rounded-full ${
                    step.intensity === "high"
                      ? "bg-[#2fb1a7]"
                      : step.intensity === "medium"
                      ? "bg-[#8ed9cc]"
                      : "bg-[#d9f2ed]"
                  }`}
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{step.range}</p>
                <p className="text-xs text-slate-500">{step.text}</p>
              </div>
              <div className="ml-auto hidden h-12 w-16 items-center justify-center rounded-full border border-slate-200 bg-white text-xs font-semibold text-slate-500 sm:flex">
                {step.intensity === "high"
                  ? "Active"
                  : step.intensity === "medium"
                  ? "Healing"
                  : "Calm"}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-center">
          <div className="relative h-40 w-28">
            <svg viewBox="0 0 140 220" className="h-full w-full">
              <path
                d="M70 10c24 0 44 20 44 44 0 16-8 30-20 36v20c0 14 8 24 16 32 8 8 14 20 14 34 0 32-22 64-54 64s-54-32-54-64c0-14 6-26 14-34 8-8 16-18 16-32v-20c-12-6-20-20-20-36 0-24 20-44 44-44Z"
                fill="#edf2f9"
              />
            </svg>
            <div className="absolute left-1/2 top-[60%] h-10 w-10 -translate-x-1/2 rounded-full bg-[#c9f3ea]" />
            <div className="absolute left-1/2 top-[60%] h-6 w-6 -translate-x-1/2 rounded-full bg-[#2fb1a7] opacity-40" />
          </div>
        </div>
      </div>
    </motion.section>
  );
}

