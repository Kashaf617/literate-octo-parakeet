import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/admin/PageHeader";
import { fmtCurrency } from "@/lib/utils";
import RecoveryActions from "./RecoveryActions";
import { ShoppingCart } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function RecoveryPage() {
  const abandonedCarts = await prisma.abandonedCart.findMany({
    orderBy: { createdAt: "desc" }
  });

  const totalLost = abandonedCarts
    .filter(c => c.status === "abandoned")
    .reduce((acc, cart) => {
      try {
        const items = JSON.parse(cart.cartData);
        return acc + items.reduce((sum: number, it: any) => sum + (it.price * it.qty), 0);
      } catch (e) {
        return acc;
      }
    }, 0);

  const totalRecovered = abandonedCarts
    .filter(c => c.status === "recovered")
    .reduce((acc, cart) => {
      try {
        const items = JSON.parse(cart.cartData);
        return acc + items.reduce((sum: number, it: any) => sum + (it.price * it.qty), 0);
      } catch (e) {
        return acc;
      }
    }, 0);

  const abandonedCount = abandonedCarts.filter(c => c.status === "abandoned").length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <PageHeader title="Abandoned Carts" subtitle="Track and recover lost sales" />
        {abandonedCount > 0 && <RecoveryActions />}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="admin-card border-l-4 border-l-warn">
          <p className="text-sub text-[13px] font-bold uppercase tracking-wider mb-1">Potential Lost Revenue</p>
          <div className="text-3xl font-black text-ink">{fmtCurrency(totalLost)}</div>
          <p className="text-[12px] text-sub mt-2">{abandonedCount} carts currently abandoned</p>
        </div>
        <div className="admin-card border-l-4 border-l-success">
          <p className="text-sub text-[13px] font-bold uppercase tracking-wider mb-1">Recovered Revenue</p>
          <div className="text-3xl font-black text-ink">{fmtCurrency(totalRecovered)}</div>
          <p className="text-[12px] text-sub mt-2">{abandonedCarts.length - abandonedCount} carts recovered</p>
        </div>
      </div>

      <div className="admin-card overflow-hidden">
        {abandonedCarts.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center text-sub">
            <ShoppingCart className="w-12 h-12 mb-3 text-gray-300" />
            <p>No abandoned carts yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-line text-[11px] uppercase tracking-wider text-sub">
                  <th className="px-6 py-3 font-bold">Email</th>
                  <th className="px-6 py-3 font-bold">Date Abandoned</th>
                  <th className="px-6 py-3 font-bold">Cart Value</th>
                  <th className="px-6 py-3 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {abandonedCarts.map((cart) => {
                  let value = 0;
                  try {
                    const items = JSON.parse(cart.cartData);
                    value = items.reduce((sum: number, it: any) => sum + (it.price * it.qty), 0);
                  } catch (e) {}

                  return (
                    <tr key={cart.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-[14px] font-bold text-ink">{cart.email}</td>
                      <td className="px-6 py-4 text-[13px] text-sub">{new Date(cart.createdAt).toLocaleString()}</td>
                      <td className="px-6 py-4 text-[14px] font-semibold text-ink">{fmtCurrency(value)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          cart.status === 'recovered' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                        }`}>
                          {cart.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
