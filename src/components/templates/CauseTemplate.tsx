"use client";

import { FileSearch } from "lucide-react";
import RichSeoTemplate from "@/components/templates/RichSeoTemplate";
import type { SeoPageRecord } from "@/types/seoPage";

export default function CauseTemplate({ page }: { page: SeoPageRecord }) {
  return (
    <RichSeoTemplate
      page={page}
      theme={{
        accentFrom: "from-amber-400",
        accentTo: "to-orange-500",
        badge: "Cause insights",
        cta: "Explore triggers",
        icon: FileSearch,
        label: "Cause",
      }}
    />
  );
}
