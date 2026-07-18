import React from 'react';
import StorefrontLayout from "@/components/ui/StorefrontLayout";

export default function FAQsPage() {
  const faqs = [
    {
      q: "What payment methods do you accept?",
      a: "We accept Cash on Delivery (COD), EasyPaisa, JazzCash, and direct Bank Transfer. Advance payments get extra discounts!"
    },
    {
      q: "How can I track my order?",
      a: "Once your order is shipped, you will receive an SMS and email notification with a tracking number and a link to view the status of your shipment."
    },
    {
      q: "Can I modify or cancel my order?",
      a: "Orders can only be modified or cancelled within 1 hour of placement. Please contact our support team at devineora7@gmail.com immediately if you need to make changes."
    },
    {
      q: "Do you ship internationally?",
      a: "Currently, we only ship nationwide within Pakistan. We provide Free Shipping all over Pakistan with no minimum order requirements!"
    },
    {
      q: "What is your return policy?",
      a: "We offer a 3-day return window for unused items in their original packaging. Please visit our Return Policy page or contact us at devineora7@gmail.com for detailed instructions."
    }
  ];

  return (
    <StorefrontLayout>
    <div className="min-h-screen bg-[#f8fafc] pb-24">
      {/* Premium Hero */}
      <div className="bg-[#0b1221] pt-32 pb-32 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-[800px] mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">Frequently Asked Questions</h1>
          <p className="text-[#94a3b8] font-medium tracking-wide text-lg max-w-2xl mx-auto">
            Find answers to common questions about our products, shipping, returns, and more.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[800px] mx-auto px-6 -mt-16 relative z-20">
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-12 border border-black/[0.04] space-y-8">
          {faqs.map((faq, index) => (
            <div key={index} className="pb-8 border-b border-line last:border-0 last:pb-0">
              <h3 className="text-xl font-bold text-[#0f172a] mb-3">{faq.q}</h3>
              <p className="text-[#475569] leading-relaxed">{faq.a}</p>
            </div>
          ))}
          
          <div className="mt-12 bg-[#f8fafc] p-8 rounded-xl text-center border border-line">
            <h4 className="text-lg font-bold text-[#0f172a] mb-2">Still have questions?</h4>
            <p className="text-[#475569] mb-6">If you cannot find the answer to your question in our FAQ, you can always contact us. We will answer to you shortly!</p>
            <a href="/contact" className="inline-block bg-[#0b1221] text-white px-8 py-3 rounded-md font-bold uppercase tracking-widest hover:bg-brand transition-colors text-sm">
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
    </StorefrontLayout>
  );
}
