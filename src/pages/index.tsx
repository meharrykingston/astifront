"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import styles from "./index.module.css";
import { HeroSection } from "@/components/home/HeroSection";
import { QuestionCard } from "@/components/home/QuestionCard";
import { TopNav } from "@/components/shared/TopNav";
import SeoHead from "@/components/seo/SeoHead";

export default function Home() {
  const [symptomInput, setSymptomInput] = useState("");
  const [activeSymptom, setActiveSymptom] = useState<string | null>(null);
  const [view, setView] = useState<"home" | "questions">("home");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [chatHistory, setChatHistory] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [currentQ, setCurrentQ] = useState<{ q: string; options: string[] }>({ q: "", options: [] });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const router = useRouter();

  const callDiagnoseAPI = async (history: any[]) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/diagnose`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatHistory: history }),
    });

    return response.json();
  };

  const startQuestions = async (symptomLabel?: string) => {
    const hasInput = symptomInput.trim().length > 0;
    const initialSymptom = symptomInput.trim() || symptomLabel || "Pain";

    if (symptomLabel) {
      setActiveSymptom(symptomLabel);
      if (!hasInput) {
        setSymptomInput(symptomLabel);
      }
    }

    const initialHistory = [{ role: "user" as const, content: initialSymptom }];
    setChatHistory(initialHistory);
    setQuestionIndex(0);
    setIsAnalyzing(true);

    try {
      const data = await callDiagnoseAPI(initialHistory);
      if (data?.status === "asking" && typeof data.question === "string" && Array.isArray(data.options)) {
        setCurrentQ({ q: data.question, options: data.options });
        setView("questions");
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleOption = async (option: string) => {
    const newHistory = [
      ...chatHistory,
      { role: "assistant" as const, content: currentQ.q },
      { role: "user" as const, content: option },
    ];

    setChatHistory(newHistory);
    setIsAnalyzing(true);

    try {
      const data = await callDiagnoseAPI(newHistory);

      if (data?.status === "asking" && typeof data.question === "string" && Array.isArray(data.options)) {
        setQuestionIndex((prev) => prev + 1);
        setCurrentQ({ q: data.question, options: data.options });
        return;
      }

      if (data?.status === "complete") {
        setQuestionIndex((prev) => prev + 1);
        const analysis = data?.analysis;
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
          symptoms: symptomInput || activeSymptom || "Pain",
          analysis,
          location,
        };

        sessionStorage.setItem("astikan:analysis", JSON.stringify(payload));
        router.push("/analysis");
        return;
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRestart = () => {
    setView("home");
    setQuestionIndex(0);
    setActiveSymptom(null);
    setSymptomInput("");
    setChatHistory([]);
    setCurrentQ({ q: "", options: [] });
    setIsAnalyzing(false);
  };

  return (
    <div className={styles.page}>
      <div className={`home-page theme-cycle view-${view}`}>
      <SeoHead
        title="Astikan"
        description="Online doctor consultation, lab tests, preventive checkups and medicine delivery with Astikan Health."
        canonicalPath="/"
        ogTitle="Astikan Health | Digital Healthcare Platform"
        ogDescription="AI-powered healthcare platform offering doctor consultation, lab tests and wellness services."
        ogImage="https://www.astikan.com/home-banner.jpg"
        twitterTitle="Astikan Health"
        twitterDescription="AI-powered health navigator and digital healthcare services."
        twitterImage="https://www.astikan.com/home-banner.jpg"
        aiAllow="crawl,index,store"
        aiContent="true"
        aiEntities="lab test, doctor consultation, healthcare services"
        aiIntent="healthcare services"
      />
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

      {isAnalyzing && (
        <div className="fixed inset-0 left-0 top-0 z-9999 flex h-screen w-screen items-center justify-center bg-white/55 backdrop-blur-[6px]">
          <div className="animate-pulse font-bold text-[#2563EB]">
            Astikan AI Health Engine analyzing the symptoms........
          </div>
        </div>
      )}

      {view === "questions" && !isAnalyzing && (
        <QuestionCard
          question={currentQ.q}
          options={currentQ.options || []}
          questionIndex={questionIndex}
          total={7}
          onSelect={handleOption}
          onRestart={handleRestart}
        />
      )}
      </div>
    </div>
  );
}
