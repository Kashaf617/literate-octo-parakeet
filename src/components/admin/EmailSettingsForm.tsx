"use client";
// v2 - supports: brevo, mailgun, gmail, smtp
import { useState } from "react";

export default function EmailSettingsForm({ initialSettings }: { initialSettings: Record<string, string> }) {
  const [settings, setSettings] = useState({
    email_provider: initialSettings.email_provider || "brevo", // "brevo", "mailgun", "gmail", "smtp"
    email_from_name: initialSettings.email_from_name || "DEVINE ORA",
    email_from_address: initialSettings.email_from_address || "no-reply@devineora.com",
    
    // Brevo Settings
    email_brevo_api_key: initialSettings.email_brevo_api_key || "",
    
    // Mailgun Settings
    email_mailgun_domain: initialSettings.email_mailgun_domain || "",
    email_mailgun_api_key: initialSettings.email_mailgun_api_key || "",

    // Gmail Settings
    email_gmail_user: initialSettings.email_gmail_user || "",
    email_gmail_pass: initialSettings.email_gmail_pass || "",

    // Custom SMTP Settings
    email_smtp_host: initialSettings.email_smtp_host || "",
    email_smtp_port: initialSettings.email_smtp_port || "587",
    email_smtp_user: initialSettings.email_smtp_user || "",
    email_smtp_pass: initialSettings.email_smtp_pass || "",
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
          <div className="grid md:grid-cols-2 gap-4">
            <label className={`border p-4 rounded-xl cursor-pointer transition-all ${settings.email_provider === "brevo" ? "border-[#0b1221] bg-[#f8f9fa] ring-2 ring-[#0b1221]/10" : "border-[#e2e8f0]"}`}>
              <div className="flex items-center gap-3 mb-1">
                <input type="radio" name="provider" value="brevo" checked={settings.email_provider === "brevo"} onChange={() => setSettings({ ...settings, email_provider: "brevo" })} />
                <span className="font-bold text-[#0b1221]">Brevo (Sendinblue)</span>
              </div>
              <p className="text-[12px] text-[#64748b] ml-6">Recommended for free tier</p>
            </label>
            <label className={`border p-4 rounded-xl cursor-pointer transition-all ${settings.email_provider === "mailgun" ? "border-[#0b1221] bg-[#f8f9fa] ring-2 ring-[#0b1221]/10" : "border-[#e2e8f0]"}`}>
              <div className="flex items-center gap-3 mb-1">
                <input type="radio" name="provider" value="mailgun" checked={settings.email_provider === "mailgun"} onChange={() => setSettings({ ...settings, email_provider: "mailgun" })} />
                <span className="font-bold text-[#0b1221]">Mailgun</span>
              </div>
              <p className="text-[12px] text-[#64748b] ml-6">Best for high volume</p>
            </label>
            <label className={`border p-4 rounded-xl cursor-pointer transition-all ${settings.email_provider === "gmail" ? "border-[#0b1221] bg-[#f8f9fa] ring-2 ring-[#0b1221]/10" : "border-[#e2e8f0]"}`}>
              <div className="flex items-center gap-3 mb-1">
                <input type="radio" name="provider" value="gmail" checked={settings.email_provider === "gmail"} onChange={() => setSettings({ ...settings, email_provider: "gmail" })} />
                <span className="font-bold text-[#0b1221]">Gmail SMTP</span>
              </div>
              <p className="text-[12px] text-[#64748b] ml-6">Easiest for unverified domains / Gmail</p>
            </label>
            <label className={`border p-4 rounded-xl cursor-pointer transition-all ${settings.email_provider === "smtp" ? "border-[#0b1221] bg-[#f8f9fa] ring-2 ring-[#0b1221]/10" : "border-[#e2e8f0]"}`}>
              <div className="flex items-center gap-3 mb-1">
                <input type="radio" name="provider" value="smtp" checked={settings.email_provider === "smtp"} onChange={() => setSettings({ ...settings, email_provider: "smtp" })} />
                <span className="font-bold text-[#0b1221]">Custom SMTP</span>
              </div>
              <p className="text-[12px] text-[#64748b] ml-6">Use any custom mail server</p>
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

        {settings.email_provider === "gmail" && (
          <div className="p-6 bg-[#f8f9fa] border border-[#e2e8f0] rounded-xl space-y-4">
            <h4 className="font-bold text-[#0b1221] mb-4">Gmail SMTP Configuration</h4>
            <div>
              <label className="admin-label">Gmail Username</label>
              <input className="admin-input" value={settings.email_gmail_user} onChange={e => setSettings({ ...settings, email_gmail_user: e.target.value })} placeholder="yourname@gmail.com" />
            </div>
            <div>
              <label className="admin-label">Gmail App Password (16 Characters)</label>
              <input className="admin-input" type="password" value={settings.email_gmail_pass} onChange={e => setSettings({ ...settings, email_gmail_pass: e.target.value })} placeholder="xxxx xxxx xxxx xxxx" />
              <p className="text-[11px] text-[#64748b] mt-1">
                Do NOT enter your regular Google password. Generate an <strong>App Password</strong> in your Google Account security settings.
              </p>
            </div>
          </div>
        )}

        {settings.email_provider === "smtp" && (
          <div className="p-6 bg-[#f8f9fa] border border-[#e2e8f0] rounded-xl space-y-4">
            <h4 className="font-bold text-[#0b1221] mb-4">Custom SMTP Configuration</h4>
            <div className="grid grid-cols-[1fr_120px] gap-4">
              <div>
                <label className="admin-label">SMTP Host</label>
                <input className="admin-input" value={settings.email_smtp_host} onChange={e => setSettings({ ...settings, email_smtp_host: e.target.value })} placeholder="smtp.mailtrap.io" />
              </div>
              <div>
                <label className="admin-label">Port</label>
                <input className="admin-input" value={settings.email_smtp_port} onChange={e => setSettings({ ...settings, email_smtp_port: e.target.value })} placeholder="587" />
              </div>
            </div>
            <div>
              <label className="admin-label">Username</label>
              <input className="admin-input" value={settings.email_smtp_user} onChange={e => setSettings({ ...settings, email_smtp_user: e.target.value })} placeholder="SMTP Username" />
            </div>
            <div>
              <label className="admin-label">Password</label>
              <input className="admin-input" type="password" value={settings.email_smtp_pass} onChange={e => setSettings({ ...settings, email_smtp_pass: e.target.value })} placeholder="SMTP Password" />
            </div>
          </div>
        )}

        <button onClick={save} disabled={saving} className="btn-primary mt-4 py-3 px-8">
          {saving ? "Saving Configuration..." : "Save Email Settings"}
        </button>
      </div>

      <div className="admin-card self-start space-y-4">
        <h3 className="font-extrabold text-ink mb-4">How it works</h3>
        <p className="text-[13px] text-[#64748b] leading-relaxed">
          Transactional emails are automatically sent when customers place orders, when you update order status, or when visitors submit the contact form.
        </p>
        <p className="text-[13px] text-[#64748b] leading-relaxed">
          <strong>Gmail SMTP option:</strong> If you are using a Vercel subdomain and don't own a custom domain yet, select <strong>Gmail SMTP</strong>. Generate an <strong>App Password</strong> in your Google Account Security settings and paste it here. This guarantees 100% email delivery to Gmail instantly.
        </p>
        <p className="text-[13px] text-[#64748b] leading-relaxed">
          <strong>Custom SMTP option:</strong> Allows routing emails through any standard email relay provider (like Mailtrap, Sendgrid, Zoho Mail, etc.) using their server hostname and credentials.
        </p>
      </div>
    </div>
  );
}
