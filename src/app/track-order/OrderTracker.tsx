"use client";
import { useState } from "react";
import { Loader2, Search, Package, MapPin, Clipboard, CheckCircle, Clock, Truck } from "lucide-react";
import Image from "next/image";

export default function OrderTracker() {
  const [orderNumber, setOrderNumber] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<any | null>(null);

  async function handleTrack(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const res = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber, contact })
      });

      const data = await res.json();
      if (res.ok) {
        setOrder(data.order);
      } else {
        setError(data.error || "Failed to find order. Please verify your details.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const getStatusStep = (status: string) => {
    switch (status.toLowerCase()) {
      case "processing": return 1;
      case "shipped": return 2;
      case "delivered": return 3;
      default: return 1;
    }
  };

  const statusStep = order ? getStatusStep(order.orderStatus) : 1;

  return (
    <div className="w-full">
      {/* Input Form */}
      <div className="bg-white rounded-3xl border border-line p-6 md:p-8 shadow-sm mb-10">
        <form onSubmit={handleTrack} className="space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">Order Number</label>
              <input 
                required 
                type="text" 
                value={orderNumber} 
                onChange={(e) => setOrderNumber(e.target.value)} 
                placeholder="e.g. DO-123456" 
                className="w-full bg-[#f8f9fa] border border-line rounded-xl px-4 py-3 outline-none focus:border-brand text-sm font-mono font-bold uppercase text-black"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">Email or Phone Number</label>
              <input 
                required 
                type="text" 
                value={contact} 
                onChange={(e) => setContact(e.target.value)} 
                placeholder="e.g. customer@gmail.com or 03001234567" 
                className="w-full bg-[#f8f9fa] border border-line rounded-xl px-4 py-3 outline-none focus:border-brand text-sm font-medium text-black"
              />
            </div>
          </div>
          
          <button 
            disabled={loading} 
            type="submit" 
            className="w-full bg-black text-white font-black text-[12px] uppercase tracking-widest py-4 hover:bg-[#27272a] transition-all rounded-xl flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>Track Shipment <Search className="w-4 h-4" /></>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl text-center animate-pulse">
            ⚠️ {error}
          </div>
        )}
      </div>

      {/* Tracking Results */}
      {order && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Status Timeline */}
          <div className="bg-white rounded-3xl border border-line p-6 md:p-8 shadow-sm">
            <h3 className="text-[12px] font-black text-black uppercase tracking-widest mb-8">Delivery Progress</h3>
            
            <div className="relative flex justify-between items-center w-full">
              {/* Connecting Line */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
              <div 
                className="absolute top-1/2 left-0 h-1 bg-[#C9A227] -translate-y-1/2 z-0 transition-all duration-500"
                style={{ width: statusStep === 1 ? "15%" : statusStep === 2 ? "50%" : "100%" }}
              ></div>

              {/* Steps */}
              <div className="relative z-10 flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${statusStep >= 1 ? 'bg-[#C9A227] text-white' : 'bg-gray-200 text-gray-400'}`}>
                  <Clock className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase mt-2 text-black">Processing</span>
              </div>

              <div className="relative z-10 flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${statusStep >= 2 ? 'bg-[#C9A227] text-white' : 'bg-gray-200 text-gray-400'}`}>
                  <Truck className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase mt-2 text-black">Shipped</span>
              </div>

              <div className="relative z-10 flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${statusStep >= 3 ? 'bg-[#C9A227] text-white' : 'bg-gray-200 text-gray-400'}`}>
                  <CheckCircle className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase mt-2 text-black">Delivered</span>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-3xl border border-line p-6 md:p-8 shadow-sm space-y-6">
            <div>
              <h4 className="text-[11px] font-black text-black uppercase tracking-widest mb-4 flex items-center gap-2">
                <Package className="w-4 h-4 text-[#C9A227]" /> Items Ordered
              </h4>
              <div className="divide-y divide-line bg-gray-50 border border-line rounded-2xl overflow-hidden px-4">
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

            {/* Shipping and Cost breakdown */}
            <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-line">
              <div className="space-y-3">
                <h4 className="text-[11px] font-black text-black uppercase tracking-widest flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#C9A227]" /> Shipping details
                </h4>
                <div className="bg-gray-50 border border-line rounded-2xl p-4 text-[13px] text-gray-600 space-y-1">
                  <p className="font-extrabold text-black">{order.customerName}</p>
                  <p className="font-medium">{order.address}</p>
                  <p className="font-medium">{order.city}, {order.province || ""}</p>
                  <p className="font-bold text-black mt-2">📞 {order.phone}</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-[11px] font-black text-black uppercase tracking-widest flex items-center gap-2">
                  <Clipboard className="w-4 h-4 text-[#C9A227]" /> Cost breakdown
                </h4>
                <div className="bg-gray-50 border border-line rounded-2xl p-4 text-[13px] text-gray-600 space-y-2">
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
          </div>

        </div>
      )}
    </div>
  );
}
