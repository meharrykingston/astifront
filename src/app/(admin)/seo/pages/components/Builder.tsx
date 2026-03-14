"use client";

import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Cog,
  Columns,
  Eye,
  Image as ImageIcon,
  LayoutPanelTop,
  Monitor,
  PencilLine,
  Plus,
  Save,
  Smartphone,
  Tablet,
  Type,
  Video,
} from 'lucide-react';
import type { SeoPage } from '../page';

interface BuilderProps {
  onBack: () => void;
  pageData?: SeoPage;
}

type BuilderElement = {
  id: number;
  type: 'heading' | 'text' | 'image' | 'button' | 'video';
  label: string;
  content: string;
};

const starterElements: BuilderElement[] = [
  { id: 1, type: 'heading', label: 'Hero Heading', content: 'Build high-converting SEO pages' },
  { id: 2, type: 'text', label: 'Paragraph', content: 'Drag and drop blocks, then preview exactly how it looks on device sizes.' },
  { id: 3, type: 'button', label: 'CTA Button', content: 'Get Started' },
];

export default function Builder({ onBack, pageData }: BuilderProps) {
  const [activeTab, setActiveTab] = useState<'elements' | 'settings'>('elements');
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showPreview, setShowPreview] = useState(false);
  const [elements, setElements] = useState<BuilderElement[]>(starterElements);
  const [selectedId, setSelectedId] = useState<number | null>(starterElements[0]?.id ?? null);
  const [pageName, setPageName] = useState(pageData?.title ?? 'New Page');

  const selected = useMemo(() => elements.find((e) => e.id === selectedId) ?? null, [elements, selectedId]);
  const canvasWidthClass =
    device === 'mobile' ? 'max-w-[360px]' : device === 'tablet' ? 'max-w-[760px]' : 'max-w-[1024px]';

  const addElement = (type: BuilderElement['type']) => {
    const labelMap: Record<BuilderElement['type'], string> = {
      heading: 'Heading',
      text: 'Text',
      image: 'Image',
      button: 'Button',
      video: 'Video',
    };
    const contentMap: Record<BuilderElement['type'], string> = {
      heading: 'New heading',
      text: 'Add your paragraph text here.',
      image: 'Image placeholder',
      button: 'Click here',
      video: 'Video placeholder',
    };

    const id = Date.now();
    const next = { id, type, label: labelMap[type], content: contentMap[type] };
    setElements((prev) => [...prev, next]);
    setSelectedId(id);
  };

  const updateSelectedContent = (value: string) => {
    if (!selectedId) return;
    setElements((prev) => prev.map((item) => (item.id === selectedId ? { ...item, content: value } : item)));
  };

  const ElementTile = ({
    icon: Icon,
    label,
    onClick,
  }: {
    icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
    label: string;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className="flex h-9 w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-left text-xs sm:text-sm font-medium text-slate-800 transition hover:border-blue-300 hover:bg-blue-50"
    >
      <Icon className="h-3.5! w-3.5! text-slate-600" strokeWidth={2.1} />
      {label}
    </button>
  );

  return (
    <section className="min-h-screen w-full overflow-x-hidden bg-slate-50 font-['Sora']">
      <div className="flex h-full min-h-screen flex-col">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-2 py-2 backdrop-blur sm:px-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <button
                onClick={onBack}
                className="inline-flex h-8 items-center gap-1 rounded-lg px-2 text-xs sm:text-sm font-semibold text-slate-800 hover:bg-slate-100"
              >
                <ArrowLeft className="h-3.5! w-3.5!" />
                Back
              </button>
              <input
                value={pageName}
                onChange={(e) => setPageName(e.target.value)}
                className="h-8 w-40 rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs sm:text-sm outline-none focus:border-blue-300"
              />
            </div>

            <div className="flex items-center gap-1">
              <div className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-100 p-0.5">
                <button
                  onClick={() => setDevice('desktop')}
                  className={`inline-flex h-7 w-7 items-center justify-center rounded-lg ${device === 'desktop' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-200'}`}
                >
                  <Monitor className="h-3.5! w-3.5!" />
                </button>
                <button
                  onClick={() => setDevice('tablet')}
                  className={`inline-flex h-7 w-7 items-center justify-center rounded-lg ${device === 'tablet' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-200'}`}
                >
                  <Tablet className="h-3.5! w-3.5!" />
                </button>
                <button
                  onClick={() => setDevice('mobile')}
                  className={`inline-flex h-7 w-7 items-center justify-center rounded-lg ${device === 'mobile' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-200'}`}
                >
                  <Smartphone className="h-3.5! w-3.5!" />
                </button>
              </div>

              <button
                onClick={() => setShowPreview((v) => !v)}
                className="inline-flex h-8 items-center gap-1 rounded-xl border border-slate-200 bg-white px-2 text-xs sm:text-sm font-medium text-slate-800 hover:bg-slate-100"
              >
                <Eye className="h-3.5! w-3.5!" />
                {showPreview ? 'Edit' : 'Preview'}
              </button>
              <button className="inline-flex h-8 items-center gap-1 rounded-xl bg-blue-600 px-2 text-xs sm:text-sm font-semibold text-white hover:bg-blue-700">
                <Save className="h-3.5! w-3.5!" />
                Save
              </button>
            </div>
          </div>
        </header>

        <div className="grid flex-1 min-h-0 grid-cols-1 lg:grid-cols-[270px_minmax(0,1fr)_290px]">
          <aside className="border-b border-slate-200 bg-white lg:border-b-0 lg:border-r">
            <div className="border-b border-slate-200 p-1">
              <div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1">
                <button
                  onClick={() => setActiveTab('elements')}
                  className={`h-7 rounded-lg text-xs sm:text-sm font-medium ${activeTab === 'elements' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
                >
                  Elements
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`h-7 rounded-lg text-xs sm:text-sm font-medium ${activeTab === 'settings' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
                >
                  Settings
                </button>
              </div>
            </div>

            <div className="max-h-65 space-y-2 overflow-y-auto p-3 lg:max-h-none lg:h-[calc(100vh-109px)]">
              {activeTab === 'elements' ? (
                <>
                  <p className="text-xs sm:text-sm text-slate-500">Drag or click to add</p>
                  <ElementTile icon={Type} label="Heading" onClick={() => addElement('heading')} />
                  <ElementTile icon={PencilLine} label="Text" onClick={() => addElement('text')} />
                  <ElementTile icon={ImageIcon} label="Image" onClick={() => addElement('image')} />
                  <ElementTile icon={LayoutPanelTop} label="Button" onClick={() => addElement('button')} />
                  <ElementTile icon={Columns} label="Container" onClick={() => addElement('text')} />
                  <ElementTile icon={Video} label="Video" onClick={() => addElement('video')} />
                </>
              ) : (
                <div className="space-y-2 text-xs sm:text-sm">
                  <label className="block text-xs sm:text-sm font-medium text-slate-600">
                    Page slug
                    <input
                      defaultValue={pageData?.slug ?? '/new-page'}
                      className="mt-1 h-8 w-full rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs sm:text-sm"
                    />
                  </label>
                  <label className="block text-xs sm:text-sm font-medium text-slate-600">
                    SEO title
                    <input
                      defaultValue={pageData?.title ?? 'New Page'}
                      className="mt-1 h-8 w-full rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs sm:text-sm"
                    />
                  </label>
                  <label className="block text-xs sm:text-sm font-medium text-slate-600">
                    Meta description
                    <textarea
                      rows={4}
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs sm:text-sm"
                      defaultValue="Describe this page for search results."
                    />
                  </label>
                </div>
              )}
            </div>
          </aside>

          <main className="min-w-0 bg-slate-100 p-2 sm:p-3">
            <div className="h-full overflow-auto rounded-xl border border-slate-200 bg-slate-200/40 p-2 sm:p-4">
              <div className={`mx-auto w-full ${canvasWidthClass}`}>
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                  {showPreview ? (
                    <div className="space-y-3">
                      {elements.map((element) => (
                        <div key={element.id} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                          {element.type === 'heading' && <h3 className="text-lg font-semibold text-slate-900">{element.content}</h3>}
                          {element.type === 'text' && <p className="text-xs sm:text-sm text-slate-700">{element.content}</p>}
                          {element.type === 'button' && (
                            <button className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs sm:text-sm font-semibold text-white">{element.content}</button>
                          )}
                          {element.type === 'image' && (
                            <div className="grid h-36 place-items-center rounded-lg border border-dashed border-slate-300 bg-white text-xs sm:text-sm text-slate-500">
                              Image preview
                            </div>
                          )}
                          {element.type === 'video' && (
                            <div className="grid h-36 place-items-center rounded-lg border border-dashed border-slate-300 bg-white text-xs sm:text-sm text-slate-500">
                              Video preview
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {elements.map((element) => (
                        <button
                          key={element.id}
                          onClick={() => setSelectedId(element.id)}
                          className={`block w-full rounded-lg border p-3 text-left transition ${
                            selectedId === element.id
                              ? 'border-blue-300 bg-blue-50'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <p className="text-xs sm:text-sm font-semibold text-slate-900">{element.label}</p>
                          <p className="mt-1 line-clamp-2 text-xs sm:text-sm text-slate-600">{element.content}</p>
                        </button>
                      ))}

                      <button
                        onClick={() => addElement('text')}
                        className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 px-2 text-xs sm:text-sm text-slate-700 hover:bg-slate-100"
                      >
                        <Plus className="h-3.5! w-3.5!" />
                        Add section
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>

          <aside className="border-t border-slate-200 bg-white lg:border-l lg:border-t-0">
            <div className="border-b border-slate-200 p-3">
              <p className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-slate-900">
                <Cog className="h-3.5! w-3.5!" />
                Properties
              </p>
            </div>

            <div className="space-y-3 p-3 text-xs sm:text-sm">
              {selected ? (
                <>
                  <p className="text-xs sm:text-sm text-slate-500">Selected: {selected.label}</p>
                  <label className="block text-xs sm:text-sm font-medium text-slate-600">
                    Content
                    <textarea
                      rows={8}
                      value={selected.content}
                      onChange={(e) => updateSelectedContent(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs sm:text-sm"
                    />
                  </label>
                </>
              ) : (
                <p className="text-xs sm:text-sm text-slate-500">Select an element to edit its properties.</p>
              )}

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-2">
                <p className="text-xs sm:text-sm font-semibold text-slate-800">Live preview</p>
                <p className="mt-1 text-xs sm:text-sm text-slate-600">
                  Toggle Preview from the top bar to see final output by selected device width.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}


