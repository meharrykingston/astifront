"use client";

import React, { useState } from 'react';
import { UploadCloud, X, FileText, CheckCircle2, Loader2 } from 'lucide-react';

interface UploadDropzoneProps {
  onBack: () => void;
}

const UploadDropzone: React.FC<UploadDropzoneProps> = ({ onBack }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success'>('idle');

  // Logic to handle drag states
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Future: Logic to parse files goes here
    simulateUpload();
  };

  const simulateUpload = () => {
    setUploadStatus('uploading');
    setTimeout(() => setUploadStatus('success'), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm w-full flex-1 flex flex-col p-4 sm:p-8 relative min-h-100">
      {/* Close Button */}
      <button 
        onClick={onBack}
        className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-100 rounded-md transition-colors z-10"
      >
        <X className="w-5! h-5! shrink-0" />
      </button>

      <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto w-full">
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-slate-900">Bulk Page Upload</h2>
          <p className="text-sm text-slate-500 mt-1">Upload CSV, HTML, or JSON schemas to generate pages in bulk.</p>
        </div>

        {/* --- DYNAMIC UPLOAD AREA --- */}
        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            w-full aspect-video sm:aspect-21/9 rounded-2xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center p-6 text-center cursor-pointer
            ${isDragging ? 'border-blue-500 bg-blue-50 scale-[1.01]' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'}
            ${uploadStatus === 'success' ? 'border-green-500 bg-green-50' : ''}
          `}
        >
          {uploadStatus === 'idle' && (
            <>
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <UploadCloud className="w-6! h-6! sm:w-8! sm:h-8! shrink-0" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">
                Drag & drop files here
              </h3>
              <p className="text-xs text-slate-500 mt-1 mb-4 px-4">
                Or click to browse from your computer (Max 50MB per file)
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <span className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-medium text-slate-600 uppercase tracking-wider">CSV</span>
                <span className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-medium text-slate-600 uppercase tracking-wider">JSON</span>
                <span className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-medium text-slate-600 uppercase tracking-wider">HTML</span>
              </div>
            </>
          )}

          {uploadStatus === 'uploading' && (
            <div className="flex flex-col items-center animate-pulse">
              <Loader2 className="w-10! h-10! text-blue-600 animate-spin mb-4 shrink-0" />
              <p className="text-sm font-medium text-slate-700">Processing bulk data...</p>
            </div>
          )}

          {uploadStatus === 'success' && (
            <div className="flex flex-col items-center text-green-600">
              <CheckCircle2 className="w-12! h-12! mb-4 shrink-0" />
              <h3 className="text-base font-bold">Upload Complete!</h3>
              <p className="text-sm opacity-80 mb-6 text-center">Your pages are being processed and will appear in the list soon.</p>
              <button 
                onClick={() => setUploadStatus('idle')}
                className="text-xs font-semibold underline underline-offset-4"
              >
                Upload more files
              </button>
            </div>
          )}
        </div>

        {/* Bulk Guidelines */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          <div className="flex items-start gap-3 p-3 bg-slate-100/50 rounded-lg border border-slate-100">
            <FileText className="w-4! h-4! text-slate-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-[11px] font-bold text-slate-700 uppercase">Schema Format</p>
              <p className="text-[11px] text-slate-500 leading-relaxed">Ensure your JSON follows our medical data schema structure.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-slate-100/50 rounded-lg border border-slate-100">
            <UploadCloud className="w-4! h-4! text-slate-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-[11px] font-bold text-slate-700 uppercase">Rate Limits</p>
              <p className="text-[11px] text-slate-500 leading-relaxed">Bulk uploads are limited to 10,000 entries per batch.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadDropzone;