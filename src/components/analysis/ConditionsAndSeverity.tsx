"use client";

import { motion } from "framer-motion";
import type { ConditionCard } from "@/types/analysis";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
};

type Props = {
  conditions: ConditionCard[];
  severityLevel: string;
  severityDescription: string;
  severityWidth: string;
};

export function ConditionsAndSeverity({
  conditions,
  severityLevel,
  severityDescription,
  severityWidth,
}: Props) {
  return (
    <motion.section {...fadeUp} className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">Possible conditions</h3>
            <p className="mt-2 text-sm text-slate-600">
              These are the most likely explanations based on your inputs.
            </p>
          </div>
          <span className="rounded-full bg-[#e7f7f3] px-3 py-1 text-xs font-semibold text-[#2b7f74]">
            Top 3 matches
          </span>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {conditions.map((card) => (
            <div key={card.name} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <h4 className="text-base font-semibold text-slate-900">{card.name}</h4>
              <p className="mt-2 text-sm text-slate-600">{card.summary}</p>
              <p className="mt-3 text-xs font-semibold text-[#2b7f74]">{card.recovery}</p>
              <button className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#1f67f2]">
                Learn more
                <span aria-hidden="true">?</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm sm:p-8">
        <h3 className="text-xl font-semibold text-slate-900">Severity indicator</h3>
        <p className="mt-2 text-sm text-slate-600">Concern level: {severityLevel}</p>
        <div className="mt-6">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Mild</span>
            <span>Moderate</span>
            <span>Urgent</span>
          </div>
          <div className="mt-3 h-3 rounded-full bg-gradient-to-r from-[#2fb1a7] via-[#f3c969] to-[#f17a7a]">
            <div className="relative h-full" style={{ width: severityWidth }}>
              <span className="absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-white bg-[#2fb1a7] shadow-[0_0_12px_rgba(47,177,167,0.6)]" />
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-600">{severityDescription}</p>
        </div>
      </div>
    </motion.section>
  );
}

