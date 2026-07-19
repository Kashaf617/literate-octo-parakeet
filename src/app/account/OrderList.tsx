"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp, Package, MapPin, CreditCard, Clipboard } from "lucide-react";
import Image from "next/image";

export default function OrderList({ orders }: { orders: any[] }) {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  function toggleExpand(orderId: string) {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
    }
  }

  async function handleCancelOrder(orderId: string, orderNumber: string) {
    if (cancellingId) return;
    const confirmCancel = window.confirm(`Are you sure you want to cancel order #${orderNumber}?`);
    if (!confirmCancel) return;

    setCancellingId(orderId);
    try {
      const res = await fetch(`/api/customer/orders/${orderId}/cancel`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        window.alert(`Order #${orderNumber} has been successfully cancelled.`);
        window.location.reload();
      } else {
        window.alert(data.error || "Failed to cancel order.");
      }
    } catch (err) {
      console.error(err);
      window.alert("An error occurred while cancelling your order.");
    } finally {
      setCancellingId(null);
    }
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const isExpanded = expandedOrderId === order.id;
        return (
          <div 
            key={order.id} 
            className="bg-white rounded-2xl shadow-sm border border-line overflow-hidden hover:shadow-md transition duration-300"
          >
            {/* Order Header Summary */}
            <div className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-line">
                <div>
                  <div className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">Order Number</div>
                  <div className="text-[15px] font-black text-black">#{order.orderNumber}</div>
                </div>
                <div>
                  <div className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">Date</div>
                  <div className="text-[14px] font-bold text-black">
                    {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Amount</div>
                  <div className="text-[15px] font-black text-[#C9A227]">PKR {order.total.toLocaleString()}</div>
                </div>
                <div>
                  <span className={`inline-flex px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                    order.orderStatus === "delivered" ? "bg-green-50 text-green-700 border border-green-200" :
                    order.orderStatus === "cancelled" ? "bg-red-50 text-red-700 border border-red-200" :
                    "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}>
                    {order.orderStatus}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-[12px] font-bold text-gray-500 uppercase tracking-widest">
                  {order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod.toUpperCase()} • {order.paymentStatus.toUpperCase()}
                </div>
                <button 
                  onClick={() => toggleExpand(order.id)}
                  className="text-[#C9A227] hover:text-[#b38e1e] font-black text-[12px] uppercase tracking-widest flex items-center gap-1 transition-colors"
                >
                  {isExpanded ? (
                    <>Hide Details <ChevronUp className="w-4 h-4" /></>
                  ) : (
                    <>View Details <ChevronDown className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            </div>

            {/* Expanded Details Section */}
            {isExpanded && (
              <div className="bg-gray-50/50 border-t border-line p-6 space-y-6">
                
                {/* 1. Items List */}
                <div>
                  <h4 className="text-[11px] font-black text-black uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Package className="w-4 h-4 text-brand" /> Items Ordered
                  </h4>
                  <div className="divide-y divide-line bg-white border border-line rounded-2xl overflow-hidden px-4">
                    {order.items.map((item: any, idx: number) => (
                      <div key={idx} className="py-4 flex gap-4 items-center">
                        <div className="w-12 h-12 relative bg-white border border-line rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                          <Image 
                            src={item.image || "/placeholder.png"} 
                            alt={item.name} 
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="text-[13px] font-bold text-black truncate">{item.name}</h5>
                          <p className="text-[11px] text-gray-500 font-medium">Qty: {item.qty} × PKR {item.price.toLocaleString()}</p>
                        </div>
                        <div className="text-[13px] font-black text-black">
                          PKR {(item.qty * item.price).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Billing / Shipping Summary & Delivery Address */}
                <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-line">
                  
                  {/* Shipping Details */}
                  <div className="space-y-3">
                    <h4 className="text-[11px] font-black text-black uppercase tracking-widest flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-brand" /> Shipping Details
                    </h4>
                    <div className="bg-white border border-line rounded-2xl p-4 text-[13px] text-gray-600 space-y-1">
                      <p className="font-extrabold text-black">{order.customerName}</p>
                      <p className="font-medium">{order.address}</p>
                      <p className="font-medium">{order.city}, {order.province || ""}</p>
                      <p className="font-bold text-black mt-2">📞 {order.phone}</p>
                      {order.notes && (
                        <div className="mt-3 pt-3 border-t border-line text-[12px] italic text-gray-400">
                          <strong>Note:</strong> {order.notes}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Summary Pricing */}
                  <div className="space-y-3">
                    <h4 className="text-[11px] font-black text-black uppercase tracking-widest flex items-center gap-2">
                      <Clipboard className="w-4 h-4 text-brand" /> Cost breakdown
                    </h4>
                    <div className="bg-white border border-line rounded-2xl p-4 text-[13px] text-gray-600 space-y-2">
                      <div className="flex justify-between font-medium">
                        <span>Subtotal</span>
                        <span className="text-black font-bold">PKR {order.subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Shipping Fee</span>
                        <span className="text-black font-bold">PKR {order.shippingFee.toLocaleString()}</span>
                      </div>
                      {order.discount > 0 && (
                        <div className="flex justify-between font-medium text-red-600">
                          <span>Discount Applied</span>
                          <span>-PKR {order.discount.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-black text-[15px] border-t border-line pt-2 text-[#C9A227]">
                        <span>Total Price</span>
                        <span>PKR {order.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cancel Order Action */}
                {(order.orderStatus.toLowerCase() === "processing" || order.orderStatus.toLowerCase() === "pending") && (
                  <div className="pt-4 border-t border-line flex justify-end">
                    <button
                      type="button"
                      disabled={cancellingId === order.id}
                      onClick={() => handleCancelOrder(order.id, order.orderNumber)}
                      className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-[11px] uppercase tracking-wider rounded-xl transition duration-200 shadow-sm disabled:opacity-50"
                    >
                      {cancellingId === order.id ? "Cancelling..." : "Cancel Order"}
                    </button>
                  </div>
                )}

              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
