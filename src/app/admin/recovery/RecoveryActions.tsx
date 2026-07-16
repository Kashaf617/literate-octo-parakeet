"use client";
import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RecoveryActions() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSendEmails() {
    if (!confirm("This will send reminder emails to all abandoned carts. Proceed?")) return;
    setLoading(true);
    const res = await fetch("/api/admin/recover-carts", { method: "POST" });
    const data = await res.json();
    setLoading(false);
    
    if (data.success) {
      alert(`Successfully sent ${data.count} recovery emails!`);
      router.refresh();
    } else {
      alert("Failed to send emails");
    }
  }

  return (
    <button 
      onClick={handleSendEmails}
      disabled={loading}
      className="bg-brand text-white text-[13px] font-bold uppercase tracking-widest px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-brand-dark transition-colors disabled:opacity-50"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
      {loading ? "Sending..." : "Send Recovery Emails"}
    </button>
  );
}
