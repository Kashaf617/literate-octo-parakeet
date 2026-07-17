"use client";
import { useRef, useState } from "react";
import { UploadCloud, CheckCircle, AlertCircle } from "lucide-react";

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
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleFiles(files: FileList | File[]) {
    const validFiles = Array.from(files).filter(f => f.type.startsWith("image/"));
    if (validFiles.length === 0) return;
    
    setUploading(true);
    setUploadStatus("idle");
    setErrorMsg("");
    const uploadedUrls: string[] = [];

    for (const file of validFiles) {
      // Show file size warning
      if (file.size > 8 * 1024 * 1024) {
        setErrorMsg(`File "${file.name}" is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max 8MB.`);
        setUploadStatus("error");
        continue;
      }

      const fd = new FormData();
      fd.append("file", file);
      
      try {
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: fd,
          // Explicitly include credentials so the admin session cookie is sent
          credentials: "include"
        });
        
        if (res.ok) {
          const data = await res.json();
          uploadedUrls.push(data.url);
          if (onChange) onChange(data.url);
          setUploadStatus("success");
        } else {
          let errorText = "";
          try {
            const errJson = await res.json();
            errorText = errJson.error || JSON.stringify(errJson);
          } catch {
            errorText = await res.text();
          }
          console.error("Upload failed:", res.status, errorText);
          setErrorMsg(`Upload failed (${res.status}): ${errorText}`);
          setUploadStatus("error");
        }
      } catch (e: any) {
        console.error("Upload error:", e);
        setErrorMsg(`Network error: ${e.message}`);
        setUploadStatus("error");
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
          isDragging ? 'border-[#0b1221] bg-[#0b1221]/5' : 
          uploadStatus === "error" ? 'border-red-300 bg-red-50' :
          uploadStatus === "success" ? 'border-green-400 bg-green-50' :
          'border-[#e2e8f0] bg-[#f8f9fa] hover:bg-[#0b1221]/5'
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
        ) : uploadStatus === "success" ? (
          <div className="flex flex-col items-center gap-1">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <span className="text-sm font-bold text-green-600">Uploaded successfully!</span>
            <span className="text-xs text-green-500">Click to upload another</span>
          </div>
        ) : uploadStatus === "error" ? (
          <div className="flex flex-col items-center gap-1">
            <AlertCircle className="w-8 h-8 text-red-400" />
            <span className="text-xs font-bold text-red-500 text-center max-w-[220px]">{errorMsg}</span>
            <span className="text-xs text-red-400">Click to try again</span>
          </div>
        ) : (
          <>
            <UploadCloud className={`w-10 h-10 mb-3 ${isDragging ? 'text-[#0b1221]' : 'text-[#94a3b8]'}`} />
            <p className="text-[13px] font-bold text-[#0b1221] mb-1">Click or drag image here</p>
            <p className="text-[11px] text-[#94a3b8]">PNG, JPG up to 8MB</p>
          </>
        )}
      </div>

      {/* Preview and Manual URL Input */}
      <div className="flex items-center gap-3 mt-2">
        <div className="w-16 h-16 rounded-lg border border-[#e2e8f0] bg-[#f8f9fa] overflow-hidden shrink-0 relative">
          {value ? <img src={value} alt="Preview" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[#94a3b8] text-[10px]">Empty</div>}
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
