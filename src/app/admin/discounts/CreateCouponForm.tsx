"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function CreateCouponForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const data = {
      code: fd.get("code") as string,
      type: fd.get("type") as string,
      value: Number(fd.get("value")),
      minSpend: fd.get("minSpend") ? Number(fd.get("minSpend")) : null,
      usageLimit: fd.get("usageLimit") ? Number(fd.get("usageLimit")) : null,
    };

    const res = await fetch("/api/admin/discounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    setLoading(false);
    if (res.ok) {
      e.currentTarget.reset();
      router.refresh();
    } else {
      const err = await res.json();
      alert(err.error || "Failed to create coupon");
    }
  }

  return (
    <div className="admin-card">
      <div className="p-5 border-b border-line">
        <h3 className="font-extrabold text-ink">Create New Coupon</h3>
      </div>
      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-widest text-[#64748b] mb-1.5">Coupon Code</label>
          <input required name="code" type="text" placeholder="e.g. SUMMER20" className="w-full border border-line rounded-lg p-2.5 text-sm uppercase font-mono font-bold outline-none focus:border-brand" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-[#64748b] mb-1.5">Type</label>
            <select required name="type" className="w-full border border-line rounded-lg p-2.5 text-sm outline-none focus:border-brand bg-white">
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount (PKR)</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-[#64748b] mb-1.5">Value</label>
            <input required name="value" type="number" step="0.01" placeholder="20" className="w-full border border-line rounded-lg p-2.5 text-sm outline-none focus:border-brand" />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-widest text-[#64748b] mb-1.5">Min Spend (Optional)</label>
          <input name="minSpend" type="number" placeholder="0" className="w-full border border-line rounded-lg p-2.5 text-sm outline-none focus:border-brand" />
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-widest text-[#64748b] mb-1.5">Usage Limit (Optional)</label>
          <input name="usageLimit" type="number" placeholder="e.g. 100" className="w-full border border-line rounded-lg p-2.5 text-sm outline-none focus:border-brand" />
        </div>

        <button disabled={loading} className="w-full bg-brand text-white font-bold text-[13px] uppercase tracking-widest py-3 rounded-lg hover:bg-brand-dark transition-colors flex items-center justify-center">
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Create Coupon
        </button>
      </form>
    </div>
  );
}
