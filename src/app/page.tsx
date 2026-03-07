"use client";

import { useMemo, useState } from "react";

const symptomChips = [
  { label: "Pain", icon: "pulse" },
  { label: "Fever", icon: "thermo" },
  { label: "Stomach Issues", icon: "pulse" },
  { label: "Breathing Problems", icon: "wind" },
  { label: "Skin Issues", icon: "shield" },
  { label: "Fatigue", icon: "battery" },
  { label: "Mental Stress", icon: "brain" },
];

function Icon({ kind }: { kind: string }) {
  switch (kind) {
    case "heart":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 21s-6.7-4.4-9.2-8C.7 10.3 1.4 6.6 4.4 5a5.4 5.4 0 0 1 5.9.7L12 7.1l1.7-1.4A5.4 5.4 0 0 1 19.6 5c3 1.6 3.7 5.3 1.6 8-2.5 3.6-9.2 8-9.2 8Z" />
        </svg>
      );
    case "search":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4.5 4.5" />
        </svg>
      );
    case "stethoscope":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 3v5a4 4 0 0 0 8 0V3" />
          <path d="M6 3v5a6 6 0 0 0 12 0V3" />
          <path d="M14 14a4 4 0 1 0 8 0 3 3 0 1 0-6 0v2a4 4 0 0 1-8 0v-2" />
        </svg>
      );
    case "arrow":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 12h14" />
          <path d="m13 5 7 7-7 7" />
        </svg>
      );
    case "pulse":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 12h4l2.2-5 3.6 10 2.2-5H21" />
        </svg>
      );
    case "thermo":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M10 14.5V6a2 2 0 1 1 4 0v8.5a4 4 0 1 1-4 0Z" />
        </svg>
      );
    case "wind":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 9h10a2.5 2.5 0 1 0-2.5-2.5" />
          <path d="M3 15h14a2.5 2.5 0 1 1-2.5 2.5" />
          <path d="M3 12h18" />
        </svg>
      );
    case "shield":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Z" />
        </svg>
      );
    case "battery":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="7" width="16" height="10" rx="2" />
          <path d="M21 10v4" />
          <path d="M7 10v4" />
        </svg>
      );
    case "brain":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 4a3 3 0 0 0-3 3v1a2.5 2.5 0 0 0-2 2.5A2.5 2.5 0 0 0 6 13v1a3 3 0 0 0 3 3" />
          <path d="M15 4a3 3 0 0 1 3 3v1a2.5 2.5 0 0 1 2 2.5A2.5 2.5 0 0 1 18 13v1a3 3 0 0 1-3 3" />
          <path d="M9 4a3 3 0 0 1 6 0v13a3 3 0 0 1-6 0Z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Home() {
  const [symptomInput, setSymptomInput] = useState("");
  const [activeSymptom, setActiveSymptom] = useState<string | null>(null);
  const [view, setView] = useState<"home" | "questions" | "done">("home");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const selectedKey = useMemo(() => {
    if (activeSymptom) return activeSymptom;
    const value = symptomInput.toLowerCase();
    if (/(fever|temperature|chills)/i.test(value)) return "Fever";
    if (/(breath|asthma|cough|chest)/i.test(value)) return "Breathing Problems";
    if (/(skin|rash|itch|hives)/i.test(value)) return "Skin Issues";
    if (/(fatigue|tired|exhaust)/i.test(value)) return "Fatigue";
    if (/(stress|anxiety|panic|mood)/i.test(value)) return "Mental Stress";
    if (/(stomach|abdomen|nausea|acid|bloat)/i.test(value)) return "Stomach Issues";
    return "Pain";
  }, [activeSymptom, symptomInput]);

  const questions = useMemo(() => {
    const base = [
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

    const tuned: Record<string, typeof base> = {
      Fever: [
        base[0],
        base[1],
        {
          q: "Highest temperature recorded?",
          options: ["No fever", "99-100 F", "101-102 F", "103 F+"],
        },
        {
          q: "Any accompanying symptoms?",
          options: ["Sore throat", "Body aches", "Cough", "None"],
        },
        base[4],
      ],
      "Breathing Problems": [
        base[0],
        base[1],
        {
          q: "When is breathing worse?",
          options: ["At rest", "With activity", "At night", "After exposure"],
        },
        {
          q: "Do you have chest tightness?",
          options: ["None", "Mild", "Moderate", "Severe"],
        },
        base[4],
      ],
      "Stomach Issues": [
        base[0],
        base[1],
        {
          q: "Is it related to eating?",
          options: ["After meals", "Before meals", "No relation", "Not sure"],
        },
        {
          q: "Any digestive changes?",
          options: ["Nausea", "Bloating", "Diarrhea", "None"],
        },
        base[4],
      ],
      "Skin Issues": [
        base[0],
        base[1],
        {
          q: "Where is it located?",
          options: ["Face", "Arms/Legs", "Torso", "All over"],
        },
        {
          q: "What does it look like?",
          options: ["Red rash", "Dry/Flaky", "Hives", "Blisters"],
        },
        base[4],
      ],
      Fatigue: [
        base[0],
        base[1],
        {
          q: "How is your sleep lately?",
          options: ["Good", "Restless", "Insomnia", "Too much sleep"],
        },
        {
          q: "Any lifestyle changes?",
          options: ["Work stress", "Diet change", "Exercise change", "None"],
        },
        base[4],
      ],
      "Mental Stress": [
        base[0],
        base[1],
        {
          q: "How often do you feel overwhelmed?",
          options: ["Rarely", "Sometimes", "Often", "Constantly"],
        },
        {
          q: "Any physical symptoms?",
          options: ["Headache", "Palpitations", "Sleep issues", "None"],
        },
        base[4],
      ],
      Pain: [
        base[0],
        base[1],
        {
          q: "Where is the pain located?",
          options: ["Head", "Chest", "Abdomen", "Muscles/Joints"],
        },
        {
          q: "Pain type?",
          options: ["Sharp", "Dull", "Burning", "Throbbing"],
        },
        base[4],
      ],
    };

    return tuned[selectedKey] ?? base;
  }, [selectedKey]);

  const startQuestions = (symptomLabel?: string) => {
    const hasInput = symptomInput.trim().length > 0;
    const hasSelection = Boolean(activeSymptom || symptomLabel);
    if (!hasInput && !hasSelection) return;
    if (symptomLabel) {
      setActiveSymptom(symptomLabel);
      setSymptomInput(symptomLabel);
    }
    setAnswers([]);
    setQuestionIndex(0);
    setView("questions");
  };

  const handleOption = (option: string) => {
    const next = [...answers, option];
    setAnswers(next);
    if (questionIndex >= 4) {
      setView("done");
      return;
    }
    setQuestionIndex((prev) => prev + 1);
  };

  const handleRestart = () => {
    setView("home");
    setAnswers([]);
    setQuestionIndex(0);
  };

  return (
    <div className={`home-page view-${view}`}>
      <header className="top-nav">
        <div className="top-nav__inner">
          <div className="brand">
            <div className="brand-icon" aria-hidden="true">
              <Icon kind="heart" />
            </div>
            <div className="brand-copy">
              <h1>Astikan</h1>
            </div>
          </div>

          <button className="emergency-btn" type="button">
            Emergency
          </button>
        </div>
      </header>

      <main className="hero-section">
        <div className="hero-content">
          <h2 className="hero-title">
            <span className="title-line">What are you feeling</span>
            <span className="title-line title-accent">today?</span>
          </h2>

          <p className="hero-subtitle">
            Describe your symptoms and let our AI help you understand what might
            be going on.
          </p>

          <div className="search-container">
            <div className="search-glow" aria-hidden="true" />
            <div className="search-box">
              <div className="search-inner">
                <div className="search-input-wrap">
                  <span className="search-icon" aria-hidden="true">
                    <Icon kind="search" />
                  </span>
                  <input
                    className="search-input"
                    type="text"
                    placeholder="Describe your symptoms..."
                    aria-label="Describe your symptoms"
                    value={symptomInput}
                    onChange={(event) => {
                      setSymptomInput(event.target.value);
                      setActiveSymptom(null);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        startQuestions();
                      }
                    }}
                  />
                </div>

                <button
                  className="search-btn"
                  type="button"
                  onClick={() => startQuestions()}
                >
                  <span className="button-icon" aria-hidden="true">
                    <Icon kind="stethoscope" />
                  </span>
                  Analyze
                </button>
              </div>
            </div>
          </div>

          <p className="example-text">
            Example: <span>"I have stomach pain after eating"</span>
          </p>

          <div className="symptom-section">
            <p className="symptom-heading">Or select a common symptom:</p>
            <div className="symptom-buttons">
              {symptomChips.map((chip) => (
                <button
                  key={chip.label}
                  className={`symptom-btn${
                    activeSymptom === chip.label ? " active" : ""
                  }`}
                  type="button"
                  onClick={() => startQuestions(chip.label)}
                >
                  <span className="chip-icon" aria-hidden="true">
                    <Icon kind={chip.icon} />
                  </span>
                  <span>{chip.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="cta-section">
            <button className="cta-btn" type="button" onClick={() => startQuestions()}>
              Start Symptom Analysis
              <span className="button-icon" aria-hidden="true">
                <Icon kind="arrow" />
              </span>
            </button>
          </div>
        </div>
      </main>

      <section className="question-screen" aria-live="polite">
        <div className="question-card">
          <div className="question-badge">Question {questionIndex + 1} of 5</div>
          <h3 className="question-title">{questions[questionIndex].q}</h3>
          <div className="question-options">
            {questions[questionIndex].options.map((option) => (
              <button
                key={option}
                className="option-btn"
                type="button"
                onClick={() => handleOption(option)}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="question-progress">
            {[0, 1, 2, 3, 4].map((index) => (
              <span
                key={index}
                className={`progress-dot${
                  index <= questionIndex ? " active" : ""
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="question-screen done-screen" aria-live="polite">
        <div className="question-card">
          <div className="question-badge">Assessment Ready</div>
          <h3 className="question-title">Thanks. We have enough to begin.</h3>
          <p className="question-subtitle">
            Your responses were captured and we can now prepare insights tailored to
            your symptoms.
          </p>
          <div className="question-options">
            <button className="option-btn primary" type="button" onClick={handleRestart}>
              Start Over
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
