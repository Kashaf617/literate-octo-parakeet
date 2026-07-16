"use client";
import { useState, useEffect, useRef } from "react";
import { Search, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LiveSearchBar({ isMobile = false }: { isMobile?: boolean }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.products || []);
        setIsOpen(true);
      } catch (err) {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  }

  return (
    <div ref={wrapperRef} className={`flex-1 relative mx-auto z-50 w-full ${isMobile ? 'block' : 'hidden lg:block max-w-[500px]'}`}>
      <form onSubmit={handleSubmit} className="w-full flex border border-[#e2e8f0] rounded-full overflow-hidden bg-[#f8fafc] h-12 items-center px-4 transition-all focus-within:border-[#0b1221] focus-within:bg-white focus-within:shadow-sm">
        <Search className="w-4 h-4 text-[#94a3b8]" strokeWidth={2} />
        <input 
          name="q" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (results.length > 0) setIsOpen(true); }}
          placeholder="Search for premium products..." 
          className="flex-1 bg-transparent border-none px-3 py-2 text-[14px] text-[#0b1221] placeholder:text-[#94a3b8] outline-none min-w-0" 
          autoComplete="off"
        />
        {loading && <Loader2 className="w-4 h-4 text-[#94a3b8] animate-spin" />}
      </form>

      {isOpen && (
        <div className="absolute top-14 left-0 right-0 bg-white border border-line rounded-2xl shadow-xl overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
          {results.length > 0 ? (
            <>
              {results.map((product) => (
                <Link 
                  key={product.id} 
                  href={`/product/${product.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 p-3 hover:bg-gray-50 transition"
                >
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-200" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-bold text-ink truncate">{product.name}</div>
                    {product.category && (
                      <div className="text-[11px] text-sub uppercase tracking-wider">{product.category.name}</div>
                    )}
                  </div>
                  <div className="font-bold text-[13px] text-brand">
                    PKR {product.price.toLocaleString()}
                  </div>
                </Link>
              ))}
              <div className="p-3 border-t border-line mt-2">
                <button 
                  onClick={handleSubmit}
                  className="w-full text-center text-[12px] font-bold uppercase tracking-wider text-brand hover:text-brand-dark transition-colors"
                >
                  View all results for "{query}"
                </button>
              </div>
            </>
          ) : (
            <div className="p-6 text-center text-sub text-[13px]">
              No products found for "{query}".
            </div>
          )}
        </div>
      )}
    </div>
  );
}
