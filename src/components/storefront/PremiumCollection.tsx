"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
export default function PremiumCollection({ banner, isEditMode = false }: { banner: any, products?: any[], isEditMode?: boolean }) {
  if (!banner) return null;

  const handleTextUpdate = async (field: string, value: string) => {
    if (!isEditMode) return;
    try {
      await fetch(`/api/admin/banners/${banner.id}`, {
        credentials: "include",
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value })
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !isEditMode) return;
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { credentials: "include", method: "POST", body: fd });
      if (res.ok) {
        const { url } = await res.json();
        await fetch(`/api/admin/banners/${banner.id}`, {
          credentials: "include",
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: url })
        });
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    if (!isEditMode) return;
    e.preventDefault();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const fd = new FormData();
      fd.append("file", file);
      try {
        const res = await fetch("/api/admin/upload", { credentials: "include", method: "POST", body: fd });
        if (res.ok) {
          const { url } = await res.json();
          await fetch(`/api/admin/banners/${banner.id}`, {
            credentials: "include",
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: url })
          });
          window.location.reload();
        }
      } catch (err) { console.error(err); }
      return;
    }

    let url = e.dataTransfer.getData("text/plain");
    if (url && url.startsWith("http")) { try { url = new URL(url).pathname; } catch (e) {} }
    if (url && url.startsWith("/")) {
      await fetch(`/api/admin/banners/${banner.id}`, {
        credentials: "include",
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: url })
      });
      window.location.reload();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (isEditMode) e.preventDefault();
  };

  return (
    <section className="py-24 bg-transparent">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="inline-block text-[#C9A227] text-[13px] font-black uppercase tracking-[0.3em] mb-4">
            The Edit
          </span>
          <h2 className="text-[36px] md:text-[48px] font-black text-black tracking-tight mb-6">
            Premium Curations
          </h2>
          <div className="w-12 h-[1px] bg-black"></div>
        </div>

        <div className="w-full">
          
          {/* Left Column - Large Widescreen Editorial Image */}
          <div 
            className={`relative aspect-[16/9] md:aspect-[21/9] bg-white overflow-hidden group rounded-3xl border border-gray-200 shadow-sm ${isEditMode ? 'ring-2 ring-transparent hover:ring-[#C9A227]/50 transition-all cursor-pointer' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={(e) => {
              if (isEditMode && (e.target as HTMLElement).tagName !== 'SPAN' && (e.target as HTMLElement).tagName !== 'H3' && (e.target as HTMLElement).tagName !== 'P') {
                document.getElementById(`upload-${banner.id}`)?.click();
              }
            }}
          >
            <input type="file" id={`upload-${banner.id}`} className="hidden" accept="image/*" onChange={handleImageUpload} />
            {isEditMode && <div className="absolute top-4 right-4 z-50 bg-black/70 text-white text-[10px] uppercase font-bold px-2 py-1 rounded shadow-lg pointer-events-none">Click or Drop image</div>}
            <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <Image 
                src={banner.image || "/placeholder.png"} 
                alt={banner.title} 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" 
              />
            </div>
            {/* Overlay Text */}
            <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-10 md:p-16">
              <h3 
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onBlur={(e) => handleTextUpdate('title', e.currentTarget.textContent || "")}
                className={`text-white text-[42px] md:text-[54px] font-black tracking-tight mb-4 ${isEditMode ? 'outline-dashed outline-1 outline-white/30 hover:outline-white p-1' : ''}`}
              >
                {banner.title}
              </h3>
              {banner.subtitle && (
                <p 
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onBlur={(e) => handleTextUpdate('subtitle', e.currentTarget.textContent || "")}
                  className={`text-white/90 text-sm tracking-wide mb-8 max-w-2xl font-light ${isEditMode ? 'outline-dashed outline-1 outline-white/30 hover:outline-white p-1' : ''}`}
                >
                  {banner.subtitle}
                </p>
              )}
              <Link href={banner.link || "/search"} onClick={(e) => isEditMode && e.preventDefault()} className="inline-flex items-center gap-4 bg-black hover:bg-[#C9A227] text-white hover:text-black text-[14px] font-black uppercase tracking-[0.2em] transition-all px-8 py-4 rounded-xl border border-black hover:border-[#C9A227] shadow-sm hover:shadow-none hover:translate-y-1 self-start mt-4">
                <span
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onBlur={(e) => handleTextUpdate('buttonText', e.currentTarget.textContent || "")}
                  className={isEditMode ? 'outline-dashed outline-1 outline-white/30 hover:outline-white p-1' : ''}
                >
                  {banner.buttonText}
                </span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
