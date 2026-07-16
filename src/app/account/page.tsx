import { getCustomerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import { getSetting, DEFAULT_SETTINGS } from "@/lib/settings";
import { LogOut, Package, MapPin, User, ChevronRight } from "lucide-react";
import LogoutButton from "./LogoutButton";

export const revalidate = 0;

export default async function AccountPage() {
  const session = await getCustomerSession();
  
  if (!session) {
    redirect("/login");
  }

  const customer = await prisma.customer.findUnique({
    where: { id: session.sub },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!customer) {
    redirect("/login");
  }

  const general = await getSetting("general", DEFAULT_SETTINGS.general);

  return (
    <>
      <Header
        storeName={general.storeName}
        tagline={general.tagline}
        supportPhone={general.supportPhone}
        freeShippingText={general.freeShippingText}
      />
      <main className="bg-[#f8f9fa] min-h-screen py-12 md:py-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-10">
            
            {/* Sidebar */}
            <aside className="w-full md:w-[300px] shrink-0">
              <div className="bg-white rounded-2xl shadow-sm border border-line p-8 flex flex-col items-center text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-brand/10 text-brand flex items-center justify-center text-2xl font-black mb-4">
                  {customer.name[0]}
                </div>
                <h2 className="text-xl font-bold text-ink mb-1">{customer.name}</h2>
                <p className="text-sub text-[13px]">{customer.email}</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-line overflow-hidden">
                <div className="p-4 border-b border-line flex items-center gap-3 text-ink font-bold text-[14px]">
                  <Package className="w-5 h-5 text-brand" /> My Orders
                </div>
                <div className="p-4 border-b border-line flex items-center gap-3 text-sub hover:text-ink hover:bg-gray-50 transition cursor-pointer text-[14px] font-medium">
                  <MapPin className="w-5 h-5 text-brand/70" /> Shipping Addresses
                </div>
                <div className="p-4 border-b border-line flex items-center gap-3 text-sub hover:text-ink hover:bg-gray-50 transition cursor-pointer text-[14px] font-medium">
                  <User className="w-5 h-5 text-brand/70" /> Account Settings
                </div>
                <div className="p-2 bg-gray-50">
                  <LogoutButton />
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              <h1 className="text-2xl font-extrabold text-ink mb-6">Order History</h1>
              
              {customer.orders.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-line p-12 text-center">
                  <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-ink mb-2">No orders yet</h3>
                  <p className="text-sub text-[14px] mb-6">When you place an order, it will appear here.</p>
                  <a href="/" className="inline-flex bg-brand text-white font-bold text-[13px] uppercase tracking-widest px-8 py-3.5 rounded-lg hover:bg-brand-dark transition-colors">
                    Start Shopping
                  </a>
                </div>
              ) : (
                <div className="space-y-4">
                  {customer.orders.map((order) => (
                    <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-line p-6 hover:shadow-md transition">
                      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-line">
                        <div>
                          <div className="text-[12px] font-bold text-sub uppercase tracking-wider mb-1">Order Number</div>
                          <div className="text-[15px] font-extrabold text-ink">#{order.orderNumber}</div>
                        </div>
                        <div>
                          <div className="text-[12px] font-bold text-sub uppercase tracking-wider mb-1">Date</div>
                          <div className="text-[14px] font-medium text-ink">{order.createdAt.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</div>
                        </div>
                        <div>
                          <div className="text-[12px] font-bold text-sub uppercase tracking-wider mb-1">Total</div>
                          <div className="text-[15px] font-extrabold text-brand">PKR {order.total.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className={`inline-flex px-3 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                            order.orderStatus === "delivered" ? "bg-green-100 text-green-700" :
                            order.orderStatus === "cancelled" ? "bg-red-100 text-red-700" :
                            "bg-blue-50 text-brand"
                          }`}>
                            {order.orderStatus}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-[13px] text-sub">
                          {order.paymentMethod.toUpperCase()} • {order.paymentStatus}
                        </div>
                        <button className="text-brand font-bold text-[13px] flex items-center gap-1 hover:underline">
                          View Details <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer storeName={general.storeName} />
    </>
  );
}
