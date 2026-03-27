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
          <div className="relative h-80 w-52">
            <svg viewBox="0 0 220 360" className="h-full w-full">
              <defs>
                <linearGradient id="skinTone" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#f8fbff" />
                  <stop offset="100%" stopColor="#dfe8f5" />
                </linearGradient>
                <linearGradient id="muscleShade" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0%" stopColor="#d4dfef" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#edf3fb" stopOpacity="0.25" />
                </linearGradient>
              </defs>
              <ellipse cx="110" cy="30" rx="26" ry="24" fill="url(#skinTone)" stroke="#c8d5e7" strokeWidth="2" />
              <path
                d="M110 62c24 0 43 10 53 31l14 36c3 8-2 15-10 15h-15v70c0 12 4 24 10 35l14 25c6 12 2 25-11 25h-12c-7 0-13-4-16-10l-14-34c-3-8-4-16-4-24v-7h-18v7c0 8-1 16-4 24l-14 34c-3 6-9 10-16 10H55c-13 0-17-13-11-25l14-25c6-11 10-23 10-35v-70H53c-8 0-13-7-10-15l14-36c10-21 29-31 53-31Z"
                fill="url(#skinTone)"
                stroke="#c4d0e2"
                strokeWidth="2"
              />
              <path d="M84 95c7-8 16-11 26-11s19 3 26 11" stroke="#bcc9dd" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M94 132c5 5 10 7 16 7s11-2 16-7" stroke="#b7c5d9" strokeWidth="3" strokeLinecap="round" />
              <path d="M96 156v62M124 156v62" stroke="#cad5e6" strokeWidth="2.5" strokeLinecap="round" />
              <path
                d="M83 210c9 8 18 12 27 12s18-4 27-12"
                fill="none"
                stroke="#b7c5d9"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <ellipse cx="110" cy="186" rx="23" ry="38" fill="url(#muscleShade)" />
              <path
                d="M47 139h18M155 139h18"
                stroke="#c4cfdf"
                strokeWidth="7"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute left-1/2 top-[56%] h-16 w-16 -translate-x-1/2 rounded-full bg-[#55d2b7]/40 blur-xl" />
            <div className="absolute left-1/2 top-[56%] h-10 w-10 -translate-x-1/2 rounded-full border border-[#2fb1a7] bg-[#c9f3ea] animate-[pulseGlow_2.8s_ease-in-out_infinite]" />
            <div className="absolute left-1/2 top-[69%] -translate-x-1/2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#2b7f74] shadow-sm">
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

