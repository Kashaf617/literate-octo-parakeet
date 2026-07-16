"use client";
import { useState } from "react";
import { Plus, Trash2, Edit, Save, X, PlayCircle } from "lucide-react";
import Image from "next/image";

export default function CelebrityManager({ initialCelebrities, products }: { initialCelebrities: any[], products: any[] }) {
  const [celebrities, setCelebrities] = useState(initialCelebrities);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    videoUrl: "",
    productId: "",
    sortOrder: 0,
    isActive: true
  });

  const handleSave = async (id?: string) => {
    try {
      const url = id ? `/api/admin/celebrities/${id}` : "/api/admin/celebrities";
      const method = id ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const data = await res.json();
        if (id) {
          setCelebrities(celebrities.map(c => c.id === id ? data : c));
          setEditingId(null);
        } else {
          setCelebrities([...celebrities, data]);
          setIsAdding(false);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await fetch(`/api/admin/celebrities/${id}`, { method: "DELETE" });
      setCelebrities(celebrities.filter(c => c.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (res.ok) {
        const { url } = await res.json();
        setFormData({ ...formData, image: url });
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Manage Celebrities</h2>
        {!isAdding && !editingId && (
          <button onClick={() => {
            setFormData({ name: "", image: "", videoUrl: "", productId: "", sortOrder: 0, isActive: true });
            setIsAdding(true);
          }} className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <Plus size={16} /> Add Celebrity
          </button>
        )}
      </div>

      {(isAdding || editingId) && (
        <div className="bg-gray-50 p-6 rounded-xl mb-8 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Celebrity Name</label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border p-2 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Image URL or Upload</label>
              <div className="flex gap-2">
                <input type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full border p-2 rounded-lg" />
                <input type="file" onChange={handleImageUpload} className="w-24 text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Video URL (e.g. YouTube or mp4)</label>
              <input type="text" value={formData.videoUrl} onChange={e => setFormData({...formData, videoUrl: e.target.value})} className="w-full border p-2 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Recommended Product (Optional)</label>
              <select value={formData.productId} onChange={e => setFormData({...formData, productId: e.target.value})} className="w-full border p-2 rounded-lg bg-white">
                <option value="">Global / No Specific Product</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Sort Order</label>
              <input type="number" value={formData.sortOrder} onChange={e => setFormData({...formData, sortOrder: parseInt(e.target.value)})} className="w-full border p-2 rounded-lg" />
            </div>
            <div className="flex items-center gap-2 mt-6">
              <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="w-5 h-5" />
              <label className="text-sm font-semibold">Active</label>
            </div>
          </div>
          <div className="flex gap-4 mt-6">
            <button onClick={() => handleSave(editingId || undefined)} className="bg-black text-white px-6 py-2 rounded-lg flex items-center gap-2">
              <Save size={16} /> Save
            </button>
            <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="bg-gray-200 text-black px-6 py-2 rounded-lg">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {celebrities.map(c => (
          <div key={c.id} className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm relative group">
            <div className="aspect-[4/5] relative bg-gray-100">
              {c.image && <Image src={c.image} alt={c.name} fill className="object-cover" />}
              {c.videoUrl && <div className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full"><PlayCircle size={24} /></div>}
            </div>
            <div className="p-4 bg-white text-center">
              <h3 className="font-bold text-lg">{c.name}</h3>
              <p className="text-xs text-gray-500 mt-1">{products.find(p => p.id === c.productId)?.name || "Global Recommendation"}</p>
            </div>
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => {
                setFormData({ name: c.name, image: c.image || "", videoUrl: c.videoUrl || "", productId: c.productId || "", sortOrder: c.sortOrder, isActive: c.isActive });
                setEditingId(c.id);
                setIsAdding(false);
              }} className="bg-white text-black px-4 py-2 rounded-lg flex items-center gap-2 font-semibold">
                <Edit size={16} /> Edit
              </button>
              <button onClick={() => handleDelete(c.id)} className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold">
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
