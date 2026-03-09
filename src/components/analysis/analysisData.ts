import type { ConditionCard, DoctorCard, TestCard, TimelineStep, MedicineCard } from "@/types/analysis";

export const defaultProcessingSteps = [
  "Analyzing your symptoms…",
  "Comparing medical patterns…",
  "Checking possible causes…",
  "Finding nearby doctors…",
];

export const defaultConditions: ConditionCard[] = [
  {
    name: "Gastritis",
    summary: "Stomach lining inflammation often linked to irritation or infection.",
    recovery: "Typically improves in 7–10 days with treatment.",
  },
  {
    name: "Acid Reflux",
    summary: "Stomach acid flows upward, causing burning and discomfort.",
    recovery: "Relief often within 3–7 days with diet changes.",
  },
  {
    name: "Food Intolerance",
    summary: "A specific food may trigger irritation and bloating.",
    recovery: "Symptoms ease in 24–72 hours after avoiding triggers.",
  },
];

export const defaultDoctors: DoctorCard[] = [
  {
    name: "Dr. Sharma",
    specialty: "Gastroenterologist",
    rating: "4.7",
    distance: "1.2 km away",
    fee: "₹600 consultation",
  },
  {
    name: "Dr. Kapoor",
    specialty: "Internal Medicine",
    rating: "4.6",
    distance: "2.1 km away",
    fee: "₹500 consultation",
  },
  {
    name: "Dr. Mehta",
    specialty: "Gastroenterologist",
    rating: "4.8",
    distance: "3.4 km away",
    fee: "₹750 consultation",
  },
];

export const defaultTests: TestCard[] = [
  {
    name: "H. pylori test",
    purpose: "Checks for a bacterial cause of inflammation.",
    cost: "₹900–₹1,200",
  },
  {
    name: "Blood test",
    purpose: "Evaluates infection markers and general health.",
    cost: "₹600–₹900",
  },
  {
    name: "Abdominal ultrasound",
    purpose: "Rules out gallbladder or organ issues.",
    cost: "₹1,500–₹2,200",
  },
];

export const defaultMedicines: MedicineCard[] = [
  {
    name: "Omeprazole",
    purpose: "Reduces stomach acid and irritation.",
    precautions: "Avoid long-term use without medical advice.",
  },
  {
    name: "Antacids",
    purpose: "Quick relief for acidity and burning.",
    precautions: "Take at least 2 hours apart from other medicines.",
  },
  {
    name: "Probiotics",
    purpose: "Supports digestion and gut balance.",
    precautions: "Check for dairy sensitivity if applicable.",
  },
];

export const defaultTimeline: TimelineStep[] = [
  { range: "Day 1–3", text: "Irritation and sensitivity", intensity: "high" },
  { range: "Day 4–7", text: "Symptoms improve", intensity: "medium" },
  { range: "Day 8–10", text: "Recovery", intensity: "low" },
];

export const lottiePulse = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 90,
  w: 120,
  h: 120,
  nm: "Astikan Pulse",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Pulse",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [60, 60, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [0, 0, 100], e: [100, 100, 100] },
            { t: 45, s: [100, 100, 100], e: [0, 0, 100] },
            { t: 90, s: [0, 0, 100] },
          ],
        },
      },
      shapes: [
        { ty: "el", p: { a: 0, k: [0, 0] }, s: { a: 0, k: [64, 64] } },
        { ty: "fl", c: { a: 0, k: [0.24, 0.55, 0.93, 1] }, o: { a: 0, k: 80 } },
        {
          ty: "tr",
          p: { a: 0, k: [0, 0] },
          a: { a: 0, k: [0, 0] },
          s: { a: 0, k: [100, 100] },
          r: { a: 0, k: 0 },
          o: { a: 0, k: 100 },
          sk: { a: 0, k: 0 },
          sa: { a: 0, k: 0 },
        },
      ],
      ip: 0,
      op: 90,
      st: 0,
      bm: 0,
    },
  ],
};
