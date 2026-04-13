"use client";

import { motion } from "framer-motion";

type Props = {
  bodyNote: string;
  highlightLabel: string;
};

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
};

export function BodyVisualization({ bodyNote, highlightLabel }: Props) {
  return (
    <motion.section {...fadeUp} className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm sm:p-8">
        <h3 className="text-xl font-semibold text-slate-900">Body visualization</h3>
        <p className="mt-2 text-sm text-slate-600">{bodyNote}</p>
        <div className="mt-6 flex items-center justify-center">
          <div className="relative h-107.5 w-52">
            <svg viewBox="0 0 200 450" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
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
            </svg>
            <div className="absolute left-1/2 top-[31%] h-16 w-16 -translate-x-1/2 rounded-full bg-[#55d2b7]/40 blur-xl" />
            <div className="absolute left-1/2 top-[31%] h-10 w-10 -translate-x-1/2 rounded-full border border-[#2fb1a7] bg-[#c9f3ea] animate-[pulseGlow_2.8s_ease-in-out_infinite]" />
            <div className="absolute left-1/2 top-[41%] -translate-x-1/2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#2b7f74] shadow-sm">
              {highlightLabel}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm sm:p-8">
        <h3 className="text-xl font-semibold text-slate-900">Condition explanation</h3>
        <p className="mt-2 text-sm text-slate-600">
          Soft, educational visualizations of possible causes.
        </p>
        <div className="mt-6 space-y-4">
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-800">Acid Reflux</p>
                <p className="text-xs text-slate-500">Acid moving upward</p>
              </div>
              <div className="h-14 w-20">
                <svg viewBox="0 0 120 80" className="h-full w-full">
                  <motion.path
                    d="M20 60c14-18 28-18 40 0 12 18 26 18 40 0"
                    stroke="#56a9ff"
                    strokeWidth="6"
                    strokeLinecap="round"
                    fill="none"
                    animate={{ pathLength: [0, 1], opacity: [0.3, 1] }}
                    transition={{ duration: 2.6, repeat: Infinity, repeatType: "loop" }}
                  />
                  <motion.path
                    d="M60 60V18"
                    stroke="#2fb1a7"
                    strokeWidth="6"
                    strokeLinecap="round"
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ duration: 2.4, repeat: Infinity }}
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-800">Gastritis</p>
                <p className="text-xs text-slate-500">Inflamed stomach lining</p>
              </div>
              <div className="h-14 w-20">
                <svg viewBox="0 0 120 80" className="h-full w-full">
                  <motion.rect
                    x="24"
                    y="18"
                    width="72"
                    height="44"
                    rx="18"
                    fill="#f4f7fb"
                    stroke="#b7c7e2"
                    strokeWidth="4"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2.6, repeat: Infinity }}
                  />
                  <motion.circle
                    cx="48"
                    cy="40"
                    r="8"
                    fill="#ffb87a"
                    animate={{ r: [6, 10, 6], opacity: [0.4, 0.9, 0.4] }}
                    transition={{ duration: 2.2, repeat: Infinity }}
                  />
                  <motion.circle
                    cx="76"
                    cy="40"
                    r="8"
                    fill="#ffb87a"
                    animate={{ r: [6, 10, 6], opacity: [0.4, 0.9, 0.4] }}
                    transition={{ duration: 2.2, repeat: Infinity, delay: 0.4 }}
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

