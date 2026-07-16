"use client";
import { useState } from "react";

export default function StorefrontSettingsForm({ initialSettings }: { initialSettings: Record<string, string> }) {
  const [settings, setSettings] = useState({
    heading_categories: initialSettings.heading_categories || "Popular Categories",
    heading_best_offers: initialSettings.heading_best_offers || "The Best Offers",
    heading_new_goods: initialSettings.heading_new_goods || "New Goods",
    marquee_text: initialSettings.marquee_text || "FOLLOW US AND GET A CHANCE TO WIN 80% OFF",
    marquee_speed: initialSettings.marquee_speed || "20",
    advance_payment_discount: initialSettings.advance_payment_discount || "200",
    jazzcash_number: initialSettings.jazzcash_number || "03001234567",
    easypaisa_number: initialSettings.easypaisa_number || "03001234567",
    company_whatsapp: initialSettings.company_whatsapp || "+923001234567",
  });
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    alert("Storefront headings updated successfully!");
  }

  return (
    <div className="admin-card max-w-2xl">
      <div className="space-y-6">
        <div>
          <label className="admin-label">Categories Section Heading</label>
          <input 
            className="admin-input" 
            value={settings.heading_categories} 
            onChange={e => setSettings({ ...settings, heading_categories: e.target.value })} 
          />
        </div>
        <div>
          <label className="admin-label">Best Offers Section Heading</label>
          <input 
            className="admin-input" 
            value={settings.heading_best_offers} 
            onChange={e => setSettings({ ...settings, heading_best_offers: e.target.value })} 
          />
        </div>
        <div>
          <label className="admin-label">New Goods Section Heading</label>
          <input 
            className="admin-input" 
            value={settings.heading_new_goods} 
            onChange={e => setSettings({ ...settings, heading_new_goods: e.target.value })} 
          />
        </div>
        <div className="pt-4 border-t border-line">
          <label className="admin-label">Header Marquee Text</label>
          <input 
            className="admin-input" 
            value={settings.marquee_text} 
            onChange={e => setSettings({ ...settings, marquee_text: e.target.value })} 
          />
        </div>
        <div>
          <label className="admin-label">Marquee Animation Speed (Seconds)</label>
          <input 
            type="number"
            className="admin-input" 
            value={settings.marquee_speed} 
            onChange={e => setSettings({ ...settings, marquee_speed: e.target.value })} 
            min="1"
          />
          <p className="text-xs text-sub mt-1">Lower is faster. Default is 20.</p>
        </div>
        
        <div className="pt-4 border-t border-line">
          <h3 className="admin-label text-ink font-black mb-4 text-sm">💳 Advance Payment Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="admin-label">Advance Payment Discount (PKR)</label>
              <input 
                type="number"
                className="admin-input" 
                value={settings.advance_payment_discount} 
                onChange={e => setSettings({ ...settings, advance_payment_discount: e.target.value })} 
                min="0"
              />
              <p className="text-xs text-sub mt-1">This amount will be deducted when a customer pays via JazzCash, EasyPaisa, or Bank Transfer.</p>
            </div>
            <div>
              <label className="admin-label">JazzCash Number</label>
              <input 
                className="admin-input" 
                value={settings.jazzcash_number} 
                onChange={e => setSettings({ ...settings, jazzcash_number: e.target.value })} 
              />
            </div>
            <div>
              <label className="admin-label">EasyPaisa Number</label>
              <input 
                className="admin-input" 
                value={settings.easypaisa_number} 
                onChange={e => setSettings({ ...settings, easypaisa_number: e.target.value })} 
              />
            </div>
            <div>
              <label className="admin-label">Company WhatsApp Number (for payment receipts)</label>
              <input 
                className="admin-input" 
                value={settings.company_whatsapp} 
                placeholder="+923001234567"
                onChange={e => setSettings({ ...settings, company_whatsapp: e.target.value })} 
              />
              <p className="text-xs text-sub mt-1">Customers will be directed to this number to send their payment screenshot after placing an advance order.</p>
            </div>
          </div>
        </div>
        
        <button onClick={save} disabled={saving} className="btn-primary mt-4">
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
