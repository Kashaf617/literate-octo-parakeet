"use client";
import { useState } from "react";

export default function GeneralSettingsForm({ initial }: { initial: any }) {
  const [values, setValues] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  async function save() {
    setSaving(true);
    await fetch("/api/admin/settings/general", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
    setSaving(false);
    setMsg("Store settings saved");
    setTimeout(() => setMsg(""), 2500);
  }

  return (
    <div className="admin-card space-y-4 max-w-2xl">
      {msg && <div className="bg-green-50 text-success font-semibold text-sm rounded-lg px-4 py-2.5">{msg}</div>}
      <div>
        <label className="admin-label">Store Name</label>
        <input className="admin-input" value={values.storeName} onChange={(e) => setValues({ ...values, storeName: e.target.value })} />
      </div>
      <div>
        <label className="admin-label">Tagline</label>
        <input className="admin-input" value={values.tagline} onChange={(e) => setValues({ ...values, tagline: e.target.value })} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="admin-label">Support Phone</label>
          <input className="admin-input" value={values.supportPhone} onChange={(e) => setValues({ ...values, supportPhone: e.target.value })} />
        </div>
        <div>
          <label className="admin-label">Store Currency</label>
          <select className="admin-select" value={values.currency} onChange={(e) => setValues({ ...values, currency: e.target.value })}>
            <option value="PKR">PKR (Rs.)</option>
            <option value="USD">USD ($)</option>
            <option value="SAR">SAR</option>
          </select>
        </div>
      </div>
      <div>
        <label className="admin-label">Shipping Message</label>
        <input className="admin-input" value={values.freeShippingText} onChange={(e) => setValues({ ...values, freeShippingText: e.target.value })} />
      </div>
      <button onClick={save} disabled={saving} className="btn-primary">{saving ? "Saving..." : "Save Settings"}</button>
    </div>
  );
}
