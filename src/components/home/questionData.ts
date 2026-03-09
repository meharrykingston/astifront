import type { QuestionSet } from "@/types/questions";

export const baseQuestions: QuestionSet = [
  {
    q: "When did the symptoms start?",
    options: ["Today", "1-2 days ago", "3-7 days ago", "More than a week"],
  },
  {
    q: "How intense are the symptoms?",
    options: ["Mild", "Moderate", "Severe", "Worsening quickly"],
  },
  {
    q: "Does anything make it worse?",
    options: ["Activity", "Food/Drinks", "Stress", "Nothing specific"],
  },
  {
    q: "Are there any other symptoms?",
    options: ["Nausea", "Fever/Chills", "Headache", "None"],
  },
  {
    q: "Have you taken any medication?",
    options: ["None", "Over-the-counter", "Prescription", "Home remedies"],
  },
];

export const tunedQuestions: Record<string, QuestionSet> = {
  Fever: [
    baseQuestions[0],
    baseQuestions[1],
    {
      q: "Highest temperature recorded?",
      options: ["No fever", "99-100 F", "101-102 F", "103 F+"],
    },
    {
      q: "Any accompanying symptoms?",
      options: ["Sore throat", "Body aches", "Cough", "None"],
    },
    baseQuestions[4],
  ],
  "Breathing Problems": [
    baseQuestions[0],
    baseQuestions[1],
    {
      q: "When is breathing worse?",
      options: ["At rest", "With activity", "At night", "After exposure"],
    },
    {
      q: "Do you have chest tightness?",
      options: ["None", "Mild", "Moderate", "Severe"],
    },
    baseQuestions[4],
  ],
  "Stomach Issues": [
    baseQuestions[0],
    baseQuestions[1],
    {
      q: "Is it related to eating?",
      options: ["After meals", "Before meals", "No relation", "Not sure"],
    },
    {
      q: "Any digestive changes?",
      options: ["Nausea", "Bloating", "Diarrhea", "None"],
    },
    baseQuestions[4],
  ],
  "Skin Issues": [
    baseQuestions[0],
    baseQuestions[1],
    {
      q: "Where is it located?",
      options: ["Face", "Arms/Legs", "Torso", "All over"],
    },
    {
      q: "What does it look like?",
      options: ["Red rash", "Dry/Flaky", "Hives", "Blisters"],
    },
    baseQuestions[4],
  ],
  Fatigue: [
    baseQuestions[0],
    baseQuestions[1],
    {
      q: "How is your sleep lately?",
      options: ["Good", "Restless", "Insomnia", "Too much sleep"],
    },
    {
      q: "Any lifestyle changes?",
      options: ["Work stress", "Diet change", "Exercise change", "None"],
    },
    baseQuestions[4],
  ],
  "Mental Stress": [
    baseQuestions[0],
    baseQuestions[1],
    {
      q: "How often do you feel overwhelmed?",
      options: ["Rarely", "Sometimes", "Often", "Constantly"],
    },
    {
      q: "Any physical symptoms?",
      options: ["Headache", "Palpitations", "Sleep issues", "None"],
    },
    baseQuestions[4],
  ],
  Pain: [
    baseQuestions[0],
    baseQuestions[1],
    {
      q: "Where is the pain located?",
      options: ["Head", "Chest", "Abdomen", "Muscles/Joints"],
    },
    {
      q: "Pain type?",
      options: ["Sharp", "Dull", "Burning", "Throbbing"],
    },
    baseQuestions[4],
  ],
};
