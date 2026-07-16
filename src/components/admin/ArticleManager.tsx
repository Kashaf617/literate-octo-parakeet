"use client";
import { useState } from "react";
import ImageUploader from "./ImageUploader";
import { cx, slugify } from "@/lib/utils";

interface Article {
  id: string; title: string; slug: string; content: string; excerpt: string | null; image: string | null;
  category: string; author: string; published: boolean; createdAt: string;
}

const EMPTY: Omit<Article, "id" | "createdAt"> = {
  title: "New Article", slug: "new-article", content: "Write your article content here...", excerpt: "",
  image: "https://placehold.co/800x400/eef4fd/1f6fdb?text=Article", category: "Blog", author: "Store Owner", published: true
};

export default function ArticleManager({ initialArticles }: { initialArticles: Article[] }) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [editing, setEditing] = useState<Article | (Omit<Article, "id" | "createdAt"> & { id?: string }) | null>(initialArticles[0] || null);
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!editing) return;
    setSaving(true);
    const isNew = !("id" in editing) || !editing.id;
    const res = await fetch(isNew ? "/api/admin/articles" : `/api/admin/articles/${(editing as Article).id}`, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing)
    });
    setSaving(false);
    if (res.ok) {
      const saved = await res.json();
      setArticles((prev) => {
        const exists = prev.find((a) => a.id === saved.id);
        return exists ? prev.map((a) => (a.id === saved.id ? saved : a)) : [saved, ...prev];
      });
      setEditing(null);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this article?")) return;
    const res = await fetch(`/api/admin/articles/${id}`, { method: "DELETE" });
    if (res.ok) setArticles((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start">
      <div className="w-full md:w-[320px] shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-ink">All Articles</h2>
          <button onClick={() => setEditing({ ...EMPTY })} className="btn-primary py-1.5 px-3 text-[11px]">+ New</button>
        </div>
        <div className="flex flex-col gap-3">
          {articles.map((art) => (
            <div
              key={art.id}
              onClick={() => setEditing(art)}
              className={cx(
                "p-3 rounded-xl border cursor-pointer transition flex items-center gap-3 group bg-white",
                editing?.id === art.id ? "border-brand ring-1 ring-brand shadow-sm" : "border-line hover:border-brand/40"
              )}
            >
              {art.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={art.image} alt="" className="w-12 h-12 rounded bg-bg object-cover shrink-0" />
              )}
              <div className="flex-1 overflow-hidden">
                <h4 className="font-bold text-[13px] text-ink truncate">{art.title}</h4>
                <p className="text-[11px] text-sub truncate">{art.published ? "Published" : "Draft"} &bull; {art.category}</p>
              </div>
              <button onClick={(e) => { e.stopPropagation(); remove(art.id); }} className="text-danger opacity-0 group-hover:opacity-100 p-1 hover:bg-danger/10 rounded">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          ))}
          {articles.length === 0 && <p className="text-sm text-sub text-center py-8">No articles found.</p>}
        </div>
      </div>

      <div className="flex-1 w-full">
        {!editing ? (
          <div className="admin-card text-center py-20 bg-white">
            <p className="text-sub font-semibold">Select an article to edit, or create a new one.</p>
          </div>
        ) : (
          <div className="admin-card bg-white grid gap-6">
            <div className="flex items-center justify-between border-b border-line pb-4 mb-2">
              <h3 className="font-extrabold text-ink">{editing.id ? "Edit Article" : "New Article"}</h3>
            </div>
            
            <div className="grid gap-5">
              <div>
                <label className="admin-label">Title</label>
                <input 
                  className="admin-input" 
                  value={editing.title} 
                  onChange={(e) => setEditing({ ...editing, title: e.target.value, slug: slugify(e.target.value) })} 
                />
              </div>
              <div>
                <label className="admin-label">Slug</label>
                <input className="admin-input" value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
              </div>
              <div>
                <label className="admin-label">Excerpt (Short description)</label>
                <textarea className="admin-input" rows={2} value={editing.excerpt || ""} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} />
              </div>
              <ImageUploader value={editing.image || ""} onChange={(url) => setEditing({ ...editing, image: url })} label="Article Cover Image" />
              <div>
                <label className="admin-label">Content (HTML or Text)</label>
                <textarea className="admin-input font-mono text-xs" rows={12} value={editing.content} onChange={(e) => setEditing({ ...editing, content: e.target.value })} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Category</label>
                  <input className="admin-input" value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} />
                </div>
                <div>
                  <label className="admin-label">Author</label>
                  <input className="admin-input" value={editing.author} onChange={(e) => setEditing({ ...editing, author: e.target.value })} />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm font-semibold mt-2">
                <input type="checkbox" checked={editing.published} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} />
                Published (Visible on storefront)
              </label>

              <div className="flex gap-2 pt-4 border-t border-line mt-4">
                <button onClick={save} disabled={saving} className="btn-primary">{saving ? "Saving..." : "Save Article"}</button>
                <button onClick={() => setEditing(null)} className="btn-secondary">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
