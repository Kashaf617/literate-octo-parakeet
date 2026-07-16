"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { UploadCloud } from "lucide-react";

export default function ImageUploader({ 
  value, 
  onChange, 
  onUploadMultiple,
  label = "Banner Image",
  multiple = false
}: { 
  value?: string; 
  onChange?: (url: string) => void; 
  onUploadMultiple?: (urls: string[]) => void;
  label?: string;
  multiple?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  async function handleFiles(files: FileList | File[]) {
    const validFiles = Array.from(files).filter(f => f.type.startsWith("image/"));
    if (validFiles.length === 0) return;
    
    setUploading(true);
    const uploadedUrls: string[] = [];

    for (const file of validFiles) {
      const fd = new FormData();
      fd.append("file", file);
      try {
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        if (res.ok) {
          const data = await res.json();
          uploadedUrls.push(data.url);
          if (onChange) onChange(data.url); // Call for single backwards compatibility
        }
      } catch (e) {
        console.error(e);
      }
    }
    
    if (onUploadMultiple && uploadedUrls.length > 0) {
      onUploadMultiple(uploadedUrls);
    }
    
    setUploading(false);
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="admin-label">{label}</label>
      
      {/* Drag & Drop Zone */}
      <div 
        className={`relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer ${
          isDragging ? 'border-[#0b1221] bg-[#0b1221]/5' : 'border-[#e2e8f0] bg-[#f8f9fa] hover:bg-[#0b1221]/5'
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files?.length > 0) {
            handleFiles(multiple ? e.dataTransfer.files : [e.dataTransfer.files[0]]);
          }
        }}
        onClick={() => inputRef.current?.click()}
      >
        <input 
          ref={inputRef} 
          type="file" 
          accept="image/*" 
          multiple={multiple}
          className="hidden" 
          onChange={(e) => {
            if (e.target.files?.length) {
              handleFiles(multiple ? e.target.files : [e.target.files[0]]);
            }
          }} 
        />
        
        {uploading ? (
          <div className="text-sm font-bold text-[#64748b] animate-pulse">Uploading...</div>
        ) : (
          <>
            <UploadCloud className={`w-10 h-10 mb-3 ${isDragging ? 'text-[#0b1221]' : 'text-[#94a3b8]'}`} />
            <p className="text-[13px] font-bold text-[#0b1221] mb-1">Click or drag image here</p>
            <p className="text-[11px] text-[#94a3b8]">PNG, JPG up to 5MB</p>
          </>
        )}
      </div>

      {/* Preview and Manual URL Input */}
      <div className="flex items-center gap-3 mt-2">
        <div className="w-16 h-16 rounded-lg border border-[#e2e8f0] bg-[#f8f9fa] overflow-hidden shrink-0 relative">
          {value ? <Image src={value} alt="" fill className="object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[#94a3b8] text-[10px]">Empty</div>}
        </div>
        <div className="flex-1">
          <input
            className="w-full text-[13px] border border-[#e2e8f0] rounded-lg p-2.5 outline-none focus:border-[#0b1221]"
            placeholder="Or paste an image URL directly"
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
