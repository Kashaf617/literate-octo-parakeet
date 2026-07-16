"use client";
import { useState } from "react";
import { Check, X, Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ReviewActions({ reviewId, currentStatus }: { reviewId: string; currentStatus: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleUpdate(status: string) {
    setLoading(true);
    await fetch(`/api/admin/reviews/${reviewId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    setLoading(false);
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this review?")) return;
    setLoading(true);
    await fetch(`/api/admin/reviews/${reviewId}`, { method: "DELETE" });
    setLoading(false);
    router.refresh();
  }

  if (loading) return <Loader2 className="w-5 h-5 text-gray-400 animate-spin ml-auto" />;

  return (
    <div className="flex items-center justify-end gap-2">
      {currentStatus !== "published" && (
        <button 
          onClick={() => handleUpdate("published")}
          title="Approve & Publish"
          className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
        >
          <Check className="w-5 h-5" />
        </button>
      )}
      
      {currentStatus !== "rejected" && (
        <button 
          onClick={() => handleUpdate("rejected")}
          title="Reject"
          className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      <button 
        onClick={handleDelete}
        title="Delete"
        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
}
