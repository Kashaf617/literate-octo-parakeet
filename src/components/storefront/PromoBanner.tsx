"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, ChevronRight } from "lucide-react";
import type { ProductType } from "./ProductCard";
import { fmtCurrency } from "@/lib/utils";

// Ultra Premium Mini Countdown
function MiniCountdown() {
  return (
    <div className="flex items-center justify-center md:justify-end gap-3 md:gap-6 mt-8 mb-10 text-white w-full">
      <div className="flex flex-col items-center">
        <span className="text-2xl md:text-4xl font-light tracking-wider">177</span>
        <span className="text-[10px] md:text-[11px] text-[#a9b6d3] uppercase tracking-[0.2em] mt-1 font-semibold">Days</span>
      </div>
      <span className="text-xl md:text-2xl font-light text-white/20 -mt-5">:</span>
      <div className="flex flex-col items-center">
        <span className="text-2xl md:text-4xl font-light tracking-wider">09</span>
        <span className="text-[10px] md:text-[11px] text-[#a9b6d3] uppercase tracking-[0.2em] mt-1 font-semibold">Hours</span>
      </div>
      <span className="text-xl md:text-2xl font-light text-white/20 -mt-5">:</span>
      <div className="flex flex-col items-center">
        <span className="text-2xl md:text-4xl font-light tracking-wider">21</span>
        <span className="text-[10px] md:text-[11px] text-[#a9b6d3] uppercase tracking-[0.2em] mt-1 font-semibold">Mins</span>
      </div>
      <span className="text-xl md:text-2xl font-light text-white/20 -mt-5">:</span>
      <div className="flex flex-col items-center">
        <span className="text-2xl md:text-4xl font-light tracking-wider">56</span>
        <span className="text-[10px] md:text-[11px] text-[#a9b6d3] uppercase tracking-[0.2em] mt-1 font-semibold">Secs</span>
      </div>
    </div>
  );
}

