import { motion } from "framer-motion";
import type { MedicineCard } from "@/types/analysis";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" },
};

type Props = {
  medicines: MedicineCard[];
};

export function MedicineSuggestions({ medicines }: Props) {
  return (
    <motion.section {...fadeUp} className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm">
      <h3 className="text-xl font-semibold text-slate-900">Medicine suggestions</h3>
      <p className="mt-2 text-sm text-slate-600">
        Commonly prescribed options. Always confirm with a doctor.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {medicines.map((item) => (
          <div key={item.name} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <h4 className="text-sm font-semibold text-slate-900">{item.name}</h4>
            <p className="mt-2 text-xs text-slate-600">{item.purpose}</p>
            <p className="mt-3 text-xs font-semibold text-slate-500">{item.precautions}</p>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
