import { Mail, Phone, MapPin } from "lucide-react";
import StorefrontLayout from "@/components/ui/StorefrontLayout";
import ContactForm from "@/components/storefront/ContactForm";

export default function ContactPage() {
  return (
    <StorefrontLayout>
      <div className="min-h-screen bg-[#f8fafc] pb-24">
      {/* Premium Hero */}
      <div className="bg-black pt-32 pb-48 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#C9A227]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-black/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-[1000px] mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight font-heading uppercase">Get in Touch</h1>
          <p className="text-[#cbd5e1] font-medium tracking-wide text-lg max-w-2xl mx-auto leading-relaxed">
            We would love to hear from you. Whether you have a question about our timepieces, shipping, or need assistance, our support team is at your service.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1200px] mx-auto px-6 -mt-32 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Contact Info Cards */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 border border-black/[0.04] flex items-start gap-5 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 rounded-full bg-[#C9A227]/10 flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6 text-[#C9A227]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#0f172a] mb-2 font-sans">Our Location</h3>
                <p className="text-[#475569] leading-relaxed font-sans font-light">
                  Chak Jhumra District Faisalabad
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 border border-black/[0.04] flex items-start gap-5 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 rounded-full bg-[#C9A227]/10 flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6 text-[#C9A227]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#0f172a] mb-2 font-sans">Phone Number</h3>
                <p className="text-[#475569] leading-relaxed mb-1 font-sans font-light">
                  <a href="tel:+923707765435" className="hover:text-[#C9A227] transition-colors">+92 370 7765435</a>
                </p>
                <p className="text-sm text-[#94a3b8] font-sans">Mon-Sat 9am to 6pm</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 border border-black/[0.04] flex items-start gap-5 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 rounded-full bg-[#C9A227]/10 flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6 text-[#C9A227]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#0f172a] mb-2 font-sans">Email Address</h3>
                <p className="text-[#475569] leading-relaxed mb-1 font-sans font-light">
                  <a href="mailto:devineora7@gmail.com" className="hover:text-[#C9A227] transition-colors">devineora7@gmail.com</a>
                </p>
                <p className="text-sm text-[#94a3b8] font-sans">We reply within 24 hours</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <ContactForm />
          </div>

        </div>
      </div>
    </div>
    </StorefrontLayout>
  );
}
