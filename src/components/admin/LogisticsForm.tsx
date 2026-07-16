"use client";
import { useState } from "react";

const COURIERS = [
  { key: "leopards", name: "Leopards Courier", color: "#e07b00" },
  { key: "tcs", name: "TCS", color: "#c8102e" },
  { key: "postex", name: "PostEx", color: "#7b5df0" },
  { key: "mnp", name: "M&P (Muller & Phipps)", color: "#1f6fdb" }
];

export default function LogisticsForm({ initial }: { initial: any }) {
  const [values, setValues] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  function set(path: string, value: any) {
    setValues((v: any) => {
      const clone = structuredClone(v);
      const keys = path.split(".");
      let obj = clone;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return clone;
    });
  }

  async function save() {
    setSaving(true);
    await fetch("/api/admin/settings/logistics", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
    setSaving(false);
    setMsg("Logistics settings saved");
    setTimeout(() => setMsg(""), 2500);
  }

  return (
    <div className="space-y-6">
      {msg && <div className="bg-green-50 text-success font-semibold text-sm rounded-lg px-4 py-2.5">{msg}</div>}

      <div className="admin-card">
        <h3 className="font-extrabold text-ink mb-3">Default Courier</h3>
        <p className="text-sub text-sm mb-3">Used to pre-select the courier when a new order is confirmed.</p>
        <select className="admin-select max-w-xs" value={values.defaultCourier} onChange={(e) => set("defaultCourier", e.target.value)}>
          {COURIERS.map((c) => <option key={c.key} value={c.key}>{c.name}</option>)}
        </select>
      </div>

      {COURIERS.map((c) => (
        <div key={c.key} className="admin-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
              <h3 className="font-extrabold text-ink">{c.name}</h3>
              <span className="text-[10px] font-bold uppercase bg-bg text-sub px-2 py-0.5 rounded-full">Pakistan</span>
            </div>
            <label className="inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={values[c.key].enabled} onChange={(e) => set(`${c.key}.enabled`, e.target.checked)} />
              <div className="w-11 h-6 rounded-full transition relative" style={{ background: values[c.key].enabled ? "#2fa84f" : "#e5e7eb" }}>
                <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition" style={{ transform: values[c.key].enabled ? "translateX(20px)" : "translateX(0)" }} />
              </div>
            </label>
          </div>
          {values[c.key].enabled && (
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="admin-label">API Key</label>
                <input type="password" className="admin-input" value={values[c.key].apiKey} onChange={(e) => set(`${c.key}.apiKey`, e.target.value)} />
              </div>
              {c.key === "leopards" && (
                <div>
                  <label className="admin-label">API Password</label>
                  <input type="password" className="admin-input" value={values.leopards.apiPassword} onChange={(e) => set("leopards.apiPassword", e.target.value)} />
                </div>
              )}
              {c.key === "tcs" && (
                <div>
                  <label className="admin-label">Cost Center Code</label>
                  <input className="admin-input" value={values.tcs.costCenter} onChange={(e) => set("tcs.costCenter", e.target.value)} />
                </div>
              )}
              <p className="text-[11px] text-sub sm:col-span-2">
                Order status webhook to give {c.name}: <code>{"{yourdomain}"}/api/webhooks/{c.key}</code> — updates order status &amp; tracking automatically.
              </p>
            </div>
          )}
        </div>
      ))}

      <button onClick={save} disabled={saving} className="btn-primary">{saving ? "Saving..." : "Save Logistics Settings"}</button>
    </div>
  );
}
