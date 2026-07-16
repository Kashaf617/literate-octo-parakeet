"use client";
import { useState } from "react";
import Link from "next/link";
import { fmtCurrency } from "@/lib/utils";
import StatusBadge from "./StatusBadge";

interface Product {
  id: string; name: string; slug: string; price: number; comparePrice: number | null; stock: number;
  status: string; images: string; category: { name: string } | null;
  collections: { collection: { name: string; color: string } }[];
}

export default function ProductsTable({ initial }: { initial: Product[] }) {
  const [products, setProducts] = useState(initial);
  const [q, setQ] = useState("");

  async function remove(id: string) {
    if (!confirm("Delete this product?")) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (res.ok) setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  const filtered = products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="admin-card">
      <input className="admin-input max-w-xs mb-4" placeholder="Search products..." value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-sub text-xs uppercase border-b border-line">
              <th className="pb-2 font-bold">Product</th>
              <th className="pb-2 font-bold">Category</th>
              <th className="pb-2 font-bold">Collections</th>
              <th className="pb-2 font-bold">Price</th>
              <th className="pb-2 font-bold">Stock</th>
              <th className="pb-2 font-bold">Status</th>
              <th className="pb-2 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const img = JSON.parse(p.images || "[]")[0];
              return (
                <tr key={p.id} className="border-b border-line last:border-0">
                  <td className="py-3 flex items-center gap-3 max-w-[240px]">
                    <div className="w-10 h-10 rounded-lg bg-cover bg-center bg-bg shrink-0" style={{ backgroundImage: img ? `url(${img})` : undefined }} />
                    <span className="font-bold truncate">{p.name}</span>
                  </td>
                  <td className="py-3 text-sub">{p.category?.name || "—"}</td>
                  <td className="py-3">
                    <div className="flex flex-wrap gap-1">
                      {p.collections.slice(0, 2).map((c, i) => (
                        <span key={i} className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: c.collection.color + "20", color: c.collection.color }}>
                          {c.collection.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 font-semibold">
                    {p.comparePrice && <span className="line-through text-sub text-xs mr-1">{fmtCurrency(p.comparePrice)}</span>}
                    {fmtCurrency(p.price)}
                  </td>
                  <td className="py-3">
                    <span className={p.stock <= 5 ? "text-danger font-bold" : ""}>{p.stock}</span>
                  </td>
                  <td className="py-3"><StatusBadge status={p.status} /></td>
                  <td className="py-3 text-right space-x-3">
                    <Link href={`/admin/products/${p.id}`} className="text-brand font-bold text-xs">Edit</Link>
                    <button onClick={() => remove(p.id)} className="text-danger font-bold text-xs">Delete</button>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && <tr><td colSpan={7} className="py-8 text-center text-sub">No products found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
