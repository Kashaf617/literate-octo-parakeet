"use client";
import { useState } from "react";

export default function EmailSettingsForm({ initialSettings }: { initialSettings: Record<string, string> }) {
  const [settings, setSettings] = useState({
    email_provider: initialSettings.email_provider || "brevo", // "brevo" or "mailgun"
    email_from_name: initialSettings.email_from_name || "DEVINE ORA",
    email_from_address: initialSettings.email_from_address || "no-reply@devineora.com",
    
    // Brevo Settings
    email_brevo_api_key: initialSettings.email_brevo_api_key || "",
    
    // Mailgun Settings
    email_mailgun_domain: initialSettings.email_mailgun_domain || "",
    email_mailgun_api_key: initialSettings.email_mailgun_api_key || "",
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
    alert("Email settings updated successfully!");
  }

  return (
    <div className="grid lg:grid-cols-[1fr_400px] gap-6">
      <div className="admin-card space-y-8">
        
        {/* General Settings */}
        <div>
          <h3 className="font-extrabold text-ink mb-4">General Configuration</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="admin-label">From Name</label>
              <input className="admin-input" value={settings.email_from_name} onChange={e => setSettings({ ...settings, email_from_name: e.target.value })} />
            </div>
            <div>
              <label className="admin-label">From Address</label>
              <input className="admin-input" type="email" value={settings.email_from_address} onChange={e => setSettings({ ...settings, email_from_address: e.target.value })} />
            </div>
          </div>
        </div>

        {/* Provider Switcher */}
        <div>
          <h3 className="font-extrabold text-ink mb-4">Active Provider</h3>
          <div className="flex gap-4">
            <label className={`flex-1 border p-4 rounded-xl cursor-pointer transition-all ${settings.email_provider === "brevo" ? "border-[#0b1221] bg-[#f8f9fa] ring-2 ring-[#0b1221]/10" : "border-[#e2e8f0]"}`}>
              <div className="flex items-center gap-3 mb-1">
                <input type="radio" name="provider" value="brevo" checked={settings.email_provider === "brevo"} onChange={() => setSettings({ ...settings, email_provider: "brevo" })} />
                <span className="font-bold text-[#0b1221]">Brevo (Sendinblue)</span>
              </div>
              <p className="text-[12px] text-[#64748b] ml-6">Recommended for free tier</p>
            </label>
            <label className={`flex-1 border p-4 rounded-xl cursor-pointer transition-all ${settings.email_provider === "mailgun" ? "border-[#0b1221] bg-[#f8f9fa] ring-2 ring-[#0b1221]/10" : "border-[#e2e8f0]"}`}>
              <div className="flex items-center gap-3 mb-1">
                <input type="radio" name="provider" value="mailgun" checked={settings.email_provider === "mailgun"} onChange={() => setSettings({ ...settings, email_provider: "mailgun" })} />
                <span className="font-bold text-[#0b1221]">Mailgun</span>
              </div>
              <p className="text-[12px] text-[#64748b] ml-6">Best for high volume</p>
            </label>
          </div>
        </div>

        {/* Provider Specific Settings */}
        {settings.email_provider === "brevo" && (
          <div className="p-6 bg-[#f8f9fa] border border-[#e2e8f0] rounded-xl">
            <h4 className="font-bold text-[#0b1221] mb-4">Brevo API Credentials</h4>
            <div>
              <label className="admin-label">API Key (v3)</label>
              <input className="admin-input" type="password" value={settings.email_brevo_api_key} onChange={e => setSettings({ ...settings, email_brevo_api_key: e.target.value })} placeholder="xkeysib-..." />
            </div>
          </div>
        )}

        {settings.email_provider === "mailgun" && (
          <div className="p-6 bg-[#f8f9fa] border border-[#e2e8f0] rounded-xl space-y-4">
            <h4 className="font-bold text-[#0b1221] mb-4">Mailgun API Credentials</h4>
            <div>
              <label className="admin-label">Sending Domain</label>
              <input className="admin-input" value={settings.email_mailgun_domain} onChange={e => setSettings({ ...settings, email_mailgun_domain: e.target.value })} placeholder="mg.yourdomain.com" />
            </div>
            <div>
              <label className="admin-label">API Key</label>
              <input className="admin-input" type="password" value={settings.email_mailgun_api_key} onChange={e => setSettings({ ...settings, email_mailgun_api_key: e.target.value })} placeholder="key-..." />
            </div>
          </div>
        )}

        <button onClick={save} disabled={saving} className="btn-primary mt-4 py-3 px-8">
          {saving ? "Saving Configuration..." : "Save Email Settings"}
        </button>
      </div>

      <div className="admin-card self-start">
        <h3 className="font-extrabold text-ink mb-4">How it works</h3>
        <p className="text-[13px] text-[#64748b] mb-4 leading-relaxed">
          Transactional emails are automatically sent to customers when they place an order, or when you update their order status (e.g. Shipped, Delivered).
        </p>
        <p className="text-[13px] text-[#64748b] mb-4 leading-relaxed">
          Choose a provider on the left, paste your API keys, and the system will automatically route all emails through that provider using their official REST APIs.
        </p>
      </div>
    </div>
  );
}
