'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { fmtCurrency } from '@/lib/utils';
import { getCart } from '@/lib/cart';

export default function HeaderCartCount() {
  const [cart, setCart] = useState<any[]>([]);

  const loadCart = () => {
    setCart(getCart());
  };

  useEffect(() => {
    loadCart();

    window.addEventListener('cart-update', loadCart);
    return () => {
      window.removeEventListener('cart-update', loadCart);
    };
  }, []);

  const qty = cart.reduce((sum: number, item: any) => sum + item.qty, 0);
  const total = cart.reduce((sum: number, item: any) => sum + item.price * item.qty, 0);

  return (
    <Link href="/cart" className="flex items-center gap-3 text-black group" aria-label="Cart">
      <div className="relative group-hover:text-[#C9A227] transition-colors">
        <ShoppingCart className="w-6 h-6" strokeWidth={2} />
        <span className="absolute -top-1.5 -right-2 bg-[#C9A227] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-gray-200">
          {qty}
        </span>
      </div>
      <div className="hidden sm:block text-left">
        <span className="text-black/60 font-black block text-[11px] uppercase tracking-widest mb-0.5">Cart</span>
        <span className="font-black text-[14px] group-hover:text-[#C9A227] transition-colors tracking-wide">
          PKR {total.toLocaleString()}
        </span>
      </div>
    </Link>
  );
}
