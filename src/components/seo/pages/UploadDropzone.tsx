"use client";

import axios from "axios";
import Papa from "papaparse";
import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  FileJson,
  FileSpreadsheet,
  FileText,
  Loader2,
  Sparkles,
  UploadCloud,
} from 'lucide-react';

interface UploadDropzoneProps {
  onBack: () => void;
}

type UploadStatus = "idle" | "uploading" | "success" | "error";
type CsvRow = Record<string, string>;
type RawRow = Record<string, unknown>;
type UploadSection = { heading: string; body: string };
type UploadRow = {
  pageKind: string;
  url: string;
  h1Heading: string;
  titleTag?: string;
  metaDescription?: string;
  overview?: string;
  quickAnswer?: string;
  metaTag?: string;
  status?: string;
  author?: string;
  targetKeyword?: string;
  sections?: UploadSection[];
};

export default function UploadDropzone({ onBack }: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const statusText = useMemo(() => {
    if (uploadStatus === "uploading") return `Uploading ${progress}%`;
    if (uploadStatus === "success") return "Upload complete";
    if (uploadStatus === "error") return "Upload failed";
    return "Drop files here or click to upload";
  }, [uploadStatus, progress]);

  // --- CSV Parsing Logic ---
  const parseCsv = (file: File): Promise<CsvRow[]> =>
    new Promise((resolve, reject) => {
      const rows: CsvRow[] = [];

      Papa.parse<CsvRow>(file, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim(),
        step: (result) => {
          rows.push(result.data || {});
          const cursor = typeof result.meta.cursor === "number" ? result.meta.cursor : 0;
          const parseProgress = Math.min(60, Math.round((cursor / Math.max(file.size, 1)) * 60));
          setProgress((prev) => (parseProgress > prev ? parseProgress : prev));
        },
        complete: () => resolve(rows),
        error: (parseError) => reject(parseError),
      });
    });

  const toText = (value: unknown): string => String(value ?? "").trim();
  const normalizePageKind = (value: unknown): string => {
    const normalized = toText(value).toLowerCase();
    return normalized === "condition" ? "cause" : normalized;
  };

  const pickField = (row: RawRow, keys: string[]): string => {
    for (const key of keys) {
      const value = toText(row[key]);
      if (value) return value;
    }
    return "";
  };

  const toSections = (row: RawRow): UploadSection[] => {
    const sections: UploadSection[] = [];
    for (let i = 1; i <= 10; i++) {
      const heading = pickField(row, [`section${i}_title`, `Section${i}_Title`, `section${i}Title`]);
      const body = pickField(row, [`section${i}_body`, `Section${i}_Body`, `section${i}Body`]);
      if (heading || body) {
        sections.push({ heading, body });
      }
    }
    return sections;
  };

  const isStructuredJsonRow = (row: RawRow): boolean => {
    const hasSections = Array.isArray(row.sections);
    const hasCoreFields = Boolean(toText(row.url) && toText(row.pageKind) && toText(row.h1Heading));
    return hasSections && hasCoreFields;
  };

  const normalizeStructuredRow = (row: RawRow): UploadRow => {
    const rawSections = Array.isArray(row.sections) ? row.sections : [];
    const sections = rawSections
      .map((item) => {
        const section = item as Record<string, unknown>;
        return {
          heading: toText(section.heading),
          body: toText(section.body),
        };
      })
      .filter((item) => item.heading || item.body);

    return {
      ...(row as UploadRow),
      pageKind: normalizePageKind(row.pageKind),
      url: toText(row.url),
      h1Heading: toText(row.h1Heading),
      titleTag: toText(row.titleTag || row.h1Heading),
      metaDescription: toText(row.metaDescription || row.overview),
      overview: toText(row.overview),
      quickAnswer: toText(row.quickAnswer),
      metaTag: toText(row.metaTag),
      status: toText(row.status || "draft").toLowerCase(),
      author: toText(row.author || "SEO Team"),
      targetKeyword: toText(row.targetKeyword || row.keyword || ""),
      sections: sections.length ? sections : undefined,
    };
  };

  const normalizeFlatRow = (row: RawRow): UploadRow => {
    const sections = toSections(row);

    return {
      pageKind: normalizePageKind(row.pageKind),
      url: toText(row.url),
      h1Heading: toText(row.h1Heading),
      titleTag: toText(row.titleTag || row.h1Heading),
      metaDescription: toText(row.metaDescription || row.overview),
      overview: toText(row.overview),
      quickAnswer: toText(row.quickAnswer),
      metaTag: toText(row.metaTag),
      status: toText(row.status || "draft").toLowerCase(),
      author: toText(row.author || "SEO Team"),
      targetKeyword: toText(row.targetKeyword || row.keyword || ""),
      sections: sections.length ? sections : undefined,
    };
  };

  const normalizeRows = (rows: RawRow[]): UploadRow[] =>
    rows.map((row) => (isStructuredJsonRow(row) ? normalizeStructuredRow(row) : normalizeFlatRow(row)));

  // --- Validation Logic ---
  const validateRows = (rows: UploadRow[]) => {
    const requiredFields = ["url", "pageKind", "h1Heading"] as const;

    const invalidRows = rows
      .map((row, index) => {
        const missing = requiredFields.filter((field) => !String(row[field] || "").trim());
        if (missing.length === 0) return null;
        return `Row ${index + 2}: missing ${missing.join(", ")}`;
      })
      .filter(Boolean) as string[];

    if (invalidRows.length > 0) {
      throw new Error(invalidRows.slice(0, 5).join(" | "));
    }
  };

  // --- The Core Upload & Transform Function ---
  const handleUpload = async (file: File) => {
    setError("");
    setUploadStatus("uploading");
    setProgress(0);

    try {
      const fileName = file.name.toLowerCase();
      let rawRows: RawRow[] = [];

      if (fileName.endsWith(".csv")) {
        rawRows = await parseCsv(file);
      } else if (fileName.endsWith(".json")) {
        const jsonText = await file.text();
        try {
          const parsed = JSON.parse(jsonText) as unknown;
          if (!Array.isArray(parsed)) {
            throw new Error("JSON file must contain an array of rows");
          }
          rawRows = parsed as RawRow[];
        } catch (jsonError) {
          if (jsonError instanceof SyntaxError) {
            throw new Error(`Invalid JSON syntax: ${jsonError.message}`);
          }
          throw jsonError;
        }
        setProgress(60);
      } else {
        throw new Error("Unsupported file type. Please upload a .csv or .json file.");
      }

      if (rawRows.length === 0) {
        throw new Error("File is empty");
      }

      const transformedData = normalizeRows(rawRows);
      validateRows(transformedData);
      setProgress(65);

      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiBaseUrl) throw new Error("NEXT_PUBLIC_API_URL is not configured");

      // Match Backend Route: /api/pages/bulk-upload
      await axios.post(`${apiBaseUrl}/api/pages/bulk-upload`, transformedData, {
        headers: { "Content-Type": "application/json" },
        onUploadProgress: (event) => {
          const total = event.total || file.size || 1;
          const uploadPercent = Math.round((event.loaded / total) * 35);
          setProgress((prev) => Math.max(prev, Math.min(99, 65 + uploadPercent)));
        },
      });

      setProgress(100);
      setUploadStatus("success");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed. Check format.";
      setError(message);
      setUploadStatus("error");
    }
  };

  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void handleUpload(file);
  };

  return (
    <section className="min-h-screen w-full overflow-x-hidden bg-slate-50 p-3 font-['Sora'] sm:p-5 lg:p-6">
      <div className="mx-auto w-full max-w-275 space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex h-8 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs sm:text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-100"
          >
            <ArrowLeft className="h-3.5! w-3.5!" />
            Back to pages
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-950 sm:text-xl">Bulk Page Upload</h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              Import pages from CSV. Column headers must match: url, pageKind, h1Heading, targetKeyword, section1_title, section1_body, etc.
            </p>
          </div>

          <label
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            className={`block cursor-pointer rounded-2xl border border-dashed p-6 text-center transition sm:p-10 ${
              isDragging ? 'border-blue-400 bg-blue-50' : 
              uploadStatus === 'success' ? 'border-emerald-300 bg-emerald-50' : 
              uploadStatus === "error" ? "border-red-300 bg-red-50" : 
              'border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100'
            }`}
          >
            <input
              type="file"
              accept=".csv,text/csv,.json,application/json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleUpload(file);
              }}
            />
            <div className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-xl bg-white text-slate-600 shadow-sm">
              {uploadStatus === 'uploading' ? <Loader2 className="h-4! w-4! animate-spin" /> : 
               uploadStatus === 'success' ? <CheckCircle2 className="h-4! w-4! text-emerald-600" /> : 
               uploadStatus === "error" ? <UploadCloud className="h-4! w-4! text-red-600" /> : 
               <UploadCloud className="h-4! w-4!" />}
            </div>

            <p className="text-sm lg:text-base font-semibold text-slate-900">{statusText}</p>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">Max file size: 50MB</p>

            {uploadStatus === 'uploading' && (
              <div className="mx-auto mt-4 h-2 w-full max-w-md overflow-hidden rounded-full bg-slate-200">
                <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${progress}%` }} />
              </div>
            )}
          </label>

          {error && (
            <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs sm:text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 p-3">
              <div className="mb-1 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <FileSpreadsheet className="h-3.5! w-3.5!" />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-900">CSV Template</p>
              <p className="mt-1 text-xs sm:text-sm text-slate-600">Standard for SEO team workflow</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-3 opacity-50 cursor-not-allowed">
              <div className="mb-1 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                <FileJson className="h-3.5! w-3.5!" />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-900">JSON</p>
              <p className="mt-1 text-xs sm:text-sm text-slate-600">Coming soon</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-3 opacity-50 cursor-not-allowed">
              <div className="mb-1 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <FileText className="h-3.5! w-3.5!" />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-900">HTML</p>
              <p className="mt-1 text-xs sm:text-sm text-slate-600">Coming soon</p>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-slate-900">
              <Sparkles className="h-3.5! w-3.5!" /> Tips for SEO Team
            </p>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Use headers: <b>url, pageKind, h1Heading, targetKeyword, overview, quickAnswer, section1_title, section1_body...</b><br/>
              Page status can be <i>draft</i> or <i>published</i>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
