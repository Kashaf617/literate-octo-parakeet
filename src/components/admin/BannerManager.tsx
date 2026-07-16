"use client";
import { useState, useEffect } from "react";
import { UploadCloud, RefreshCw, Monitor, Smartphone } from "lucide-react";
import { cx } from "@/lib/utils";

export default function BannerManager() {
  const [media, setMedia] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");

  useEffect(() => {
    fetchMedia();
  }, []);

  async function fetchMedia() {
    const res = await fetch("/api/admin/media");
    if (res.ok) {
      const data = await res.json();
      setMedia(data.files || []);
    }
  }

  async function handleFiles(files: FileList | File[]) {
    const validFiles = Array.from(files).filter(f => f.type.startsWith("image/"));
    if (validFiles.length === 0) return;
    
    setUploading(true);
    let uploadedCount = 0;
    for (const file of validFiles) {
      const fd = new FormData();
      fd.append("file", file);
      try {
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        if (res.ok) uploadedCount++;
      } catch (e) {
        console.error(e);
      }
    }
    setUploading(false);
    if (uploadedCount > 0) {
      fetchMedia();
    }
  }

  return (
    <div className="flex h-[calc(100vh-140px)] overflow-hidden rounded-xl border border-line bg-white shadow-sm">
      {/* Sidebar - Media Gallery */}
      <div className="w-[320px] shrink-0 border-r border-line bg-[#f8f9fa] flex flex-col relative z-10">
        <div className="p-4 border-b border-line bg-white">
          <h3 className="font-bold text-ink">Media Gallery</h3>
          <p className="text-[11px] text-sub">Drag images directly onto the live preview to update banners and categories. Click text in preview to edit.</p>
        </div>
        
        {/* Upload Zone */}
        <div className="p-4 border-b border-line">
          <div 
            className="border-2 border-dashed border-[#cbd5e1] rounded-lg p-5 flex flex-col items-center justify-center text-center cursor-pointer bg-white hover:bg-[#f1f5f9] transition-colors"
            onClick={() => document.getElementById('media-upload')?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
            }}
          >
            <UploadCloud className={`w-8 h-8 mb-2 ${uploading ? 'text-brand animate-pulse' : 'text-[#94a3b8]'}`} />
            <span className="text-xs font-bold text-ink">{uploading ? "Uploading..." : "Click or drag images to upload"}</span>
            <input id="media-upload" type="file" multiple accept="image/*" className="hidden" onChange={(e) => e.target.files && handleFiles(e.target.files)} />
          </div>
        </div>

        {/* Image Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-3 content-start">
            {media.map((url, i) => (
              <div 
                key={i} 
                className="aspect-square border border-line rounded-lg bg-cover bg-center cursor-grab active:cursor-grabbing hover:ring-2 ring-brand transition-all shadow-sm"
                style={{ backgroundImage: `url(${url})` }}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("text/plain", url);
                }}
              />
            ))}
            {media.length === 0 && !uploading && (
              <div className="col-span-2 text-center py-10 text-sub text-xs">No media uploaded yet.</div>
            )}
          </div>
        </div>
      </div>

      {/* Main Area - Live Preview Iframe */}
      <div className="flex-1 bg-[#e2e8f0] flex flex-col overflow-hidden relative">
        <div className="h-14 bg-white border-b border-line flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ef4444]"></div>
            <div className="w-3 h-3 rounded-full bg-[#eab308]"></div>
            <div className="w-3 h-3 rounded-full bg-[#22c55e]"></div>
            <span className="ml-3 text-[12px] font-bold text-sub">Storefront Visual Editor</span>
          </div>
          
          <div className="flex bg-[#f1f5f9] p-1 rounded-lg">
            <button 
              onClick={() => setViewMode("desktop")}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-[12px] font-bold transition-all ${viewMode === "desktop" ? 'bg-white shadow-sm text-ink' : 'text-sub hover:text-ink'}`}
            >
              <Monitor className="w-4 h-4" /> Desktop
            </button>
            <button 
              onClick={() => setViewMode("mobile")}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-[12px] font-bold transition-all ${viewMode === "mobile" ? 'bg-white shadow-sm text-ink' : 'text-sub hover:text-ink'}`}
            >
              <Smartphone className="w-4 h-4" /> Mobile
            </button>
          </div>

          <button 
            onClick={() => setRefreshKey(k => k + 1)} 
            className="text-[12px] font-bold text-sub flex items-center gap-1.5 hover:text-ink transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
        <div className="flex-1 overflow-hidden relative p-4 lg:p-8 flex justify-center">
          <div 
            className={`h-full bg-white shadow-xl border border-line overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${viewMode === 'mobile' ? 'w-[375px] rounded-[2.5rem] border-[8px] border-[#0f172a]' : 'w-full max-w-[1440px] rounded-xl'}`}
          >
            <iframe 
              key={refreshKey}
              src="/?editMode=true" 
              className="w-full h-full border-0"
              title="Storefront Preview"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
