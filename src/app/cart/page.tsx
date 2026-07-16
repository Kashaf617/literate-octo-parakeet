"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2, ArrowRight, Truck, ChevronLeft,
  Banknote, MessageCircle, Shield, Package, Clock,
  Copy, Check, ShoppingCart, Trash2
} from "lucide-react";
import { createOrder } from "./actions";
import { trackInitiateCheckout, trackPurchase } from "@/lib/tracking";
import { getCart, removeFromCart, updateCartQty, clearCart, CartItem } from "@/lib/cart";

export default function CartPage() {
  const [step, setStep] = useState<"cart" | "checkout" | "success">("cart");
  const [loading, setLoading] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("Punjab");
  const [citySearch, setCitySearch] = useState("");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountAmount: number } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "advance">("cod");
  const [advanceDiscount, setAdvanceDiscount] = useState(200);
  const [whatsappNumber, setWhatsappNumber] = useState("+923001234567");
  const [jazzcashNumber, setJazzcashNumber] = useState("03001234567");
  const [easypaisaNumber, setEasypaisaNumber] = useState("03001234567");
  const [copied, setCopied] = useState<string | null>(null);
  const [paySettings, setPaySettings] = useState<any>({
    jazzcash: { enabled: false, displayNumber: "", displayName: "" },
    easypaisa: { enabled: false, displayNumber: "", displayName: "" },
    bankTransfer: { enabled: false, accountTitle: "", accountNumber: "", bankName: "", iban: "", displayInstructions: "" },
  });

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartLoading, setCartLoading] = useState(true);

  useEffect(() => {
    // Resolve general settings
    fetch("/api/admin/settings")
      .then(r => r.json())
      .then(d => {
        if (d.advance_payment_discount) setAdvanceDiscount(Number(d.advance_payment_discount));
        if (d.company_whatsapp) setWhatsappNumber(d.company_whatsapp);
        if (d.jazzcash_number) setJazzcashNumber(d.jazzcash_number);
        if (d.easypaisa_number) setEasypaisaNumber(d.easypaisa_number);
      })
      .catch(() => {});

    fetch("/api/admin/settings/payments")
      .then(r => r.json())
      .then(d => { if (d) setPaySettings(d); })
      .catch(() => {});

    // Parse URL parameters if any (Buy Now redirection)
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("productId");
    
    if (productId) {
      const newItem = {
        id: productId,
        name: params.get("name") || "Product",
        price: Number(params.get("price") || 0),
        qty: Number(params.get("qty") || 1),
        image: params.get("image") || "/placeholder.png",
        variant: params.get("variant") || ""
      };
      
      // Save item in persistent local storage
      const list = getCart();
      const existing = list.find((i) => i.id === newItem.id && i.variant === newItem.variant);
      if (existing) {
        existing.qty += newItem.qty;
        localStorage.setItem('cart', JSON.stringify(list));
      } else {
        list.push(newItem);
        localStorage.setItem('cart', JSON.stringify(list));
      }
      window.dispatchEvent(new Event('cart-update'));
      window.history.replaceState({}, '', '/cart');
    }

    setCartItems(getCart());
    setCartLoading(false);
  }, []);

  const handleQtyChange = (id: string, variant: string, qty: number) => {
    const updated = updateCartQty(id, variant, qty);
    setCartItems(updated);
  };

  const handleRemove = (id: string, variant: string) => {
    const updated = removeFromCart(id, variant);
    setCartItems(updated);
  };

  const provinceCities: Record<string, string[]> = {
    "Punjab": ["Lahore", "Faisalabad", "Rawalpindi", "Multan", "Gujranwala", "Sialkot", "Sargodha", "Bahawalpur", "Sheikhupura", "Jhang", "Gujrat", "Kasur", "Sahiwal", "Okara", "Wah Cantonment", "Dera Ghazi Khan", "Chiniot", "Kamoke", "Sadiqabad", "Burewala", "Vehari", "Muridke"],
    "Sindh": ["Karachi", "Hyderabad", "Sukkur", "Larkana", "Nawabshah", "Mirpur Khas", "Jacobabad", "Shikarpur", "Khairpur", "Dadu", "Tando Adam", "Tando Allahyar", "Umerkot", "Badin"],
    "KPK": ["Peshawar", "Mardan", "Mingora", "Kohat", "Abbottabad", "Swat", "Dera Ismail Khan", "Nowshera", "Charsadda", "Mansehra", "Swabi", "Timargara", "Bannu", "Batkhela"],
    "Balochistan": ["Quetta", "Gwadar", "Khuzdar", "Chaman", "Turbat", "Sibi", "Hub", "Zhob", "Dera Murad Jamali"],
    "Islamabad": ["Islamabad"]
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = 0;
  const advanceSaving = paymentMethod === "advance" ? advanceDiscount : 0;
  const couponDiscount = appliedCoupon?.discountAmount || 0;
  const total = subtotal + shipping - couponDiscount - advanceSaving;

  // Tracking Effect
  useEffect(() => {
    if (cartItems.length === 0) return;
    const itemsToTrack = cartItems.map(item => ({
      productId: item.id,
      name: item.name,
      price: item.price,
      quantity: item.qty
    }));

    if (step === "checkout") {
      trackInitiateCheckout(total, "PKR", itemsToTrack);
    } else if (step === "success" && orderNumber) {
      trackPurchase(orderNumber, total, "PKR", itemsToTrack);
    }
  }, [step, orderNumber, total, cartItems]);

  function copyToClipboard(text: string, key: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    });
  }

  async function handleApplyCoupon() {
    if (!couponCode) return;
    setCouponLoading(true);
    setCouponError("");
    const res = await fetch("/api/checkout/apply-coupon", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: couponCode, cartTotal: subtotal })
    });
    setCouponLoading(false);
    const data = await res.json();
    if (res.ok) {
      setAppliedCoupon({ code: data.coupon.code, discountAmount: data.discountAmount });
      setCouponCode("");
    } else {
      setCouponError(data.error);
    }
  }

  async function handleCheckout(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const res = await createOrder({
      customerName: fd.get("name") as string,
      phone: fd.get("phone") as string,
      email: fd.get("email") as string,
      address: fd.get("address") as string,
      city: fd.get("city") as string,
      province: fd.get("province") as string,
      postalCode: fd.get("postal") as string,
      total,
      couponCode: appliedCoupon?.code || undefined,
      discountAmount: appliedCoupon?.discountAmount || undefined,
      paymentMethod,
      items: cartItems.map(item => ({
        productId: item.id,
        name: item.variant ? `${item.name} (${item.variant})` : item.name,
        price: item.price,
        qty: item.qty,
        image: item.image
      }))
    });
    if (res.success) {
      setOrderNumber(res.orderNumber || "");
      clearCart();
      setStep("success");
    } else {
      alert("Checkout failed. Please try again.");
    }
    setLoading(false);
  }

  async function handleEmailBlur(e: React.FocusEvent<HTMLInputElement>) {
    const email = e.target.value;
    if (!email || !email.includes("@")) return;
    await fetch("/api/cart/abandoned", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, cartData: cartItems })
    }).catch(console.error);
  }

  function openWhatsApp() {
    const clean = whatsappNumber.replace(/[^0-9]/g, "");
    const msg = encodeURIComponent(
      `Hi! I placed order *#${orderNumber}* via Advance Payment. Screenshot attached. Total: *Rs. ${total.toLocaleString()} PKR*. Please confirm!`
    );
    window.open(`https://wa.me/${clean}?text=${msg}`, "_blank");
  }

  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-black bg-[#f8f9fa] outline-none transition-all focus:border-[#1a1f2e] focus:bg-white focus:shadow-[0_0_0_3px_rgba(26,31,46,0.06)] placeholder:text-black/40";

  // ─── LOADING SCREEN ─────────────────────────────────────────────────────────
  if (cartLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#C9A227] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // ─── EMPTY STATE ────────────────────────────────────────────────────────────
  if (cartItems.length === 0 && step !== "success") {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-6 text-center">
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-12 max-w-md w-full">
          <div className="w-16 h-16 bg-[#F2E8CB]/40 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-6 h-6 text-black" />
          </div>
          <h2 className="text-2xl font-black font-heading uppercase text-black mb-3">Your Cart is Empty</h2>
          <p className="text-gray-500 font-light text-sm mb-8 leading-relaxed">
            You haven't added any luxury timepieces to your cart yet.
          </p>
          <Link 
            href="/search" 
            className="inline-block bg-black hover:bg-[#C9A227] hover:text-black border border-black hover:border-[#C9A227] text-white font-black text-xs uppercase tracking-widest px-10 py-4 rounded-xl transition-all duration-300 shadow-sm w-full"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  // ─── SUCCESS SCREEN ─────────────────────────────────────────────────────────
  if (step === "success") {
    const isAdvance = paymentMethod === "advance";
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4">
        <div className="max-w-[480px] w-full">
          <div className="bg-white rounded-3xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.12)] p-8 md:p-10 text-center">
            <div className="mx-auto w-20 h-20 mb-6 relative">
              <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" strokeWidth={1.5} />
              </div>
            </div>

            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-black/60 mb-2">Order Confirmed</p>
            <h1 className="text-3xl font-black text-black mb-2 tracking-tight">Thank You!</h1>
            <p className="text-black/70 text-sm mb-1">
              Order <span className="font-bold text-black">#{orderNumber}</span> placed successfully.
            </p>
            <p className="text-black/60 text-xs mb-8">
              Rs. {total.toLocaleString()} • {isAdvance ? "Advance Payment" : "Cash on Delivery"}
            </p>

            {isAdvance && (
              <div className="text-left mb-6 space-y-3">
                <div className="bg-[#f8f9fa] border border-gray-200 rounded-2xl p-5">
                  <p className="text-[11px] font-black uppercase tracking-[0.15em] text-black/60 mb-3">📋 Send Payment To</p>
                  
                  {paySettings.jazzcash?.displayNumber && (
                    <div className="flex items-center justify-between py-3 border-b border-black">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg overflow-hidden relative bg-[#f5f5f5]">
                          <Image src="/uploads/jazzcash.jpg" alt="JazzCash" fill className="object-contain p-1" />
                        </div>
                        <div>
                          <p className="text-[11px] text-black/60 font-medium">JazzCash</p>
                          <p className="text-sm font-bold text-black">{paySettings.jazzcash.displayNumber}</p>
                          {paySettings.jazzcash.displayName && <p className="text-xs text-black/70">{paySettings.jazzcash.displayName}</p>}
                        </div>
                      </div>
                      <button onClick={() => copyToClipboard(paySettings.jazzcash.displayNumber, "jc")} className="text-black/60 hover:text-black transition-colors p-2 rounded-lg hover:bg-[#f0f0f0]">
                        {copied === "jc" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  )}

                  {paySettings.easypaisa?.displayNumber && (
                    <div className="flex items-center justify-between py-3 border-b border-black">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg overflow-hidden relative bg-[#f5f5f5]">
                          <Image src="/uploads/easypaisa.png" alt="EasyPaisa" fill className="object-contain p-1" />
                        </div>
                        <div>
                          <p className="text-[11px] text-black/60 font-medium">EasyPaisa</p>
                          <p className="text-sm font-bold text-black">{paySettings.easypaisa.displayNumber}</p>
                          {paySettings.easypaisa.displayName && <p className="text-xs text-black/70">{paySettings.easypaisa.displayName}</p>}
                        </div>
                      </div>
                      <button onClick={() => copyToClipboard(paySettings.easypaisa.displayNumber, "ep")} className="text-black/60 hover:text-black transition-colors p-2 rounded-lg hover:bg-[#f0f0f0]">
                        {copied === "ep" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  )}

                  {paySettings.bankTransfer?.accountNumber && (
                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#3b2e2a] flex items-center justify-center">
                          <span className="text-white text-[9px] font-black">BANK</span>
                        </div>
                        <div>
                          <p className="text-[11px] text-black/60 font-medium">{paySettings.bankTransfer.bankName || "Bank Transfer"}</p>
                          <p className="text-sm font-bold text-black">{paySettings.bankTransfer.accountNumber}</p>
                          {paySettings.bankTransfer.accountTitle && <p className="text-xs text-black/70">{paySettings.bankTransfer.accountTitle}</p>}
                          {paySettings.bankTransfer.iban && <p className="text-[11px] text-black/60">IBAN: {paySettings.bankTransfer.iban}</p>}
                        </div>
                      </div>
                      <button onClick={() => copyToClipboard(paySettings.bankTransfer.accountNumber, "bank")} className="text-black/60 hover:text-black transition-colors p-2 rounded-lg hover:bg-[#f0f0f0]">
                        {copied === "bank" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  )}

                  {!paySettings.jazzcash?.displayNumber && !paySettings.easypaisa?.displayNumber && !paySettings.bankTransfer?.accountNumber && (
                    <p className="text-sm text-black/60 py-2">Transfer details will be sent to your email.</p>
                  )}
                </div>

                {paySettings.bankTransfer?.displayInstructions && (
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                    <p className="text-xs text-amber-700 leading-relaxed">{paySettings.bankTransfer.displayInstructions}</p>
                  </div>
                )}

                <button
                  onClick={openWhatsApp}
                  className="w-full flex items-center justify-center gap-2.5 bg-[#25d366] hover:bg-[#20b858] text-white font-bold text-sm py-3.5 rounded-2xl transition-all duration-200 shadow-[0_4px_16px_rgba(37,211,102,0.25)]"
                >
                  <div className="w-6 h-6 relative shrink-0">
                     <Image src="/uploads/whatsapp.png" alt="WhatsApp" fill className="object-contain filter brightness-0 invert" />
                  </div>
                  Send Screenshot via WhatsApp
                </button>
              </div>
            )}

            <div className={`flex gap-3 ${isAdvance ? "" : "mt-2"}`}>
              <Link
                href="/"
                className="flex-1 flex items-center justify-center py-3.5 rounded-2xl border border-gray-200 text-black/70 hover:border-[#1a1f2e] hover:text-black font-semibold text-sm transition-all"
              >
                Continue Shopping
              </Link>
              <Link
                href="/account"
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#3b2e2a] text-white font-bold text-sm transition-all hover:bg-[#ff5a1f]"
              >
                Track Order <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── MAIN CART / CHECKOUT ────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <div className="bg-white border-b border-black">
        <div className="max-w-[1100px] mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => step === "checkout" ? setStep("cart") : window.history.back()}
            className="flex items-center gap-1.5 text-black/70 hover:text-black transition-colors text-sm font-semibold"
          >
            <ChevronLeft className="w-4 h-4" />
            {step === "checkout" ? "Back to Cart" : "Back"}
          </button>

          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest">
            <span className={step === "cart" ? "text-black" : "text-black/40"}>Bag</span>
            <div className="w-5 h-px bg-[#e8ecf0]" />
            <span className={step === "checkout" ? "text-black" : "text-black/40"}>Checkout</span>
          </div>

          <div className="flex items-center gap-1.5 text-black/60">
            <Shield className="w-3.5 h-3.5" />
            <span className="text-[11px] font-medium hidden sm:inline">Secure</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* LEFT COLUMN */}
          <div className="flex-1 min-w-0 space-y-4 w-full">
            {step === "cart" ? (
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-[#f8f9fb]">
                  <h1 className="text-[17px] font-black text-black">Shopping Bag</h1>
                  <p className="text-xs text-black/60 mt-0.5">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</p>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {cartItems.map((item) => (
                    <div key={`${item.id}-${item.variant}`} className="p-6 flex items-center gap-5">
                      <div className="w-20 h-20 bg-[#f8f9fa] rounded-xl relative overflow-hidden shrink-0 border border-gray-100">
                        <Image src={item.image} alt="" fill className="object-cover mix-blend-multiply p-2" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-black leading-snug mb-0.5">{item.name}</h3>
                        {item.variant && <p className="text-xs font-bold text-[#C9A227] mb-1">Variant: {item.variant}</p>}
                        <p className="text-xs text-black/60 mb-2">Signature Collection</p>
                        <span className="text-base font-black text-black">Rs. {item.price.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex flex-col items-end gap-3 shrink-0">
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden h-8">
                          <button 
                            type="button" 
                            onClick={() => handleQtyChange(item.id, item.variant, item.qty - 1)}
                            className="px-2.5 py-1 text-gray-500 hover:bg-gray-50 font-bold transition-colors"
                          >
                            -
                          </button>
                          <span className="px-3 text-xs font-bold text-black">{item.qty}</span>
                          <button 
                            type="button" 
                            onClick={() => handleQtyChange(item.id, item.variant, item.qty + 1)}
                            className="px-2.5 py-1 text-gray-500 hover:bg-gray-50 font-bold transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => handleRemove(item.id, item.variant)}
                          className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors uppercase tracking-wider flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-6 pb-6 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => setStep("checkout")}
                    className="w-full bg-[#3b2e2a] hover:bg-[#C9A227] hover:text-black text-white font-black text-[15px] uppercase tracking-widest py-4 rounded-2xl border border-gray-200 shadow-sm hover:shadow-none hover:translate-y-1 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    Proceed to Checkout <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCheckout} className="space-y-4">
                <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-5 border-b border-[#f8f9fb] flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#f8f9fa] border border-gray-200 flex items-center justify-center">
                      <Package className="w-4 h-4 text-black/70" />
                    </div>
                    <div>
                      <h2 className="text-[15px] font-black text-black">Shipping Information</h2>
                      <p className="text-[11px] text-black/60">We'll deliver right to your door</p>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-black/60 mb-2">Full Name</label>
                      <input name="name" required className={inputCls} placeholder="Your full name" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-black/60 mb-2">Phone Number *</label>
                        <input required type="text" name="phone" defaultValue="+92 " className={inputCls} placeholder="+92 300 1234567" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-black/60 mb-2">Email Address *</label>
                        <input required type="email" name="email" onBlur={handleEmailBlur} className={inputCls} placeholder="For order updates" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-black/60 mb-2">Complete Address</label>
                      <input name="address" required className={inputCls} placeholder="House No, Street, Area / Block" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="relative">
                        <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-black/60 mb-2">City</label>
                        <input type="hidden" name="city" value={citySearch} />
                        <input
                          required autoComplete="off" value={citySearch}
                          onChange={(e) => { setCitySearch(e.target.value); setShowCityDropdown(true); }}
                          onFocus={() => setShowCityDropdown(true)}
                          onBlur={() => setTimeout(() => setShowCityDropdown(false), 200)}
                          className={inputCls} placeholder="Search or select city"
                        />
                        {showCityDropdown && (
                          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-[0_8px_24px_-8px_rgba(0,0,0,0.12)] max-h-52 overflow-y-auto">
                            {(provinceCities[selectedProvince] || [])
                              .filter(c => c.toLowerCase().includes(citySearch.toLowerCase()))
                              .map(city => (
                                <div key={city} onClick={() => { setCitySearch(city); setShowCityDropdown(false); }}
                                  className="px-4 py-2.5 text-sm text-black hover:bg-[#f8f9fa] cursor-pointer border-b border-[#f8f9fb] last:border-0 transition-colors"
                                >
                                  {city}
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-black/60 mb-2">Province</label>
                        <select name="province" value={selectedProvince}
                          onChange={(e) => { setSelectedProvince(e.target.value); setCitySearch(""); }}
                          className={inputCls}
                        >
                          {Object.keys(provinceCities).map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className={`flex items-center gap-3 p-3.5 rounded-xl text-sm font-medium ${shipping === 0 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                      <Truck className="w-4 h-4 shrink-0" />
                      { "🎉 Free Shipping All Over Pakistan!" }
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-5 border-b border-[#f8f9fb] flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#f8f9fa] border border-gray-200 flex items-center justify-center">
                      <Banknote className="w-4 h-4 text-black/70" />
                    </div>
                    <div>
                      <h2 className="text-[15px] font-black text-black">Payment Method</h2>
                      <p className="text-[11px] text-black/60">Choose how you'd like to pay</p>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div
                      onClick={() => setPaymentMethod("cod")}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === "cod" ? "border-[#1a1f2e] bg-[#3b2e2a]/[0.02]" : "border-gray-200 hover:border-gray-300"}`}
                    >
                      <div className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center shrink-0 ${paymentMethod === "cod" ? "border-[#1a1f2e]" : "border-[#d1d5db]"}`} style={{ width: 18, height: 18 }}>
                        {paymentMethod === "cod" && <div className="w-2.5 h-2.5 rounded-full bg-[#3b2e2a]" />}
                      </div>
                      <Banknote className="w-5 h-5 text-black/70 shrink-0" />
                      <div>
                        <p className="font-bold text-sm text-black">Cash on Delivery</p>
                        <p className="text-xs text-black/60">Pay when your order arrives</p>
                      </div>
                    </div>

                    <div
                      onClick={() => setPaymentMethod("advance")}
                      className={`border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === "advance" ? "border-[#f59e0b]" : "border-gray-200 hover:border-gray-300"}`}
                    >
                      <div className="flex items-start gap-4 p-4">
                        <div className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${paymentMethod === "advance" ? "border-[#f59e0b]" : "border-[#d1d5db]"}`} style={{ width: 18, height: 18 }}>
                          {paymentMethod === "advance" && <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <p className="font-bold text-sm text-black">Advance Payment</p>
                            <span className="bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                              Save Rs. {advanceDiscount}
                            </span>
                          </div>
                          <p className="text-xs text-black/60 mb-3">Pay via JazzCash, EasyPaisa, or Bank Transfer</p>

                          <div className="flex flex-wrap gap-2">
                            {paySettings.jazzcash?.enabled !== false && (
                              <div className="flex items-center gap-2 bg-[#f8f9fa] border border-gray-200 rounded-lg px-2.5 py-1.5">
                                <div className="w-6 h-6 rounded overflow-hidden relative">
                                  <Image src="/uploads/jazzcash.jpg" alt="JazzCash" fill className="object-contain" />
                                </div>
                                <span className="text-[11px] font-bold text-black">JazzCash</span>
                              </div>
                            )}
                            {paySettings.easypaisa?.enabled !== false && (
                              <div className="flex items-center gap-2 bg-[#f8f9fa] border border-gray-200 rounded-lg px-2.5 py-1.5">
                                <div className="w-6 h-6 rounded overflow-hidden relative">
                                  <Image src="/uploads/easypaisa.png" alt="EasyPaisa" fill className="object-contain" />
                                </div>
                                <span className="text-[11px] font-bold text-black">EasyPaisa</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2 bg-[#f8f9fa] border border-gray-200 rounded-lg px-2.5 py-1.5">
                              <div className="w-6 h-6 rounded bg-[#3b2e2a] flex items-center justify-center">
                                <span className="text-white text-[8px] font-black">BK</span>
                              </div>
                              <span className="text-[11px] font-bold text-black">Bank</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {paymentMethod === "advance" && (
                        <div className="mx-4 mb-4 border border-gray-200 rounded-xl overflow-hidden bg-[#f8f9fa] p-4">
                          <p className="text-[13px] font-bold text-black mb-2">
                            Total Amount to Pay: <span className="text-amber-600 font-black">Rs. {total.toLocaleString()}</span>
                          </p>
                          <p className="text-[11px] text-black/70 mb-4">Please send the payment to any of the following accounts:</p>
                          
                          <div className="flex flex-col gap-3 mb-4">
                            {paySettings.jazzcash?.displayNumber && (
                              <div className="flex items-center justify-between bg-white border border-gray-200 p-3 rounded-xl shadow-sm">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-200 bg-white relative shrink-0">
                                    <Image src="/uploads/jazzcash_new.jpg" alt="JazzCash" fill className="object-cover" />
                                  </div>
                                  <div className="flex flex-col">
                                     <span className="text-[10px] uppercase text-black/60 font-black tracking-widest">JazzCash</span>
                                     <span className="text-sm font-black text-black tracking-wider">{jazzcashNumber}</span>
                                  </div>
                                </div>
                                <button type="button" onClick={() => copyToClipboard(jazzcashNumber, "jc")} className="text-black/60 hover:text-black p-2 rounded-lg hover:bg-[#f8f9fa] transition-colors flex items-center justify-center shrink-0">
                                  {copied === "jc" ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                                </button>
                              </div>
                            )}

                            {paySettings.easypaisa?.displayNumber && (
                              <div className="flex items-center justify-between bg-white border border-gray-200 p-3 rounded-xl shadow-sm">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-200 bg-white relative shrink-0 p-1">
                                    <Image src="/uploads/easypaisa_new.png" alt="EasyPaisa" fill className="object-contain" />
                                  </div>
                                  <div className="flex flex-col">
                                     <span className="text-[10px] uppercase text-black/60 font-black tracking-widest">EasyPaisa</span>
                                     <span className="text-sm font-black text-black tracking-wider">{easypaisaNumber}</span>
                                  </div>
                                </div>
                                <button type="button" onClick={() => copyToClipboard(easypaisaNumber, "ep")} className="text-black/60 hover:text-black p-2 rounded-lg hover:bg-[#f8f9fa] transition-colors flex items-center justify-center shrink-0">
                                  {copied === "ep" ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                                </button>
                              </div>
                            )}
                          </div>

                          <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-emerald-100 transition-colors shadow-sm" onClick={openWhatsApp}>
                            <div className="w-8 h-8 relative shrink-0">
                               <Image src="/uploads/whatsapp.png" alt="WhatsApp" fill className="object-contain" />
                            </div>
                            <div className="flex-1">
                               <p className="text-[11px] font-bold text-emerald-800">Send screenshot on WhatsApp to confirm order</p>
                               <p className="text-[10px] text-emerald-600 mt-0.5 leading-tight">Click here to send your payment screenshot directly to our WhatsApp number.</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="px-6 pb-6">
                    <button
                      type="submit" disabled={loading}
                      className={`w-full font-black text-[15px] uppercase tracking-widest py-4 rounded-2xl border border-gray-200 shadow-sm hover:shadow-none hover:translate-y-1 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-sm ${
                        paymentMethod === "advance"
                          ? "bg-[#ff5a1f] hover:bg-[#e04f1a] text-white"
                          : "bg-[#3b2e2a] hover:bg-[#2d221e] text-white"
                      }`}
                    >
                      {loading ? <><Clock className="w-4 h-4 animate-spin" /> Processing...</> 
                        : paymentMethod === "advance"
                          ? <>Place Order & Save Rs. {advanceDiscount} <ArrowRight className="w-4 h-4" /></>
                          : <>Place Order (Cash on Delivery) <ArrowRight className="w-4 h-4" /></>
                      }
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div className="w-full lg:w-[320px] shrink-0">
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden sticky top-20">
              <div className="px-6 py-5 border-b border-[#f8f9fb]">
                <h2 className="text-[13px] font-black uppercase tracking-widest text-black">Order Summary</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4 pb-5 border-b border-[#f8f9fb] max-h-60 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={`${item.id}-${item.variant}`} className="flex gap-3.5">
                      <div className="relative w-14 h-14 bg-[#f8f9fa] rounded-xl overflow-hidden shrink-0 border border-gray-100">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-bold text-black leading-snug mb-0.5 truncate">{item.name}</p>
                        {item.variant && <p className="text-[10px] font-bold text-[#C9A227]">Variant: {item.variant}</p>}
                        <p className="text-[11px] text-black/60">Qty: {item.qty}</p>
                        <p className="text-[13px] font-black text-black mt-1">Rs. {(item.price * item.qty).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="py-4 border-b border-[#f8f9fb]">
                  <div className="flex gap-2">
                    <input
                      type="text" value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Promo code"
                      className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#1a1f2e] font-mono uppercase bg-[#f8f9fa] transition-all"
                    />
                    <button type="button" onClick={handleApplyCoupon} disabled={couponLoading || !couponCode}
                      className="bg-[#ff5a1f] text-white font-black text-[13px] uppercase tracking-wider px-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-none hover:translate-y-1 transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-sm"
                    >
                      {couponLoading ? "..." : "Apply"}
                    </button>
                  </div>
                  {couponError && <p className="text-red-500 text-xs mt-1.5">{couponError}</p>}
                  {appliedCoupon && (
                    <div className="mt-2 bg-emerald-50 border border-emerald-100 rounded-xl p-2.5 flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-emerald-700">{appliedCoupon.code} applied</span>
                      <button type="button" onClick={() => setAppliedCoupon(null)} className="text-[11px] text-black/60 hover:text-red-500 font-bold">✕</button>
                    </div>
                  )}
                </div>

                <div className="pt-4 space-y-2.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-black/60">Subtotal</span>
                    <span className="font-semibold text-black">Rs. {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-black/60">Shipping</span>
                    <span className={`font-semibold ${shipping === 0 ? "text-emerald-600" : "text-black"}`}>
                      {shipping === 0 ? "Free 🎉" : `Rs. ${shipping}`}
                    </span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-sm font-bold text-emerald-600">
                      <span>Coupon</span>
                      <span>- Rs. {appliedCoupon.discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  {paymentMethod === "advance" && (
                    <div className="flex justify-between text-sm font-bold text-amber-600">
                      <span>Advance Discount</span>
                      <span>- Rs. {advanceDiscount}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                  <span className="text-[12px] font-black uppercase tracking-widest text-black">Total</span>
                  <span className="text-2xl font-black text-black">Rs. {total.toLocaleString()}</span>
                </div>

                {paymentMethod === "advance" && (
                  <div className="mt-3 flex items-center gap-2 bg-amber-50 border border-amber-100 p-3 rounded-xl">
                    <span className="text-base">💰</span>
                    <p className="text-xs text-amber-700">Saving <strong>Rs. {advanceDiscount}</strong> with Advance Payment</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
