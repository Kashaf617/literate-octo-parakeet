"use client";
// EmailSettingsForm - supports: brevo, mailgun, gmail, smtp
import { useState } from "react";

export default function EmailSettingsForm({ initialSettings }: { initialSettings: Record<string, string> }) {
  const [settings, setSettings] = useState({
    email_provider: initialSettings.email_provider || "brevo",
    email_from_name: initialSettings.email_from_name || "DEVINE ORA",
    email_from_address: initialSettings.email_from_address || "no-reply@devineora.com",
    email_brevo_api_key: initialSettings.email_brevo_api_key || "",
    email_mailgun_domain: initialSettings.email_mailgun_domain || "",
    email_mailgun_api_key: initialSettings.email_mailgun_api_key || "",
    email_gmail_user: initialSettings.email_gmail_user || "",
    email_gmail_pass: initialSettings.email_gmail_pass || "",
    email_smtp_host: initialSettings.email_smtp_host || "",
    email_smtp_port: initialSettings.email_smtp_port || "587",
    email_smtp_user: initialSettings.email_smtp_user || "",
    email_smtp_pass: initialSettings.email_smtp_pass || "",
  });
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    if (res.ok) {
      alert("Email settings saved successfully!");
    } else {
      alert("Failed to save settings. Please try again.");
    }
  }

  const [testEmail, setTestEmail] = useState(initialSettings.email_from_address || "devineora7@gmail.com");
  const [testingEmail, setTestingEmail] = useState(false);
  const [testStatus, setTestStatus] = useState<string | null>(null);

  async function handleSendTestEmail() {
    setTestingEmail(true);
    setTestStatus(null);
    try {
      const res = await fetch("/api/admin/settings/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testEmail }),
      });
      const data = await res.json();
      setTestingEmail(false);
      if (res.ok && data.success) {
        setTestStatus(`✅ ${data.message}`);
      } else {
        setTestStatus(`❌ ${data.error || "Failed to send test email."}`);
      }
    } catch (err: any) {
      setTestingEmail(false);
      setTestStatus(`❌ Error: ${err.message}`);
    }
  }

  const providers = [
    { value: "brevo", label: "Brevo (Sendinblue)", desc: "Recommended – free tier available" },
    { value: "mailgun", label: "Mailgun", desc: "Best for high volume sending" },
    { value: "gmail", label: "Gmail SMTP", desc: "Easy setup using your Gmail account" },
    { value: "smtp", label: "Custom SMTP", desc: "Use any custom mail server" },
  ];

  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<string | null>(null);

  async function runSeeder() {
    setSeeding(true);
    setSeedResult(null);
    try {
      const res = await fetch("/api/admin/seed-data?secret=devineora-seed-2026");
      const data = await res.json();
      setSeeding(false);
      if (res.ok && data.success) {
        setSeedResult(`✅ Success! ${data.articlesCreated} blog articles and ${data.reviewsCreated} customer reviews populated.`);
      } else {
        setSeedResult(`❌ Failed: ${data.error || "Unknown error"}`);
      }
    } catch (err: any) {
      setSeeding(false);
      setSeedResult(`❌ Error: ${err.message}`);
    }
  }

  return (
    <div className="grid lg:grid-cols-[1fr_400px] gap-6">
      <div className="admin-card space-y-8">

        {/* General */}
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

        {/* Provider Selection */}
        <div>
          <h3 className="font-extrabold text-ink mb-4">Active Provider</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {providers.map((p) => (
              <label
                key={p.value}
                className={`border p-4 rounded-xl cursor-pointer transition-all ${settings.email_provider === p.value ? "border-[#0b1221] bg-[#f8f9fa] ring-2 ring-[#0b1221]/10" : "border-[#e2e8f0]"}`}
              >
                <div className="flex items-center gap-3 mb-1">
                  <input
                    type="radio"
                    name="provider"
                    value={p.value}
                    checked={settings.email_provider === p.value}
                    onChange={() => setSettings({ ...settings, email_provider: p.value })}
                  />
                  <span className="font-bold text-[#0b1221]">{p.label}</span>
                </div>
                <p className="text-[12px] text-[#64748b] ml-6">{p.desc}</p>
              </label>
            ))}
          </div>
        </div>

        {/* Brevo */}
        {settings.email_provider === "brevo" && (
          <div className="p-6 bg-[#f8f9fa] border border-[#e2e8f0] rounded-xl">
            <h4 className="font-bold text-[#0b1221] mb-4">Brevo API Credentials</h4>
            <div>
              <label className="admin-label">API Key (v3)</label>
              <input
                className="admin-input"
                type="password"
                value={settings.email_brevo_api_key}
                onChange={e => setSettings({ ...settings, email_brevo_api_key: e.target.value })}
                placeholder="xkeysib-..."
              />
            </div>
          </div>
        )}

        {/* Mailgun */}
        {settings.email_provider === "mailgun" && (
          <div className="p-6 bg-[#f8f9fa] border border-[#e2e8f0] rounded-xl space-y-4">
            <h4 className="font-bold text-[#0b1221] mb-4">Mailgun Credentials</h4>
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

        {/* Gmail SMTP */}
        {settings.email_provider === "gmail" && (
          <div className="p-6 bg-[#f8f9fa] border border-[#e2e8f0] rounded-xl space-y-4">
            <h4 className="font-bold text-[#0b1221] mb-4">Gmail SMTP Configuration</h4>
            <div>
              <label className="admin-label">Gmail Address</label>
              <input
                className="admin-input"
                type="email"
                value={settings.email_gmail_user}
                onChange={e => setSettings({ ...settings, email_gmail_user: e.target.value })}
                placeholder="yourname@gmail.com"
              />
            </div>
            <div>
              <label className="admin-label">Gmail App Password (16 Characters)</label>
              <input
                className="admin-input"
                type="password"
                value={settings.email_gmail_pass}
                onChange={e => setSettings({ ...settings, email_gmail_pass: e.target.value })}
                placeholder="xxxx xxxx xxxx xxxx"
              />
              <p className="text-[11px] text-[#64748b] mt-2">
                ⚠️ Do NOT use your regular Gmail password. You must generate an <strong>App Password</strong> from{" "}
                <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noreferrer" className="text-blue-600 underline">
                  myaccount.google.com/apppasswords
                </a>{" "}
                (2-Step Verification must be enabled first).
              </p>
            </div>
          </div>
        )}

        {/* Custom SMTP */}
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
          {saving ? "Saving..." : "Save Email Settings"}
        </button>

        {/* Send Test Email Card */}
        <div className="p-6 bg-white border border-[#e2e8f0] rounded-xl space-y-4 mt-8">
          <h4 className="font-bold text-[#0b1221]">📧 Send Test Email</h4>
          <p className="text-[12px] text-[#64748b]">
            Verify that your email settings are working by sending a test message to your inbox.
          </p>
          <div className="flex gap-3">
            <input
              type="email"
              className="admin-input flex-1"
              value={testEmail}
              onChange={e => setTestEmail(e.target.value)}
              placeholder="Enter your email address (e.g. devineora7@gmail.com)"
            />
            <button
              onClick={handleSendTestEmail}
              disabled={testingEmail}
              className="bg-[#0b1221] text-white px-6 py-2.5 rounded-xl text-[13px] font-bold hover:bg-black transition-colors disabled:opacity-50"
            >
              {testingEmail ? "Sending..." : "Send Test Email"}
            </button>
          </div>
          {testStatus && (
            <p className={`text-[12px] p-3 rounded-lg font-medium ${testStatus.startsWith("✅") ? "bg-green-100 text-green-800 border border-green-200" : "bg-red-100 text-red-800 border border-red-200"}`}>
              {testStatus}
            </p>
          )}
        </div>
      </div>

      {/* Help sidebar */}
      <div className="space-y-6">
        <div className="admin-card space-y-4">
          <h3 className="font-extrabold text-ink mb-2">Provider Guide</h3>
          <div className="space-y-4 text-[13px] text-[#64748b] leading-relaxed">
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
              <p className="font-bold text-blue-800 mb-1">📧 Gmail SMTP (Recommended)</p>
              <p>Best option if you are using a Vercel subdomain. Go to <strong>Google Account → Security → App Passwords</strong>, create a new App Password, and paste it here.</p>
            </div>
            <div className="p-3 rounded-lg bg-green-50 border border-green-100">
              <p className="font-bold text-green-800 mb-1">🚀 Brevo (Free Tier)</p>
              <p>Create a free account at <strong>brevo.com</strong>, get your API key from Settings → API Keys, and paste it here.</p>
            </div>
            <p>Emails are sent automatically on: new orders, status updates (Shipped/Delivered), and contact form submissions.</p>
          </div>
        </div>

        {/* Data Seeder Box */}
        <div className="admin-card space-y-4 border-2 border-amber-200 bg-amber-50/50">
          <h3 className="font-extrabold text-ink">✨ Initialize Store Content</h3>
          <p className="text-[13px] text-[#64748b] leading-relaxed">
            Populate your store with <strong>4 luxury watch blog articles</strong> and <strong>36 customer reviews</strong> (with latest July 2026 dates) in one click.
          </p>
          <button
            onClick={runSeeder}
            disabled={seeding}
            className="w-full bg-[#0b1221] text-white font-bold py-3 px-4 rounded-xl text-[13px] hover:bg-black transition-colors disabled:opacity-50"
          >
            {seeding ? "Populating Store Data..." : "⚡ Sync Blog Articles & Reviews"}
          </button>
          {seedResult && (
            <p className={`text-[12px] p-3 rounded-lg font-medium leading-relaxed ${seedResult.startsWith("✅") ? "bg-green-100 text-green-800 border border-green-200" : "bg-red-100 text-red-800 border border-red-200"}`}>
              {seedResult}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
