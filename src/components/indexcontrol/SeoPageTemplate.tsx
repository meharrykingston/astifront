"use client";

import type { ComponentType } from "react";
import type { SeoPageRecord } from "@/types/seoPage";
import SymptomTemplate from "@/components/templates/SymptomTemplate";
import TreatmentTemplate from "@/components/templates/TreatmentTemplate";
import DiseaseTemplate from "@/components/templates/DiseaseTemplate";
import TestTemplate from "@/components/templates/TestTemplate";
import MedicineTemplate from "@/components/templates/MedicineTemplate";
import CauseTemplate from "@/components/templates/CauseTemplate";
import SpecialistTemplate from "@/components/templates/SpecialistTemplate";

type SeoPageTemplateProps = {
  page: SeoPageRecord;
};

const TEMPLATE_MAP: Record<string, ComponentType<SeoPageTemplateProps>> = {
  symptom: SymptomTemplate,
  medicine: MedicineTemplate,
  disease: DiseaseTemplate,
  treatment: TreatmentTemplate,
  test: TestTemplate,
  cause: CauseTemplate,
  specialist: SpecialistTemplate,
};

export default function SeoPageTemplate({ page }: SeoPageTemplateProps) {
  const SelectedTemplate = TEMPLATE_MAP[page.pageKind] || SymptomTemplate;
  return <SelectedTemplate page={page} />;
}
