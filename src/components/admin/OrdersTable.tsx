"use client";
import { useState } from "react";
import Link from "next/link";
import { fmtCurrency } from "@/lib/utils";
import StatusBadge from "./StatusBadge";

interface Order {
  id: string; orderNumber: string; customerName: string; phone: string; city: string;
  total: number; orderStatus: string; paymentStatus: string; paymentMethod: string; createdAt: string;
}

const STATUSES = ["all", "processing", "confirmed", "packed", "shipped", "delivered", "cancelled", "returned"];

interface ProductItem {
  id: string;
  name: string;
  price: number;
  images?: string;
}

export default function OrdersTable({ initial, products = [] }: { initial: Order[]; products?: ProductItem[] }) {
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");

  const filtered = initial.filter((o) => {
    const statusMatch = filter === "all" || o.orderStatus === filter;
    const qMatch = !q || o.orderNumber.toLowerCase().includes(q.toLowerCase()) || o.customerName.toLowerCase().includes(q.toLowerCase()) || o.phone.includes(q);
    return statusMatch && qMatch;
  });

  const [clearing, setClearing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Manual Order Form State
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Lahore");
  const [notes, setNotes] = useState("Instagram / WhatsApp Order");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [orderStatus, setOrderStatus] = useState("processing");
  const [shippingFee, setShippingFee] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [items, setItems] = useState<{ name: string; price: number; qty: number; productId?: string }[]>([]);

  // Item input helpers
  const [selectedProductId, setSelectedProductId] = useState("");
  const [customItemName, setCustomItemName] = useState("");
  const [customItemPrice, setCustomItemPrice] = useState("");
  const [customItemQty, setCustomItemQty] = useState(1);

  function handleAddSelectedProduct() {
    if (!selectedProductId) return;
    const prod = products.find(p => p.id === selectedProductId);
    if (!prod) return;
    setItems([...items, { name: prod.name, price: prod.price, qty: 1, productId: prod.id }]);
    setSelectedProductId("");
  }

  function handleAddCustomItem() {
    if (!customItemName || !customItemPrice) return;
    setItems([...items, { name: customItemName.trim(), price: Number(customItemPrice), qty: Number(customItemQty) || 1 }]);
    setCustomItemName("");
    setCustomItemPrice("");
    setCustomItemQty(1);
  }

  function removeItem(index: number) {
    setItems(items.filter((_, i) => i !== index));
  }

  async function handleCreateManualOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!customerName || !phone || !address || !city) {
      alert("Please fill in Customer Name, Phone, Address, and City.");
      return;
    }
    if (items.length === 0) {
      alert("Please add at least 1 product item to the order.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          phone,
          email,
          address,
          city,
          notes,
          paymentMethod,
          orderStatus,
          shippingFee: Number(shippingFee),
          discount: Number(discount),
          items
        })
      });
      const data = await res.json();
      setSubmitting(false);
      if (res.ok && data.success) {
        alert(`Order #${data.order.orderNumber} created successfully!`);
        setShowModal(false);
        window.location.reload();
      } else {
        alert(`Failed to create order: ${data.error || "Unknown error"}`);
      }
    } catch (err: any) {
      setSubmitting(false);
      alert(`Error: ${err.message}`);
    }
  }

  async function handleClearAllOrders() {
    if (!confirm("Are you sure you want to delete ALL test orders from the database? This cannot be undone.")) return;
    setClearing(true);
    try {
      const res = await fetch("/api/admin/orders/clear-all", { method: "DELETE" });
      const data = await res.json();
      setClearing(false);
      if (res.ok && data.success) {
        alert(data.message);
        window.location.reload();
      } else {
        alert(`Failed to clear orders: ${data.error || "Unknown error"}`);
      }
    } catch (err: any) {
      setClearing(false);
      alert(`Error: ${err.message}`);
    }
  }

  const calculatedSubtotal = items.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const calculatedTotal = calculatedSubtotal + Number(shippingFee) - Number(discount);

  return (
    <div className="admin-card">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`text-xs font-bold px-3 py-1.5 rounded-full border transition capitalize ${filter === s ? "bg-navy text-white border-navy" : "border-line text-sub hover:border-brand"}`}
          >
            {s} {s !== "all" && `(${initial.filter((o) => o.orderStatus === s).length})`}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-3">
          <input className="admin-input max-w-[200px]" placeholder="Search order, name, phone..." value={q} onChange={(e) => setQ(e.target.value)} />
          
          <button
            onClick={() => setShowModal(true)}
            className="bg-[#0b1221] text-white hover:bg-black text-xs font-bold px-4 py-2 rounded-xl transition-colors shrink-0"
          >
            + Create Manual Order
          </button>

          {initial.length > 0 && (
            <button
              onClick={handleClearAllOrders}
              disabled={clearing}
              className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 text-xs font-bold px-3.5 py-2 rounded-xl transition-colors shrink-0 disabled:opacity-50"
            >
              {clearing ? "Clearing..." : "🗑️ Clear Test Orders"}
            </button>
          )}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-sub text-xs uppercase border-b border-line">
              <th className="pb-2 font-bold">Order</th>
              <th className="pb-2 font-bold">Customer</th>
              <th className="pb-2 font-bold">City</th>
              <th className="pb-2 font-bold">Total</th>
              <th className="pb-2 font-bold">Payment</th>
              <th className="pb-2 font-bold">Status</th>
              <th className="pb-2 font-bold">Date</th>
              <th className="pb-2 font-bold text-right">—</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} className="border-b border-line last:border-0">
                <td className="py-3 font-bold text-brand">{o.orderNumber}</td>
                <td className="py-3">
                  <div className="font-semibold">{o.customerName}</div>
                  <div className="text-xs text-sub">{o.phone}</div>
                </td>
                <td className="py-3 text-sub">{o.city}</td>
                <td className="py-3 font-semibold">{fmtCurrency(o.total)}</td>
                <td className="py-3">
                  <div className="text-xs uppercase font-bold text-sub">{o.paymentMethod}</div>
                  <StatusBadge status={o.paymentStatus} />
                </td>
                <td className="py-3"><StatusBadge status={o.orderStatus} /></td>
                <td className="py-3 text-sub text-xs">{new Date(o.createdAt).toLocaleDateString()}</td>
                <td className="py-3 text-right">
                  <Link href={`/admin/orders/${o.id}`} className="text-brand font-bold text-xs">Manage →</Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={8} className="py-8 text-center text-sub">No orders match this filter.</td></tr>}
          </tbody>
        </table>
      </div>

      {/* MANUAL ORDER MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-6 my-8 border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-xl font-extrabold text-ink">Create Manual Order</h3>
                <p className="text-xs text-sub mt-0.5">Add an order from Instagram, WhatsApp, or Phone sales.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-black font-bold text-lg p-1">✕</button>
            </div>

            <form onSubmit={handleCreateManualOrder} className="space-y-5">
              {/* Customer Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Customer Name *</label>
                  <input required className="admin-input" value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="e.g. Ali Hassan" />
                </div>
                <div>
                  <label className="admin-label">Phone Number *</label>
                  <input required className="admin-input" value={phone} onChange={e => setPhone(e.target.value)} placeholder="e.g. 03001234567" />
                </div>
                <div>
                  <label className="admin-label">Email Address (Optional)</label>
                  <input className="admin-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="customer@example.com" />
                </div>
                <div>
                  <label className="admin-label">City *</label>
                  <input required className="admin-input" value={city} onChange={e => setCity(e.target.value)} placeholder="Lahore, Karachi, Islamabad..." />
                </div>
              </div>

              <div>
                <label className="admin-label">Shipping Address *</label>
                <input required className="admin-input" value={address} onChange={e => setAddress(e.target.value)} placeholder="House #, Street #, Area..." />
              </div>

              <div>
                <label className="admin-label">Order Notes / Source</label>
                <input className="admin-input" value={notes} onChange={e => setNotes(e.target.value)} placeholder="e.g. Instagram Order @customer_handle" />
              </div>

              {/* Order Items */}
              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-4">
                <h4 className="font-bold text-ink text-sm">Order Items</h4>

                {/* Select Store Product */}
                {products.length > 0 && (
                  <div className="flex gap-2">
                    <select
                      className="admin-input flex-1"
                      value={selectedProductId}
                      onChange={e => setSelectedProductId(e.target.value)}
                    >
                      <option value="">-- Select Store Product --</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name} - PKR {p.price.toLocaleString()}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={handleAddSelectedProduct}
                      disabled={!selectedProductId}
                      className="bg-[#0b1221] text-white text-xs font-bold px-4 py-2 rounded-xl disabled:opacity-40"
                    >
                      + Add Product
                    </button>
                  </div>
                )}

                {/* Custom Item */}
                <div className="grid grid-cols-[1fr_100px_70px_auto] gap-2 items-center">
                  <input className="admin-input" placeholder="Custom Item Name" value={customItemName} onChange={e => setCustomItemName(e.target.value)} />
                  <input className="admin-input" type="number" placeholder="Price (PKR)" value={customItemPrice} onChange={e => setCustomItemPrice(e.target.value)} />
                  <input className="admin-input" type="number" min="1" placeholder="Qty" value={customItemQty} onChange={e => setCustomItemQty(Number(e.target.value))} />
                  <button type="button" onClick={handleAddCustomItem} className="bg-gray-200 text-ink text-xs font-bold px-3 py-2.5 rounded-xl hover:bg-gray-300">
                    + Custom
                  </button>
                </div>

                {/* Items List Table */}
                {items.length > 0 ? (
                  <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
                    {items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 text-xs">
                        <div>
                          <span className="font-bold text-ink">{item.name}</span>
                          <span className="text-sub ml-2">(PKR {item.price.toLocaleString()} x {item.qty})</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-extrabold text-ink">PKR {(item.price * item.qty).toLocaleString()}</span>
                          <button type="button" onClick={() => removeItem(idx)} className="text-red-500 hover:text-red-700 font-bold">✕</button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-sub italic">No items added yet. Select a product above or enter a custom item.</p>
                )}
              </div>

              {/* Payment & Shipping */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="admin-label">Payment Method</label>
                  <select className="admin-input" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                    <option value="cod">Cash on Delivery (COD)</option>
                    <option value="bank">Bank Transfer</option>
                    <option value="jazzcash">JazzCash</option>
                    <option value="easypaisa">EasyPaisa</option>
                  </select>
                </div>
                <div>
                  <label className="admin-label">Shipping Fee (PKR)</label>
                  <input className="admin-input" type="number" value={shippingFee} onChange={e => setShippingFee(Number(e.target.value))} />
                </div>
                <div>
                  <label className="admin-label">Discount (PKR)</label>
                  <input className="admin-input" type="number" value={discount} onChange={e => setDiscount(Number(e.target.value))} />
                </div>
              </div>

              {/* Summary & Submit */}
              <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                <div>
                  <span className="text-xs text-sub block">Total Payable:</span>
                  <span className="text-xl font-black text-brand">PKR {calculatedTotal.toLocaleString()}</span>
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50">
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} className="bg-[#0b1221] text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-black transition-colors disabled:opacity-50">
                    {submitting ? "Saving Order..." : "Create Order"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
