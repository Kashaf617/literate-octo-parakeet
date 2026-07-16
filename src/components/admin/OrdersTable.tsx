"use client";
import { useState } from "react";
import Link from "next/link";
import { fmtCurrency } from "@/lib/utils";
import StatusBadge from "./StatusBadge";

interface Order {
  id: string; orderNumber: string; customerName: string; phone: string; city: string;
  total: number; orderStatus: string; paymentStatus: string; paymentMethod: string; createdAt: string;
}

const STATUSES = ["all", "processing", "confirmed", "packed", "shipped", "delivered", "cancelled", "returned"];

export default function OrdersTable({ initial }: { initial: Order[] }) {
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");

  const filtered = initial.filter((o) => {
    const statusMatch = filter === "all" || o.orderStatus === filter;
    const qMatch = !q || o.orderNumber.toLowerCase().includes(q.toLowerCase()) || o.customerName.toLowerCase().includes(q.toLowerCase()) || o.phone.includes(q);
    return statusMatch && qMatch;
  });

  return (
    <div className="admin-card">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`text-xs font-bold px-3 py-1.5 rounded-full border transition capitalize ${filter === s ? "bg-navy text-white border-navy" : "border-line text-sub hover:border-brand"}`}
          >
            {s} {s !== "all" && `(${initial.filter((o) => o.orderStatus === s).length})`}
          </button>
        ))}
        <input className="admin-input ml-auto max-w-[220px]" placeholder="Search order, name, phone..." value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-sub text-xs uppercase border-b border-line">
              <th className="pb-2 font-bold">Order</th>
              <th className="pb-2 font-bold">Customer</th>
              <th className="pb-2 font-bold">City</th>
              <th className="pb-2 font-bold">Total</th>
              <th className="pb-2 font-bold">Payment</th>
              <th className="pb-2 font-bold">Status</th>
              <th className="pb-2 font-bold">Date</th>
              <th className="pb-2 font-bold text-right">—</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} className="border-b border-line last:border-0">
                <td className="py-3 font-bold text-brand">{o.orderNumber}</td>
                <td className="py-3">
                  <div className="font-semibold">{o.customerName}</div>
                  <div className="text-xs text-sub">{o.phone}</div>
                </td>
                <td className="py-3 text-sub">{o.city}</td>
                <td className="py-3 font-semibold">{fmtCurrency(o.total)}</td>
                <td className="py-3">
                  <div className="text-xs uppercase font-bold text-sub">{o.paymentMethod}</div>
                  <StatusBadge status={o.paymentStatus} />
                </td>
                <td className="py-3"><StatusBadge status={o.orderStatus} /></td>
                <td className="py-3 text-sub text-xs">{new Date(o.createdAt).toLocaleDateString()}</td>
                <td className="py-3 text-right">
                  <Link href={`/admin/orders/${o.id}`} className="text-brand font-bold text-xs">Manage →</Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={8} className="py-8 text-center text-sub">No orders match this filter.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
