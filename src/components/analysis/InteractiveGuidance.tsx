import { motion } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
};

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
};

export function InteractiveGuidance({ value, onChange, onSend, disabled }: Props) {
  return (
    <motion.section {...fadeUp} className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm">
      <h3 className="text-xl font-semibold text-slate-900">Ask Astikan AI</h3>
      <p className="mt-2 text-sm text-slate-600">
        Continue the conversation and refine your symptoms.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none"
          placeholder="Ask a follow-up question..."
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <button
          className="btn-primary rounded-full px-5 py-3 text-sm font-semibold text-white"
          type="button"
          onClick={onSend}
          disabled={disabled}
        >
          Ask AI
        </button>
      </div>
    </motion.section>
  );
}
