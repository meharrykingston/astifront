"use client";

import { motion } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
};

type Props = {
  onRestart: () => void;
};

export function NextSteps({ onRestart }: Props) {
  return (
    <motion.section
      {...fadeUp}
      className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-slate-900">Next steps</h3>
          <p className="mt-2 text-sm text-slate-600">
            Keep the momentum with guided actions and symptom tracking.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300">
            Ask Astikan AI Another Question
          </button>
          <button className="btn-primary rounded-full px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(31,103,242,0.25)]">
            Find Doctors
          </button>
          <button className="btn-soft-accent rounded-full border px-5 py-3 text-sm font-semibold transition">
            Track Your Symptoms
          </button>
        </div>
      </div>
      <div className="mt-6">
        <button className="text-xs font-semibold text-slate-400" type="button" onClick={onRestart}>
          Start over
        </button>
      </div>
    </motion.section>
  );
}

