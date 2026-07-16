"use client";
import { useState, useEffect } from "react";
import { fmtCurrency } from "@/lib/utils";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { trackViewContent, trackAddToCart } from "@/lib/tracking";
import { addToCart } from "@/lib/cart";

interface Variant {
  id: string;
  sku: string | null;
  price: number;
  comparePrice: number | null;
  stock: number;
  optionChoices: string; // JSON string
}

interface Product {
  id: string;
  name: string;
  price: number;
  comparePrice: number | null;
  stock: number;
  options: string | null; // JSON array
  variants: Variant[];
  images?: string; // JSON array string
  description: string;
}

export default function VariantSelector({ product, general }: { product: Product, general: any }) {
  const router = useRouter();
  const options = product.options ? JSON.parse(product.options) as { name: string; values: string[] }[] : [];
  
  const variants = product.variants.map(v => ({
    ...v,
    choices: JSON.parse(v.optionChoices) as Record<string, string>
  }));

  // Safely parse description JSON
  let parsedDesc: any = {};
  try {
    if (product.description) {
      parsedDesc = JSON.parse(product.description);
    }
  } catch {}

  const showBundleSaveSetting = !!parsedDesc.showBundleSave;
  const hasShadeAndSize = options.some(o => o.name === "Shade") && options.some(o => o.name === "Size");

  // Keep track of separate option states
  const [selected, setSelected] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    options.forEach(opt => {
      if (opt.values.length > 0) init[opt.name] = opt.values[0];
    });
    return init;
  });

  const [qty, setQty] = useState(1);
  const [selectedBundle, setSelectedBundle] = useState<"one" | "two" | "three">("one");
  const [matchedVariant, setMatchedVariant] = useState<typeof variants[0] | null>(null);
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 600) setShowSticky(true);
      else setShowSticky(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Fire ViewContent pixel on mount
    trackViewContent({
      id: product.id,
      name: product.name,
      price: product.price,
      currency: general.currency || "PKR"
    });
  }, [product.id, product.name, product.price, general.currency]);

  useEffect(() => {
    if (variants.length === 0) return;
    const matched = variants.find(v => {
      for (const [key, val] of Object.entries(selected)) {
        if (v.choices[key] !== val) return false;
      }
      return true;
    });
    setMatchedVariant(matched || null);
  }, [selected, variants]);

  const currentPrice = matchedVariant ? matchedVariant.price : product.price;
  const currentStock = matchedVariant ? matchedVariant.stock : product.stock;
  const showCompare = matchedVariant ? false : !!product.comparePrice;

  // Sync qty and bundle selection
  const handleQtyChange = (newQty: number) => {
    const q = Math.max(1, Math.min(currentStock, newQty));
    setQty(q);
    if (q === 1) setSelectedBundle("one");
    else if (q === 2) setSelectedBundle("two");
    else if (q >= 3) setSelectedBundle("three");
  };

  const handleBundleSelect = (b: "one" | "two" | "three") => {
    setSelectedBundle(b);
    if (b === "one") setQty(1);
    else if (b === "two") setQty(2);
    else if (b === "three") setQty(3);
  };

  // Calculate dynamic bundle unit price and total price
  const getBundleUnitPrice = () => {
    if (selectedBundle === "two") return currentPrice * 0.95;
    if (selectedBundle === "three") return currentPrice * 0.85;
    return currentPrice;
  };

  const getBundleTotalPrice = () => {
    return Math.round(getBundleUnitPrice() * qty);
  };

  const handleRedirect = () => {
    let imgUrl = "/placeholder.png";
    if (product.images) {
      try {
        const arr = JSON.parse(product.images);
        imgUrl = arr[0] || "/placeholder.png";
      } catch {}
    }
    const variantStr = Object.entries(selected).map(([k,v]) => `${k}: ${v}`).join(', ');
    const finalPrice = getBundleUnitPrice();
    
    // Fire AddToCart pixel
    trackAddToCart({
      id: product.id,
      name: product.name,
      price: finalPrice,
      currency: general.currency || "PKR",
      quantity: qty
    });

    const params = new URLSearchParams({
      productId: product.id,
      name: product.name,
      price: finalPrice.toString(),
      image: imgUrl,
      qty: qty.toString(),
      variant: variantStr
    });
    router.push(`/cart?${params.toString()}`);
  };

  const handleAddToCart = () => {
    let imgUrl = "/placeholder.png";
    if (product.images) {
      try {
        const arr = JSON.parse(product.images);
        imgUrl = arr[0] || "/placeholder.png";
      } catch {}
    }
    const variantStr = Object.entries(selected).map(([k,v]) => `${k}: ${v}`).join(', ');
    const finalPrice = getBundleUnitPrice();
    
    // Fire AddToCart pixel
    trackAddToCart({
      id: product.id,
      name: product.name,
      price: finalPrice,
      currency: general.currency || "PKR",
      quantity: qty
    });

    addToCart({
      id: product.id,
      name: product.name,
      price: finalPrice,
      image: imgUrl,
      variant: variantStr,
      qty: qty
    });

    alert(`Added "${product.name}" to cart successfully!`);
  };

  // Custom combinations for Hair Color Shampoo swatches
  const swatchCombinations = [
    { shade: "Dark Brown", size: "200ML", color: "#3E2A20", label: "DARK BROWN - 200ML" },
    { shade: "Light Brown", size: "200ML", color: "#8B5A2B", label: "LIGHT BROWN - 200ML" },
    { shade: "Black", size: "200ML", color: "#0a0a0a", label: "BLACK - 200ML" },
    { shade: "Dark Brown", size: "400ML", color: "#3E2A20", label: "DARK BROWN - 400ML" },
    { shade: "Black", size: "400ML", color: "#0a0a0a", label: "BLACK - 400ML" },
    { shade: "Light Brown", size: "400ML", color: "#8B5A2B", label: "LIGHT BROWN - 400ML" },
  ];

  const currentCombinationLabel = `${selected["Shade"]?.toUpperCase()} - ${selected["Size"]}`;

  return (
    <div>
      {/* Price section formatted to match the Hair Factory theme */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-[26px] font-bold text-[#e95144] tracking-tight">
          Rs.{getBundleUnitPrice().toLocaleString()}
        </span>
        {showCompare && (
          <span className="text-[18px] font-light text-[#969696] line-through tracking-wide">
            Rs.{(selectedBundle === "one" 
              ? (product.comparePrice || currentPrice * 1.25) 
              : selectedBundle === "two" ? (currentPrice * 2) : (currentPrice * 3)).toLocaleString()}
          </span>
        )}
        <span className="bg-[#e95144] text-white text-[9px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
          SALE • SAVE RS.{(
            (selectedBundle === "one" ? (product.comparePrice || currentPrice * 1.25) : selectedBundle === "two" ? (currentPrice * 2) : (currentPrice * 3)) - getBundleTotalPrice()
          ).toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </span>
      </div>

      {/* Feature List Box */}
      {parsedDesc?.features && Array.isArray(parsedDesc.features) && parsedDesc.features.length > 0 && (
        <div className="border border-black rounded-2xl bg-[#f8f9fa]/30 p-6 mb-8 grid grid-cols-2 gap-4">
          {parsedDesc.features.map((feat: any, idx: number) => (
            <div key={idx} className="flex items-start gap-2.5">
              <span className="text-[#3b2e2a] font-bold mt-0.5">✓</span>
              <div>
                <h5 className="text-[11px] font-bold text-black uppercase tracking-wider">{feat.title}</h5>
                <p className="text-[10px] text-[#6b6b6b]">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Unified Shade Swatch Selector (For Hair Color Shampoo specifically) */}
      {hasShadeAndSize ? (
        <div className="border border-black rounded-2xl bg-white/40 p-6 mb-8">
          <div className="mb-4">
            <h4 className="text-[11px] font-bold text-black uppercase tracking-wider">
              Choose SHADES: <span className="font-extrabold text-[#e95144]">{currentCombinationLabel}</span>
            </h4>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {swatchCombinations.map(combo => {
              const isSelected = selected["Shade"] === combo.shade && selected["Size"] === combo.size;
              return (
                <button
                  key={combo.label}
                  type="button"
                  onClick={() => setSelected({ "Shade": combo.shade, "Size": combo.size })}
                  className={`flex flex-col items-center p-3 border rounded-xl transition-all ${
                    isSelected 
                      ? 'border-black bg-white ring-2 ring-black' 
                      : 'border-gray-300 hover:border-black bg-white/70'
                  }`}
                >
                  <div 
                    className="w-10 h-10 rounded-full mb-2.5 border border-black/10 shadow-inner"
                    style={{ backgroundColor: combo.color }}
                  />
                  <span className="text-[8px] font-extrabold text-black text-center leading-tight tracking-wider uppercase">
                    {combo.shade}<br/>{combo.size}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Fallback for other products with variants */
        options.length > 0 && (
          <div className="space-y-8 mb-10 border border-black rounded-2xl bg-white/40 p-6">
            {options.map(opt => (
              <div key={opt.name}>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a1a1aa]">{opt.name}</h4>
                  <span className="text-[11px] font-medium text-black">{selected[opt.name]}</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {opt.values.map(val => (
                    <button
                      key={val}
                      onClick={() => setSelected(prev => ({ ...prev, [opt.name]: val }))}
                      className={`px-6 py-3 border text-[11px] font-semibold uppercase tracking-[0.1em] transition-all duration-300 ${
                        selected[opt.name] === val 
                          ? 'border-black bg-black text-white' 
                          : 'border-[#e4e4e7] text-[#52525b] hover:border-black hover:text-black bg-white'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Quantity Selector */}
      <div className="mb-8">
        <h4 className="text-[10px] font-bold text-black uppercase tracking-wider mb-3">Quantity</h4>
        <div className="flex items-center w-32 border border-black bg-white rounded-xl overflow-hidden">
          <button 
            type="button"
            onClick={() => handleQtyChange(qty - 1)}
            className="w-10 py-3 text-black hover:bg-gray-100 flex items-center justify-center font-bold text-sm select-none"
          >
            -
          </button>
          <span className="flex-1 text-center text-xs font-bold text-black select-none">{qty}</span>
          <button 
            type="button"
            onClick={() => handleQtyChange(qty + 1)}
            className="w-10 py-3 text-black hover:bg-gray-100 flex items-center justify-center font-bold text-sm select-none"
          >
            +
          </button>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <button 
          type="button"
          onClick={handleAddToCart}
          disabled={currentStock <= 0}
          className="w-full bg-[#3b2e2a] hover:bg-[#2d221e] text-white font-bold text-[12px] uppercase tracking-[0.2em] py-5 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_16px_rgba(59,46,42,0.2)] rounded-xl"
        >
          <span>{currentStock > 0 ? 'Add To Cart' : 'Out of Stock'}</span>
          {currentStock > 0 && <ShoppingCart className="w-4 h-4 opacity-70" />}
        </button>

        <button 
          type="button"
          onClick={handleRedirect}
          disabled={currentStock <= 0}
          className="w-full bg-black hover:bg-[#C9A227] text-white hover:text-black font-extrabold text-[12px] uppercase tracking-[0.2em] py-5 transition-all duration-500 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed border border-black hover:border-[#C9A227] shadow-sm rounded-xl"
        >
          <span>Buy It Now</span>
        </button>
      </div>

      <div className="text-center mb-10 pb-10 border-b border-black">
        <p className="text-[#e95144] text-[12px] font-black tracking-wider mb-1">30 Day Money-Back-Guarantee.</p>
        <p className="text-[12px] text-black font-bold">
          If it doesn't work for you we'll <span className="text-[#2e7d32] underline decoration-2">refund</span> no questions asked
        </p>
      </div>

      {/* BUNDLE & SAVE SECTION */}
      {showBundleSaveSetting && (
        <div className="border border-gray-200 rounded-3xl bg-white shadow-sm p-6 mb-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-[2px] bg-black flex-1"></div>
            <h3 className="text-sm font-black text-black uppercase tracking-[0.15em] font-sans">BUNDLE & SAVE</h3>
            <div className="h-[2px] bg-black flex-1"></div>
          </div>

          <div className="space-y-4">
            {/* Box 1: Buy One */}
            <div 
              onClick={() => handleBundleSelect("one")}
              className={`border-2 rounded-2xl overflow-hidden cursor-pointer bg-white transition-all shadow-sm ${
                selectedBundle === "one" ? 'border-black ring-2 ring-[#C9A227] scale-[1.02]' : 'border-black hover:translate-y-0.5 hover:shadow-none'
              }`}
            >
              <div className={`text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 border-b border-gray-200 flex items-center justify-between ${selectedBundle === "one" ? 'bg-[#C9A227] text-black' : 'bg-black'}`}>
                <span>MOST POPULAR</span>
              </div>
              <div className="p-4 flex items-start gap-4">
                <input 
                  type="radio" 
                  checked={selectedBundle === "one"} 
                  onChange={() => handleBundleSelect("one")}
                  className="mt-1 accent-[#C9A227] w-4 h-4" 
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-black font-sans">Buy One</span>
                    <span className="text-xs font-black text-black font-sans">Rs.{currentPrice.toLocaleString()}</span>
                  </div>
                  {selectedBundle === "one" && options.length > 0 && (
                    <div className="space-y-2 mt-2">
                      {options.map(opt => (
                        <div key={opt.name} className="space-y-1">
                          <label className="block text-[8px] font-bold text-[#6b6b6b] uppercase tracking-wider">{opt.name}</label>
                          <select 
                            value={selected[opt.name]} 
                            onChange={(e) => setSelected(prev => ({ ...prev, [opt.name]: e.target.value }))}
                            className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-[11px] font-semibold bg-white text-black outline-none font-sans"
                          >
                            {opt.values.map(val => (
                              <option key={val} value={val}>{val}</option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Box 2: Buy Two */}
            <div 
              onClick={() => handleBundleSelect("two")}
              className={`border-2 rounded-2xl overflow-hidden cursor-pointer bg-white transition-all shadow-sm ${
                selectedBundle === "two" ? 'border-black ring-2 ring-[#C9A227] scale-[1.02]' : 'border-black hover:translate-y-0.5 hover:shadow-none'
              }`}
            >
              <div className={`text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 border-b border-gray-200 flex items-center justify-between ${selectedBundle === "two" ? 'bg-[#C9A227] text-black' : 'bg-black'}`}>
                <span>Best Seller!</span>
              </div>
              <div className="p-4 flex items-start gap-4">
                <input 
                  type="radio" 
                  checked={selectedBundle === "two"} 
                  onChange={() => handleBundleSelect("two")}
                  className="mt-1 accent-[#C9A227] w-4 h-4" 
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-black font-sans">Buy Two</span>
                    <div className="text-right">
                      <span className="text-xs font-black text-black font-sans block">Rs.{Math.round(currentPrice * 0.95 * 2).toLocaleString()}</span>
                      <span className="text-[10px] text-[#969696] line-through block font-sans">Rs.{(currentPrice * 2).toLocaleString()}</span>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-amber-600 uppercase tracking-wide font-sans">Get Extra 5% Discount</span>
                </div>
              </div>
            </div>

            {/* Box 3: Buy Three */}
            <div 
              onClick={() => handleBundleSelect("three")}
              className={`border-2 rounded-2xl overflow-hidden cursor-pointer bg-white transition-all shadow-sm ${
                selectedBundle === "three" ? 'border-black ring-2 ring-[#C9A227] scale-[1.02]' : 'border-black hover:translate-y-0.5 hover:shadow-none'
              }`}
            >
              <div className={`text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 border-b border-gray-200 flex items-center justify-between ${selectedBundle === "three" ? 'bg-[#C9A227] text-black' : 'bg-black'}`}>
                <span>Best Value!</span>
              </div>
              <div className="p-4 flex items-start gap-4">
                <input 
                  type="radio" 
                  checked={selectedBundle === "three"} 
                  onChange={() => handleBundleSelect("three")}
                  className="mt-1 accent-[#C9A227] w-4 h-4" 
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-black font-sans">Buy Three</span>
                    <div className="text-right">
                      <span className="text-xs font-black text-black font-sans block">Rs.{Math.round(currentPrice * 0.85 * 3).toLocaleString()}</span>
                      <span className="text-[10px] text-[#969696] line-through block font-sans">Rs.{(currentPrice * 3).toLocaleString()}</span>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-amber-600 uppercase tracking-wide font-sans">Get Extra 15% Discount</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentStock > 0 && currentStock <= 10 && (
        <p className="text-[11px] font-medium text-[#d4af37] tracking-wider mt-4 text-center">
          Only {currentStock} left in stock - order soon.
        </p>
      )}

      {/* Sticky Bottom Add To Cart bar */}
      {showSticky && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-black p-4 flex gap-4 lg:hidden shadow-[0_-4px_16px_rgba(0,0,0,0.12)]">
          <button 
            type="button"
            onClick={handleAddToCart}
            disabled={currentStock <= 0}
            className="w-full bg-[#c27c24] hover:bg-[#a9661d] text-white font-bold text-[12px] uppercase tracking-[0.2em] py-4 transition-all duration-300 flex items-center justify-center gap-2 rounded-xl disabled:opacity-50"
          >
            <span>ADD TO CART</span>
          </button>
        </div>
      )}

    </div>
  );
}
