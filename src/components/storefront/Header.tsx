import Link from "next/link";
import { Search, Heart, ShoppingCart, ChevronDown, User } from "lucide-react";
import { getCustomerSession } from "@/lib/auth";
import LiveSearchBar from "./LiveSearchBar";
import MobileSidebar from "./MobileSidebar";
import HeaderWishlistCount from "./HeaderWishlistCount";
import DesktopNav from "./DesktopNav";
import HeaderCartCount from "./HeaderCartCount";

export default async function Header({ 
  storeName, tagline, supportPhone, freeShippingText, marqueeText = "Follow us and get a chance to win 80% off", marqueeSpeed = 20
}: { 
  storeName: string; tagline: string; supportPhone: string; freeShippingText: string; marqueeText?: string; marqueeSpeed?: number;
}) {
  const session = await getCustomerSession();

  return (
    <>
      {/* Top Utility Bar - Ultra Premium Dark */}
      <div className="hidden md:block bg-black text-[#DFD1A5] text-[12px] uppercase tracking-widest font-black overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-6 h-[40px] flex items-center justify-between relative">

          
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
            <div 
              className="text-[#DFD1A5] whitespace-nowrap inline-block animate-marquee"
              style={{ animationDuration: `${marqueeSpeed}s` }}
            >
              <span className="mr-12">{marqueeText}</span>
              <span className="mr-12">{marqueeText}</span>
              <span className="mr-12">{marqueeText}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-[9999] shadow-sm">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex items-center justify-between gap-2 sm:gap-4 lg:gap-8 py-5">
          <MobileSidebar supportPhone={supportPhone} />
          
          <Link href="/" className="flex flex-col items-start shrink-0 select-none group">
            <span className="font-heading text-lg sm:text-2xl font-bold tracking-widest text-black group-hover:text-gold transition-colors duration-200">
              DEVINE ORA
            </span>
            <span className="text-[9px] uppercase tracking-[0.2em] font-sans text-gold font-bold -mt-0.5">
              Luxury Watchmaking
            </span>
          </Link>

          {/* Minimalist Search Bar */}
          <LiveSearchBar />

          <div className="flex items-center gap-3 lg:gap-8 shrink-0 ml-auto">
            <div className="hidden lg:flex items-center gap-3">
              <div className="text-right">
                <span className="text-[11px] text-black/60 font-black uppercase tracking-widest block mb-0.5">24/7 Support</span>
                <b className="block text-black text-[14px] font-black tracking-wide">{supportPhone}</b>
              </div>
            </div>

            <div className="flex items-center gap-3 lg:gap-6">
              <Link href={session ? "/account" : "/login"} className="relative text-black hover:text-[#C9A227] transition-colors flex items-center gap-2" aria-label="Account">
                <User className="w-6 h-6" strokeWidth={2} />
                <span className="hidden sm:block text-[13px] font-black">{session ? "Account" : "Sign In"}</span>
              </Link>
              <HeaderWishlistCount />
              <HeaderCartCount />
            </div>
          </div>
        </div>

        {/* Navigation Bar - Clean & Minimal */}
        <nav className="hidden md:block border-t border-gray-100 bg-white">
          <div className="max-w-[1280px] mx-auto px-6 h-[50px] flex items-center justify-between">
            <DesktopNav />
            
            <div className="flex items-center gap-2 cursor-pointer text-black/60 hover:text-black transition-colors">
              <span className="text-[12px] font-black uppercase tracking-widest">PKR</span>
              <ChevronDown className="w-4 h-4" strokeWidth={2} />
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
