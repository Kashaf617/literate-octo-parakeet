"use client";
import { useState } from "react";
import Image from "next/image";
import ImageUploader from "./ImageUploader";

interface Category { id: string; name: string; slug: string; image: string | null; description: string | null; sortOrder: number; isActive: boolean; _count?: { products: number } }
const EMPTY = { name: "", slug: "", image: "", description: "", sortOrder: 0, isActive: true };

export default function CategoryManager({ initial }: { initial: Category[] }) {
  const [categories, setCategories] = useState<Category[]>(initial);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    const isNew = !editing.id;
    const res = await fetch(isNew ? "/api/admin/categories" : `/api/admin/categories/${editing.id}`, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing)
    });
    setSaving(false);
    if (res.ok) {
      const saved = await res.json();
      setCategories((prev) => {
        const exists = prev.find((c) => c.id === saved.id);
        return exists ? prev.map((c) => (c.id === saved.id ? { ...saved, _count: c._count } : c)) : [...prev, saved];
      });
      setEditing(null);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this category? Products in it will become uncategorized.")) return;
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    if (res.ok) setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div className="grid lg:grid-cols-[1fr_380px] gap-6">
      <div className="admin-card overflow-x-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-extrabold text-ink">All Categories ({categories.length})</h3>
          <button onClick={() => setEditing({ ...EMPTY })} className="btn-primary py-1.5 px-3 text-xs">+ New Category</button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-sub text-xs uppercase border-b border-line">
              <th className="pb-2 font-bold">Category</th>
              <th className="pb-2 font-bold">Slug</th>
              <th className="pb-2 font-bold">Products</th>
              <th className="pb-2 font-bold">Status</th>
              <th className="pb-2 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-b border-line last:border-0">
                <td className="py-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cover bg-center bg-brand-pale shrink-0" style={{ backgroundImage: c.image ? `url(${c.image})` : undefined }} />
                  <span className="font-bold">{c.name}</span>
                </td>
                <td className="py-3 text-sub">/{c.slug}</td>
                <td className="py-3">{c._count?.products ?? 0}</td>
                <td className="py-3">
                  <span className={`text-[11px] font-bold px-2 py-1 rounded-full ${c.isActive ? "bg-green-50 text-success" : "bg-gray-100 text-gray-500"}`}>
                    {c.isActive ? "Active" : "Hidden"}
                  </span>
                </td>
                <td className="py-3 text-right space-x-3">
                  <button onClick={() => setEditing(c)} className="text-brand font-bold text-xs">Edit</button>
                  <button onClick={() => remove(c.id)} className="text-danger font-bold text-xs">Delete</button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && <tr><td colSpan={5} className="py-8 text-center text-sub">No categories yet.</td></tr>}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="admin-card h-fit sticky top-6">
          <h3 className="font-extrabold text-ink mb-4">{editing.id ? "Edit Category" : "New Category"}</h3>
          <div className="space-y-4">
            <div>
              <label className="admin-label">Name</label>
              <input className="admin-input" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
            </div>
            <div>
              <label className="admin-label">Slug (URL)</label>
              <input className="admin-input" placeholder="auto-generated from name" value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
            </div>
            <ImageUploader value={editing.image || ""} onChange={(url) => setEditing({ ...editing, image: url })} label="Category Image" />
            <div>
              <label className="admin-label">Description</label>
              <textarea className="admin-input" rows={2} value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3 items-end">
              <div>
                <label className="admin-label">Sort Order</label>
                <input type="number" className="admin-input" value={editing.sortOrder} onChange={(e) => setEditing({ ...editing, sortOrder: Number(e.target.value) })} />
              </div>
              <label className="flex items-center gap-2 text-sm font-semibold pb-2.5">
                <input type="checkbox" checked={editing.isActive} onChange={(e) => setEditing({ ...editing, isActive: e.target.checked })} />
                Active
              </label>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={save} disabled={saving} className="btn-primary">{saving ? "Saving..." : "Save"}</button>
              <button onClick={() => setEditing(null)} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
