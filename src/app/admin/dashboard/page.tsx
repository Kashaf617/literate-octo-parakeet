import { prisma } from "@/lib/prisma";
import { fmtCurrency } from "@/lib/utils";
import PageHeader from "@/components/admin/PageHeader";
import StatCard from "@/components/admin/StatCard";
import StatusBadge from "@/components/admin/StatusBadge";
import { RevenueChart, OrderStatusPie, TopProductsBar } from "@/components/admin/DashboardCharts";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [orders, products, categories] = await Promise.all([
    prisma.order.findMany({ include: { items: true }, orderBy: { createdAt: "desc" } }),
    prisma.product.findMany(),
    prisma.category.count()
  ]);

  const lowStock = products.filter(p => p.stock <= 5).length;
  const pendingStatuses = ["processing", "confirmed", "packed", "shipped"];
  const pendingOrdersArr = orders.filter(o => pendingStatuses.includes(o.orderStatus));
  const deliveredOrdersArr = orders.filter(o => o.orderStatus === "delivered");

  const totalDeliveredAmount = deliveredOrdersArr.reduce((s, o) => s + o.total, 0);
  const pendingOrderAmount = pendingOrdersArr.reduce((s, o) => s + o.total, 0);

  const pendingCodOrdersArr = pendingOrdersArr.filter(o => o.paymentMethod === "cod");
  const pendingAdvanceOrdersArr = pendingOrdersArr.filter(o => o.paymentMethod === "advance");

  const totalCodAmount = orders.filter(o => o.paymentMethod === "cod").reduce((s, o) => s + o.total, 0);
  const totalAdvanceAmount = orders.filter(o => o.paymentMethod === "advance").reduce((s, o) => s + o.total, 0);
  const pendingCodAmount = pendingCodOrdersArr.reduce((s, o) => s + o.total, 0);
  const pendingAdvanceAmount = pendingAdvanceOrdersArr.reduce((s, o) => s + o.total, 0);

  // Revenue for last 7 days
  const days: { day: string; revenue: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const dayRevenue = orders
      .filter(o => new Date(o.createdAt).toDateString() === d.toDateString())
      .reduce((s, o) => s + o.total, 0);
    days.push({ day: key, revenue: Math.round(dayRevenue) });
  }

  const statusCounts: Record<string, number> = {};
  for (const o of orders) statusCounts[o.orderStatus] = (statusCounts[o.orderStatus] || 0) + 1;
  const pieData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

  const soldMap: Record<string, number> = {};
  for (const o of orders) for (const it of o.items) soldMap[it.name] = (soldMap[it.name] || 0) + it.qty;
  const topProducts = Object.entries(soldMap).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, sold]) => ({ name: name.length > 20 ? name.slice(0, 20) + "…" : name, sold }));

  const recentOrders = orders.slice(0, 6);

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Live overview of your store's performance" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Delivered Revenue" value={fmtCurrency(totalDeliveredAmount)} sub={`${deliveredOrdersArr.length} delivered orders`} tone="success" />
        <StatCard label="Pending Revenue" value={fmtCurrency(pendingOrderAmount)} sub={`${pendingOrdersArr.length} orders to process`} tone="warn" />
        <StatCard label="Total COD Amount" value={fmtCurrency(totalCodAmount)} sub="All-time COD" tone="brand" />
        <StatCard label="Total Advance Amount" value={fmtCurrency(totalAdvanceAmount)} sub="All-time Advance Payment" tone="brand" />
        
        <StatCard label="Total Pending Orders" value={String(pendingOrdersArr.length)} sub="Needs action" tone="warn" />
        <StatCard label="Pending COD Orders" value={String(pendingCodOrdersArr.length)} sub={`Amount: ${fmtCurrency(pendingCodAmount)}`} tone="brand" />
        <StatCard label="Pending Advance Orders" value={String(pendingAdvanceOrdersArr.length)} sub={`Amount: ${fmtCurrency(pendingAdvanceAmount)}`} tone="brand" />
        <StatCard label="Delivered Orders" value={String(deliveredOrdersArr.length)} sub="Completed successfully" tone="success" />
      </div>

      <div className="grid lg:grid-cols-3 gap-5 mb-6">
        <div className="admin-card lg:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-extrabold text-ink">Revenue — Last 7 Days</h3>
          </div>
          <RevenueChart data={days} />
        </div>
        <div className="admin-card">
          <h3 className="font-extrabold text-ink mb-2">Order Status Split</h3>
          {pieData.length > 0 ? <OrderStatusPie data={pieData} /> : <p className="text-sub text-sm py-16 text-center">No orders yet</p>}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="admin-card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-ink">Recent Orders</h3>
            <Link href="/admin/orders" className="text-brand text-xs font-bold">View all →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-sub text-xs uppercase border-b border-line">
                  <th className="pb-2 font-bold">Order</th>
                  <th className="pb-2 font-bold">Customer</th>
                  <th className="pb-2 font-bold">Total</th>
                  <th className="pb-2 font-bold">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(o => (
                  <tr key={o.id} className="border-b border-line last:border-0">
                    <td className="py-3 font-bold text-brand"><Link href={`/admin/orders/${o.id}`}>{o.orderNumber}</Link></td>
                    <td className="py-3">{o.customerName}</td>
                    <td className="py-3 font-semibold">{fmtCurrency(o.total)}</td>
                    <td className="py-3"><StatusBadge status={o.orderStatus} /></td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr><td colSpan={4} className="py-8 text-center text-sub">No orders yet — new orders appear here in real time.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="admin-card">
          <h3 className="font-extrabold text-ink mb-2">Top Selling Products</h3>
          {topProducts.length > 0 ? <TopProductsBar data={topProducts} /> : <p className="text-sub text-sm py-16 text-center">No sales recorded yet</p>}
        </div>
      </div>

      {lowStock > 0 && (
        <div className="mt-5 admin-card border-warn bg-amber-50/40 flex items-center justify-between">
          <span className="text-sm font-semibold text-ink">⚠️ {lowStock} product(s) are low on stock (5 or fewer units).</span>
          <Link href="/admin/products" className="btn-secondary">Review Products</Link>
        </div>
      )}
    </div>
  );
}
