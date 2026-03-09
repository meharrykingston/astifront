"use client";

import { useState } from "react";
import type { SymptomChip } from "@/types/home";

const symptomChips: SymptomChip[] = [
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

type Props = {
  symptomInput: string;
  activeSymptom: string | null;
  onInputChange: (value: string) => void;
  onStart: (label?: string) => void;
};

export function HeroSection({ symptomInput, activeSymptom, onInputChange, onStart }: Props) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <main className="hero-section">
      <div className="hero-content">
        <h2 className={`hero-title${isFocused ? " hero-title--focus" : ""}`}>
          {isFocused ? (
            <>
              <span className="title-line">Hey! Don't worry,</span>
              <span className="title-line title-accent">I'm with you.</span>
            </>
          ) : (
            <>
              <span className="title-line">What are you feeling</span>
              <span className="title-line title-accent">today?</span>
            </>
          )}
        </h2>

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
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onChange={(event) => onInputChange(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      onStart();
                    }
                  }}
                />
              </div>

              <button className="search-btn" type="button" onClick={() => onStart()}>
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
                className={`symptom-btn${activeSymptom === chip.label ? " active" : ""}`}
                type="button"
                onClick={() => onStart(chip.label)}
              >
                <span className="chip-icon" aria-hidden="true">
                  <Icon kind={chip.icon} />
                </span>
                <span>{chip.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

