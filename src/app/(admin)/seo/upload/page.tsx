"use client";
import React, { useState } from 'react';
import { 
  UploadCloud, FileText, CheckCircle2, 
  AlertCircle, ArrowRight, Database
} from 'lucide-react';

export default function BulkUploadPage() {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <div className="max-w-5xl mx-auto px-4">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Data Ingestion</h1>
        <p className="text-gray-500 mt-1 font-medium">Upload datasets to trigger programmatic page generation.</p>
      </div>

      {/* Stepper Logic  */}
      <div className="flex items-center justify-between mb-12 relative max-w-2xl mx-auto">
        <div className="absolute top-6 left-0 w-full h-0.5 bg-gray-100 -z-10"></div>
        {[
          { id: 1, label: 'Upload', icon: UploadCloud },
          { id: 2, label: 'Map', icon: Database },
          { id: 3, label: 'Ready', icon: CheckCircle2 },
        ].map((s) => (
          <div key={s.id} className="flex flex-col items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all border-2 ${
              step >= s.id ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-white border-gray-200 text-gray-400'
            }`}>
              <div className="w-5 h-5 flex items-center justify-center shrink-0">
                <s.icon size={20} strokeWidth={2.5} />
              </div>
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest ${step >= s.id ? 'text-blue-600' : 'text-gray-400'}`}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Step 1: Dropzone */}
      {step === 1 && (
        <div 
          onClick={() => setStep(2)}
          className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-16 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer group shadow-sm"
        >
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
            <UploadCloud size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Select Source File</h3>
          <p className="text-sm text-gray-400 mt-2 max-w-xs mx-auto font-medium">Supported formats: .CSV, .XLSX (UTF-8 Encoded)</p>
        </div>
      )}

      {/* Step 2: Mapping Grid */}
      {step === 2 && (
        <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2">
          <div className="p-6 border-b border-gray-100 bg-gray-50/30 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 flex items-center gap-2 text-sm">
              <div className="w-5 h-5 text-blue-600 flex items-center justify-center"><Database size={16} /></div>
              Column Mapping
            </h3>
            <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">DETECTED: 1,000,000 ROWS</span>
          </div>
          
          <div className="p-8 space-y-4">
            {['symptom_name', 'target_city', 'severity_level'].map((field) => (
              <div key={field} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <span className="text-xs font-bold text-gray-600 font-mono italic">{field}</span>
                <div className="flex items-center gap-4">
                  <ArrowRight size={14} className="text-gray-300" />
                  <select className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm min-w-40">
                    <option>Select CSV Column...</option>
                    <option selected>Column_{field}</option>
                  </select>
                </div>
              </div>
            ))}

            <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-tight">
                <AlertCircle size={14} /> 12 invalid rows will be ignored
              </div>
              <button 
                onClick={() => setStep(3)}
                className="px-8 py-3 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
              >
                Execute Generation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Deployment State */}
      {step === 3 && (
        <div className="bg-white border border-gray-200 rounded-3xl p-16 text-center shadow-sm max-w-xl mx-auto animate-in zoom-in-95">
          <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={40} strokeWidth={3} />
          </div>
          <h2 className="text-2xl font-black text-gray-900">Process Initiated</h2>
          <p className="text-gray-500 mt-3 font-medium text-sm leading-relaxed">
            The data pipeline is now active. Pages are being queued for Incremental Static Regeneration.
          </p>
          <div className="mt-10 flex gap-3 justify-center">
            <button className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-200 transition-all">View Log</button>
            <button className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-50">Dashboard</button>
          </div>
        </div>
      )}
    </div>
  );
}