"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { BannerType } from "@/lib/types";

export default function HeroBanners({ banners, isEditMode = false }: { banners: BannerType[], isEditMode?: boolean }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (isEditMode || !banners || banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(timer);
  }, [banners, isEditMode]);

  if (!banners || banners.length === 0) return null;

  const activeBanner = banners[current];

  const handleTextUpdate = async (id: string, field: string, value: string) => {
    if (!isEditMode) return;
    try {
      const res = await fetch(`/api/admin/banners/${id}`, {
        credentials: "include",
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value })
      });
      if (!res.ok) {
        if (res.status === 401) {
          alert("Unauthorized: You must be logged in as an admin to save edits. Please login at http://localhost:3000/adminlogin first.");
        } else {
          const data = await res.json().catch(() => ({}));
          alert(`Error: ${data.error || "Failed to save edits"}`);
        }
      }
    } catch (e: any) {
      console.error(e);
      alert(`Connection error: ${e.message}`);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const file = e.target.files?.[0];
    if (!file || !isEditMode) return;
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { credentials: "include", method: "POST", body: fd });
      if (res.ok) {
        const { url } = await res.json();
        await fetch(`/api/admin/banners/${id}`, {
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

  const handleDrop = async (e: React.DragEvent, id: string) => {
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
          await fetch(`/api/admin/banners/${id}`, {
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
      await fetch(`/api/admin/banners/${id}`, {
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
    <section className="bg-transparent pt-6 pb-12">
      <div className="max-w-[1280px] mx-auto px-6">
        <div 
          onDrop={(e: any) => handleDrop(e, activeBanner.id)}
          onDragOver={handleDragOver}
          className={`relative rounded-3xl overflow-hidden h-[540px] bg-black border border-gray-200 shadow-sm ${
            isEditMode ? 'ring-2 ring-transparent hover:ring-[#ff5a1f]/50 transition-all cursor-pointer' : ''
          }`}
          onClick={(e) => {
            if (isEditMode && (e.target as HTMLElement).tagName !== 'SPAN' && (e.target as HTMLElement).tagName !== 'H2' && (e.target as HTMLElement).tagName !== 'P') {
              document.getElementById(`upload-${activeBanner.id}`)?.click();
            }
          }}
        >
          <input type="file" id={`upload-${activeBanner.id}`} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, activeBanner.id)} />
          
          {isEditMode && (
            <div className="absolute top-4 right-4 z-50 bg-black/70 text-white text-[10px] uppercase font-bold px-2 py-1 rounded shadow-lg pointer-events-none">
              Click or Drop image (Slide {current + 1} of {banners.length})
            </div>
          )}

          {/* Slide transitions with Framer Motion */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeBanner.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full"
            >
              <Image 
                src={activeBanner.image || "/placeholder.png"} 
                alt={activeBanner.title} 
                fill 
                className="object-cover object-center scale-100 hover:scale-102 transition-transform duration-[5000ms] ease-out opacity-80"
                priority
              />
              {/* Premium Dark Gradients Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-transparent"></div>
            </motion.div>
          </AnimatePresence>

          {/* Slide Text Content overlay */}
          <div className="relative z-10 p-10 md:p-20 h-full flex flex-col justify-center max-w-2xl text-left">
            <span 
              contentEditable={isEditMode}
              suppressContentEditableWarning
              onBlur={(e) => handleTextUpdate(activeBanner.id, 'eyebrow', e.currentTarget.textContent || "")}
              className={`inline-block text-[#C9A227] text-xs md:text-sm font-black uppercase tracking-[0.3em] mb-4 ${
                isEditMode ? 'outline-dashed outline-1 outline-white/30 hover:outline-white p-1' : ''
              }`}
            >
              {activeBanner.eyebrow}
            </span>
            <h2 
              contentEditable={isEditMode}
              suppressContentEditableWarning
              onBlur={(e) => handleTextUpdate(activeBanner.id, 'title', e.currentTarget.textContent || "")}
              className={`text-[42px] md:text-[68px] font-black text-white leading-[1.1] mb-5 tracking-tight uppercase font-heading ${
                isEditMode ? 'outline-dashed outline-1 outline-white/30 hover:outline-white p-1' : ''
              }`}
            >
              {activeBanner.title}
            </h2>
            <p 
              contentEditable={isEditMode}
              suppressContentEditableWarning
              onBlur={(e) => handleTextUpdate(activeBanner.id, 'subtitle', e.currentTarget.textContent || "")}
              className={`text-[14px] md:text-[16px] text-gray-300 mb-10 font-light leading-relaxed max-w-lg ${
                isEditMode ? 'outline-dashed outline-1 outline-white/30 hover:outline-white p-1' : ''
              }`}
            >
              {activeBanner.subtitle}
            </p>
            <div>
              <Link 
                href={activeBanner.link !== "#" ? activeBanner.link : "/search"} 
                onClick={(e) => isEditMode && e.preventDefault()} 
                className="inline-block bg-black hover:bg-[#C9A227] border-2 border-white hover:border-[#C9A227] hover:text-black text-white font-black text-[13px] uppercase tracking-widest px-10 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-none hover:translate-y-[2px]"
              >
                <span
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onBlur={(e) => handleTextUpdate(activeBanner.id, 'buttonText', e.currentTarget.textContent || "")}
                  className={isEditMode ? 'outline-dashed outline-1 outline-black/30 hover:outline-black p-1' : ''}
                >
                  {activeBanner.buttonText || "Shop Now"}
                </span>
              </Link>
            </div>
          </div>

          {/* Indicator Navigation Dots */}
          {banners.length > 1 && (
            <div className="absolute bottom-6 right-10 z-20 flex gap-2.5">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrent(index);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    index === current ? 'w-8 bg-[#C9A227]' : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
