"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { fmtCurrency } from "@/lib/utils";
import type { ProductType } from "@/lib/types";

export default function PremiumCollection({ banner, products = [], isEditMode = false }: { banner: any, products?: ProductType[], isEditMode?: boolean }) {
  if (!banner) return null;
  const displayProducts = products.slice(0, 3);
  const featuredProduct = displayProducts[0];
  const subProducts = displayProducts.slice(1, 3);

  const getPrimaryImage = (p: ProductType) => {
    try { return JSON.parse(p.images)[0] || "/placeholder.png"; } 
    catch { return "/placeholder.png"; }
  };

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

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Large Editorial Image */}
          <div 
            className={`relative aspect-[4/5] bg-white overflow-hidden group rounded-3xl border border-gray-200 shadow-sm ${isEditMode ? 'ring-2 ring-transparent hover:ring-[#C9A227]/50 transition-all cursor-pointer' : ''}`}
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
            <div className="absolute inset-0 bg-black/20 flex flex-col justify-end p-10 md:p-16">
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
                  className={`text-white/90 text-sm tracking-wide mb-8 max-w-md font-light ${isEditMode ? 'outline-dashed outline-1 outline-white/30 hover:outline-white p-1' : ''}`}
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

          {/* Right Column - Product List */}
          <div className="flex flex-col gap-12">
            
            {/* Featured Product */}
            {featuredProduct && (
              <div className="flex flex-col md:flex-row gap-8 items-center group">
                <Link href={`/product/${featuredProduct.slug}`} className="relative w-full md:w-1/2 aspect-square bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                  <Image 
                    src={getPrimaryImage(featuredProduct)} 
                    alt={featuredProduct.name} 
                    fill 
                    className="object-contain mix-blend-multiply p-8 group-hover:scale-105 transition-transform duration-700" 
                  />
                </Link>
                <div className="w-full md:w-1/2 flex flex-col justify-center">
                  <span className="text-[#C9A227] text-[12px] font-black uppercase tracking-[0.2em] mb-3 font-sans">Featured</span>
                  <Link href={`/product/${featuredProduct.slug}`} className="hover:opacity-80 transition-opacity">
                    <h4 className="text-[28px] font-black text-black mb-3 leading-snug">{featuredProduct.name}</h4>
                  </Link>
                  <p className="text-[18px] text-[#C9A227] font-black mb-6">{fmtCurrency(featuredProduct.price)}</p>
                  <Link href={`/product/${featuredProduct.slug}`} className="inline-flex items-center gap-3 bg-black hover:bg-[#C9A227] border border-black hover:border-[#C9A227] shadow-sm hover:shadow-none hover:translate-y-1 text-white hover:text-black text-[13px] font-black uppercase tracking-[0.1em] px-8 py-4 rounded-xl transition-all self-start">
                    Shop Now
                  </Link>
                </div>
              </div>
            )}

            <div className="h-[1px] w-full bg-[#f4f4f5]"></div>

            {/* Sub Products Grid */}
            <div className="grid grid-cols-2 gap-8">
              {subProducts.map((p) => (
                <Link key={p.id} href={`/product/${p.slug}`} className="flex flex-col group">
                  <div className="relative aspect-square bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-none hover:translate-y-1 transition-all duration-300 overflow-hidden mb-4">
                    <Image 
                      src={getPrimaryImage(p)} 
                      alt={p.name} 
                      fill 
                      className="object-contain mix-blend-multiply p-6 group-hover:scale-105 transition-transform duration-700" 
                    />
                  </div>
                  <h5 className="text-[15px] font-black text-black mb-1 group-hover:opacity-60 transition-opacity line-clamp-1">{p.name}</h5>
                  <p className="text-[14px] text-[#C9A227] font-black">{fmtCurrency(p.price)}</p>
                </Link>
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
