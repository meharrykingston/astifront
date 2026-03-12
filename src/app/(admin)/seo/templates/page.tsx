"use client";
import React, { useState } from 'react';
import { 
  Settings2, Eye, Code2, Save, Info, Type, Layout
} from 'lucide-react';

export default function TemplateManager() {
  const [activeTab, setActiveTab] = useState('meta');
  const [template, setTemplate] = useState({
    title: "How to treat {{symptom}} at home | Astikan",
    description: "Learn about the causes, severity, and home remedies for {{symptom}}. Expert medical insights from Astikan Healthcare.",
    h1: "Understanding {{symptom}}",
  });

  const previewData = (text: string) => text.replace(/{{symptom}}/g, 'Acute Migraine');

  return (
    <div className="max-w-7xl mx-auto pb-12 px-4 sm:px-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">pSEO Template Manager</h1>
          <p className="text-gray-500 mt-1 font-medium">Define the dynamic blueprint for your symptom pages.</p>
        </div>
        
        
        <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 shrink-0 h-fit">
          <div className="w-5 h-5 flex items-center justify-center shrink-0">
            <Save size={18} strokeWidth={2.5} />
          </div>
          <span>Save Template</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="flex border-b border-gray-100 bg-gray-50/50">
              {['meta', 'content'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                    activeTab === tab 
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-white' 
                    : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {tab === 'meta' ? 'SEO Metadata' : 'Page Structure'}
                </button>
              ))}
            </div>

            <div className="p-6 space-y-6">
              {activeTab === 'meta' ? (
                <>
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-700 flex items-center gap-2 uppercase tracking-widest">
                     
                      <div className="w-5 h-5 text-blue-500 flex items-center justify-center shrink-0">
                        <Type size={16} />
                      </div>
                      Meta Title Template
                    </label>
                    <input 
                      type="text" 
                      value={template.title}
                      onChange={(e) => setTemplate({...template, title: e.target.value})}
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-700 flex items-center gap-2 uppercase tracking-widest">
                     
                      <div className="w-5 h-5 text-blue-500 flex items-center justify-center shrink-0">
                        <Settings2 size={16} />
                      </div>
                      Meta Description
                    </label>
                    <textarea 
                      rows={4}
                      value={template.description}
                      onChange={(e) => setTemplate({...template, description: e.target.value})}
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all"
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                  <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-3">
                    <div className="w-5 h-5 text-blue-600 shrink-0 mt-0.5 flex items-center justify-center">
                       <Info size={18} />
                    </div>
                    <p className="text-[11px] text-blue-700 font-bold leading-relaxed">
                      Inject data using double curly braces. <br/>
                      Example: <code className="bg-blue-100 px-1 rounded">{"{{symptom}}"}</code>
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-widest">Main Heading (H1)</label>
                    <input 
                      type="text" 
                      value={template.h1}
                      onChange={(e) => setTemplate({...template, h1: e.target.value})}
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          
        
          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
              <div className="w-4 h-4 shrink-0 flex items-center justify-center text-blue-400">
                 <Code2 size={14} />
              </div>
              Available Tokens
            </h4>
            <div className="flex flex-wrap gap-2">
              {['symptom', 'location', 'severity'].map(token => (
                <span key={token} className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-[10px] font-mono font-bold text-blue-400 uppercase tracking-tighter">
                  {`{{${token}}}`}
                </span>
              ))}
            </div>
          </div>
        </div>

       
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center gap-2 text-gray-400 px-2">
            <div className="w-5 h-5 flex items-center justify-center shrink-0">
               <Eye size={14} strokeWidth={3} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">SERP Preview</span>
          </div>
          
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
            <div className="text-[#1a0dab] text-xl font-medium hover:underline cursor-pointer truncate mb-1">
              {previewData(template.title)}
            </div>
            <div className="text-[#006621] text-sm mb-2">https://astikan.com/symptoms/acute-migraine</div>
            <p className="text-[#545454] text-sm line-clamp-2 leading-relaxed">{previewData(template.description)}</p>
          </div>

          <div className="flex items-center gap-2 text-gray-400 px-2 pt-2">
            <div className="w-5 h-5 flex items-center justify-center shrink-0">
               <Layout size={14} strokeWidth={3} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Live Simulation</span>
          </div>

          {/* Browser Simulation */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden h-100 flex flex-col border-b-4 border-b-gray-100">
            <div className="h-10 bg-gray-50 border-b border-gray-100 flex items-center px-4 gap-2 shrink-0">
              <div className="flex gap-1.5 shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-red-300"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-300"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-300"></div>
              </div>
              <div className="ml-4 bg-white border border-gray-200 h-6 w-full rounded-md text-[10px] flex items-center px-3 text-gray-400 truncate">
                astikan.com/symptoms/acute-migraine
              </div>
            </div>
            <div className="p-8 flex-1 overflow-y-auto bg-white">
               <div className="max-w-md mx-auto space-y-6">
                  <h1 className="text-3xl font-black text-gray-900 border-b border-gray-100 pb-4">
                    {previewData(template.h1)}
                  </h1>
                  <div className="space-y-3">
                    <div className="h-3 bg-gray-50 rounded-full w-full"></div>
                    <div className="h-3 bg-gray-50 rounded-full w-4/5"></div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}