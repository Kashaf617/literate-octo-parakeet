"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const ORDER_STATUSES = ["processing", "confirmed", "packed", "shipped", "delivered", "cancelled", "returned"];
const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"];
const COURIERS = [
  { value: "", label: "— Not assigned —" },
  { value: "leopards", label: "Leopards Courier" },
  { value: "tcs", label: "TCS" },
  { value: "postex", label: "PostEx" },
  { value: "mnp", label: "M&P (Muller & Phipps)" },
  { value: "trax", label: "Trax" }
];

export default function OrderActions({ order }: { order: any }) {
  const router = useRouter();
  const [orderStatus, setOrderStatus] = useState(order.orderStatus);
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus);
  const [courierProvider, setCourierProvider] = useState(order.courierProvider || "");
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setSaving(true);
    setSaved(false);
    const res = await fetch(`/api/admin/orders/${order.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderStatus, paymentStatus, courierProvider, trackingNumber })
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 2000);
    }
  }

  return (
    <div className="admin-card space-y-4">
      <h3 className="font-extrabold text-ink">Fulfillment</h3>
      <div>
        <label className="admin-label">Order Status</label>
        <select className="admin-select capitalize" value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)}>
          {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div>
        <label className="admin-label">Payment Status</label>
        <select className="admin-select capitalize" value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
          {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div>
        <label className="admin-label">Courier / Logistics Partner</label>
        <select className="admin-select" value={courierProvider} onChange={(e) => setCourierProvider(e.target.value)}>
          {COURIERS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </div>
      <div>
        <label className="admin-label">Tracking / Consignment Number</label>
        <input className="admin-input" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} placeholder="e.g. LC-2481093" />
      </div>
      <button onClick={save} disabled={saving} className="btn-primary w-full justify-center">
        {saving ? "Saving..." : saved ? "Saved ✓" : "Update Order"}
      </button>
    </div>
  );
}
