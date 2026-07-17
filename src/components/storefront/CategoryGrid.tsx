"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { CategoryType } from "@/lib/types";

export default function CategoryGrid({ categories, title, isEditMode = false }: { categories: CategoryType[], title?: string, isEditMode?: boolean }) {
  if (categories.length === 0) return null;

  const handleTextUpdate = async (id: string, field: string, value: string) => {
    if (!isEditMode) return;
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        credentials: "include",
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value })
      });
      if (res.ok) {
        window.location.reload();
      } else {
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
      console.log("CategoryGrid: uploading file:", file.name);
      const res = await fetch("/api/admin/upload", { credentials: "include", method: "POST", body: fd });
      if (res.ok) {
        const { url } = await res.json();
        console.log("CategoryGrid: upload success, saving category image url:", url);
        const saveRes = await fetch(`/api/admin/categories/${id}`, {
          credentials: "include",
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: url })
        });
        if (saveRes.ok) {
          window.location.reload();
        } else {
          alert(`Failed to save category image: ${await saveRes.text()}`);
        }
      } else {
        alert(`Upload failed: ${await res.text()}`);
      }
    } catch (err: any) {
      console.error(err);
      alert(`Upload error: ${err.message}`);
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
        console.log("CategoryGrid: drag-drop uploading file:", file.name);
        const res = await fetch("/api/admin/upload", { credentials: "include", method: "POST", body: fd });
        if (res.ok) {
          const { url } = await res.json();
          console.log("CategoryGrid: drag-drop upload success, saving url:", url);
          const saveRes = await fetch(`/api/admin/categories/${id}`, {
            credentials: "include",
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: url })
          });
          if (saveRes.ok) {
            window.location.reload();
          } else {
            alert(`Failed to save dropped category image: ${await saveRes.text()}`);
          }
        } else {
          alert(`Drop upload failed: ${await res.text()}`);
        }
      } catch (err: any) {
        console.error(err);
        alert(`Drop upload error: ${err.message}`);
      }
      return;
    }

    const url = e.dataTransfer.getData("text/plain");
    let finalUrl = url;
    if (url && url.startsWith("http")) {
      try { finalUrl = new URL(url).pathname; } catch (e) {}
    }
    if (finalUrl && finalUrl.startsWith("/")) {
      await fetch(`/api/admin/categories/${id}`, {
        credentials: "include",
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: finalUrl })
      });
      window.location.reload();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (isEditMode) e.preventDefault();
  };

  return (
    <section className="pt-6 pb-10 bg-transparent" id="categories">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex flex-col items-center mb-6 text-center">
          <span className="inline-block text-[#C9A227] text-[13px] font-black uppercase tracking-[0.3em] mb-3">
            Explore Collections
          </span>
          <h2 className="text-[36px] md:text-[48px] font-black text-black tracking-tight">
            {title || "Popular Categories"}
          </h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 md:gap-5">
          {categories.map((c, i) => {
             const imgSrc = c.image || "https://picsum.photos/seed/" + c.slug + "/300/400";
             const CardContent = (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
                  whileHover={{ y: -8 }}
                  onDrop={(e: any) => handleDrop(e, c.id)}
                  onDragOver={handleDragOver}
                  onClick={(e: any) => { 
                    if(isEditMode) {
                      e.preventDefault(); 
                      if ((e.target as HTMLElement).tagName !== 'SPAN') {
                        document.getElementById(`upload-cat-${c.id}`)?.click();
                      }
                    }
                  }}
                  className={`group relative aspect-[3/4] rounded-3xl overflow-hidden bg-white cursor-pointer border border-gray-200 shadow-sm hover:shadow-[0_0px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 transition-all duration-300 ${isEditMode ? 'ring-2 ring-transparent hover:ring-[#C9A227]/50' : ''}`}
                >
                  <input type="file" id={`upload-cat-${c.id}`} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, c.id)} />
                  {isEditMode && <div className="absolute top-2 right-2 z-50 bg-black/70 text-white text-[9px] uppercase font-bold px-1.5 py-0.5 rounded shadow-lg pointer-events-none">Click or Drop image</div>}
                  {/* Background Image */}
                  <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
                    <Image 
                      src={imgSrc} 
                      alt={c.name} 
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100" 
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 14vw"
                    />
                  </div>
                  
                  {/* Premium Solid Overlay */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-[#C9A227]/80 transition-colors duration-300"></div>
                  
                  {/* Content inside card */}
                  <div className="absolute bottom-0 left-0 w-full p-4 flex flex-col items-center text-center translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <span 
                      contentEditable={isEditMode}
                      suppressContentEditableWarning
                      onBlur={(e) => handleTextUpdate(c.id, 'name', e.currentTarget.textContent || "")}
                      className={`block text-[15px] md:text-[18px] font-black text-white tracking-wide mb-1 ${isEditMode ? 'outline-dashed outline-1 outline-white/30 hover:outline-white p-1' : ''}`}
                    >
                      {c.name}
                    </span>
                    {c._count && (
                      <span className="block text-[12px] text-white font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                        {c._count.products} items
                      </span>
                    )}
                  </div>
                </motion.div>
             );

             return isEditMode ? (
               <div key={c.id}>{CardContent}</div>
             ) : (
               <Link href={`/category/${c.slug}`} key={c.id}>
                 {CardContent}
               </Link>
             );
          })}
        </div>
      </div>
    </section>
  );
}
