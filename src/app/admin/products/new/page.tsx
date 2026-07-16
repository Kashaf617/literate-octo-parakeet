import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/admin/PageHeader";
import ProductForm from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const [categories, collections] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.collection.findMany({ orderBy: { name: "asc" } })
  ]);
  return (
    <div>
      <PageHeader title="Add Product" subtitle="Create a new product listing." />
      <ProductForm categories={categories} collections={collections as any} />
    </div>
  );
}
