"use client";

import { ClipboardList } from "lucide-react";
import RichSeoTemplate from "@/components/templates/RichSeoTemplate";
import type { SeoPageRecord } from "@/types/seoPage";

export default function TestTemplate({ page }: { page: SeoPageRecord }) {
  return (
    <RichSeoTemplate
      page={page}
      theme={{
        accentFrom: "from-indigo-500",
        accentTo: "to-violet-500",
        badge: "Diagnostic tests",
        cta: "Review tests",
        icon: ClipboardList,
        label: "Test",
      }}
    />
  );
}
