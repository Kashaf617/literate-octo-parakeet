import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import { getSetting, DEFAULT_SETTINGS } from "@/lib/settings";
import OrderTracker from "./OrderTracker";

export const dynamic = "force-dynamic";

export default async function TrackOrderPage() {
  const general = await getSetting("general", DEFAULT_SETTINGS.general);

  return (
    <div className="bg-[#f8f9fa] min-h-screen text-black flex flex-col justify-between">
      <Header
        storeName={general.storeName}
        tagline={general.tagline}
        supportPhone={general.supportPhone}
        freeShippingText={general.freeShippingText}
      />
      
      <main className="flex-1 py-12 md:py-24 px-6 max-w-[800px] mx-auto w-full">
        <div className="text-center mb-10">
          <span className="inline-block text-[#C9A227] text-[13px] font-black uppercase tracking-[0.3em] mb-3">Track Shipment</span>
          <h1 className="text-3xl md:text-5xl font-black text-black tracking-tight uppercase">Track Your Order</h1>
          <p className="text-gray-500 font-medium mt-3 text-sm md:text-base">
            Check the status of your shipment by entering your order details below.
          </p>
        </div>

        <OrderTracker />
      </main>

      <Footer storeName={general.storeName} />
    </div>
  );
}
