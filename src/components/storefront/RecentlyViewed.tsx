"use client";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fmtCurrency } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice: number | null;
  images: string;
}

export default function RecentlyViewed({ products }: { products: Product[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(direction: "left" | "right") {
    if (!scrollRef.current) return;
    const amount = direction === "left" ? -280 : 280;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  }

  if (products.length === 0) return null;

  return (
    <section className="py-8" id="recently-viewed">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex items-center justify-between mb-5 border-b border-gray-200 pb-4">
          <h2 className="text-[24px] font-black text-black uppercase tracking-widest">Recently Viewed</h2>
          <div className="flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-[#ff5a1f] hover:text-white hover:translate-y-[-2px] hover:shadow-sm transition-all bg-white"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-[#ff5a1f] hover:text-white hover:translate-y-[-2px] hover:shadow-sm transition-all bg-white"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((p, i) => {
            const img = JSON.parse(p.images || "[]")[0] || "https://picsum.photos/seed/rv" + i + "/300/300";
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={`/product/${p.slug}`}
                  className="shrink-0 w-[200px] bg-white border border-gray-200 rounded-3xl overflow-hidden group hover:shadow-sm hover:translate-y-[-4px] transition-all block mb-2"
                >
                  <div className="relative aspect-square bg-white overflow-hidden border-b border-gray-200">
                    <Image
                      src={img}
                      alt={p.name}
                      fill
                      className="object-cover product-image-zoom"
                      sizes="200px"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-[14px] font-black text-black line-clamp-1">{p.name}</p>
                    <div className="mt-2 flex items-baseline gap-1.5">
                      <span className="text-[16px] font-black text-[#ff5a1f]">{fmtCurrency(p.price, "PKR")}</span>
                      {p.comparePrice && (
                        <span className="text-[12px] text-black/40 font-bold line-through">{fmtCurrency(p.comparePrice, "PKR")}</span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
