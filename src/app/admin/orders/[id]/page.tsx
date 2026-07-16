import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import OrderActions from "@/components/admin/OrderActions";
import { fmtCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({ where: { id: params.id }, include: { items: true } });
  if (!order) return notFound();

  return (
    <div>
      <PageHeader title={`Order ${order.orderNumber}`} subtitle={`Placed on ${new Date(order.createdAt).toLocaleString()}`} actions={<StatusBadge status={order.orderStatus} />} />
      <div className="grid lg:grid-cols-[1fr_340px] gap-6">
        <div className="space-y-5">
          <div className="admin-card">
            <h3 className="font-extrabold text-ink mb-4">Items</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-sub text-xs uppercase border-b border-line">
                  <th className="pb-2 font-bold">Product</th>
                  <th className="pb-2 font-bold">Price</th>
                  <th className="pb-2 font-bold">Qty</th>
                  <th className="pb-2 font-bold text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((it) => (
                  <tr key={it.id} className="border-b border-line last:border-0">
                    <td className="py-3 font-semibold">{it.name}</td>
                    <td className="py-3">{fmtCurrency(it.price)}</td>
                    <td className="py-3">{it.qty}</td>
                    <td className="py-3 text-right font-semibold">{fmtCurrency(it.price * it.qty)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 pt-4 border-t border-line space-y-1.5 text-sm ml-auto max-w-[240px]">
              <div className="flex justify-between"><span className="text-sub">Subtotal</span><span className="font-semibold">{fmtCurrency(order.subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-sub">Shipping</span><span className="font-semibold">{fmtCurrency(order.shippingFee)}</span></div>
              {order.discount > 0 && <div className="flex justify-between"><span className="text-sub">Discount</span><span className="font-semibold text-success">-{fmtCurrency(order.discount)}</span></div>}
              <div className="flex justify-between text-base font-extrabold pt-1.5 border-t border-line"><span>Total</span><span>{fmtCurrency(order.total)}</span></div>
            </div>
          </div>

          <div className="admin-card">
            <h3 className="font-extrabold text-ink mb-4">Customer & Shipping</h3>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div><div className="text-sub text-xs font-bold uppercase mb-1">Name</div><div className="font-semibold">{order.customerName}</div></div>
              <div><div className="text-sub text-xs font-bold uppercase mb-1">Phone</div><div className="font-semibold">{order.phone}</div></div>
              {order.email && <div><div className="text-sub text-xs font-bold uppercase mb-1">Email</div><div className="font-semibold">{order.email}</div></div>}
              <div><div className="text-sub text-xs font-bold uppercase mb-1">City</div><div className="font-semibold">{order.city}</div></div>
              <div className="sm:col-span-2"><div className="text-sub text-xs font-bold uppercase mb-1">Address</div><div className="font-semibold">{order.address}</div></div>
              {order.notes && <div className="sm:col-span-2"><div className="text-sub text-xs font-bold uppercase mb-1">Notes</div><div className="font-semibold">{order.notes}</div></div>}
            </div>
          </div>
        </div>

        <OrderActions order={JSON.parse(JSON.stringify(order))} />
      </div>
    </div>
  );
}
