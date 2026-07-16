"use client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/customer/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button 
      onClick={handleLogout}
      className="w-full flex items-center gap-3 p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition text-[13px] font-bold"
    >
      <LogOut className="w-5 h-5" /> Sign Out
    </button>
  );
}
