"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cx } from "@/lib/utils";
import { 
  Menu,
  X,
  LayoutDashboard, 
  LineChart,
  ShoppingBag, 
  Package, 
  Tags, 
  ImageIcon, 
  Search, 
  FileText, 
  CreditCard, 
  Star, 
  Truck, 
  Settings, 
  Store, 
  Mail,
  LogOut,
  History,
  UserCircle,
  Ticket,
  Palette
} from "lucide-react";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { href: "/admin/analytics", label: "Analytics", icon: <LineChart size={18} /> },
  { href: "/admin/orders", label: "Orders", icon: <ShoppingBag size={18} /> },
  { href: "/admin/products", label: "Products", icon: <Package size={18} /> },
  { href: "/admin/categories", label: "Categories", icon: <Tags size={18} /> },
  { href: "/admin/banners", label: "Banners", icon: <ImageIcon size={18} /> },
  { href: "/admin/celebrities", label: "Celebrities", icon: <UserCircle size={18} /> },
  { href: "/admin/seo", label: "SEO & Pixels", icon: <Search size={18} /> },
  { href: "/admin/articles", label: "Articles", icon: <FileText size={18} /> },
  { href: "/admin/discounts", label: "Discounts", icon: <Ticket size={18} /> },
  { href: "/admin/payments", label: "Payments", icon: <CreditCard size={18} /> },
  { href: "/admin/recovery", label: "Cart Recovery", icon: <History size={18} /> },
  { href: "/admin/reviews", label: "Reviews", icon: <Star size={18} /> },
  { href: "/admin/logistics", label: "Logistics", icon: <Truck size={18} /> },
  { href: "/admin/settings", label: "Settings", icon: <Settings size={18} /> },
  { href: "/admin/settings/storefront", label: "Storefront UI", icon: <Store size={18} /> },
  { href: "/admin/settings/email", label: "Email (Brevo)", icon: <Mail size={18} /> }
];

export default function Sidebar({ storeName, userName }: { storeName: string; userName: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/adminlogin");
    router.refresh();
  }

  return (
    <>
      <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#DFD1A5]/30 bg-white flex items-center justify-center shadow-md">
            <img 
              src="/uploads/logo.png" 
              alt="DEVINE ORA" 
              className="absolute w-[185%] h-[185%] object-cover object-center max-w-none" 
            />
          </div>
          <span className="text-[12px] font-black tracking-widest uppercase font-heading text-black">DEVINE ORA</span>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-gray-600">
          <Menu size={24} />
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsOpen(false)} />
      )}

      <aside className={cx(
        "w-64 shrink-0 bg-[#fcfcfc] text-[#111827] flex flex-col h-[100dvh] lg:h-screen lg:sticky lg:top-0 border-r border-gray-200/60 shadow-[4px_0_24px_rgba(0,0,0,0.01)] z-50 transition-transform duration-300",
        isOpen ? "fixed inset-y-0 left-0 translate-x-0" : "fixed inset-y-0 left-0 -translate-x-full lg:static lg:translate-x-0"
      )}>
        <div className="flex items-center justify-between px-6 py-6 border-b border-gray-100 relative">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#DFD1A5]/30 bg-white flex items-center justify-center shadow-md">
              <img 
                src="/uploads/logo.png" 
                alt="DEVINE ORA" 
                className="absolute w-[185%] h-[185%] object-cover object-center max-w-none" 
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold tracking-widest text-[#111827] uppercase font-heading">DEVINE ORA</span>
              <span className="text-[7px] font-bold tracking-widest text-[#C9A227] uppercase">LUXURY WATCHES</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-gray-400 hidden lg:block">Admin</span>
            <button onClick={() => setIsOpen(false)} className="lg:hidden p-1 text-gray-500">
              <X size={20} />
            </button>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {NAV.map((item) => {
            const isActive = pathname.startsWith(item.href) && (item.href !== "/admin" || pathname === "/admin");
            return (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cx(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-300",
                  isActive 
                    ? "bg-gray-100/80 text-[#0f172a] shadow-sm font-semibold" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <div className={cx("w-[18px] h-[18px] shrink-0 transition-colors", isActive ? "text-brand" : "text-gray-400")}>{item.icon}</div>
                {item.label}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-5 border-t border-gray-100 bg-gray-50/50 space-y-3">
          <div className="px-4 py-3 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase mb-1">Store User</div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-brand/10 text-brand flex items-center justify-center text-xs font-bold shrink-0">{userName.charAt(0).toUpperCase()}</div>
              <div className="text-[13px] font-semibold text-gray-800 truncate">{userName}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 rounded-lg text-[13px] font-semibold text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2">
            <LogOut className="w-4 h-4 shrink-0 text-red-400" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
