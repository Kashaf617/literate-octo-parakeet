import StorefrontLayout from "@/components/ui/StorefrontLayout";

export default function AboutPage() {
  return (
    <StorefrontLayout>
      <div className="min-h-screen bg-[#F9F9F9] pb-24 font-sans text-black">
        {/* Luxury Hero Banner */}
        <div className="bg-black pt-32 pb-48 px-6 relative overflow-hidden text-center">
          <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center pointer-events-none" />
          <div className="relative z-10 max-w-[1000px] mx-auto">
            <span className="text-[#C9A227] text-xs font-black uppercase tracking-[0.3em] mb-4 block">OUR STORY</span>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight font-heading uppercase">
              The Heritage of Devine Ora
            </h1>
            <div className="w-16 h-[1px] bg-[#C9A227] mx-auto mt-6 mb-8"></div>
            <p className="text-gray-300 font-medium tracking-wide text-lg max-w-2xl mx-auto leading-relaxed">
              Crafting timeless luxury, designed for every moment. Experience the ultimate in horological precision and design.
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-[1000px] mx-auto px-6 -mt-24 relative z-20">
          <div className="bg-white rounded-3xl border border-[#DFD1A5] shadow-lg p-10 md:p-16 space-y-12">
            
            {/* Craftsmanship Section */}
            <div className="grid md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-7 space-y-4">
                <span className="text-[#C9A227] text-[10px] font-black uppercase tracking-widest block">HOROLOGY</span>
                <h2 className="text-3xl font-black text-black font-heading uppercase">Uncompromising Craftsmanship</h2>
                <p className="text-gray-600 leading-relaxed font-light text-sm">
                  At DEVINE ORA, watchmaking is not just a profession; it is an art form. Each timepiece is meticulously hand-assembled by master watchmakers, bringing together the heritage of traditional Swiss caliber mechanics and contemporary luxury design.
                </p>
              </div>
              <div className="md:col-span-5 relative aspect-[4/3] rounded-2xl overflow-hidden border border-gray-100">
                <img src="https://images.unsplash.com/photo-1619134778706-7015533a6150?auto=format&fit=crop&w=600&q=80" alt="Watch Assembly" className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="border-t border-[#DFD1A5]/30"></div>

            {/* Precision & Quality Section */}
            <div className="grid md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-5 order-last md:order-first relative aspect-[4/3] rounded-2xl overflow-hidden border border-gray-100">
                <img src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80" alt="Watch Movement details" className="w-full h-full object-cover" />
              </div>
              <div className="md:col-span-7 space-y-4">
                <span className="text-[#C9A227] text-[10px] font-black uppercase tracking-widest block">PRECISION</span>
                <h2 className="text-3xl font-black text-black font-heading uppercase">Swiss Caliber Accuracy</h2>
                <p className="text-gray-600 leading-relaxed font-light text-sm">
                  Precision defines us. We source our internal movements from top-tier horological suppliers, ensuring that every second is measured with absolute accuracy. Wrapped in surgical-grade 316L stainless steel and topped with scratch-resistant sapphire crystal, our timepieces are built to last generations.
                </p>
              </div>
            </div>

            <div className="border-t border-[#DFD1A5]/30"></div>

            {/* Timeless Philosophy */}
            <div className="text-center max-w-2xl mx-auto space-y-4 py-6">
              <span className="text-[#C9A227] text-[10px] font-black uppercase tracking-widest block">THE PHILOSOPHY</span>
              <h2 className="text-4xl font-black text-black font-heading uppercase">Timeless Luxury Experience</h2>
              <p className="text-gray-600 leading-relaxed font-light text-sm">
                Luxury should not be exclusive to the few. By eliminating the traditional retail markups and middleman costs, DEVINE ORA delivers Swiss-standard luxury watches directly to you, providing an unparalleled luxury experience at a fraction of the cost.
              </p>
            </div>

          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
}
