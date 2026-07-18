"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";

export default function DeleteCouponButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/discounts?id=${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        router.refresh();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to delete coupon");
      }
    } catch (e) {
      alert("An error occurred while deleting the coupon.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button 
      onClick={handleDelete} 
      disabled={loading}
      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-all disabled:opacity-50"
      title="Delete Coupon"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </button>
  );
}
