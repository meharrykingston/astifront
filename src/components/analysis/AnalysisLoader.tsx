import { motion } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
};

type Props = {
  messages: string[];
  activeIndex: number;
};

export function AnalysisLoader({ messages, activeIndex }: Props) {
  return (
    <motion.section
      {...fadeUp}
      className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm"
    >
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)]" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            AI Analysis Loader
          </p>
          <p className="text-sm font-semibold text-slate-700">{messages[activeIndex]}</p>
        </div>
      </div>
      <div className="mt-4 h-2 w-full rounded-full bg-slate-100">
        <div className="h-full w-[72%] animate-[progressGlow_4s_linear_infinite] rounded-full bg-gradient-to-r from-[var(--accent)] via-[var(--accent-2)] to-[#6be0cc]" />
      </div>
    </motion.section>
  );
}
