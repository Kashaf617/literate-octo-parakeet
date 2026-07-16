"use client";
import { useState } from "react";

export default function PaymentsForm({ initial }: { initial: any }) {
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
    await fetch("/api/admin/settings/payments", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
    setSaving(false);
    setMsg("Payment settings saved");
    setTimeout(() => setMsg(""), 2500);
  }

  return (
    <div className="space-y-6">
      {msg && <div className="bg-green-50 text-success font-semibold text-sm rounded-lg px-4 py-2.5">{msg}</div>}

      <div className="admin-card flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-ink">Cash on Delivery (COD)</h3>
          <p className="text-sub text-sm">Pakistan's most-used payment method — recommended to keep enabled.</p>
        </div>
        <label className="inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" checked={values.codEnabled} onChange={(e) => set("codEnabled", e.target.checked)} />
          <div className="w-11 h-6 bg-gray-200 peer-checked:bg-success rounded-full transition relative">
            <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition peer-checked:translate-x-5" style={{ transform: values.codEnabled ? "translateX(20px)" : "translateX(0)" }} />
          </div>
        </label>
      </div>

      <GatewayCard
        title="JazzCash"
        badge="Pakistan"
        color="#e2001a"
        enabled={values.jazzcash.enabled}
        onToggle={(v: any) => set("jazzcash.enabled", v)}
      >
        <Field label="Merchant ID" value={values.jazzcash.merchantId} onChange={(v: any) => set("jazzcash.merchantId", v)} />
        <Field label="Password" type="password" value={values.jazzcash.password} onChange={(v: any) => set("jazzcash.password", v)} />
        <Field label="Integrity Salt" type="password" value={values.jazzcash.integritySalt} onChange={(v: any) => set("jazzcash.integritySalt", v)} />
        <ModeSelect value={values.jazzcash.mode} onChange={(v: any) => set("jazzcash.mode", v)} />
        <div className="sm:col-span-2 border-t border-dashed border-line pt-4 mt-2">
          <p className="text-[11px] font-black uppercase tracking-wider text-sub mb-3">📱 Customer-Facing Display (shown at checkout)</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Display Account Number" value={values.jazzcash.displayNumber || ""} onChange={(v: any) => set("jazzcash.displayNumber", v)} />
            <Field label="Account Holder Name" value={values.jazzcash.displayName || ""} onChange={(v: any) => set("jazzcash.displayName", v)} />
          </div>
        </div>
        <p className="text-[11px] text-sub sm:col-span-2">Webhook / return URL to give JazzCash: <code>{"{yourdomain}"}/api/webhooks/jazzcash</code></p>
      </GatewayCard>

      <GatewayCard
        title="EasyPaisa"
        badge="Pakistan"
        color="#22b04b"
        enabled={values.easypaisa.enabled}
        onToggle={(v: any) => set("easypaisa.enabled", v)}
      >
        <Field label="Store ID" value={values.easypaisa.storeId} onChange={(v: any) => set("easypaisa.storeId", v)} />
        <Field label="Account Number" value={values.easypaisa.accountNum} onChange={(v: any) => set("easypaisa.accountNum", v)} />
        <Field label="Hash Key" type="password" value={values.easypaisa.hashKey} onChange={(v: any) => set("easypaisa.hashKey", v)} />
        <ModeSelect value={values.easypaisa.mode} onChange={(v: any) => set("easypaisa.mode", v)} />
        <div className="sm:col-span-2 border-t border-dashed border-line pt-4 mt-2">
          <p className="text-[11px] font-black uppercase tracking-wider text-sub mb-3">📱 Customer-Facing Display (shown at checkout)</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Display Account Number" value={values.easypaisa.displayNumber || ""} onChange={(v: any) => set("easypaisa.displayNumber", v)} />
            <Field label="Account Holder Name" value={values.easypaisa.displayName || ""} onChange={(v: any) => set("easypaisa.displayName", v)} />
          </div>
        </div>
        <p className="text-[11px] text-sub sm:col-span-2">Webhook / return URL: <code>{"{yourdomain}"}/api/webhooks/easypaisa</code></p>
      </GatewayCard>

      <GatewayCard
        title="PayFast"
        badge="Pakistan"
        color="#1f6fdb"
        enabled={values.payfast.enabled}
        onToggle={(v: any) => set("payfast.enabled", v)}
      >
        <Field label="Merchant ID" value={values.payfast.merchantId} onChange={(v: any) => set("payfast.merchantId", v)} />
        <Field label="Secure Key" type="password" value={values.payfast.secureKey} onChange={(v: any) => set("payfast.secureKey", v)} />
        <ModeSelect value={values.payfast.mode} onChange={(v: any) => set("payfast.mode", v)} />
      </GatewayCard>

      <GatewayCard
        title="Direct Bank Transfer"
        badge="Manual"
        color="#122043"
        enabled={values.bankTransfer.enabled}
        onToggle={(v: any) => set("bankTransfer.enabled", v)}
      >
        <Field label="Account Title" value={values.bankTransfer.accountTitle} onChange={(v: any) => set("bankTransfer.accountTitle", v)} />
        <Field label="Account Number" value={values.bankTransfer.accountNumber} onChange={(v: any) => set("bankTransfer.accountNumber", v)} />
        <Field label="Bank Name" value={values.bankTransfer.bankName} onChange={(v: any) => set("bankTransfer.bankName", v)} />
        <Field label="IBAN" value={values.bankTransfer.iban} onChange={(v: any) => set("bankTransfer.iban", v)} />
        <div className="sm:col-span-2 border-t border-dashed border-line pt-4 mt-2">
          <label className="admin-label">Customer Instructions (shown at checkout)</label>
          <textarea
            className="admin-input w-full min-h-[80px] resize-y"
            value={values.bankTransfer.displayInstructions || ""}
            onChange={(e) => set("bankTransfer.displayInstructions", e.target.value)}
            placeholder="e.g. Transfer to Meezan Bank. Account: 0123456789. Title: DEVINE ORA."
          />
        </div>
      </GatewayCard>

      <button onClick={save} disabled={saving} className="btn-primary">{saving ? "Saving..." : "Save Payment Settings"}</button>
    </div>
  );
}

function GatewayCard({ title, badge, color, enabled, onToggle, children }: any) {
  return (
    <div className="admin-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
          <h3 className="font-extrabold text-ink">{title}</h3>
          <span className="text-[10px] font-bold uppercase bg-bg text-sub px-2 py-0.5 rounded-full">{badge}</span>
        </div>
        <label className="inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" checked={enabled} onChange={(e) => onToggle(e.target.checked)} />
          <div className="w-11 h-6 bg-gray-200 rounded-full transition relative" style={{ background: enabled ? "#2fa84f" : undefined }}>
            <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition" style={{ transform: enabled ? "translateX(20px)" : "translateX(0)" }} />
          </div>
        </label>
      </div>
      {enabled && <div className="grid sm:grid-cols-2 gap-4">{children}</div>}
      {!enabled && <p className="text-sub text-sm">Enable to configure credentials for {title}.</p>}
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: any) {
  return (
    <div>
      <label className="admin-label">{label}</label>
      <input type={type} className="admin-input" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function ModeSelect({ value, onChange }: any) {
  return (
    <div>
      <label className="admin-label">Environment</label>
      <select className="admin-select" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="sandbox">Sandbox (Testing)</option>
        <option value="live">Live (Production)</option>
      </select>
    </div>
  );
}
