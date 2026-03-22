"use client";

import { Stethoscope } from "lucide-react";
import RichSeoTemplate from "@/components/templates/RichSeoTemplate";
import type { SeoPageRecord } from "@/types/seoPage";

export default function SpecialistTemplate({ page }: { page: SeoPageRecord }) {
  return (
    <RichSeoTemplate
      page={page}
      theme={{
        accentFrom: "from-fuchsia-500",
        accentTo: "to-pink-500",
        badge: "Specialist care",
        cta: "Find a doctor",
        icon: Stethoscope,
        label: "Specialist",
      }}
    />
  );
}
