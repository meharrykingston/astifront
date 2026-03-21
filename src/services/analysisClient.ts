import type { AnalysisMeta, AnalysisPayload, AnalysisResult } from "@/types/analysis";

const backendBase =
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  "http://localhost:4000";

export type StreamHandlers = {
  onMeta?: (meta: AnalysisMeta) => void;
  onDelta?: (text: string) => void;
  onData?: (data: AnalysisResult) => void;
  onError?: (message: string) => void;
};

export async function streamAnalysis(
  payload: AnalysisPayload,
  handlers: StreamHandlers,
  signal?: AbortSignal
) {
  const response = await fetch(`${backendBase}/api/analyze/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal,
  });

  if (!response.ok || !response.body) {
    handlers.onError?.("Analysis failed");
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const parts = buffer.split("\n\n");
    buffer = parts.pop() ?? "";

    for (const part of parts) {
      const lines = part.split("\n");
      const eventLine = lines.find((line) => line.startsWith("event:"));
      const dataLine = lines.find((line) => line.startsWith("data:"));
      const event = eventLine?.replace("event:", "").trim() ?? "message";
      const payloadText = dataLine?.replace("data:", "").trim();
      if (!payloadText) continue;

      const parsed = JSON.parse(payloadText);
      if (event === "meta") handlers.onMeta?.(parsed);
      if (event === "delta") handlers.onDelta?.(parsed.text ?? "");
      if (event === "data") handlers.onData?.(parsed);
      if (event === "error") handlers.onError?.(parsed.message ?? "Analysis failed");
    }
  }
}

export async function fetchFollowup(
  payload: AnalysisPayload,
  question: string
): Promise<{ response: string; extra?: AnalysisResult }> {
  const response = await fetch(`${backendBase}/api/followup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ payload, question }),
  });

  if (!response.ok) {
    throw new Error("Follow-up failed");
  }

  return response.json();
}
