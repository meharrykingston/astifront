import { useEffect, useRef, useState } from "react";
import type { AnalysisMeta, AnalysisPayload, AnalysisResult } from "@/types/analysis";
import { streamAnalysis } from "@/services/analysisClient";

export function useSymptomAnalysis(payload: AnalysisPayload | null) {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [summaryStream, setSummaryStream] = useState("");
  const [meta, setMeta] = useState<AnalysisMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!payload) return;
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);
    setError(null);
    setSummaryStream("");
    setAnalysis(null);

    streamAnalysis(
      payload,
      {
        onMeta: (value) => setMeta(value),
        onDelta: (text) => setSummaryStream(text),
        onData: (data) => setAnalysis(data),
        onError: (message) => setError(message),
      },
      controller.signal
    ).finally(() => {
      setLoading(false);
    });

    return () => controller.abort();
  }, [payload?.symptoms, payload?.answers?.join("|")]);

  return {
    analysis,
    summaryStream,
    meta,
    loading,
    error,
  };
}
