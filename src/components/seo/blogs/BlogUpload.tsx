import React, { useRef, useState } from "react";
import { Loader2, Upload, X } from "lucide-react";

type BlogUploadProps = {
  isOpen: boolean;
  isUploading: boolean;
  onClose: () => void;
  onUploadFile: (file: File) => Promise<void>;
};

export default function BlogUpload({ isOpen, isUploading, onClose, onUploadFile }: BlogUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const uploadInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 grid place-items-center bg-slate-900/45 p-4">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h3 className="text-lg font-semibold text-slate-900">Upload Blogs</h3>
          <button
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
            aria-label="Close upload dialog"
          >
            <X className="h-4! w-4!" />
          </button>
        </div>

        <label
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOver(false);
            const file = e.dataTransfer.files?.[0];
            if (file) void onUploadFile(file);
          }}
          className={`block cursor-pointer rounded-2xl border border-dashed p-8 text-center transition ${
            isDragOver ? "border-blue-400 bg-blue-50" : "border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100"
          }`}
        >
          <input
            ref={uploadInputRef}
            type="file"
            accept="application/json,.json,text/csv,.csv"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (file) void onUploadFile(file);
            }}
          />
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl bg-white text-slate-600 shadow-sm">
            {isUploading ? <Loader2 className="h-5! w-5! animate-spin" /> : <Upload className="h-5! w-5!" />}
          </div>
          <p className="text-base font-semibold text-slate-900">{isUploading ? "Uploading..." : "Drag and drop CSV or JSON here"}</p>
          <p className="mt-1 text-sm text-slate-600">or click to browse files (max 50MB)</p>
        </label>
      </div>
    </div>
  );
}
