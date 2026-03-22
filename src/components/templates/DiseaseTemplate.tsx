"use client";

import { Stethoscope } from "lucide-react";
import RichSeoTemplate from "@/components/templates/RichSeoTemplate";
import type { SeoPageRecord } from "@/types/seoPage";

export default function DiseaseTemplate({ page }: { page: SeoPageRecord }) {
  return (
    <RichSeoTemplate
      page={page}
      theme={{
        accentFrom: "from-rose-500",
        accentTo: "to-red-500",
        badge: "Disease overview",
        cta: "View guidance",
        icon: Stethoscope,
        label: "Disease",
      }}
    />
  );
}
