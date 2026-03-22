"use client";

import { Pill } from "lucide-react";
import RichSeoTemplate from "@/components/templates/RichSeoTemplate";
import type { SeoPageRecord } from "@/types/seoPage";

export default function MedicineTemplate({ page }: { page: SeoPageRecord }) {
  return (
    <RichSeoTemplate
      page={page}
      theme={{
        accentFrom: "from-emerald-500",
        accentTo: "to-teal-500",
        badge: "Medication guide",
        cta: "See usage",
        icon: Pill,
        label: "Medicine",
      }}
    />
  );
}
