import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getSetting, DEFAULT_SETTINGS } from "@/lib/settings";

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="#25D366" className="w-10 h-10 drop-shadow-xl hover:scale-110 transition-transform cursor-pointer">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);

export default async function Footer({ storeName }: { storeName: string }) {
  const settings = await getSetting("general", DEFAULT_SETTINGS.general) as any;
  const whatsappNumber = settings.company_whatsapp || "+923707765435";
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, "");
  return (
    <footer className="bg-[#1a1514] text-[#f8f9fa] pt-24 pb-12 relative overflow-hidden" id="footer">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Top Minimalist Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 mb-24">
          
          {/* Brand & Newsletter (Col 1-5) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <Link href="/" className="flex flex-col items-start select-none group mb-8">
                <span className="font-heading text-lg sm:text-2xl font-bold tracking-widest text-white group-hover:text-gold transition-colors duration-200">
                  DEVINE ORA
                </span>
                <span className="text-[9px] uppercase tracking-[0.2em] font-sans text-gold font-bold -mt-0.5">
                  Luxury Watchmaking
                </span>
              </Link>
              <p className="text-gray-400 text-[14px] leading-relaxed max-w-sm mb-12 font-light">
                DEVINE ORA crafts premium luxury timepieces. Experience precision, heritage, and timeless design.
              </p>
            </div>
            
            <div className="max-w-md">
              <h4 className="text-[11px] font-black uppercase tracking-[0.25em] text-[#C9A227] mb-6">Newsletter</h4>
              <div className="flex border-b border-white/20 pb-3 group focus-within:border-[#C9A227] transition-colors">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-transparent border-none outline-none w-full text-[14px] text-white placeholder:text-gray-500 font-light"
                />
                <button className="text-gray-500 group-focus-within:text-white transition-colors">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Spacer */}
          <div className="hidden lg:block lg:col-span-1"></div>

          {/* Links (Col 6-12) */}
          <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-10">
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-[0.25em] text-[#C9A227] mb-8">Shop</h4>
              <ul className="space-y-5">
                <li><Link href="/category/luxury-watches" className="text-[14px] text-gray-300 hover:text-[#C9A227] transition-colors font-medium">Luxury Watches</Link></li>
                <li><Link href="/category/classic-watches" className="text-[14px] text-gray-300 hover:text-[#C9A227] transition-colors font-medium">Classic Watches</Link></li>
                <li><Link href="/category/smart-watches" className="text-[14px] text-gray-300 hover:text-[#C9A227] transition-colors font-medium">Smart Watches</Link></li>
                <li><Link href="/category/chronographs" className="text-[14px] text-gray-300 hover:text-[#C9A227] transition-colors font-medium">Chronographs</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-[0.25em] text-[#C9A227] mb-8">Support</h4>
              <ul className="space-y-5">
                <li><Link href="/contact" className="text-[14px] text-gray-300 hover:text-[#C9A227] transition-colors font-medium">Contact</Link></li>
                <li><Link href="/faqs" className="text-[14px] text-gray-300 hover:text-[#C9A227] transition-colors font-medium">FAQs</Link></li>
                <li><Link href="/shipping-policy" className="text-[14px] text-gray-300 hover:text-[#C9A227] transition-colors font-medium">Shipping</Link></li>
                <li><Link href="/return-policy" className="text-[14px] text-gray-300 hover:text-[#C9A227] transition-colors font-medium">Returns</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-[0.25em] text-[#C9A227] mb-8">Social</h4>
              <ul className="space-y-5">
                <li><a href="#" className="text-[14px] text-gray-300 hover:text-[#C9A227] transition-colors font-medium">Instagram</a></li>
                <li><a href="#" className="text-[14px] text-gray-300 hover:text-[#C9A227] transition-colors font-medium">Twitter</a></li>
                <li><a href="#" className="text-[14px] text-gray-300 hover:text-[#C9A227] transition-colors font-medium">Facebook</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-gray-500 text-[12px] font-medium tracking-wide">
            &copy; {new Date().getFullYear()} {storeName}. All rights reserved.
          </div>
          <div className="flex gap-8">
            <Link href="/terms" className="text-gray-500 hover:text-white text-[11px] font-black uppercase tracking-[0.15em] transition-colors">Terms</Link>
            <Link href="/privacy" className="text-gray-500 hover:text-white text-[11px] font-black uppercase tracking-[0.15em] transition-colors">Privacy</Link>
          </div>
        </div>
        
      </div>

      {/* Floating WhatsApp Icon - Styled as fixed on viewport */}
      <a 
        href={`https://wa.me/${cleanNumber}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-24 lg:bottom-6 right-6 z-[999999] flex flex-col items-center gap-2 group hover:scale-105 transition-all duration-300"
      >
        <span className="bg-white text-black text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded shadow-2xl border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity translate-y-1 group-hover:translate-y-0 duration-300 pointer-events-none">
          Send Screenshot
        </span>
        <div className="w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 cursor-pointer">
          <svg viewBox="0 0 24 24" fill="#ffffff" className="w-8 h-8">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
          </svg>
        </div>
      </a>
    </footer>
  );
}
