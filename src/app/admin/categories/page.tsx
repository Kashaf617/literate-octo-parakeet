import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/admin/PageHeader";
import CategoryManager from "@/components/admin/CategoryManager";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" }, include: { _count: { select: { products: true } } } });
  return (
    <div>
      <PageHeader title="Categories" subtitle="Organize your catalog with images for each category." />
      <CategoryManager initial={categories as any} />
    </div>
  );
}
