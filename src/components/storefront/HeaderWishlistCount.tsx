'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { getWishlist } from '@/lib/wishlist';

export default function HeaderWishlistCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Initial fetch
    setCount(getWishlist().length);

    // Event listener for updates
    const handleUpdate = () => {
      setCount(getWishlist().length);
    };

    window.addEventListener('wishlist-update', handleUpdate);
    return () => {
      window.removeEventListener('wishlist-update', handleUpdate);
    };
  }, []);

  return (
    <Link href="/wishlist" className="relative text-black hover:text-[#C9A227] transition-colors" aria-label="Wishlist">
      <Heart className="w-6 h-6" strokeWidth={2} />
      <span className="absolute -top-1.5 -right-2 bg-[#C9A227] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-gray-200">
        {count}
      </span>
    </Link>
  );
}
