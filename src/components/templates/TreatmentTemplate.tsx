"use client";

import { ShieldCheck } from "lucide-react";
import RichSeoTemplate from "@/components/templates/RichSeoTemplate";
import type { SeoPageRecord } from "@/types/seoPage";

export default function TreatmentTemplate({ page }: { page: SeoPageRecord }) {
  return (
    <RichSeoTemplate
      page={page}
      theme={{
        accentFrom: "from-sky-500",
        accentTo: "to-blue-500",
        badge: "Treatment plan",
        cta: "Find relief",
        icon: ShieldCheck,
        label: "Treatment",
      }}
    />
  );
}
