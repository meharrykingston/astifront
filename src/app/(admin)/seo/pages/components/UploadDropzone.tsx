"use client";

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

export default function UploadDropzone({ onBack }: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success'>('idle');
  const [progress, setProgress] = useState(0);

  const statusText = useMemo(() => {
    if (uploadStatus === 'uploading') return `Uploading ${progress}%`;
    if (uploadStatus === 'success') return 'Upload complete';
    return 'Drop files here or click to upload';
  }, [uploadStatus, progress]);

  const simulateUpload = () => {
    setUploadStatus('uploading');
    setProgress(0);
    let p = 0;
    const timer = setInterval(() => {
      p += 10;
      setProgress(p);
      if (p >= 100) {
        clearInterval(timer);
        setUploadStatus('success');
      }
    }, 120);
  };

  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    simulateUpload();
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
              Import pages from CSV, JSON, or HTML. We auto-validate fields before publishing.
            </p>
          </div>

          <label
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            className={`block cursor-pointer rounded-2xl border border-dashed p-6 text-center transition sm:p-10 ${
              isDragging
                ? 'border-blue-400 bg-blue-50'
                : uploadStatus === 'success'
                  ? 'border-emerald-300 bg-emerald-50'
                  : 'border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100'
            }`}
          >
            <input type="file" multiple className="hidden" onChange={simulateUpload} />
            <div className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-xl bg-white text-slate-600 shadow-sm">
              {uploadStatus === 'uploading' ? (
                <Loader2 className="h-4! w-4! animate-spin" />
              ) : uploadStatus === 'success' ? (
                <CheckCircle2 className="h-4! w-4! text-emerald-600" />
              ) : (
                <UploadCloud className="h-4! w-4!" />
              )}
            </div>

            <p className="text-sm lg:text-base font-semibold text-slate-900">{statusText}</p>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">Max file size: 50MB each</p>

            {uploadStatus === 'uploading' && (
              <div className="mx-auto mt-4 h-2 w-full max-w-md overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </label>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 p-3">
              <div className="mb-1 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <FileSpreadsheet className="h-3.5! w-3.5!" />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-900">CSV</p>
              <p className="mt-1 text-xs sm:text-sm text-slate-600">Best for bulk SEO metadata upload</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-3">
              <div className="mb-1 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                <FileJson className="h-3.5! w-3.5!" />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-900">JSON</p>
              <p className="mt-1 text-xs sm:text-sm text-slate-600">Structured content import format</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-3">
              <div className="mb-1 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <FileText className="h-3.5! w-3.5!" />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-900">HTML</p>
              <p className="mt-1 text-xs sm:text-sm text-slate-600">Import static pages with parsing</p>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-slate-900">
              <Sparkles className="h-3.5! w-3.5!" />
              Tips before upload
            </p>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              Include fields: title, slug, meta_title, meta_description, canonical_url, publish_status.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}


