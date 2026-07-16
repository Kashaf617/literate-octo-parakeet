import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/admin/PageHeader";
import OrdersTable from "@/components/admin/OrdersTable";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div>
      <PageHeader title="Orders" subtitle="Track, manage, and fulfill every order in one place." />
      <OrdersTable initial={JSON.parse(JSON.stringify(orders))} />
    </div>
  );
}
