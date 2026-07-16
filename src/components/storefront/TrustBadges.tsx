"use client";
import { Truck, RotateCcw, Shield, Headphones } from "lucide-react";
import { TRUST_BADGES } from "@/lib/mock-data";

export default function TrustBadges() {
  const icons = {
    Truck: <Truck className="w-8 h-8 text-[#C9A227]" strokeWidth={1.5} />,
    RotateCcw: <RotateCcw className="w-8 h-8 text-[#C9A227]" strokeWidth={1.5} />,
    Shield: <Shield className="w-8 h-8 text-[#C9A227]" strokeWidth={1.5} />,
    Headphones: <Headphones className="w-8 h-8 text-[#C9A227]" strokeWidth={1.5} />
  };

  return (
    <div className="bg-white border-y border-black py-10">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          {TRUST_BADGES.map((badge, i) => (
            <div 
              key={i} 
              className={`flex items-start gap-4 ${i === 0 || i === 1 ? 'pb-8 border-b border-black' : ''}`}
            >
              <div className="shrink-0 pt-1">
                {icons[badge.icon as keyof typeof icons]}
              </div>
              <div>
                <h4 className="text-[17px] font-black text-black mb-1">{badge.title}</h4>
                <p className="text-[14px] text-gray-500 font-bold leading-snug">{badge.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
