import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/admin/PageHeader";
import OrdersTable from "@/components/admin/OrdersTable";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const [orders, products] = await Promise.all([
    prisma.order.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.product.findMany({ select: { id: true, name: true, price: true, images: true } })
  ]);
  return (
    <div>
      <PageHeader title="Orders" subtitle="Track, manage, and fulfill every order in one place." />
      <OrdersTable initial={JSON.parse(JSON.stringify(orders))} products={JSON.parse(JSON.stringify(products))} />
    </div>
  );
}
