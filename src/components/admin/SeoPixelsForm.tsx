"use client";
import { useState } from "react";

export default function SeoPixelsForm({ initialSeo, initialPixels }: { initialSeo: any; initialPixels: any }) {
  const [seo, setSeo] = useState(initialSeo);
  const [pixels, setPixels] = useState(initialPixels);
  const [savingSeo, setSavingSeo] = useState(false);
  const [savingPixels, setSavingPixels] = useState(false);
  const [msg, setMsg] = useState("");

  async function saveSeo() {
    setSavingSeo(true);
    await fetch("/api/admin/settings/seo", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(seo) });
    setSavingSeo(false);
    flash("SEO settings saved");
  }
  async function savePixels() {
    setSavingPixels(true);
    await fetch("/api/admin/settings/pixels", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(pixels) });
    setSavingPixels(false);
    flash("Tracking pixels saved");
  }
  function flash(m: string) {
    setMsg(m);
    setTimeout(() => setMsg(""), 2500);
  }

  return (
    <div className="space-y-6">
      {msg && <div className="bg-green-50 text-success font-semibold text-sm rounded-lg px-4 py-2.5">{msg}</div>}

      <div className="admin-card space-y-4">
        <h3 className="font-extrabold text-ink">Global SEO</h3>
        <div>
          <label className="admin-label">Default Meta Title</label>
          <input className="admin-input" value={seo.metaTitle} onChange={(e) => setSeo({ ...seo, metaTitle: e.target.value })} />
        </div>
        <div>
          <label className="admin-label">Default Meta Description</label>
          <textarea className="admin-input" rows={2} value={seo.metaDescription} onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })} />
          <p className="text-[11px] text-sub mt-1">{seo.metaDescription?.length || 0}/160 characters recommended</p>
        </div>
        <div>
          <label className="admin-label">Open Graph / Social Share Image URL</label>
          <input className="admin-input" value={seo.ogImage} onChange={(e) => setSeo({ ...seo, ogImage: e.target.value })} placeholder="https://..." />
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input type="checkbox" checked={seo.robotsIndex} onChange={(e) => setSeo({ ...seo, robotsIndex: e.target.checked })} />
            Allow search engines to index the site
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input type="checkbox" checked={seo.sitemapEnabled} onChange={(e) => setSeo({ ...seo, sitemapEnabled: e.target.checked })} />
            Enable auto-generated sitemap.xml
          </label>
        </div>
        <p className="text-xs text-sub">Sitemap: <code>/sitemap.xml</code> · Robots: <code>/robots.txt</code> — both generated automatically from your live product & category data.</p>
        <button onClick={saveSeo} disabled={savingSeo} className="btn-primary">{savingSeo ? "Saving..." : "Save SEO Settings"}</button>
      </div>

      <div className="admin-card space-y-4">
        <h3 className="font-extrabold text-ink">Tracking Pixels & Analytics</h3>
        <p className="text-xs text-sub -mt-2">These scripts load site-wide, on every storefront page, automatically.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="admin-label">Google Analytics 4 ID</label>
            <input className="admin-input" placeholder="G-XXXXXXXXXX" value={pixels.ga4Id} onChange={(e) => setPixels({ ...pixels, ga4Id: e.target.value })} />
          </div>
          <div>
            <label className="admin-label">Google Tag Manager ID</label>
            <input className="admin-input" placeholder="GTM-XXXXXXX" value={pixels.gtmId} onChange={(e) => setPixels({ ...pixels, gtmId: e.target.value })} />
          </div>
          <div>
            <label className="admin-label">Meta (Facebook) Pixel ID</label>
            <input className="admin-input" placeholder="1234567890" value={pixels.metaPixelId} onChange={(e) => setPixels({ ...pixels, metaPixelId: e.target.value })} />
          </div>
          <div>
            <label className="admin-label">TikTok Pixel ID</label>
            <input className="admin-input" placeholder="CXXXXXXXXXXX" value={pixels.tiktokPixelId} onChange={(e) => setPixels({ ...pixels, tiktokPixelId: e.target.value })} />
          </div>
          <div>
            <label className="admin-label">Snapchat Pixel ID</label>
            <input className="admin-input" value={pixels.snapPixelId} onChange={(e) => setPixels({ ...pixels, snapPixelId: e.target.value })} />
          </div>
        </div>
        <button onClick={savePixels} disabled={savingPixels} className="btn-primary">{savingPixels ? "Saving..." : "Save Pixels"}</button>
      </div>
    </div>
  );
}
