import { prisma } from "@/lib/prisma";
import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import ProductsTable from "@/components/admin/ProductsTable";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true, collections: { include: { collection: true } } }
  });
  return (
    <div>
      <PageHeader
        title="Products"
        subtitle="Manage your catalog, pricing, and collections."
        actions={<Link href="/admin/products/new" className="btn-primary">+ Add Product</Link>}
      />
      <ProductsTable initial={products as any} />
    </div>
  );
}
