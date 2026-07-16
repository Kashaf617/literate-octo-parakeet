import { prisma } from "@/lib/prisma";
import { fmtCurrency } from "@/lib/utils";
import PageHeader from "@/components/admin/PageHeader";
import StatCard from "@/components/admin/StatCard";
import { RevenueChart, CategorySalesPie, InventoryHealthBar } from "@/components/admin/DashboardCharts";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const [orders, products, categories] = await Promise.all([
    prisma.order.findMany({ 
      where: { paymentStatus: "paid" }, // Only count actual sales
      include: { items: { include: { product: { include: { category: true } } } } } 
    }),
    prisma.product.findMany({ include: { orderItems: true } }),
    prisma.category.findMany()
  ]);

  // 1. 30-Day Revenue Trend
  const days30: { day: string; revenue: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const dayRevenue = orders
      .filter(o => new Date(o.createdAt).toDateString() === d.toDateString())
      .reduce((s, o) => s + o.total, 0);
    days30.push({ day: key, revenue: Math.round(dayRevenue) });
  }

  // 2. Category Sales Pie
  const categorySalesMap: Record<string, number> = {};
  for (const o of orders) {
    for (const it of o.items) {
      const catName = it.product?.category?.name || "Uncategorized";
      categorySalesMap[catName] = (categorySalesMap[catName] || 0) + (it.price * it.qty);
    }
  }
  const categorySalesPie = Object.entries(categorySalesMap)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }));

  // 3. Customer LTV Table
  const customerLTVMap: Record<string, { name: string; totalSpent: number; orderCount: number }> = {};
  for (const o of orders) {
    if (!o.customerName) continue;
    if (!customerLTVMap[o.customerName]) {
      customerLTVMap[o.customerName] = { name: o.customerName, totalSpent: 0, orderCount: 0 };
    }
    customerLTVMap[o.customerName].totalSpent += o.total;
    customerLTVMap[o.customerName].orderCount += 1;
  }
  const topCustomers = Object.values(customerLTVMap)
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 10);

  // 4. Inventory Health (High sales, low stock)
  const inventoryHealth = products
    .filter(p => p.stock <= 20) // Only look at items with 20 or less stock
    .map(p => ({
      name: p.name.length > 25 ? p.name.slice(0, 25) + "..." : p.name,
      stock: p.stock,
      sold: p.orderItems.reduce((acc, it) => acc + it.qty, 0)
    }))
    .sort((a, b) => b.sold - a.sold) // Sort by most sold
    .slice(0, 10);

  const total30DayRev = days30.reduce((acc, d) => acc + d.revenue, 0);
  const avgOrderValue = orders.length ? total30DayRev / orders.length : 0;

  return (
    <div>
      <PageHeader title="Analytics Engine" subtitle="Deep insights into your store's performance" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="30-Day Revenue" value={fmtCurrency(total30DayRev)} sub="Total from paid orders" tone="brand" />
        <StatCard label="Total Orders" value={String(orders.length)} sub="Lifetime paid orders" tone="success" />
        <StatCard label="Avg. Order Value" value={fmtCurrency(avgOrderValue)} sub="Lifetime average" tone="brand" />
        <StatCard label="Active Categories" value={String(categories.length)} sub="With assigned products" tone="warn" />
      </div>

      <div className="grid lg:grid-cols-3 gap-5 mb-6">
        {/* 30-Day Revenue Chart */}
        <div className="admin-card lg:col-span-2">
          <div className="mb-4">
            <h3 className="font-extrabold text-ink">30-Day Revenue Trend</h3>
            <p className="text-sub text-[13px]">Daily revenue from completed sales over the last month.</p>
          </div>
          <RevenueChart data={days30} />
        </div>

        {/* Sales by Category Pie */}
        <div className="admin-card">
          <div className="mb-4">
            <h3 className="font-extrabold text-ink">Revenue by Category</h3>
            <p className="text-sub text-[13px]">Which categories drive the most value.</p>
          </div>
          {categorySalesPie.length > 0 ? (
            <CategorySalesPie data={categorySalesPie} />
          ) : (
            <p className="text-sub text-sm py-16 text-center">No sales data yet</p>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5 mb-6">
        {/* Top Customers (LTV) */}
        <div className="admin-card overflow-hidden flex flex-col">
          <div className="p-6 pb-2 border-b border-line">
            <h3 className="font-extrabold text-ink">Top Customers (LTV)</h3>
            <p className="text-sub text-[13px]">Your highest value returning customers.</p>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-line text-[11px] uppercase tracking-wider text-sub">
                  <th className="px-6 py-3 font-bold">Customer Name</th>
                  <th className="px-6 py-3 font-bold">Orders</th>
                  <th className="px-6 py-3 font-bold text-right">Lifetime Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {topCustomers.map((c, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-[14px] font-bold text-ink">{c.name}</td>
                    <td className="px-6 py-4 text-[14px] text-sub">{c.orderCount}</td>
                    <td className="px-6 py-4 text-[14px] font-bold text-brand text-right">{fmtCurrency(c.totalSpent)}</td>
                  </tr>
                ))}
                {topCustomers.length === 0 && (
                  <tr><td colSpan={3} className="px-6 py-8 text-center text-sub">No customer data yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inventory Health */}
        <div className="admin-card">
          <div className="mb-4">
            <h3 className="font-extrabold text-ink">Inventory Health Alert</h3>
            <p className="text-sub text-[13px]">Fast selling products with 20 or less stock remaining.</p>
          </div>
          {inventoryHealth.length > 0 ? (
            <InventoryHealthBar data={inventoryHealth} />
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3">
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <p className="font-bold text-ink">Inventory is healthy!</p>
              <p className="text-sub text-[13px]">No fast-selling products are currently low on stock.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
