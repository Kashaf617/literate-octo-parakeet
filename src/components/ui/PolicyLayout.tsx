import React from 'react';
import StorefrontLayout from './StorefrontLayout';

export default function PolicyLayout({ title, lastUpdated, children }: { title: string, lastUpdated?: string, children: React.ReactNode }) {
  return (
    <StorefrontLayout>
      <div className="min-h-screen bg-[#f8fafc] pb-24">
      {/* Premium Hero */}
      <div className="bg-[#0b1221] pt-32 pb-32 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-[800px] mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">{title}</h1>
          {lastUpdated && <p className="text-[#94a3b8] font-medium tracking-wide uppercase text-sm">Last Updated: {lastUpdated}</p>}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[800px] mx-auto px-6 -mt-16 relative z-20">
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-12 border border-black/[0.04]">
          <div className="space-y-8 text-[#475569] leading-relaxed text-[16px]">
            {children}
          </div>
        </div>
      </div>
    </div>
    </StorefrontLayout>
  );
}
