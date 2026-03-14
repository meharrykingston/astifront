"use client";

import React from 'react';
import { 
  X, Type, Image as ImageIcon, Layout, 
  BoxSelect, Save, MousePointer2, Plus 
} from 'lucide-react';

interface BuilderProps {
  onBack: () => void;
  pageData?: any;
}

const Builder: React.FC<BuilderProps> = ({ onBack, pageData }) => {
  
  // Widget Item Component for the Sidebar
  const Widget = ({ icon: Icon, label }: { icon: any, label: string }) => (
    <div className="bg-white border border-slate-200 rounded-lg p-3 flex flex-col items-center justify-center gap-2 cursor-grab hover:border-blue-500 hover:text-blue-600 transition-all hover:shadow-sm active:scale-95 group">
      <Icon className="w-5! h-5! shrink-0 group-hover:scale-110 transition-transform" strokeWidth={2} />
      <span className="text-[10px] font-semibold uppercase tracking-tight">{label}</span>
    </div>
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm w-full flex-1 flex flex-col lg:flex-row overflow-hidden min-h-[calc(100vh-200px)]">
      
      {/* --- SIDEBAR (Tools & Widgets) --- */}
      {/* On mobile: Bottom fixed or scrollable. On desktop: Left sidebar */}
      <aside className="w-full lg:w-72 border-b lg:border-b-0 lg:border-r border-slate-200 bg-slate-50 flex flex-col shrink-0 order-2 lg:order-1">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white lg:bg-transparent">
          <div className="flex items-center gap-2">
            <MousePointer2 className="w-4! h-4! text-blue-600 shrink-0" />
            <h3 className="font-bold text-[12px] text-slate-900 uppercase tracking-widest">
              Elements
            </h3>
          </div>
          <button 
            onClick={onBack}
            className="lg:hidden p-1.5 text-slate-400 hover:bg-slate-200 rounded transition-colors"
          >
            <X className="w-5! h-5! shrink-0" />
          </button>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto max-h-75 lg:max-h-full">
          <section className="mb-6">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Layout Structure</p>
            <div className="grid grid-cols-2 gap-2">
              <Widget icon={BoxSelect} label="Section" />
              <Widget icon={Layout} label="Grid" />
            </div>
          </section>

          <section className="mb-6">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Medical Components</p>
            <div className="grid grid-cols-2 gap-2">
              <Widget icon={Type} label="Heading" />
              <Widget icon={ImageIcon} label="Media" />
              {/* Add more specific medical widgets here */}
            </div>
          </section>
        </div>

        {/* Action Button for Desktop Sidebar */}
        <div className="p-4 border-t border-slate-200 bg-white hidden lg:block">
          <button className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-[13px] font-bold transition-all shadow-sm flex items-center justify-center gap-2">
            <Save className="w-4! h-4! shrink-0" />
            Save Changes
          </button>
        </div>
      </aside>

      {/* --- CANVAS (The Visual Editor) --- */}
      <div className="flex-1 bg-slate-100 flex flex-col relative overflow-hidden order-1 lg:order-2">
        
        {/* Top bar for Canvas - Desktop only show Close button here */}
        <div className="p-3 bg-white border-b border-slate-200 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="px-2 py-1 bg-slate-100 rounded text-[10px] font-mono text-slate-500 uppercase tracking-tighter">
              {pageData?.path || '/new-page-path'}
            </div>
          </div>
          <div className="flex items-center gap-2">
             <button className="lg:hidden px-4 py-1.5 bg-green-600 text-white rounded text-[11px] font-bold">
               Save
             </button>
             <button 
               onClick={onBack}
               className="p-1.5 text-slate-400 hover:bg-slate-100 rounded transition-colors"
             >
               <X className="w-5! h-5! shrink-0" />
             </button>
          </div>
        </div>

        {/* The Drop Zone Area */}
        <div className="flex-1 p-4 sm:p-8 overflow-y-auto custom-scrollbar">
          <div className="w-full max-w-4xl mx-auto min-h-full bg-white rounded-md shadow-lg border-2 border-dashed border-slate-200 p-12 flex flex-col items-center justify-center group hover:border-blue-400 transition-colors cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mb-4 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
              <Plus className="w-6! h-6! text-slate-300 group-hover:text-blue-500 shrink-0" />
            </div>
            <p className="text-slate-400 text-[13px] font-medium text-center">
              Drag elements from the sidebar to start building <br />
              <span className="text-[11px] text-slate-300 mt-1 block uppercase tracking-wider">or click to add section</span>
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Builder;