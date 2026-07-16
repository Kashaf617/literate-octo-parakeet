"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Filter, SlidersHorizontal, X } from "lucide-react";

export default function SearchFilters({ categories }: { categories: any[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  
  const currentCategory = searchParams.get("category") || "";
  const currentMinPrice = searchParams.get("minPrice") || "";
  const currentMaxPrice = searchParams.get("maxPrice") || "";
  const currentSort = searchParams.get("sort") || "featured";

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/search?${params.toString()}`);
  }

  function handlePriceSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const min = fd.get("minPrice") as string;
    const max = fd.get("maxPrice") as string;
    const params = new URLSearchParams(searchParams.toString());
    if (min) params.set("minPrice", min); else params.delete("minPrice");
    if (max) params.set("maxPrice", max); else params.delete("maxPrice");
    router.push(`/search?${params.toString()}`);
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="md:hidden flex items-center justify-center gap-2 w-full bg-white border border-line rounded-xl py-3 font-bold text-ink mb-6"
      >
        <Filter className="w-5 h-5" /> Filters & Sorting
      </button>

      <div className={`fixed inset-0 bg-black/50 z-50 transition-opacity md:hidden ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={() => setIsOpen(false)} />
      
      <aside className={`fixed md:static inset-y-0 left-0 w-[280px] bg-white md:bg-transparent z-50 md:z-0 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} overflow-y-auto p-6 md:p-0 border-r border-line md:border-none flex-shrink-0 h-full md:h-auto`}>
        
        <div className="flex items-center justify-between md:hidden mb-6">
          <h2 className="text-lg font-bold flex items-center gap-2"><SlidersHorizontal className="w-5 h-5" /> Filters</h2>
          <button onClick={() => setIsOpen(false)}><X className="w-6 h-6" /></button>
        </div>

        <div className="space-y-8">
          {/* Categories */}
          <div>
            <h3 className="text-[12px] font-bold uppercase tracking-widest text-ink mb-4">Categories</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="radio" 
                  name="category"
                  checked={currentCategory === ""}
                  onChange={() => updateFilter("category", "")}
                  className="w-4 h-4 text-brand focus:ring-brand accent-brand cursor-pointer" 
                />
                <span className={`text-[14px] ${currentCategory === "" ? "font-bold text-ink" : "text-sub group-hover:text-ink transition-colors"}`}>
                  All Products
                </span>
              </label>
              {categories.map(cat => (
                <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="category"
                    checked={currentCategory === cat.slug}
                    onChange={() => updateFilter("category", cat.slug)}
                    className="w-4 h-4 text-brand focus:ring-brand accent-brand cursor-pointer" 
                  />
                  <span className={`text-[14px] ${currentCategory === cat.slug ? "font-bold text-ink" : "text-sub group-hover:text-ink transition-colors"}`}>
                    {cat.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="pt-6 border-t border-line">
            <h3 className="text-[12px] font-bold uppercase tracking-widest text-ink mb-4">Price Range (PKR)</h3>
            <form onSubmit={handlePriceSubmit} className="flex items-center gap-3">
              <input 
                name="minPrice"
                type="number" 
                defaultValue={currentMinPrice}
                placeholder="Min" 
                className="w-full bg-white border border-line rounded-lg px-3 py-2 text-[14px] text-ink outline-none focus:border-brand transition-colors" 
              />
              <span className="text-sub">-</span>
              <input 
                name="maxPrice"
                type="number" 
                defaultValue={currentMaxPrice}
                placeholder="Max" 
                className="w-full bg-white border border-line rounded-lg px-3 py-2 text-[14px] text-ink outline-none focus:border-brand transition-colors" 
              />
              <button type="submit" className="bg-ink text-white p-2 rounded-lg hover:bg-brand transition-colors">
                <ChevronRightIcon />
              </button>
            </form>
          </div>

          {/* Sorting */}
          <div className="pt-6 border-t border-line">
            <h3 className="text-[12px] font-bold uppercase tracking-widest text-ink mb-4">Sort By</h3>
            <select 
              value={currentSort}
              onChange={(e) => updateFilter("sort", e.target.value)}
              className="w-full bg-white border border-line rounded-lg px-4 py-3 text-[14px] text-ink outline-none focus:border-brand transition-colors appearance-none cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </aside>
    </>
  );
}

function ChevronRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}
