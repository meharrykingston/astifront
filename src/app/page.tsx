"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { HeroSection } from "@/components/home/HeroSection";
import { QuestionCard } from "@/components/home/QuestionCard";
import { baseQuestions, tunedQuestions } from "@/components/home/questionData";
import { TopNav } from "@/components/shared/TopNav";

export default function Home() {
  const [symptomInput, setSymptomInput] = useState("");
  const [activeSymptom, setActiveSymptom] = useState<string | null>(null);
  const [view, setView] = useState<"home" | "questions">("home");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const router = useRouter();

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
    return tunedQuestions[selectedKey] ?? baseQuestions;
  }, [selectedKey]);

  const startQuestions = (symptomLabel?: string) => {
    const hasInput = symptomInput.trim().length > 0;
    const fallbackLabel = symptomLabel ?? (hasInput ? undefined : "Pain");
    if (fallbackLabel) {
      setActiveSymptom(fallbackLabel);
      if (!hasInput) {
        setSymptomInput(fallbackLabel);
      }
    }
    setAnswers([]);
    setQuestionIndex(0);
    setView("questions");
  };

  const handleOption = (option: string) => {
    const next = [...answers, option];
    setAnswers(next);
    if (questionIndex >= 4) {
      const finalize = async () => {
        let location: { lat: number; lng: number } | null = null;
        if (navigator.geolocation) {
          try {
            location = await new Promise((resolve) => {
              const timeout = window.setTimeout(() => resolve(null), 1500);
              navigator.geolocation.getCurrentPosition(
                (pos) => {
                  window.clearTimeout(timeout);
                  resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                },
                () => resolve(null),
                { maximumAge: 60000, timeout: 1200 }
              );
            });
          } catch {
            location = null;
          }
        }
        const payload = {
          symptoms: symptomInput || selectedKey,
          answers: next,
          location,
        };
        sessionStorage.setItem("astikan:analysis", JSON.stringify(payload));
        router.push("/analysis");
      };
      finalize();
      return;
    }
    setQuestionIndex((prev) => prev + 1);
  };

  const handleRestart = () => {
    setView("home");
    setAnswers([]);
    setQuestionIndex(0);
    setActiveSymptom(null);
    setSymptomInput("");
  };

  return (
    <div className={`home-page theme-cycle view-${view}`}>
      <TopNav />

      <HeroSection
        symptomInput={symptomInput}
        activeSymptom={activeSymptom}
        onInputChange={(value) => {
          setSymptomInput(value);
          setActiveSymptom(null);
        }}
        onStart={startQuestions}
      />

      {view === "questions" && (
        <QuestionCard
          question={questions[questionIndex].q}
          options={questions[questionIndex].options}
          questionIndex={questionIndex}
          total={questions.length}
          onSelect={handleOption}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
