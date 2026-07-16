import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/admin/PageHeader";
import { Ticket } from "lucide-react";
import CreateCouponForm from "./CreateCouponForm";

export const dynamic = "force-dynamic";

export default async function DiscountsPage() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div>
      <PageHeader title="Discount Coupons" subtitle="Create and manage promo codes" />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <CreateCouponForm />
        </div>

        <div className="lg:col-span-2">
          <div className="admin-card overflow-hidden">
            <div className="p-5 border-b border-line">
              <h3 className="font-extrabold text-ink">Active Coupons</h3>
            </div>
            
            {coupons.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center justify-center text-sub">
                <Ticket className="w-12 h-12 mb-3 text-gray-300" />
                <p>No coupons created yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 border-b border-line text-[11px] uppercase tracking-wider text-sub">
                      <th className="px-6 py-3 font-bold">Code</th>
                      <th className="px-6 py-3 font-bold">Discount</th>
                      <th className="px-6 py-3 font-bold">Usage</th>
                      <th className="px-6 py-3 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {coupons.map((c) => (
                      <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded border border-gray-200 bg-white text-[13px] font-mono font-bold text-ink shadow-sm">
                            {c.code}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[14px] font-semibold text-ink">
                          {c.type === "percentage" ? `${c.value}% OFF` : `PKR ${c.value.toLocaleString()} OFF`}
                          {c.minSpend && <div className="text-[11px] font-normal text-sub mt-0.5">Min spend: PKR {c.minSpend.toLocaleString()}</div>}
                        </td>
                        <td className="px-6 py-4 text-[14px] text-sub">
                          {c.usageCount} {c.usageLimit ? `/ ${c.usageLimit}` : ""} used
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            c.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {c.isActive ? 'ACTIVE' : 'INACTIVE'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
