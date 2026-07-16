'use client';

import { useEffect, useState } from 'react';
import ProductCard from "@/components/storefront/ProductCard";
import { getWishlist, WishlistItem } from "@/lib/wishlist";

export default function WishlistContent() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setItems(getWishlist());
    setLoading(false);

    const handleUpdate = () => {
      setItems(getWishlist());
    };
    window.addEventListener('wishlist-update', handleUpdate);
    return () => {
      window.removeEventListener('wishlist-update', handleUpdate);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F9F9F9] pt-32 pb-24 font-sans text-black">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex flex-col md:flex-row items-baseline justify-between mb-12 border-b border-gray-100 pb-6">
          <div>
            <span className="text-[#C9A227] text-xs font-black uppercase tracking-[0.2em] mb-2 block">CURATED FAVORITES</span>
            <h1 className="text-4xl md:text-5xl font-black font-heading uppercase tracking-tight">My Favorites</h1>
          </div>
          <p className="text-gray-500 font-medium text-sm mt-2 md:mt-0">
            {items.length} {items.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>

        {loading ? (
          <div className="py-24 text-center">
            <div className="w-10 h-10 border-2 border-[#C9A227] border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#DFD1A5]/40 shadow-lg p-16 text-center max-w-xl mx-auto">
            <div className="w-16 h-16 bg-[#F2E8CB]/40 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">🖤</span>
            </div>
            <h2 className="text-2xl font-black font-heading uppercase text-black mb-3">Your Wishlist is Empty</h2>
            <p className="text-gray-500 font-light text-sm mb-8 max-w-sm mx-auto leading-relaxed">
              Explore our exquisite collections of luxury timepieces and save your absolute favorites here.
            </p>
            <a 
              href="/search" 
              className="inline-block bg-black hover:bg-[#C9A227] hover:text-black border border-black hover:border-[#C9A227] text-white font-black text-xs uppercase tracking-widest px-10 py-4 rounded-xl transition-all duration-300 shadow-sm"
            >
              Explore Collection
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