export default function PromoBanner({ banner, products = [], isEditMode = false }: { banner: any, products?: ProductType[], isEditMode?: boolean }) {
  const displayProducts = products.slice(0, 4);

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
    <section className="py-16 relative overflow-hidden bg-transparent">
      <div className="max-w-[1280px] mx-auto px-6 relative z-10">
        
        {/* Main Ultra Premium Banner */}
        <div 
          className={`relative min-h-[500px] rounded-3xl overflow-hidden border border-gray-200 shadow-sm ${isEditMode ? 'ring-2 ring-transparent hover:ring-[#C9A227]/50 transition-all cursor-pointer' : ''}`}
          style={{ background: `linear-gradient(90deg, ${banner.bgColorFrom}, ${banner.bgColorTo})`, color: banner.textColor }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={(e) => {
            if (isEditMode && (e.target as HTMLElement).tagName !== 'SPAN' && (e.target as HTMLElement).tagName !== 'H2' && (e.target as HTMLElement).tagName !== 'P') {
              document.getElementById(`upload-${banner.id}`)?.click();
            }
          }}
        >
          <input type="file" id={`upload-${banner.id}`} className="hidden" accept="image/*" onChange={handleImageUpload} />
          {isEditMode && <div className="absolute top-4 right-4 z-50 bg-black/70 text-white text-[10px] uppercase font-bold px-2 py-1 rounded shadow-lg pointer-events-none">Click or Drop image</div>}
          
          {/* Background Image spanning the whole banner but fading out towards the right */}
          <div className="absolute inset-0 w-full h-full md:w-[65%] z-0 pointer-events-none">
            <Image 
              src={banner.image || "/placeholder.png"} 
              alt={banner.title} 
              fill 
              className="object-cover object-center" 
              priority
            />
            {/* Gradient mask to seamlessly blend the image into the dark background on the right */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0b1221]/80 to-[#0b1221]" style={{ background: `linear-gradient(to right, transparent, ${banner.bgColorTo}80, ${banner.bgColorTo})` }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b1221]/90 via-[#0b1221]/60 to-transparent md:hidden" style={{ background: `linear-gradient(to top, ${banner.bgColorTo}F2, ${banner.bgColorTo}99, transparent)` }}></div>
          </div>

          {/* Right Side - Content */}
          <div className="relative z-10 flex flex-col justify-center h-full min-h-[500px] px-6 py-12 md:px-16 w-full md:w-[55%] mx-auto md:ml-auto md:mx-0 text-center md:text-left mt-32 md:mt-0">
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center md:items-end text-center md:text-right mx-auto md:ml-auto max-w-xl w-full"
            >
              {banner.eyebrow && <span 
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onBlur={(e) => handleTextUpdate('eyebrow', e.currentTarget.textContent || "")}
                className={`uppercase text-[12px] md:text-[14px] font-black tracking-[0.3em] text-[#C9A227] mb-4 drop-shadow-md ${isEditMode ? 'outline-dashed outline-1 outline-white/30 hover:outline-white p-1' : ''}`}
              >{banner.eyebrow}</span>}
              <h2 
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onBlur={(e) => handleTextUpdate('title', e.currentTarget.textContent || "")}
                className={`text-3xl md:text-6xl font-black mb-4 md:mb-6 leading-[1.15] md:leading-[1.1] tracking-tight drop-shadow-lg ${isEditMode ? 'outline-dashed outline-1 outline-white/30 hover:outline-white p-1' : ''}`} style={{ color: banner.textColor }}>
                {banner.title}
              </h2>
              {banner.subtitle && (
                <p 
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onBlur={(e) => handleTextUpdate('subtitle', e.currentTarget.textContent || "")}
                  className={`text-base md:text-xl font-medium leading-relaxed drop-shadow opacity-90 ${isEditMode ? 'outline-dashed outline-1 outline-white/30 hover:outline-white p-1' : ''}`} style={{ color: banner.textColor }}>
                  {banner.subtitle}
                </p>
              )}
              
              <MiniCountdown />

              <div className="mt-8">
                <Link href={banner.link || "/search"} onClick={(e) => isEditMode && e.preventDefault()} className="group inline-flex items-center gap-3 bg-black hover:bg-[#C9A227] text-white hover:text-black font-black text-[14px] uppercase tracking-widest px-8 py-4 rounded-xl transition-all duration-300 border border-black hover:border-[#C9A227] shadow-sm hover:shadow-none hover:translate-y-1">
                  <span
                    contentEditable={isEditMode}
                    suppressContentEditableWarning
                    onBlur={(e) => handleTextUpdate('buttonText', e.currentTarget.textContent || "")}
                    className={isEditMode ? 'outline-dashed outline-1 outline-black/30 hover:outline-black p-1' : ''}
                  >
                    {banner.buttonText}
                  </span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Overlapping Cards - Ultra Premium Styling */}
        {displayProducts.length > 0 && (
          <div className="relative -mt-10 md:-mt-20 z-30 mx-4 md:mx-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 pb-6">
            {displayProducts.map((p, i) => {
              const imageList: string[] = (() => {
                try { return JSON.parse(p.images); } catch { return []; }
              })();
              const primaryImage = imageList[0] || "/placeholder.png";

              return (
                <Link href={`/product/${p.slug}`} key={p.id}>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
                    whileHover={{ y: -6 }}
                    className="bg-white rounded-3xl p-4 flex gap-4 items-center border border-gray-200 shadow-sm hover:shadow-none hover:translate-y-1 transition-all duration-300"
                  >
                    <div className="w-[70px] h-[70px] shrink-0 rounded-2xl overflow-hidden relative bg-white border border-gray-200">
                      <Image 
                        src={primaryImage} 
                        alt={p.name} 
                        fill
                        className="object-cover mix-blend-multiply" 
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <h4 className="text-[15px] font-black text-black truncate mb-1.5">
                        {p.name}
                      </h4>
                      <div className="flex gap-[2px] mb-2">
                        {Array.from({ length: 5 }).map((_, idx) => {
                          const pseudoRating = (() => {
                            let hash = 0;
                            const str = p.name || "";
                            for (let k = 0; k < str.length; k++) {
                              hash = str.charCodeAt(k) + ((hash << 5) - hash);
                            }
                            return 4.6 + (Math.abs(hash % 4) / 10);
                          })();
                          return (
                            <Star key={idx} className={`w-[13px] h-[13px] ${idx < Math.floor(pseudoRating) ? "text-amber-400 fill-amber-400" : "text-black/10"}`} />
                          );
                        })}
                      </div>
                      <div className="text-[16px] font-black text-[#C9A227]">
                        {fmtCurrency(p.price)}
                      </div>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
