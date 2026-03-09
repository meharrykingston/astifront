export type ConditionCard = {
  name: string;
  summary: string;
  recovery: string;
};

export type DoctorCard = {
  name: string;
  specialty: string;
  rating: string;
  distance: string;
  fee: string;
};

export type TestCard = {
  name: string;
  purpose: string;
  cost: string;
};

export type MedicineCard = {
  name: string;
  purpose: string;
  precautions: string;
};

export type TimelineStep = {
  range: string;
  text: string;
  intensity: "high" | "medium" | "low";
};

export type Severity = {
  level: string;
  description: string;
  score: number;
};

export type AnalysisResult = {
  summary?: string;
  bodyNote?: string;
  highlightLabel?: string;
  highlightRegion?: string;
  conditions?: ConditionCard[];
  severity?: Severity;
  specialist?: string;
  doctors?: DoctorCard[];
  tests?: TestCard[];
  medicines?: MedicineCard[];
  timeline?: TimelineStep[];
  followups?: string[];
};

export type AnalysisMeta = {
  usedFallback?: boolean;
  model?: string;
  reason?: string | null;
};

export type AnalysisPayload = {
  symptoms: string;
  answers: string[];
  location?: {
    lat: number;
    lng: number;
  } | null;
};
